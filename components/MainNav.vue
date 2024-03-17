<template>
  <ContentNavigation v-slot="{ navigation }">
    <ul class="flex space-x-10">
      <li v-for="link of navigation" :key="link._path" >
        <NuxtLink :to="link._path">
          {{ link.navTitle || link.title }}
        </NuxtLink>
      </li>
    </ul>
  </ContentNavigation>
</template>

<script lang="ts" setup></script>

<style></style>
