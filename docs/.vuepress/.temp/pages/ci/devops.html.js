import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/ci/devops.html.vue"
const data = JSON.parse("{\"path\":\"/ci/devops.html\",\"title\":\"DevOps 详解与实践方案\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"ci/devops.md\"}")
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
