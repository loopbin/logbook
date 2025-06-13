import { CodeTabs } from "/Users/ben/practice/logbook/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vue_53ad5a7a9e6c8727194f087d2e4df901/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "/Users/ben/practice/logbook/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vue_53ad5a7a9e6c8727194f087d2e4df901/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "/Users/ben/practice/logbook/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vue_53ad5a7a9e6c8727194f087d2e4df901/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
