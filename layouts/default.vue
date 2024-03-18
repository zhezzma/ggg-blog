<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="flex-1 mx-auto lg:max-w-7xl w-full mb-10 p-5">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-9">
          <slot />
        </div>
        <div class="lg:col-span-3">
          <AppSideBar />
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
