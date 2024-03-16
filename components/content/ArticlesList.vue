


<script lang="ts" setup>
import type { QueryBuilderParams } from "@nuxt/content/dist/runtime/types";

const props = defineProps({
  path: {
    type: String,
    default: '/'
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const page = ref(0);


let query: QueryBuilderParams = {};

const count = await queryContent(props.path).count();

watch(page, (newX) => {
  query = {
    path: props.path,
    skip: (newX - 1) * props.pageSize,
    limit: props.pageSize,
    sort: [{ date: -1 }],
  };
});

page.value = 1;

</script>

<template>
    <ContentList :query="query" v-slot="{ list }">
      <div v-for="article in list" :key="article._path">
        <h2>
          <ULink
            :to="article._path"
            active-class="text-primary"
            inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {{ article.title }}
          </ULink>
        </h2>
      </div>
    </ContentList>

    <UPagination
      v-model="page"
      :page-count="props.pageSize"
      :total="count"
    />

 
 </template>