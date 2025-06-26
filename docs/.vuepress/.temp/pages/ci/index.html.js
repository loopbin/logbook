import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/ci/index.html.vue"
const data = JSON.parse("{\"path\":\"/ci/\",\"title\":\"持续集成 (CI) 方案对比\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"ci/index.md\"}")
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
