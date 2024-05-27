<template>
    <div class="flex flex-col gap-8 bg-gray-50 p-8">
        <div>
            <h1 class="mb-2 text-xl font-semibold">Informations du restaurant :</h1>
            <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
            <form v-if="Object.keys(restaurant).length > 0" class="flex w-fit flex-col gap-2"
                @submit.prevent="handleUpdateRestaurant">
                <div class="flex flex-col">
                    <label class="text-sm" for="name">Nom</label>
                    <input class="rounded-md border border-gray-200 bg-white p-1" type="text" name="name"
                        v-model="restaurantData.name" @input="handleInputChange" />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm" for="city">Ville</label>
                    <input class="rounded-md border border-gray-200 bg-white p-1" type="text" name="city"
                        v-model="restaurantData.city" @input="handleInputChange" />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm" for="places">Nb Places</label>
                    <input class="rounded-md border border-gray-200 bg-white p-1" type="number" min="1" name="places"
                        v-model="restaurantData.places" @input="handleInputChange" />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm" for="terrace">Terrasse</label>
                    <select class="rounded-md border border-gray-200 bg-white p-1" name="terrace"
                        v-model="restaurantData.terrace" @change="handleInputChange">
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                    </select>
                </div>
                <div class="flex flex-col">
                    <label class="text-sm" for="parking">Parking</label>
                    <select class="rounded-md border border-gray-200 bg-white p-1" name="parking"
                        v-model="restaurantData.parking" @change="handleInputChange">
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                    </select>
                </div>
                <button
                    :class="`rounded-md border border-sky-600 bg-sky-600 py-1 text-gray-50 hover:bg-transparent hover:text-sky-600 ${!formModified && 'cursor-not-allowed opacity-50'}`"
                    type="submit" :disabled="!formModified">
                    Update
                </button>
            </form>
        </div>
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Employés du restaurant :</h2>
                <button @click="handleAddButtonClick"
                    class="flex items-center gap-2 rounded-md border border-green-600 bg-green-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-green-600">
                    <p>Ajouter un employé</p>
                    <AkPlus />
                </button>
            </div>
            <p v-if="employees.length <= 0">Aucun employés dans ce restaurant, veuillez en ajouter.</p>
            <div v-else class="flex flex-col gap-4">
                <div v-for="employee in employees" :key="employee.id"
                    class="flex justify-between rounded-md border border-gray-400 p-4">
                    <div class="flex flex-col justify-between">
                        <p>{{ employee.first_name }}</p>
                        <p>{{ employee.last_name }}</p>
                        <p>Recruté le : {{ formatDate(employee.hire_date) }}</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <router-link :to="`${id}/employees/${employee.id}`"
                            class="flex items-center justify-center gap-2 rounded-md border border-sky-600 bg-sky-600 px-3 py-2 text-gray-50 hover:bg-transparent hover:text-sky-600">
                            <p>Modifier</p>
                        </router-link>
                        <button @click="openConfirmationModal(employee.id)"
                            class="flex items-center justify-center gap-2 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-gray-50 hover:bg-transparent hover:text-red-600">
                            <p>Supprimer</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal d'ajout d'employé -->
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div @click.stop class="flex min-w-96 flex-col gap-2 rounded-md bg-white p-8">
                <h2 class="text-xl font-semibold text-gray-950">Ajouter un employé :</h2>
                <form @submit.prevent="handleSubmit" class="flex w-full flex-col gap-2">
                    <div v-if="addErrorMessage" class="text-red-600">{{ addErrorMessage }}</div>
                    <div class="flex flex-col">
                        <label class="text-sm" for="first_name">Prénom</label>
                        <input class="rounded-md border border-gray-200 bg-white p-1" type="text" name="first_name"
                            v-model="newEmployee.first_name" />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm" for="last_name">Nom</label>
                        <input class="rounded-md border border-gray-200 bg-white p-1" type="text" name="last_name"
                            v-model="newEmployee.last_name" />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm" for="hire_date">Date d'embauche</label>
                        <VueDatePicker class="w-full rounded-md border border-gray-200 bg-white p-1"
                            v-model="newEmployee.hire_date" />
                    </div>
                    <div class="mt-2 flex justify-end">
                        <button type="submit"
                            class="rounded-md bg-green-500 px-4 py-2 text-gray-50 hover:bg-green-600">Ajouter</button>
                        <button type="button" @click="handleCloseAddModal"
                            class="ml-2 rounded-md bg-red-500 px-4 py-2 text-gray-50 hover:bg-red-600">Annuler</button>
                    </div>
                </form>
            </div>
        </div>

        <ConfirmationModal v-if="showConfirmationModal" :show="showConfirmationModal" @close="closeConfirmationModal"
            @confirm="handleEmployeeDelete" :message="{
                title: 'Êtes-vous sûr de vouloir supprimer cet employé ?',
                content: 'L\'employé et ses informations seront supprimer définitivement.'
            }" />

        <SuccessMessage v-if="showSuccessMessage" :show="showSuccessMessage" :message="successMessage" />
    </div>
</template>

<script>
import axios from "axios";
import { AkPlus } from "@kalimahapps/vue-icons";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ConfirmationModal from "../components/common/ConfirmationModal.vue";
import SuccessMessage from "../components/common/SuccessMessage.vue";

export default {
    data() {
        return {
            id: null,
            restaurant: {},
            restaurantData: {},
            employees: [],
            employeeToDelete: null,
            showConfirmationModal: false,
            showSuccessMessage: false,
            errorMessage: "",
            addErrorMessage: "",
            successMessage: "",
            formModified: false,
            newEmployee: {
                first_name: "",
                last_name: "",
                hire_date: null,
            },
            showAddModal: false,
        };
    },
    components: {
        AkPlus,
        VueDatePicker,
        ConfirmationModal,
        SuccessMessage,
    },
    created() {
        this.id = this.$route.params.id;
        this.fetchRestaurant();
        this.fetchEmployees();
    },
    methods: {
        fetchRestaurant() {
            axios
                .get(`http://localhost:5000/restaurants/${this.id}`)
                .then((response) => {
                    this.restaurant = response.data;
                    this.restaurantData = { ...response.data[0] };
                    document.title = `${this.restaurantData.name} - Restaurants`;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        fetchEmployees() {
            axios
                .get(`http://localhost:5000/restaurants/${this.id}/employees`)
                .then((response) => {
                    this.employees = response.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
        },
        openConfirmationModal(id) {
            this.employeeToDelete = id;
            this.showConfirmationModal = true;
        },
        closeConfirmationModal() {
            this.showConfirmationModal = false;
        },
        handleAddButtonClick() {
            this.showAddModal = true;
        },
        handleCloseAddModal() {
            this.showAddModal = false;
            this.addErrorMessage = "";
        },
        handleInputChange(e) {
            const { name, value } = e.target;
            this.restaurantData = { ...this.restaurantData, [name]: value };
            this.formModified = true;
        },
        handleUpdateRestaurant() {
            if (Object.values(this.restaurantData).some((value) => value === "")) {
                this.errorMessage = "Veuillez remplir tous les champs.";
            } else if (parseInt(this.restaurantData.places) > 250) {
                this.errorMessage = "Le nombre de places ne peut pas dépasser 250.";
            } else {
                axios
                    .put(`http://localhost:5000/restaurants/${this.id}`, this.restaurantData)
                    .then(() => {
                        this.errorMessage = "";
                        this.successMessage = "Restaurant mis à jour avec succès";
                        this.showSuccessMessage = true;
                        setTimeout(() => {
                            this.showSuccessMessage = false;
                            this.successMessage = "";
                        }, 3000);
                        this.formModified = false;
                    })
                    .catch((err) => {
                        this.errorMessage = "Une erreur s'est produite lors de la sauvegarde des changements.";
                        console.log(err);
                    });
            }
        },
        handleEmployeeDelete() {
            axios
                .delete(`http://localhost:5000/restaurants/${this.id}/employees/${this.employeeToDelete}`)
                .then(() => {
                    this.employees = this.employees.filter((employee) => employee.id !== this.employeeToDelete);
                    this.closeConfirmationModal();
                    this.successMessage = "Employé supprimé avec succès";
                    this.showSuccessMessage = true;
                    setTimeout(() => {
                        this.showSuccessMessage = false;
                        this.successMessage = "";
                    }, 3000);
                })
                .catch((error) => {
                    console.log(error);
                    this.closeConfirmationModal();
                });
        },
        handleChange(e) {
            const { name, value } = e.target;
            this.newEmployee = { ...this.newEmployee, [name]: value };
        },
        handleSubmit() {
            const { first_name, last_name, hire_date } = this.newEmployee;

            if (!first_name || !last_name || !hire_date) {
                this.addErrorMessage = "Veuillez remplir tous les champs du formulaire.";
            } else {
                axios
                    .post(`http://localhost:5000/restaurants/${this.id}/employees`, this.newEmployee)
                    .then(() => {
                        this.fetchEmployees();
                        this.newEmployee = {
                            first_name: "",
                            last_name: "",
                            hire_date: "",
                        };
                        this.showAddModal = false;
                        this.successMessage = "Employé ajouté avec succès !";
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
    },
};
</script>