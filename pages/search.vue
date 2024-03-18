<script lang="ts" setup>


const search = ref("");

let results: any;
watch(search, startSearch);
search.value = "";

async function startSearch(){
  results = await searchContent(search);
}
</script>

<template>
  <UCard >
    <div class="flex space-x-10">
      <UInput v-model="search" class="flex-1" />
    </div>
    <div v-for="article in results" :key="article.id" class="my-5 p-4">
      <h2>
        <ULink
          :to="article.id"
          active-class="text-primary"
          inactive-class="font-semibold text-zinc-700 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
        >
          {{ article.title }}
        </ULink>
      </h2>
      <div class="text-zinc-500 dark:text-zinc-400">
        {{ article.content }}
      </div>
      <UDivider class="my-4" />
    </div>
  </UCard>
</template>
