<script setup lang="ts">

const route = useRoute();
</script>

<template>
  <ArticlesList :path="route.path" />
</template>
