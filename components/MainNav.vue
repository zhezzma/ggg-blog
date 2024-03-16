<template>
  <ContentNavigation v-slot="{ navigation }">
    <NuxtLink v-for="link of navigation" :key="link._path" :to="link._path">
      {{ link.navTitle || link.title }}
    </NuxtLink>
  </ContentNavigation>
</template>

<script lang="ts" setup>

</script>

<style>

</style>