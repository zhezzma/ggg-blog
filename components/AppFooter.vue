<template>
  <footer class="bg-zinc-200 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-500">
    <UContainer class="py-5">
      <div class="flex justify-between">
        <div>
          <h3 class="font-bold text-lg mb-4">链接</h3>
          <ul>
            <li v-for="item in menu" :key="item.path">
              <NuxtLink
                :key="item.path"
                :to="item.path"
                class="hover:text-zinc-400"
                >{{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold text-lg mb-4">关注</h3>
          <div
            v-if="author?.socials && Object.entries(author.socials)"
            class="mt-2 space-x-5 text-2xl"
          >
            <SocialIcons :socials="author.socials" />
          </div>
        </div>
        <div v-if="newsletterEnabled">
          <h3 class="font-bold text-lg mb-4">订阅</h3>
          <p class="mb-4">通过电子邮件获取最新文章</p>
          <p v-if="error" class="text-red-500 text-xs italic mb-2">
            订阅失败。请稍后重试
          </p>
          <p v-if="success" class="text-green-500 text-xs italic mb-2">
            您已成功订阅
          </p>

          <form :action="formAction" method="post" target="_blank">
            <input
              v-model="email"
              name="fields[email]"
              autocomplete="email"
              type="email"
              placeholder="welcome@hello.world"
              class="p-2 text-zinc-700 w-full"
              required
            />
            <input type="hidden" name="ml-submit" value="1" />
            <input type="hidden" name="anticsrf" value="true" />
            <UButton
            icon="i-heroicons-pencil-square"
    size="lg"
              class="mt-2 w-full"
              @click.prevent="subscribe"
            >
              订阅
            </UButton>
          </form>
        </div>
      </div>
      <div
        class="flex max-w-7xl m-auto mb-2 space-x-2 text-sm text-zinc-500 dark:text-zinc-400"
      >
        <div>Copyright © {{ new Date().getFullYear() }}</div>
        <div>•</div>
        &nbsp;{{ config.title }}
        <div>•</div>
        &nbsp; Powered by
        <a href="https://github.com/zhezzma">{{ author?.username }}</a>
        <div>•</div>
        <a href="https://beian.miit.gov.cn/" rel="noopener" target="_blank">{{ config.icp }} </a>
        <div>•</div>
        <img src="/images/beian.png" alt="" class="w-4 h-4">
        <a :href="wanganUrl" rel="noopener" target="_blank">{{ config.wangan }} </a>
      </div>
    </UContainer>
  </footer>
</template>

<script lang="ts" setup>
const config = useAppConfig();
const menu = config.menu;
const newsletterEnabled = config.newsletter.enabled;
const formAction = config.newsletter.form_action;
const email = ref("");
const success = ref(false);
const error = ref(false);
const author = findAuthor();

const wanganUrl = "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode="+config.wangan.slice(5);


async function subscribe() {
  const formData = new FormData();
  formData.append("fields[email]", email.value);
  formData.append("ml-submit", "1");
  formData.append("anticsrf", "true");
  const response = await fetch(formAction, {
    method: "POST",
    body: formData,
  });
  email.value = "";

  if (response.ok) {
    success.value = true;
  } else {
    error.value = true;
  }
}
</script>

<style></style>
