<template><div><h1 id="docker-基础入门" tabindex="-1"><a class="header-anchor" href="#docker-基础入门"><span>Docker 基础入门</span></a></h1>
<h2 id="环境准备" tabindex="-1"><a class="header-anchor" href="#环境准备"><span>环境准备</span></a></h2>
<h3 id="windows-mac-安装" tabindex="-1"><a class="header-anchor" href="#windows-mac-安装"><span>Windows/Mac 安装</span></a></h3>
<ol>
<li>访问 <a href="https://www.docker.com/products/docker-desktop" target="_blank" rel="noopener noreferrer">Docker Desktop 下载页面</a></li>
<li>下载对应系统的安装包</li>
<li>运行安装程序，按照向导完成安装</li>
<li>安装完成后，打开终端验证：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token parameter variable">--version</span></span>
<span class="line"><span class="token function">docker</span> run hello-world</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="linux-安装" tabindex="-1"><a class="header-anchor" href="#linux-安装"><span>Linux 安装</span></a></h3>
<p>以 Ubuntu 为例：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 更新包索引</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> update</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装必要的依赖</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> <span class="token punctuation">\</span></span>
<span class="line">    apt-transport-https <span class="token punctuation">\</span></span>
<span class="line">    ca-certificates <span class="token punctuation">\</span></span>
<span class="line">    <span class="token function">curl</span> <span class="token punctuation">\</span></span>
<span class="line">    gnupg <span class="token punctuation">\</span></span>
<span class="line">    lsb-release</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加 Docker 的官方 GPG 密钥</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-fsSL</span> https://download.docker.com/linux/ubuntu/gpg <span class="token operator">|</span> <span class="token function">sudo</span> gpg <span class="token parameter variable">--dearmor</span> <span class="token parameter variable">-o</span> /usr/share/keyrings/docker-archive-keyring.gpg</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置稳定版仓库</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token string">"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \</span>
<span class="line">  <span class="token variable"><span class="token variable">$(</span>lsb_release <span class="token parameter variable">-cs</span><span class="token variable">)</span></span> stable"</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tee</span> /etc/apt/sources.list.d/docker.list <span class="token operator">></span> /dev/null</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装 Docker Engine</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> update</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> docker-ce docker-ce-cli containerd.io</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证安装</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> run hello-world</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念"><span>核心概念</span></a></h2>
<h3 id="镜像-image" tabindex="-1"><a class="header-anchor" href="#镜像-image"><span>镜像（Image）</span></a></h3>
<ul>
<li>镜像是一个只读的模板，包含了运行应用所需的所有文件和配置</li>
<li>类比：前端项目的 <code v-pre>node_modules</code> 目录</li>
<li>特点：
<ul>
<li>分层存储</li>
<li>可复用</li>
<li>不可修改</li>
</ul>
</li>
</ul>
<h3 id="容器-container" tabindex="-1"><a class="header-anchor" href="#容器-container"><span>容器（Container）</span></a></h3>
<ul>
<li>容器是镜像的运行实例</li>
<li>类比：正在运行的开发服务器（如 <code v-pre>npm run dev</code>）</li>
<li>特点：
<ul>
<li>可读写</li>
<li>相互隔离</li>
<li>生命周期管理</li>
</ul>
</li>
</ul>
<h3 id="dockerfile" tabindex="-1"><a class="header-anchor" href="#dockerfile"><span>Dockerfile</span></a></h3>
<ul>
<li>用于构建镜像的文本文件</li>
<li>类比：项目的 <code v-pre>package.json</code></li>
<li>包含：
<ul>
<li>基础镜像</li>
<li>运行环境</li>
<li>应用代码</li>
<li>启动命令</li>
</ul>
</li>
</ul>
<h3 id="数据卷-volume" tabindex="-1"><a class="header-anchor" href="#数据卷-volume"><span>数据卷（Volume）</span></a></h3>
<ul>
<li>用于持久化数据的机制</li>
<li>类比：数据库文件</li>
<li>特点：
<ul>
<li>数据持久化</li>
<li>容器间共享</li>
<li>备份和恢复</li>
</ul>
</li>
</ul>
<h3 id="网络-network" tabindex="-1"><a class="header-anchor" href="#网络-network"><span>网络（Network）</span></a></h3>
<ul>
<li>容器间通信的机制</li>
<li>类比：前端项目的 API 调用</li>
<li>类型：
<ul>
<li>bridge（默认）</li>
<li>host</li>
<li>none</li>
<li>overlay</li>
</ul>
</li>
</ul>
<h2 id="基础命令" tabindex="-1"><a class="header-anchor" href="#基础命令"><span>基础命令</span></a></h2>
<h3 id="镜像操作" tabindex="-1"><a class="header-anchor" href="#镜像操作"><span>镜像操作</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 拉取镜像</span></span>
<span class="line"><span class="token function">docker</span> pull nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看本地镜像</span></span>
<span class="line"><span class="token function">docker</span> images</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除镜像</span></span>
<span class="line"><span class="token function">docker</span> rmi nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="容器操作" tabindex="-1"><a class="header-anchor" href="#容器操作"><span>容器操作</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 运行容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">80</span>:80 nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看运行中的容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看所有容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止容器</span></span>
<span class="line"><span class="token function">docker</span> stop <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动容器</span></span>
<span class="line"><span class="token function">docker</span> start <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">rm</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="容器交互" tabindex="-1"><a class="header-anchor" href="#容器交互"><span>容器交互</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 进入容器内部</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span> /bin/bash</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 实时查看日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token parameter variable">-f</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第一个-docker-应用" tabindex="-1"><a class="header-anchor" href="#第一个-docker-应用"><span>第一个 Docker 应用</span></a></h2>
<p>让我们创建一个简单的 Node.js 应用：</p>
<ol>
<li>创建项目目录：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> docker-demo</span>
<span class="line"><span class="token builtin class-name">cd</span> docker-demo</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>创建 <code v-pre>app.js</code>：</li>
</ol>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"http"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token function">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  res<span class="token punctuation">.</span><span class="token function">writeHead</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token string-property property">"Content-Type"</span><span class="token operator">:</span> <span class="token string">"text/plain"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token string">"Hello Docker!\n"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">server<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">,</span> <span class="token string">"0.0.0.0"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Server running at http://0.0.0.0:3000/"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>创建 <code v-pre>Dockerfile</code>：</li>
</ol>
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
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"node"</span>, <span class="token string">"app.js"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li>构建镜像：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> build <span class="token parameter variable">-t</span> my-node-app <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol start="5">
<li>运行容器：</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">3000</span>:3000 my-node-app</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol start="6">
<li>访问应用：
打开浏览器访问 <code v-pre>http://localhost:3000</code></li>
</ol>
<h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2>
<h3 id="_1-权限问题" tabindex="-1"><a class="header-anchor" href="#_1-权限问题"><span>1. 权限问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将当前用户添加到 docker 组</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">usermod</span> <span class="token parameter variable">-aG</span> <span class="token function">docker</span> <span class="token environment constant">$USER</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新登录使更改生效</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-端口占用" tabindex="-1"><a class="header-anchor" href="#_2-端口占用"><span>2. 端口占用</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看端口占用</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">lsof</span> <span class="token parameter variable">-i</span> :80</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止占用端口的进程</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">kill</span> <span class="token operator">&lt;</span>PID<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-磁盘空间" tabindex="-1"><a class="header-anchor" href="#_3-磁盘空间"><span>3. 磁盘空间</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 清理未使用的镜像</span></span>
<span class="line"><span class="token function">docker</span> system prune <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看磁盘使用情况</span></span>
<span class="line"><span class="token function">docker</span> system <span class="token function">df</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>学习 <RouteLink to="/docker/dockerfile.html">Dockerfile 编写</RouteLink></li>
<li>了解 <RouteLink to="/docker/volumes.html">数据持久化</RouteLink></li>
<li>掌握 <RouteLink to="/docker/networking.html">网络管理</RouteLink></li>
</ul>
</div></template>


