<template>
  <header class="flex flex-row  justify-between  px-4 py-4 mx-auto  max-w-2xl">
    <div  class="text-gray-700 dark:text-gray-200">
      <MainNav />
    </div>
    <div class="space-x-3 transition text-gray-500">
      <NuxtLink to="/">
        {{ app.title }}
      </NuxtLink>
    </div>
  </header>
</template>

<script lang="ts" setup>
const app = useAppConfig().app;
</script>

<style></style>
