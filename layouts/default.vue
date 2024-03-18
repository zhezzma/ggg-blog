<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <UContainer class="flex-1 w-full  mb-10 ">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-9 mb-5">
          <slot />
        </div>
        <div class="lg:col-span-3">
          <AppSideBar />
        </div>
      </div>
    </UContainer>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
