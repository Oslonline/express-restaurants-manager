<template>
    <div class="flex flex-col gap-8 p-8 bg-gray-50">
        <div>
            <h1 class="mb-2 text-xl font-semibold">Informations de l'employé :</h1>
            <form v-if="Object.keys(employeeData).length > 0" class="flex w-fit flex-col gap-2"
                @submit.prevent="handleUpdateEmployee">
                <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
                <div class="flex flex-col">
                    <label class="text-sm" for="first_name">Prénom</label>
                    <input class="rounded-md border border-gray-200 bg-white p-1" type="text" name="first_name"
                        v-model="employeeData.first_name" @input="handleInputChange" />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm" for="last_name">Nom</label>
                    <input class="rounded-md border border-gray-200 bg-white p-1" type="text" name="last_name"
                        v-model="employeeData.last_name" @input="handleInputChange" />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm" for="hire_date">Date d'embauche</label>
                    <VueDatePicker class="rounded-md border border-gray-200 bg-white p-1"
                        v-model="employeeData.hire_date" @date-update="handleDateChange" :format="format" />
                </div>
                <button
                    :class="`rounded-md border border-sky-600 bg-sky-600 py-1 text-gray-50 hover:bg-transparent hover:text-sky-600 ${!formModified && 'cursor-not-allowed opacity-50'}`"
                    type="submit" :disabled="!formModified">
                    Update
                </button>
            </form>
        </div>
        <SuccessMessage v-if="showSuccessMessage" :message="successMessage" />
    </div>
</template>

<script>
import axios from "axios";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import SuccessMessage from "../components/common/SuccessMessage.vue";

export default {
    components: {
        VueDatePicker,
        SuccessMessage,
    },
    data() {
        return {
            id: null,
            rid: null,
            employeeData: {},
            showSuccessMessage: false,
            successMessage: "",
            errorMessage: "",
            formModified: false,
        };
    },
    created() {
        this.id = this.$route.params.id;
        this.rid = this.$route.params.rid;
        this.fetchEmployee();
    },
    methods: {
        fetchEmployee() {
            axios
                .get(`http://localhost:5000/restaurants/${this.rid}/employees/${this.id}`)
                .then((response) => {
                    this.employeeData = response.data;
                    document.title = `${this.employeeData.first_name} ${this.employeeData.last_name} - Employés`;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        format(date) {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },
        handleInputChange(e) {
            const { name, value } = e.target;
            this.employeeData = { ...this.employeeData, [name]: value };
            this.formModified = true;
        },
        handleDateChange(date) {
            this.employeeData.hire_date = date;
            this.formModified = true;
        },
        handleUpdateEmployee() {
            if (!this.formModified) {
                this.errorMessage = "Aucune modification détectée.";
            }
            else if (Object.values(this.employeeData).some((value) => value === "")) {
                this.errorMessage = "Veuillez remplir tous les champs.";
            }

            axios
                .put(`http://localhost:5000/restaurants/${this.rid}/employees/${this.id}`, this.employeeData)
                .then(() => {
                    this.errorMessage = "";
                    this.successMessage = "Informations de l'employé modifiées avec succès !";
                    this.showSuccessMessage = true;
                    setTimeout(() => {
                        this.showSuccessMessage = false;
                        this.successMessage = "";
                    }, 3000);
                    this.formModified = false;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>