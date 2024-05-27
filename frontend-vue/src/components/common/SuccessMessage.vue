<template>
    <div v-if="show" class="fixed bottom-4 right-4 rounded-md bg-green-500 px-4 py-2 text-white">{{ message }}</div>
</template>

<script>
export default {
    props: {
        show: Boolean,
        message: String,
    },
};
</script>