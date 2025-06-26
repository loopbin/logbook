<template><div><h1 id="docker-安全实践" tabindex="-1"><a class="header-anchor" href="#docker-安全实践"><span>Docker 安全实践</span></a></h1>
<h2 id="容器安全" tabindex="-1"><a class="header-anchor" href="#容器安全"><span>容器安全</span></a></h2>
<h3 id="_1-非-root-用户运行" tabindex="-1"><a class="header-anchor" href="#_1-非-root-用户运行"><span>1. 非 root 用户运行</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 创建非 root 用户</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建用户和组</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> addgroup -S appgroup &amp;&amp; adduser -S appuser -G appgroup</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置工作目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 复制文件并设置权限</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--chown</span><span class="token punctuation">=</span><span class="token string">appuser:appgroup</span></span> . .</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 切换到非 root 用户</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">USER</span> appuser</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动应用</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"node"</span>, <span class="token string">"app.js"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-最小化攻击面" tabindex="-1"><a class="header-anchor" href="#_2-最小化攻击面"><span>2. 最小化攻击面</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 使用多阶段构建</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine <span class="token keyword">AS</span> builder</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm run build</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用轻量级基础镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> nginx:alpine</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">builder</span></span> /app/dist /usr/share/nginx/html</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> nginx.conf /etc/nginx/conf.d/default.conf</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 只暴露必要端口</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">EXPOSE</span> 80</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用非 root 用户</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">USER</span> nginx</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-资源限制" tabindex="-1"><a class="header-anchor" href="#_3-资源限制"><span>3. 资源限制</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 限制 CPU 使用</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--cpus</span><span class="token operator">=</span><span class="token number">0.5</span> <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 限制内存使用</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--memory</span><span class="token operator">=</span>512m <span class="token punctuation">\</span></span>
<span class="line">  --memory-swap<span class="token operator">=</span>1g <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 限制进程数</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --pids-limit<span class="token operator">=</span><span class="token number">100</span> <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="镜像安全" tabindex="-1"><a class="header-anchor" href="#镜像安全"><span>镜像安全</span></a></h2>
<h3 id="_1-基础镜像选择" tabindex="-1"><a class="header-anchor" href="#_1-基础镜像选择"><span>1. 基础镜像选择</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># 推荐：使用官方镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 不推荐：使用非官方镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> someuser/node:14</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-镜像扫描" tabindex="-1"><a class="header-anchor" href="#_2-镜像扫描"><span>2. 镜像扫描</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 Docker Scout</span></span>
<span class="line"><span class="token function">docker</span> scout quickview myapp</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 Trivy</span></span>
<span class="line">trivy image myapp</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 Clair</span></span>
<span class="line">clair-scanner <span class="token parameter variable">--ip</span> <span class="token number">172.17</span>.0.1 myapp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-镜像签名" tabindex="-1"><a class="header-anchor" href="#_3-镜像签名"><span>3. 镜像签名</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 启用 Docker Content Trust</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">DOCKER_CONTENT_TRUST</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 签名镜像</span></span>
<span class="line"><span class="token function">docker</span> trust sign myapp:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证签名</span></span>
<span class="line"><span class="token function">docker</span> trust inspect myapp:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="网络安全" tabindex="-1"><a class="header-anchor" href="#网络安全"><span>网络安全</span></a></h2>
<h3 id="_1-网络隔离" tabindex="-1"><a class="header-anchor" href="#_1-网络隔离"><span>1. 网络隔离</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建内部网络</span></span>
<span class="line"><span class="token function">docker</span> network create <span class="token parameter variable">--internal</span> isolated-network</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用内部网络运行容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--network</span> isolated-network <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-端口暴露" tabindex="-1"><a class="header-anchor" href="#_2-端口暴露"><span>2. 端口暴露</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 只暴露必要端口</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">80</span>:80 <span class="token punctuation">\</span></span>
<span class="line">  --publish-all<span class="token operator">=</span>false <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 限制端口访问</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">127.0</span>.0.1:80:80 <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-网络策略" tabindex="-1"><a class="header-anchor" href="#_3-网络策略"><span>3. 网络策略</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># docker-compose.yml</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> frontend</span>
<span class="line">      <span class="token punctuation">-</span> backend</span>
<span class="line">    <span class="token key atrule">dns</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> 8.8.8.8</span>
<span class="line">      <span class="token punctuation">-</span> 8.8.4.4</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">frontend</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line">  <span class="token key atrule">backend</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line">    <span class="token key atrule">internal</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数据安全" tabindex="-1"><a class="header-anchor" href="#数据安全"><span>数据安全</span></a></h2>
<h3 id="_1-数据卷权限" tabindex="-1"><a class="header-anchor" href="#_1-数据卷权限"><span>1. 数据卷权限</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 设置只读挂载</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/config:/app/config:ro <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置特定用户权限</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/data:/app/data:rw <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--user</span> <span class="token number">1000</span>:1000 <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-敏感数据管理" tabindex="-1"><a class="header-anchor" href="#_2-敏感数据管理"><span>2. 敏感数据管理</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 Docker Secrets</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"mysecret"</span> <span class="token operator">|</span> <span class="token function">docker</span> secret create db_password -</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在服务中使用</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">service</span> create <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--secret</span> db_password <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-数据加密" tabindex="-1"><a class="header-anchor" href="#_3-数据加密"><span>3. 数据加密</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用加密数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume create <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--driver</span> <span class="token builtin class-name">local</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--opt</span> <span class="token assign-left variable">type</span><span class="token operator">=</span>encrypted <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--opt</span> <span class="token assign-left variable">key</span><span class="token operator">=</span>mykey <span class="token punctuation">\</span></span>
<span class="line">  encrypted-data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="运行时安全" tabindex="-1"><a class="header-anchor" href="#运行时安全"><span>运行时安全</span></a></h2>
<h3 id="_1-容器隔离" tabindex="-1"><a class="header-anchor" href="#_1-容器隔离"><span>1. 容器隔离</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用只读文件系统</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --read-only <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 禁用容器间通信</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--network</span> none <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-系统调用限制" tabindex="-1"><a class="header-anchor" href="#_2-系统调用限制"><span>2. 系统调用限制</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 限制系统调用</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --security-opt <span class="token assign-left variable">seccomp</span><span class="token operator">=</span>unconfined <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用自定义 seccomp 配置</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --security-opt <span class="token assign-left variable">seccomp</span><span class="token operator">=</span>/path/to/seccomp.json <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-能力控制" tabindex="-1"><a class="header-anchor" href="#_3-能力控制"><span>3. 能力控制</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 移除所有能力</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --cap-drop<span class="token operator">=</span>ALL <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加必要能力</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --cap-drop<span class="token operator">=</span>ALL <span class="token punctuation">\</span></span>
<span class="line">  --cap-add<span class="token operator">=</span>NET_BIND_SERVICE <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<h3 id="_1-安全扫描" tabindex="-1"><a class="header-anchor" href="#_1-安全扫描"><span>1. 安全扫描</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 定期扫描镜像</span></span>
<span class="line"><span class="token function">docker</span> scout quickview myapp</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 扫描运行中的容器</span></span>
<span class="line"><span class="token function">docker</span> scout cves myapp</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查配置</span></span>
<span class="line"><span class="token function">docker</span> scout config myapp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-更新策略" tabindex="-1"><a class="header-anchor" href="#_2-更新策略"><span>2. 更新策略</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用特定版本</span></span>
<span class="line">FROM node:14.17.0-alpine</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 定期更新基础镜像</span></span>
<span class="line"><span class="token function">docker</span> pull node:14-alpine</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用多阶段构建</span></span>
<span class="line">FROM node:14-alpine AS builder</span>
<span class="line"><span class="token comment"># ... 构建步骤</span></span>
<span class="line">FROM node:14-alpine</span>
<span class="line">COPY <span class="token parameter variable">--from</span><span class="token operator">=</span>builder /app/dist /app</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-监控和审计" tabindex="-1"><a class="header-anchor" href="#_3-监控和审计"><span>3. 监控和审计</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 启用 Docker 审计日志</span></span>
<span class="line">dockerd --audit-log-path<span class="token operator">=</span>/var/log/docker/audit.log</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 监控容器行为</span></span>
<span class="line"><span class="token function">docker</span> events</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查容器配置</span></span>
<span class="line"><span class="token function">docker</span> inspect web</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2>
<h3 id="_1-权限问题" tabindex="-1"><a class="header-anchor" href="#_1-权限问题"><span>1. 权限问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 修改数据卷权限</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> my-volume:/data <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">chown</span> <span class="token parameter variable">-R</span> <span class="token number">1000</span>:1000 /data</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置容器用户</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--user</span> <span class="token number">1000</span>:1000 <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-网络问题" tabindex="-1"><a class="header-anchor" href="#_2-网络问题"><span>2. 网络问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查网络连接</span></span>
<span class="line"><span class="token function">docker</span> network inspect bridge</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 限制网络访问</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--network</span> isolated-network <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--dns</span> <span class="token number">8.8</span>.8.8 <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-资源问题" tabindex="-1"><a class="header-anchor" href="#_3-资源问题"><span>3. 资源问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 监控资源使用</span></span>
<span class="line"><span class="token function">docker</span> stats web</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置资源限制</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--cpus</span><span class="token operator">=</span><span class="token number">0.5</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--memory</span><span class="token operator">=</span>512m <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>学习 <RouteLink to="/docker/cicd.html">CI/CD 集成</RouteLink></li>
<li>了解 <RouteLink to="/docker/troubleshooting.html">故障排查</RouteLink></li>
<li>掌握 <RouteLink to="/docker/performance.html">性能优化</RouteLink></li>
</ul>
</div></template>


