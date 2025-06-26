export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":""} }],
  ["/webrtc.html", { loader: () => import(/* webpackChunkName: "webrtc.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/webrtc.html.js"), meta: {"title":""} }],
  ["/%E5%BC%80%E5%8F%91%E6%97%A5%E8%AE%B0.html", { loader: () => import(/* webpackChunkName: "开发日记.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/开发日记.html.js"), meta: {"title":""} }],
  ["/docker/basics.html", { loader: () => import(/* webpackChunkName: "docker_basics.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/basics.html.js"), meta: {"title":"Docker 基础入门"} }],
  ["/docker/cicd.html", { loader: () => import(/* webpackChunkName: "docker_cicd.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/cicd.html.js"), meta: {"title":"Docker CI/CD 集成"} }],
  ["/docker/common-operations.html", { loader: () => import(/* webpackChunkName: "docker_common-operations.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/common-operations.html.js"), meta: {"title":"Docker 常规操作"} }],
  ["/docker/compose.html", { loader: () => import(/* webpackChunkName: "docker_compose.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/compose.html.js"), meta: {"title":"Docker Compose 容器编排"} }],
  ["/docker/dockerfile.html", { loader: () => import(/* webpackChunkName: "docker_dockerfile.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/dockerfile.html.js"), meta: {"title":"Dockerfile 编写指南"} }],
  ["/docker/", { loader: () => import(/* webpackChunkName: "docker_index.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/index.html.js"), meta: {"title":"Docker 文档"} }],
  ["/docker/learning-path.html", { loader: () => import(/* webpackChunkName: "docker_learning-path.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/learning-path.html.js"), meta: {"title":"Docker 学习路径"} }],
  ["/docker/monitoring.html", { loader: () => import(/* webpackChunkName: "docker_monitoring.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/monitoring.html.js"), meta: {"title":"Docker 监控和日志"} }],
  ["/docker/networking.html", { loader: () => import(/* webpackChunkName: "docker_networking.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/networking.html.js"), meta: {"title":""} }],
  ["/docker/performance.html", { loader: () => import(/* webpackChunkName: "docker_performance.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/performance.html.js"), meta: {"title":"Docker 性能优化"} }],
  ["/docker/security.html", { loader: () => import(/* webpackChunkName: "docker_security.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/security.html.js"), meta: {"title":"Docker 安全实践"} }],
  ["/docker/troubleshooting.html", { loader: () => import(/* webpackChunkName: "docker_troubleshooting.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/troubleshooting.html.js"), meta: {"title":"Docker 故障排查"} }],
  ["/docker/volumes.html", { loader: () => import(/* webpackChunkName: "docker_volumes.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/docker/volumes.html.js"), meta: {"title":"Docker 数据持久化"} }],
  ["/ci/devops.html", { loader: () => import(/* webpackChunkName: "ci_devops.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/ci/devops.html.js"), meta: {"title":"DevOps 详解与实践方案"} }],
  ["/ci/", { loader: () => import(/* webpackChunkName: "ci_index.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/ci/index.html.js"), meta: {"title":"持续集成 (CI) 方案对比"} }],
  ["/algorithm/", { loader: () => import(/* webpackChunkName: "algorithm_index.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/index.html.js"), meta: {"title":"算法学习笔记"} }],
  ["/algorithm/analysis/complexity.html", { loader: () => import(/* webpackChunkName: "algorithm_analysis_complexity.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/analysis/complexity.html.js"), meta: {"title":"算法复杂度分析"} }],
  ["/algorithm/analysis/optimization.html", { loader: () => import(/* webpackChunkName: "algorithm_analysis_optimization.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/analysis/optimization.html.js"), meta: {"title":"算法优化方案"} }],
  ["/algorithm/techniques/backtracking.html", { loader: () => import(/* webpackChunkName: "algorithm_techniques_backtracking.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/techniques/backtracking.html.js"), meta: {"title":"回溯算法"} }],
  ["/algorithm/techniques/divide-conquer.html", { loader: () => import(/* webpackChunkName: "algorithm_techniques_divide-conquer.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/techniques/divide-conquer.html.js"), meta: {"title":"分治算法"} }],
  ["/algorithm/techniques/dynamic-programming.html", { loader: () => import(/* webpackChunkName: "algorithm_techniques_dynamic-programming.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/techniques/dynamic-programming.html.js"), meta: {"title":"动态规划"} }],
  ["/algorithm/techniques/greedy.html", { loader: () => import(/* webpackChunkName: "algorithm_techniques_greedy.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/techniques/greedy.html.js"), meta: {"title":"贪心算法"} }],
  ["/algorithm/sorting/bubble-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_bubble-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/bubble-sort.html.js"), meta: {"title":"冒泡排序"} }],
  ["/algorithm/sorting/counting-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_counting-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/counting-sort.html.js"), meta: {"title":"计数排序"} }],
  ["/algorithm/sorting/heap-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_heap-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/heap-sort.html.js"), meta: {"title":"堆排序"} }],
  ["/algorithm/sorting/insertion-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_insertion-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/insertion-sort.html.js"), meta: {"title":"插入排序"} }],
  ["/algorithm/sorting/merge-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_merge-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/merge-sort.html.js"), meta: {"title":"归并排序"} }],
  ["/algorithm/sorting/quick-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_quick-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/quick-sort.html.js"), meta: {"title":"快速排序"} }],
  ["/algorithm/sorting/selection-sort.html", { loader: () => import(/* webpackChunkName: "algorithm_sorting_selection-sort.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/sorting/selection-sort.html.js"), meta: {"title":"选择排序"} }],
  ["/algorithm/searching/binary-search.html", { loader: () => import(/* webpackChunkName: "algorithm_searching_binary-search.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/searching/binary-search.html.js"), meta: {"title":"二分查找"} }],
  ["/algorithm/searching/hash-search.html", { loader: () => import(/* webpackChunkName: "algorithm_searching_hash-search.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/searching/hash-search.html.js"), meta: {"title":""} }],
  ["/algorithm/searching/linear-search.html", { loader: () => import(/* webpackChunkName: "algorithm_searching_linear-search.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/searching/linear-search.html.js"), meta: {"title":"顺序查找"} }],
  ["/algorithm/data-structures/array.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_array.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/array.html.js"), meta: {"title":"数组"} }],
  ["/algorithm/data-structures/graph.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_graph.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/graph.html.js"), meta: {"title":"图"} }],
  ["/algorithm/data-structures/hash-table.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_hash-table.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/hash-table.html.js"), meta: {"title":""} }],
  ["/algorithm/data-structures/heap.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_heap.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/heap.html.js"), meta: {"title":"堆"} }],
  ["/algorithm/data-structures/linked-list.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_linked-list.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/linked-list.html.js"), meta: {"title":"链表"} }],
  ["/algorithm/data-structures/stack-queue.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_stack-queue.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/stack-queue.html.js"), meta: {"title":"栈和队列"} }],
  ["/algorithm/data-structures/tree.html", { loader: () => import(/* webpackChunkName: "algorithm_data-structures_tree.html" */"/Users/ben/practice/logbook/docs/.vuepress/.temp/pages/algorithm/data-structures/tree.html.js"), meta: {"title":"树"} }],
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
