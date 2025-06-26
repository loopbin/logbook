import comp from "/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/webrtc.html.vue"
const data = JSON.parse("{\"path\":\"/webrtc.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1749805633000,\"contributors\":[{\"name\":\"loopbin\",\"username\":\"loopbin\",\"email\":\"lzb100562@163.com\",\"commits\":2,\"url\":\"https://github.com/loopbin\"},{\"name\":\"ben\",\"username\":\"ben\",\"email\":\"BenLi@poweronlabs.ai\",\"commits\":1,\"url\":\"https://github.com/ben\"}],\"changelog\":[{\"hash\":\"d83ab611cd20089ef52b61af0b40a093aab0b733\",\"time\":1749805633000,\"email\":\"BenLi@poweronlabs.ai\",\"author\":\"ben\",\"message\":\"feat: 1\"},{\"hash\":\"eadead2e8c7a58f460369e6c2bd543d0f70fbabe\",\"time\":1746781054000,\"email\":\"lzb100562@163.com\",\"author\":\"loopbin\",\"message\":\"Rename webrtc to webrtc.md\"},{\"hash\":\"0ee3c00bd674e71fad81e7522b34909b5a524587\",\"time\":1746781028000,\"email\":\"lzb100562@163.com\",\"author\":\"loopbin\",\"message\":\"Create webrtc\"}]},\"filePathRelative\":\"webrtc.md\"}")
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
