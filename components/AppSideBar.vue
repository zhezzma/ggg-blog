<template>
  <div>
    <div class="card flex flex-col items-center p-4">
      <img
        :src="author?.avatar"
        :alt="author?.name"
        class="rounded-full border border-gray-300"
        width="100"
        height="100"
      />
      <div class="font-semibold text-xl mt-2">
        {{ author?.name }}
      </div>
      <div class="text-gray-500 text-sm mt-2 text-center">
        {{ author?.description }}
      </div>
      <div v-if="author?.socials && Object.entries(author.socials)" class="mt-2 space-x-5">
        <SocialIcons :socials="author.socials" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const author = findAuthor();
</script>

<style></style>
