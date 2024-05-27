<script>
import { RouterLink } from 'vue-router';
</script>

<template>
    <header className="sticky top-0 flex min-h-16 items-center justify-around bg-gray-100">
        <RouterLink class="group font-semibold" to="/">
            <p className="group-hover:underline underline-offset-2">Home</p>
        </RouterLink>
        <div>
            <p className="text-xl font-bold uppercase">Restaurants & Employees Manager</p>
        </div>
    </header>
</template>
