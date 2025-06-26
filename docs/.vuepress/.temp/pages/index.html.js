import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1749812552000,\"contributors\":[{\"name\":\"loopbin\",\"username\":\"loopbin\",\"email\":\"lizhenbin@bins-MacBook-Pro.local\",\"commits\":2,\"url\":\"https://github.com/loopbin\"}],\"changelog\":[{\"hash\":\"20aa393b6aeed73c3e6c2e56f39477b463166aed\",\"time\":1749812552000,\"email\":\"lzb100562@163.com\",\"author\":\"loopbin\",\"message\":\"feat: 1\"},{\"hash\":\"14a4d33db93c977d9a10ca8875e22cd6e16f0496\",\"time\":1742617282000,\"email\":\"lizhenbin@bins-MacBook-Pro.local\",\"author\":\"loopbin\",\"message\":\"init\"}]},\"filePathRelative\":\"README.md\"}")
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
