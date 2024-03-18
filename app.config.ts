export default defineAppConfig({
  title: "GODGODGAME",
  description: "The minimalist blog theme",
  url: "",
  logo: "",
  pageSize: 15,
  descriptionSliceLength: 300,
  icp: "皖ICP备19024574号 ",
  wangan:"皖公网安备34030002001147",
  authors: [
    {
      default: true,
      username: "zhepama",
      name: "李九仙",
      description:
        "一个不怎么正经的程序员，喜欢折腾各种奇奇怪怪的玩意儿。",
      avatar: "/images/avatar.png",
      socials: {
        twitter: "https://twitter.com",
        mastodon: "https://piaille.fr",
        youtube: "https://youtube.com",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        github: "https://github.com",
      },
    },
  ],
  menu: [
    { name: "首页", path: "/" },
    { name: "存档", path: "/archives" },
    { name: "关于", path: "/about" },
  ],
  newsletter: {
    enabled: true,
    form_action: "YOUR_NEWSLETTER_FORM_ACTION",
  },

  ui: {
    primary: "zinc", //值就是tailwindcss里的颜色 http://localhost:3000/_tailwind/
    gray: "zinc",
    button: {
      default: {
        color: "blue",
      },
      rounded: 'rounded-sm',
    },
    card: {
      background: "bg-white dark:bg-black",
      rounded: "rounded-sm",
      shadow: "  shadow-lg shadow-zinc-400/50 dark:shadow-zinc-800/50 ",
    },
  },
});
