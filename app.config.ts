export default defineAppConfig({
  title: "GODGODGAME",
  description: "The minimalist blog theme",
  url: "",
  logo: "",
  pageSize:15,
  descriptionSliceLength:300,
  authors: [
    {
      default: true,
      username: "john-doe",
      name: "John Doe",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
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
    { name: "关于我们", path: "/about" },
    { name: "存档", path: "/archives" },
  ],
  newsletter: {
    enabled: true,
    form_action: "YOUR_NEWSLETTER_FORM_ACTION",
  },

  ui: {
    primary: 'blue',
    gray: 'cool'
  },
});
