<template>
    <div v-if="show" @click="onClose"
        class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
        <div @click.stop class="rounded-md bg-white p-4">
            <p class="text-xl font-semibold">{{ message.title }}</p>
            <p v-if="message.content" class="text-sm text-gray-600">{{ message.content }}</p>
            <div class="mt-4 flex justify-end gap-2">
                <button @click="onConfirm"
                    class="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-gray-50 hover:bg-transparent hover:text-red-600">Supprimer</button>
                <button @click="onClose"
                    class="rounded-md border border-gray-500 bg-gray-500 px-4 py-2 text-gray-50 hover:bg-transparent hover:text-gray-500">Annuler</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: Boolean,
        onClose: Function,
        onConfirm: Function,
        message: Object,
    },
};
</script>