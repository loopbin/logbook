import "/Users/lizhenbin/code/logbook/node_modules/@vuepress/highlighter-helper/lib/client/styles/base.css"
import "/Users/lizhenbin/code/logbook/node_modules/@vuepress/plugin-prismjs/lib/client/styles/nord.css"
import "/Users/lizhenbin/code/logbook/node_modules/@vuepress/highlighter-helper/lib/client/styles/line-numbers.css"
import "/Users/lizhenbin/code/logbook/node_modules/@vuepress/highlighter-helper/lib/client/styles/notation-highlight.css"
import "/Users/lizhenbin/code/logbook/node_modules/@vuepress/highlighter-helper/lib/client/styles/collapsed-lines.css"
import { setupCollapsedLines } from "/Users/lizhenbin/code/logbook/node_modules/@vuepress/highlighter-helper/lib/client/index.js"
import "/Users/lizhenbin/code/logbook/node_modules/@vuepress/highlighter-helper/lib/client/styles/code-block-title.css"

export default {
  setup() {
    setupCollapsedLines()
  }
}
