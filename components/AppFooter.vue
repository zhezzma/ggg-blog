<template>
  <footer class="bg-gray-100 text-gray-800 dark:bg-black dark:text-gray-500">
    <div class="max-w-7xl p-5 mx-auto">
      <div class="flex justify-between">
        <div>
          <h3 class="font-bold text-lg mb-4">Menu</h3>
          <ul>
            <li v-for="item in menu" :key="item.path">
              <NuxtLink
                :key="item.path"
                :to="item.path"
                class="hover:text-gray-400"
                >{{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold text-lg mb-4">Follow</h3>
          <div
            v-if="author?.socials && Object.entries(author.socials)"
            class="mt-2 space-x-5 text-2xl"
          >
            <SocialIcons :socials="author.socials" />
          </div>
        </div>
        <div v-if="newsletterEnabled">
          <h3 class="font-bold text-lg mb-4">Subscribe</h3>
          <p class="mb-4">Subscribe to get the latest posts by email.</p>
          <p v-if="error" class="text-red-500 text-xs italic mb-2">
            Subscription failed. Please retry later
          </p>
          <p v-if="success" class="text-green-500 text-xs italic mb-2">
            You have successfully subscribed
          </p>

          <form :action="formAction" method="post" target="_blank">
            <input
              v-model="email"
              name="fields[email]"
              autocomplete="email"
              type="email"
              placeholder="Your email"
              class="p-2 text-gray-700 w-full"
              required
            />
            <input type="hidden" name="ml-submit" value="1" />
            <input type="hidden" name="anticsrf" value="true" />
            <button
              class="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click.prevent="subscribe"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div
        class="flex max-w-7xl m-auto mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <div>Copyright © {{ new Date().getFullYear() }}</div>
        <div>•</div>
        &nbsp;{{ config.title }}
        <div>•</div>
        &nbsp; Powered by
        <a href="https://github.com/zhezzma">zhezzma</a>
      </div>
    </div>
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
