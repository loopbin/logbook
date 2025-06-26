<template><div><h1 id="dockerfile-编写指南" tabindex="-1"><a class="header-anchor" href="#dockerfile-编写指南"><span>Dockerfile 编写指南</span></a></h1>
<h2 id="基础指令" tabindex="-1"><a class="header-anchor" href="#基础指令"><span>基础指令</span></a></h2>
<h3 id="from" tabindex="-1"><a class="header-anchor" href="#from"><span>FROM</span></a></h3>
<p>指定基础镜像</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 使用官方 Node.js 镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用官方 Python 镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> python:3.9-slim</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="workdir" tabindex="-1"><a class="header-anchor" href="#workdir"><span>WORKDIR</span></a></h3>
<p>设置工作目录</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 设置工作目录为 /app</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="copy-add" tabindex="-1"><a class="header-anchor" href="#copy-add"><span>COPY/ADD</span></a></h3>
<p>复制文件到容器中</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 复制 package.json 和 package-lock.json</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 复制所有文件</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># ADD 支持自动解压和远程 URL</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ADD</span> https://example.com/file.tar.gz /app/</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="run" tabindex="-1"><a class="header-anchor" href="#run"><span>RUN</span></a></h3>
<p>执行命令</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 安装依赖</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 多个命令合并</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> apt-get update &amp;&amp; <span class="token operator">\</span></span>
<span class="line">    apt-get install -y curl &amp;&amp; <span class="token operator">\</span></span>
<span class="line">    rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="env" tabindex="-1"><a class="header-anchor" href="#env"><span>ENV</span></a></h3>
<p>设置环境变量</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 设置单个环境变量</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ENV</span> NODE_ENV=production</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置多个环境变量</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ENV</span> NODE_ENV=production <span class="token operator">\</span></span>
<span class="line">    PORT=3000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="expose" tabindex="-1"><a class="header-anchor" href="#expose"><span>EXPOSE</span></a></h3>
<p>声明端口</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 声明容器将使用 3000 端口</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">EXPOSE</span> 3000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cmd-entrypoint" tabindex="-1"><a class="header-anchor" href="#cmd-entrypoint"><span>CMD/ENTRYPOINT</span></a></h3>
<p>指定容器启动命令</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># CMD 可以被 docker run 的命令覆盖</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"node"</span>, <span class="token string">"app.js"</span>]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># ENTRYPOINT 不会被覆盖，但可以与 CMD 配合使用</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">"node"</span>]</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"app.js"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<h3 id="_1-使用官方镜像" tabindex="-1"><a class="header-anchor" href="#_1-使用官方镜像"><span>1. 使用官方镜像</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 推荐</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 不推荐</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> ubuntu:latest</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-使用特定版本" tabindex="-1"><a class="header-anchor" href="#_2-使用特定版本"><span>2. 使用特定版本</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 推荐</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14.17.0-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 不推荐</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:latest</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-多阶段构建" tabindex="-1"><a class="header-anchor" href="#_3-多阶段构建"><span>3. 多阶段构建</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 构建阶段</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine <span class="token keyword">AS</span> builder</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm run build</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 运行阶段</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> nginx:alpine</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">builder</span></span> /app/dist /usr/share/nginx/html</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-优化层数" tabindex="-1"><a class="header-anchor" href="#_4-优化层数"><span>4. 优化层数</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 不推荐</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> apt-get update</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> apt-get install -y curl</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 推荐</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> apt-get update &amp;&amp; <span class="token operator">\</span></span>
<span class="line">    apt-get install -y curl &amp;&amp; <span class="token operator">\</span></span>
<span class="line">    rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-使用-dockerignore" tabindex="-1"><a class="header-anchor" href="#_5-使用-dockerignore"><span>5. 使用 .dockerignore</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">node_modules</span>
<span class="line">npm-debug.log</span>
<span class="line">.git</span>
<span class="line">.gitignore</span>
<span class="line">.env</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见应用示例" tabindex="-1"><a class="header-anchor" href="#常见应用示例"><span>常见应用示例</span></a></h2>
<h3 id="node-js-应用" tabindex="-1"><a class="header-anchor" href="#node-js-应用"><span>Node.js 应用</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">EXPOSE</span> 3000</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"npm"</span>, <span class="token string">"start"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="python-应用" tabindex="-1"><a class="header-anchor" href="#python-应用"><span>Python 应用</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token instruction"><span class="token keyword">FROM</span> python:3.9-slim</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> requirements.txt .</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> pip install --no-cache-dir -r requirements.txt</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">EXPOSE</span> 5000</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"python"</span>, <span class="token string">"app.py"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-静态网站" tabindex="-1"><a class="header-anchor" href="#nginx-静态网站"><span>Nginx 静态网站</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token instruction"><span class="token keyword">FROM</span> nginx:alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> dist/ /usr/share/nginx/html/</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> nginx.conf /etc/nginx/conf.d/default.conf</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">EXPOSE</span> 80</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"nginx"</span>, <span class="token string">"-g"</span>, <span class="token string">"daemon off;"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="调试技巧" tabindex="-1"><a class="header-anchor" href="#调试技巧"><span>调试技巧</span></a></h2>
<h3 id="_1-构建时调试" tabindex="-1"><a class="header-anchor" href="#_1-构建时调试"><span>1. 构建时调试</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看构建过程</span></span>
<span class="line"><span class="token function">docker</span> build <span class="token parameter variable">-t</span> myapp <span class="token builtin class-name">.</span> <span class="token parameter variable">--progress</span><span class="token operator">=</span>plain</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在特定阶段停止</span></span>
<span class="line"><span class="token function">docker</span> build <span class="token parameter variable">--target</span> builder <span class="token parameter variable">-t</span> myapp:builder <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-运行时调试" tabindex="-1"><a class="header-anchor" href="#_2-运行时调试"><span>2. 运行时调试</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用交互式 shell</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--rm</span> myapp /bin/sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-检查镜像" tabindex="-1"><a class="header-anchor" href="#_3-检查镜像"><span>3. 检查镜像</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看镜像历史</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">history</span> myapp</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查镜像层</span></span>
<span class="line"><span class="token function">docker</span> inspect myapp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安全考虑" tabindex="-1"><a class="header-anchor" href="#安全考虑"><span>安全考虑</span></a></h2>
<h3 id="_1-使用非-root-用户" tabindex="-1"><a class="header-anchor" href="#_1-使用非-root-用户"><span>1. 使用非 root 用户</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建非 root 用户</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> addgroup -S appgroup &amp;&amp; adduser -S appuser -G appgroup</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--chown</span><span class="token punctuation">=</span><span class="token string">appuser:appgroup</span></span> . .</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">USER</span> appuser</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"node"</span>, <span class="token string">"app.js"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-扫描漏洞" tabindex="-1"><a class="header-anchor" href="#_2-扫描漏洞"><span>2. 扫描漏洞</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 Docker Scout</span></span>
<span class="line"><span class="token function">docker</span> scout quickview myapp</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 Trivy</span></span>
<span class="line">trivy image myapp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-最小化攻击面" tabindex="-1"><a class="header-anchor" href="#_3-最小化攻击面"><span>3. 最小化攻击面</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 只安装必要的包</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> apt-get update &amp;&amp; <span class="token operator">\</span></span>
<span class="line">    apt-get install -y --no-install-recommends <span class="token operator">\</span></span>
<span class="line">    curl <span class="token operator">\</span></span>
<span class="line">    &amp;&amp; rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化"><span>性能优化</span></a></h2>
<h3 id="_1-缓存优化" tabindex="-1"><a class="header-anchor" href="#_1-缓存优化"><span>1. 缓存优化</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 先复制依赖文件</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再复制源代码</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-镜像大小优化" tabindex="-1"><a class="header-anchor" href="#_2-镜像大小优化"><span>2. 镜像大小优化</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 使用 alpine 基础镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理缓存</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install &amp;&amp; <span class="token operator">\</span></span>
<span class="line">    npm cache clean --force</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-构建速度优化" tabindex="-1"><a class="header-anchor" href="#_3-构建速度优化"><span>3. 构建速度优化</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 使用构建缓存</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm ci</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用多阶段构建</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine <span class="token keyword">AS</span> builder</span></span>
<span class="line"><span class="token comment"># ... 构建步骤</span></span>
<span class="line"></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">builder</span></span> /app/dist /app</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>学习 <RouteLink to="/docker/volumes.html">数据持久化</RouteLink></li>
<li>了解 <RouteLink to="/docker/networking.html">网络管理</RouteLink></li>
<li>掌握 <RouteLink to="/docker/compose.html">容器编排</RouteLink></li>
</ul>
</div></template>


