import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/index.html.vue"
const data = JSON.parse("{\"path\":\"/docker/\",\"title\":\"Docker 文档\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1749805633000,\"contributors\":[{\"name\":\"ben\",\"username\":\"ben\",\"email\":\"BenLi@poweronlabs.ai\",\"commits\":1,\"url\":\"https://github.com/ben\"}],\"changelog\":[{\"hash\":\"d83ab611cd20089ef52b61af0b40a093aab0b733\",\"time\":1749805633000,\"email\":\"BenLi@poweronlabs.ai\",\"author\":\"ben\",\"message\":\"feat: 1\"}]},\"filePathRelative\":\"docker/index.md\"}")
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
