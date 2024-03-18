<template>
  <UCard class="">
    <h1 class="text-4xl font-bold mb-8 text-center">存档</h1>
    <ContentList :query="query">
      <template #not-found>
        <p>No posts found.</p>
      </template>
      <template #default="{ list }">
        <div v-for="(article, index) in list" :key="article._path">
          <div v-if="shouldDisplayYear(list, article.date, index)" class="my-4">
            <span class="text-xl font-bold">{{ getYear(article.date) }}</span>
          </div>
          <NuxtLink
            :to="article._path"
            class="text-zinc-700 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <span>{{ article.date }}</span> &middot;
            <span>{{ article.title }}</span>
          </NuxtLink>
        </div>
      </template>
    </ContentList>
  </UCard>
</template>

<script setup lang="ts">
import type { QueryBuilderParams } from "@nuxt/content/dist/runtime/types";

definePageMeta({
  layout: "page",
});
const query: QueryBuilderParams = {
  path: "",
  where: [{ listed: { $ne: false } }],
  sort: [{ date: -1 }],
};
function getYear(date: string | number | Date) {
  return new Date(date).getFullYear();
}
function shouldDisplayYear(list: any, date: any, index: any) {
  const currentYear = getYear(date);
  const prevYear = index > 0 ? getYear(list[index - 1].date) : null;
  return currentYear !== prevYear;
}
function formatDate(date: string | number): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en", options);
}
</script>
