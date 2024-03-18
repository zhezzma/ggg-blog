<script lang="ts" setup>
import type { QueryBuilderParams } from "@nuxt/content/dist/runtime/types";
const config = useAppConfig();
const props = defineProps({
  path: {
    type: String,
    default: "/",
  },
  pageSize: {
    type: Number,
    default: 0,
  },
});
let pageSize = props.pageSize;
if (pageSize === 0) {
  pageSize = config.pageSize;
}
const page = ref(0);

let query: QueryBuilderParams = {};
let where = [{ draft: false }, { isArchived: false }];

const count = await queryContent(props.path).count();

watch(page, (newX) => {
  query = {
    path: props.path,
    skip: (newX - 1) * pageSize,
    limit: pageSize,
    sort: [{ date: -1 }],
  };
});

page.value = 1;
</script>

<template>
  <div class="">
    <ContentList :query="query">
      <template #default="{ list }">
        <div v-for="article in list" :key="article._path" class="card mb-8 p-4">
          <div class="flex justify-between border-b mb-3 pb-3 border-b-zinc-300 dark:border-b-zinc-800">
            <h2>
              <ULink
                :to="article._path"
                active-class="text-primary"
                inactive-class="font-semibold text-xl  text-zinc-700 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
              >
                {{ article.title }}
              </ULink>
            </h2>
            <span class="text-zinc-400 dark:text-zinc-300">{{
              article.date
            }}</span>
          </div>
     
          <div class="text-zinc-500 dark:text-zinc-400">
            {{ article.description }}
          </div>
        </div>
      </template>
      <template #not-found>
        <div class="my-5 p-4">
          <h1>Not found</h1>
        </div>
      </template>
    </ContentList>

    <div v-if="count > 0" class="flex justify-center">
      <UPagination
        v-model="page"
        size="xl"
        :page-count="pageSize"
        :total="count"
        class="pagination"
      >
      </UPagination>
    </div>
  </div>
</template>
