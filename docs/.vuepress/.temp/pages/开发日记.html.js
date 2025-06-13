import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/开发日记.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%BC%80%E5%8F%91%E6%97%A5%E8%AE%B0.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"开发日记.md\"}")
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
