import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/开发日记.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%BC%80%E5%8F%91%E6%97%A5%E8%AE%B0.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1749805633000,\"contributors\":[{\"name\":\"ben\",\"username\":\"ben\",\"email\":\"BenLi@poweronlabs.ai\",\"commits\":1,\"url\":\"https://github.com/ben\"}],\"changelog\":[{\"hash\":\"d83ab611cd20089ef52b61af0b40a093aab0b733\",\"time\":1749805633000,\"email\":\"BenLi@poweronlabs.ai\",\"author\":\"ben\",\"message\":\"feat: 1\"}]},\"filePathRelative\":\"开发日记.md\"}")
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
