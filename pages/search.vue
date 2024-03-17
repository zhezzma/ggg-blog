<script lang="ts" setup>
const search = ref("");
const searchA = ref("");
let results: any;
watchDebounced(search, onClick);
search.value = "";

async function onClick(){
  results = await searchContent(search);
  console.log(results);
}
</script>

<template>
  <main class="mt-5 card p-4">
    <div class="flex space-x-10">
      <UInput v-model="search" class="flex-1" />
      <UButton
        icon="i-heroicons-magnifying-glass"
        size="sm"
        color="primary"
        square
        variant="solid"
        @click="onClick"
      />
    </div>
    <div v-for="article in results" :key="article.id" class="my-5 p-4">
      <h2>
        <ULink
          :to="article.id"
          active-class="text-primary"
          inactive-class="font-semibold text-zinc-700 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
        >
          {{ article.title }}
        </ULink>
      </h2>
      <div class="text-gray-500 dark:text-gray-400">
        {{ article.content }}
      </div>
      <UDivider class="my-4" />
    </div>
  </main>
</template>
