<template><div><h1 id="docker-常规操作" tabindex="-1"><a class="header-anchor" href="#docker-常规操作"><span>Docker 常规操作</span></a></h1>
<h2 id="容器操作" tabindex="-1"><a class="header-anchor" href="#容器操作"><span>容器操作</span></a></h2>
<h3 id="查看容器" tabindex="-1"><a class="header-anchor" href="#查看容器"><span>查看容器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看运行中的容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看所有容器（包括已停止的）</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-停止容器" tabindex="-1"><a class="header-anchor" href="#启动-停止容器"><span>启动/停止容器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 启动容器</span></span>
<span class="line"><span class="token function">docker</span> start <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止容器</span></span>
<span class="line"><span class="token function">docker</span> stop <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启容器</span></span>
<span class="line"><span class="token function">docker</span> restart <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="删除容器" tabindex="-1"><a class="header-anchor" href="#删除容器"><span>删除容器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 删除已停止的容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">rm</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 强制删除运行中的容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">rm</span> <span class="token parameter variable">-f</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="镜像操作" tabindex="-1"><a class="header-anchor" href="#镜像操作"><span>镜像操作</span></a></h2>
<h3 id="查看镜像" tabindex="-1"><a class="header-anchor" href="#查看镜像"><span>查看镜像</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 列出本地镜像</span></span>
<span class="line"><span class="token function">docker</span> images</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="拉取镜像" tabindex="-1"><a class="header-anchor" href="#拉取镜像"><span>拉取镜像</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 拉取最新版本</span></span>
<span class="line"><span class="token function">docker</span> pull <span class="token operator">&lt;</span>image_name<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 拉取指定版本</span></span>
<span class="line"><span class="token function">docker</span> pull <span class="token operator">&lt;</span>image_name<span class="token operator">></span>:<span class="token operator">&lt;</span>tag<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="删除镜像" tabindex="-1"><a class="header-anchor" href="#删除镜像"><span>删除镜像</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 删除镜像</span></span>
<span class="line"><span class="token function">docker</span> rmi <span class="token operator">&lt;</span>image_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 强制删除镜像</span></span>
<span class="line"><span class="token function">docker</span> rmi <span class="token parameter variable">-f</span> <span class="token operator">&lt;</span>image_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="网络操作" tabindex="-1"><a class="header-anchor" href="#网络操作"><span>网络操作</span></a></h2>
<h3 id="查看网络" tabindex="-1"><a class="header-anchor" href="#查看网络"><span>查看网络</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 列出所有网络</span></span>
<span class="line"><span class="token function">docker</span> network <span class="token function">ls</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建网络" tabindex="-1"><a class="header-anchor" href="#创建网络"><span>创建网络</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建自定义网络</span></span>
<span class="line"><span class="token function">docker</span> network create <span class="token operator">&lt;</span>network_name<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="连接容器到网络" tabindex="-1"><a class="header-anchor" href="#连接容器到网络"><span>连接容器到网络</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将容器连接到网络</span></span>
<span class="line"><span class="token function">docker</span> network connect <span class="token operator">&lt;</span>network_name<span class="token operator">></span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数据卷操作" tabindex="-1"><a class="header-anchor" href="#数据卷操作"><span>数据卷操作</span></a></h2>
<h3 id="创建数据卷" tabindex="-1"><a class="header-anchor" href="#创建数据卷"><span>创建数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume create <span class="token operator">&lt;</span>volume_name<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查看数据卷" tabindex="-1"><a class="header-anchor" href="#查看数据卷"><span>查看数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 列出所有数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume <span class="token function">ls</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="删除数据卷" tabindex="-1"><a class="header-anchor" href="#删除数据卷"><span>删除数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 删除数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume <span class="token function">rm</span> <span class="token operator">&lt;</span>volume_name<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用命令组合" tabindex="-1"><a class="header-anchor" href="#常用命令组合"><span>常用命令组合</span></a></h2>
<h3 id="清理未使用的资源" tabindex="-1"><a class="header-anchor" href="#清理未使用的资源"><span>清理未使用的资源</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 清理未使用的容器、网络、镜像和构建缓存</span></span>
<span class="line"><span class="token function">docker</span> system prune</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查看容器日志" tabindex="-1"><a class="header-anchor" href="#查看容器日志"><span>查看容器日志</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 实时查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token parameter variable">-f</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="进入容器内部" tabindex="-1"><a class="header-anchor" href="#进入容器内部"><span>进入容器内部</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 进入运行中的容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span> /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


