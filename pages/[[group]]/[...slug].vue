<script setup lang="ts">
</script>

<template>
  <main>
    <ContentDoc>
      <template #default="{ doc }">
        <article>
          <h1>{{ doc.title }}</h1>
          <ContentRenderer :value="doc" />
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
  </main>
</template>
