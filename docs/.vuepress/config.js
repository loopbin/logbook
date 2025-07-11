import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { webpackBundler } from "@vuepress/bundler-webpack";

export default defineUserConfig({
  lang: "zh-CN",
  title: "开发笔记",
  description: "个人开发备忘和技术笔记",
  base: "/logbook/",
  theme: defaultTheme({
    logo: "https://vuejs.press/images/hero.png",
    navbar: [
      { text: "首页", link: "/" },
      { text: "WebRTC", link: "/webrtc" },
      { text: "Docker", link: "/docker/" },
      { text: "ci", link: "/ci/" },
      { text: "algorithm", link: "/algorithm/" },
    ],
    sidebar: {
      "/docker/": [
        {
          text: "Docker",
          children: ["/docker/README.md"],
        },
      ],
    },
  }),
  bundler: webpackBundler({
    devServer: {
      port: 8089,
    },
  }),
});
