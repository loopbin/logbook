react 事件
使用 e.preventDefault() 报错：Unable to preventDefault inside passive event listener invocation.

这个错误通常与浏览器的滚动行为有关。现代浏览器为了优化滚动性能，默认将 touch 和 wheel 事件监听器标记为 passive，以提高滚动的流畅度。在 passive 事件监听器中调用 e.preventDefault()会被浏览器忽略，并抛出警告。

解决方案：

使用非 passive 事件监听器，通过 addEventListener 手动添加事件监听器，并设置 passive: false。但 React 中直接使用 onWheel 可能无法直接设置 passive 属性。
