<script setup lang="ts">
definePageMeta({
  layout: "article",
});
</script>
<template>
  <div class="card p-5 markdown-body">
    <ContentDoc>
      <template #default="{ doc }">
        <article>
          <h1
            class="text-center text-3xl font-semibold text-zinc-800 dark:text-zinc-50"
          >
            {{ doc.title }}
          </h1>
          <div class="mt-5">
            <ContentRenderer :value="doc" />
          </div>
        </article>
      </template>
      <template #empty>
        <h1>Empty</h1>
      </template>
      <template #not-found>
        <h1>Not found</h1>
      </template>
    </ContentDoc>
  </div>
</template>
