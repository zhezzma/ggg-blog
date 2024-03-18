<template>
  <div>
    <UCard>
      <UAvatar
        :src="author?.avatar"
        :alt="author?.name"
        class="rounded-full border border-zinc-300 mx-auto block"
        width="100"
        height="100"
        size = "3xl"
      />
      <div class="font-semibold text-xl mt-2 text-center">
        {{ author?.name }}
      </div>
      <div class="text-zinc-500 text-sm mt-2 text-center">
        {{ author?.description }}
      </div>
      <div v-if="author?.socials && Object.entries(author.socials)" class="mt-2 space-x-5 text-center">
        <SocialIcons :socials="author.socials" />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const author = findAuthor();
</script>

<style></style>
