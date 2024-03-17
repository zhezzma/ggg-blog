<template>
    <div class="min-h-screen flex flex-col">
      <AppHeader />
      <div class="flex-1 mx-auto lg:max-w-7xl w-full mb-10">
        <slot />
      </div>
      <AppFooter />
    </div>
  </template>
  
  <script lang="ts" setup></script>
  
  <style></style>
  