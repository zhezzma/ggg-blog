<template>
  <ContentNavigation v-slot="{ navigation }">
    <ul class="flex">
      <li v-for="link of navigation" :key="link._path" class="mx-5">
        <NuxtLink :to="link._path">
          {{ link.navTitle || link.title }}
        </NuxtLink>
      </li>
    </ul>
  </ContentNavigation>
</template>

<script lang="ts" setup></script>

<style></style>
