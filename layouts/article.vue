<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <UContainer class="flex-1 w-full  mb-10 ">
      <slot />
    </UContainer>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
