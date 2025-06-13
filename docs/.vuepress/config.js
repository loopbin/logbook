import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { webpackBundler } from "@vuepress/bundler-webpack";

export default defineUserConfig({
  lang: "zh-CN",
  title: "开发日记",
  description: "个人开发日记和技术笔记",
  base: "/",
  theme: defaultTheme({
    logo: "https://vuejs.press/images/hero.png",
    navbar: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/get-started" },
      { text: "WebRTC", link: "/webrtc" },
      { text: "Docker", link: "/docker/" },
    ],
    sidebar: {
      "/docker/": [
        {
          text: "Docker 教程",
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
