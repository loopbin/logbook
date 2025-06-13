import { GitContributors } from "/Users/ben/practice/logbook/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.108_vuepress@2.0.0-rc.23_@vuepress+bundler-webpack@2.0.0-rc.23_vue@3.5.16_/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "/Users/ben/practice/logbook/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.108_vuepress@2.0.0-rc.23_@vuepress+bundler-webpack@2.0.0-rc.23_vue@3.5.16_/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
