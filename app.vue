<script setup lang="ts">
const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === "dark" ? "#111827" : "white"
);

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const appConfig = useAppConfig();
const title = appConfig.title;
const description = appConfig.description;
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
