<template>
  <header
    class="shadow-lg shadow-zinc-300 dark:shadow-zinc-800/50 sticky top-0 z-30 bg-zinc-50 dark:bg-zinc-950 mb-10"
  >
    <UContainer
      class="flex flex-col lg:flex-row lg:space-x-10 items-center py-5"
    >
      <div class="flex w-full lg:w-auto items-center justify-between">
        <a :href="url" class="text-lg">
          <span class="font-bold text-slate-800 dark:text-zinc-50"
            >{{ config.title.substring(0, 6) }} </span
          ><span class="text-slate-500 dark:text-zinc-400">{{
            config.title.substring(6)
          }}</span>
        </a>
        <!--桌面浏览器下隐藏-->
        <div class="block lg:hidden">
          <button @click="open = !open" class="text-zinc-800 dark:text-zinc-50">
            <svg
              fill="currentColor"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path
                v-show="open"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
              ></path>
              <path
                v-show="!open"
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <nav class="lg:flex w-full" :class="{ hidden: !open }">
        <ul
          class="flex flex-col w-full lg:flex-row lg:space-x-10 text-center"
          :class="{ navsd: open }"
        >
          <li><NuxtLink :to="url"> 首页 </NuxtLink></li>
          <ContentNavigation v-slot="{ navigation }">
            <li v-for="link of navigation" :key="link._path" class="">
              <NuxtLink :to="link._path">
                {{ link.navTitle || link.title }}
              </NuxtLink>
            </li>
          </ContentNavigation>
          <li
            class="flex-1 flex flex-col lg:flex-row lg:justify-end lg:space-x-5"
          >
            <button aria-label="Color Mode" @click="onClick">
              <Icon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
            </button>
            <ColorModeSwitch />
          </li>
        </ul>
      </nav>
      <div class="hidden lg:flex items-center">
        <!--一些web下显示,手机端隐藏的-->
      </div>
      <div class="lg:hidden flex items-center">
        <!--一些web下隐藏的,手机端显示的-->
      </div>
    </UContainer>
  </header>
</template>

<script lang="ts" setup>
const config = useAppConfig();
const url = config.url && config.url != "" ? config.url : "/";
const open = ref(false);

const router = useRouter();
function onClick() {
  router.push({ path: "/search" });
}
</script>

<style></style>
