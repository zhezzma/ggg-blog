<template>
  <header class="px-4 pb-5 pt-7 ring-1 ring-zinc-950/5 dark:ring-white/5 sticky top-0 z-30 bg-white dark:bg-black">
    <div class="mx-auto flex items-center justify-between lg:max-w-7xl">
      <div class="flex space-x-5">
        <NuxtLink
          :to="url"
          class="font-extrabold text-zinc-950 sm:block dark:text-white forced-colors:text-[CanvasText]"
        >
          {{ config.title }}
        </NuxtLink>
        <ColorModeSwitch />
      </div>
      <div class="flex">
        <MainNav />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const config = useAppConfig();
const url = config.url && config.url != "" ? config.url : "/";
</script>

<style></style>
