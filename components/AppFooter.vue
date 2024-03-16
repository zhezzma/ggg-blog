<template>
  <footer  class=" bottom-0 flex  flex-col items-center ">
    <div class="flex  flex-row  ">
      <div v-if="app.socials && Object.entries(app.socials)">
        <SocialIcons :socials="app.socials" />
      </div>
      <ColorModeSwitch />
    </div>
  </footer>
</template>

<script lang="ts" setup>
const app = useAppConfig().app;
</script>

<style></style>
