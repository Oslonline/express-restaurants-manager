<template>
  <div>
    <div class="flex flex-col gap-8 p-8 bg-gray-50">
      <div class="flex justify-between">
        <h1 class="text-xl font-semibold text-gray-950">Mes restaurants :</h1>
        <button @click="handleAddButtonClick"
          class="flex items-center gap-2 rounded-md border border-green-600 bg-green-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-green-600">
          <p>Ajouter un restaurant</p>
          <AkPlus />
        </button>
      </div>
      <div class="flex flex-col gap-4">
        <div v-for="restaurant in restaurants" :key="restaurant.id"
          class="flex justify-between rounded-md border border-gray-400 p-4">
          <div class="flex flex-col justify-between">
            <p class="text-2xl font-semibold">{{ restaurant.name }}</p>
            <div>
              <div class="flex items-center gap-2">
                <AkLocation />
                <p class="text-lg">{{ restaurant.city }}</p>
              </div>
              <div class="flex items-center gap-2">
                <HeOutlineConstructionWorker />
                <p v-if="restaurant.employeeCount === 0">Aucun employé actuellement</p>
                <p v-else class="text-lg">{{ restaurant.employeeCount }} employés</p>
              </div>
              <div class="flex items-center gap-2">
                <PhChair />
                <p class="text-lg">{{ restaurant.places }} places</p>
              </div>
            </div>
          </div>
          <div class="item flex flex-col justify-center gap-2">
            <router-link :to="'/restaurants/' + restaurant.id"
              class="flex items-center justify-center gap-2 rounded-md border border-sky-600 bg-sky-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-sky-600">
              <p>Modifier</p>
            </router-link>
            <button @click="openConfirmationModal(restaurant.id)"
              class="flex items-center justify-center gap-2 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-red-600">
              <p>Supprimer</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" @click="handleCloseModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div @click.stop class="flex min-w-96 flex-col gap-2 rounded-md bg-white p-8">
        <h2 class="text-xl font-semibold text-gray-950">Ajouter un restaurant :</h2>
        <form @submit.prevent="handleSubmit" class="flex w-full flex-col gap-2">
          <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
          <div class="flex flex-col">
            <label class="text-sm" for="name">Nom</label>
            <input v-model="newRestaurant.name" class="rounded-md border border-gray-200 bg-white p-1" type="text"
              name="name" placeholder="Nom du restaurant" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm" for="city">Ville</label>
            <input v-model="newRestaurant.city" class="rounded-md border border-gray-200 bg-white p-1" type="text"
              name="city" placeholder="Ville" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm" for="places">Nb Places</label>
            <input v-model.number="newRestaurant.places" class="rounded-md border border-gray-200 bg-white p-1"
              type="number" name="places" placeholder="Nombre places" min="1" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm" for="terrace">Terrasse</label>
            <select v-model="newRestaurant.terrace" class="rounded-md border border-gray-200 bg-white p-1"
              name="terrace" placeholder="Terrasse">
              <option value="">Sélectionnez</option>
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </div>
          <div class="flex flex-col">
            <label class="text-sm" for="parking">Parking</label>
            <select v-model="newRestaurant.parking" class="rounded-md border border-gray-200 bg-white p-1"
              name="parking" placeholder="Parking">
              <option value="">Sélectionnez</option>
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </div>
          <div class="mt-2 flex justify-end">
            <button type="submit"
              class="rounded-md border-green-600 bg-green-600 px-3 py-2 text-gray-50 duration-200 hover:bg-green-600 hover:text-green-600">Ajouter</button>
            <button type="button" @click="handleCloseModal"
              class="ml-2 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-gray-50 hover:bg-transparent hover:text-red-600">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmationModal v-if="showConfirmationModal" :show="showConfirmationModal" @close="closeConfirmationModal"
      @confirm="handleDelete" :message="{
        title: 'Êtes-vous sûr de vouloir supprimer ce Restaurant ?',
        content: 'Le restaurant ainsi que tout les employés associé seront supprimer definitivement'
      }" />
    <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage" />
  </div>
</template>

<script>
import axios from "axios";
import { AkLocation, PhChair, HeOutlineConstructionWorker, AkPlus } from "@kalimahapps/vue-icons";
import ConfirmationModal from "../components/common/ConfirmationModal.vue";
import SuccessMessage from "../components/common/SuccessMessage.vue";

export default {
  components: {
    ConfirmationModal,
    SuccessMessage,
    AkLocation,
    PhChair,
    HeOutlineConstructionWorker,
    AkPlus,
  },
  data() {
    return {
      restaurants: [],
      restaurantToDelete: null,
      showConfirmationModal: false,
      showSuccessMessage: false,
      newRestaurant: {
        name: "",
        city: "",
        places: 0,
        terrace: "",
        parking: "",
      },
      showAddModal: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  created() {
    this.fetchRestaurants();
  },
  methods: {
    fetchRestaurants() {
      axios
        .get("http://localhost:5000/restaurants")
        .then((response) => {
          this.restaurants = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openConfirmationModal(id) {
      this.restaurantToDelete = id;
      this.showConfirmationModal = true;
    },
    closeConfirmationModal() {
      this.showConfirmationModal = false;
    },
    handleDelete() {
      axios
        .delete(`http://localhost:5000/restaurants/${this.restaurantToDelete}`)
        .then(() => {
          this.restaurants = this.restaurants.filter((r) => r.id !== this.restaurantToDelete);
          this.closeConfirmationModal();
          this.successMessage = "Restaurant supprimé avec succès !";
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.log(error);
          this.closeConfirmationModal();
        });
    },
    handleChange(e) {
      const { name, value } = e.target;
      this.newRestaurant = { ...this.newRestaurant, [name]: value };
    },
    handleSubmit() {
      const { name, city, places, terrace, parking } = this.newRestaurant;

      if (!name || !city || !places || !terrace || !parking) {
        this.errorMessage = "Veuillez remplir tous les champs du formulaire.";
      } else if (isNaN(parseInt(places)) || parseInt(places) <= 0) {
        this.errorMessage = "Le nombre de places doit être un nombre entier positif.";
      } else if (parseInt(places) > 250) {
        this.errorMessage = "Le nombre de places ne peut pas dépasser 250.";
      } else {
        axios
          .post("http://localhost:5000/restaurants", this.newRestaurant)
          .then(() => {
            this.fetchRestaurants();
            this.newRestaurant = {
              name: "",
              city: "",
              places: 0,
              terrace: "",
              parking: "",
            };
            this.showAddModal = false;
            this.successMessage = "Restaurant ajouté avec succès !";
            this.showSuccessMessage = true;
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    handleAddButtonClick() {
      this.showAddModal = true;
    },
    handleCloseModal() {
      this.showAddModal = false;
      this.errorMessage = "";
    },
  },
};
</script>
