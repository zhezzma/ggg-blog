<script setup lang="ts">



</script>

<template>
  <main class=" mt-5 ">
    <div class="card mt-5 p-5 markdown-body" >
      <ContentDoc>
        <template #default="{ doc }">
          <article>
            <h1
              class="text-center text-3xl font-semibold text-zinc-600 dark:text-white"
            >
              {{ doc.title }}
            </h1>
            <div class="mt-5">
              <ContentRenderer :value="doc" />
            </div>
          </article>
        </template>
        <template #empty="{ doc }">
          <h1>{{ doc.title }}</h1>
          <h1>....</h1>
        </template>
        <template #not-found>
          <h1>Not found</h1>
        </template>
      </ContentDoc>
    </div>
  </main>
</template>
