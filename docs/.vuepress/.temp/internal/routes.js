export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Home"} }],
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"Get Started"} }],
  ["/webrtc.html", { loader: () => import(/* webpackChunkName: "webrtc.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/webrtc.html.js"), meta: {"title":""} }],
  ["/%E5%BC%80%E5%8F%91%E6%97%A5%E8%AE%B0.html", { loader: () => import(/* webpackChunkName: "开发日记.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/开发日记.html.js"), meta: {"title":""} }],
  ["/docker/", { loader: () => import(/* webpackChunkName: "docker_index.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/index.html.js"), meta: {"title":""} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
