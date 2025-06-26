import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/monitoring.html.vue"
const data = JSON.parse("{\"path\":\"/docker/monitoring.html\",\"title\":\"Docker 监控和日志\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1749812552000,\"contributors\":[{\"name\":\"loopbin\",\"username\":\"loopbin\",\"email\":\"lzb100562@163.com\",\"commits\":1,\"url\":\"https://github.com/loopbin\"}],\"changelog\":[{\"hash\":\"20aa393b6aeed73c3e6c2e56f39477b463166aed\",\"time\":1749812552000,\"email\":\"lzb100562@163.com\",\"author\":\"loopbin\",\"message\":\"feat: 1\"}]},\"filePathRelative\":\"docker/monitoring.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
