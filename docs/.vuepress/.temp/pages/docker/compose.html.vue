<template><div><h1 id="docker-compose-容器编排" tabindex="-1"><a class="header-anchor" href="#docker-compose-容器编排"><span>Docker Compose 容器编排</span></a></h1>
<h2 id="基础概念" tabindex="-1"><a class="header-anchor" href="#基础概念"><span>基础概念</span></a></h2>
<h3 id="什么是-docker-compose" tabindex="-1"><a class="header-anchor" href="#什么是-docker-compose"><span>什么是 Docker Compose</span></a></h3>
<ul>
<li>用于定义和运行多容器 Docker 应用的工具</li>
<li>使用 YAML 文件配置应用服务</li>
<li>一个命令即可创建和启动所有服务</li>
</ul>
<h3 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念"><span>核心概念</span></a></h3>
<ul>
<li>服务（Service）：一个应用容器</li>
<li>项目（Project）：一组关联的服务</li>
<li>配置文件：<code v-pre>docker-compose.yml</code></li>
</ul>
<h2 id="安装配置" tabindex="-1"><a class="header-anchor" href="#安装配置"><span>安装配置</span></a></h2>
<h3 id="安装-docker-compose" tabindex="-1"><a class="header-anchor" href="#安装-docker-compose"><span>安装 Docker Compose</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 pip 安装</span></span>
<span class="line">pip <span class="token function">install</span> <span class="token function">docker-compose</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 curl 安装</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-L</span> <span class="token string">"https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-s</span><span class="token variable">)</span></span>-<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-m</span><span class="token variable">)</span></span>"</span> <span class="token parameter variable">-o</span> /usr/local/bin/docker-compose</span>
<span class="line"><span class="token function">chmod</span> +x /usr/local/bin/docker-compose</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="验证安装" tabindex="-1"><a class="header-anchor" href="#验证安装"><span>验证安装</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker-compose</span> <span class="token parameter variable">--version</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用"><span>基本使用</span></a></h2>
<h3 id="配置文件结构" tabindex="-1"><a class="header-anchor" href="#配置文件结构"><span>配置文件结构</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"80:80"</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./src<span class="token punctuation">:</span>/usr/share/nginx/html</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> db</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span><span class="token number">8.0</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">MYSQL_ROOT_PASSWORD</span><span class="token punctuation">:</span> secret</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> mysql<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/mysql</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">mysql-data</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line"><span class="token function">docker-compose</span> up</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 后台启动服务</span></span>
<span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止服务</span></span>
<span class="line"><span class="token function">docker-compose</span> down</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看服务状态</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看服务日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启服务</span></span>
<span class="line"><span class="token function">docker-compose</span> restart</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置详解" tabindex="-1"><a class="header-anchor" href="#配置详解"><span>配置详解</span></a></h2>
<h3 id="服务配置" tabindex="-1"><a class="header-anchor" href="#服务配置"><span>服务配置</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 镜像配置</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">build</span><span class="token punctuation">:</span> ./web</span>
<span class="line">    <span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./web</span>
<span class="line">      <span class="token key atrule">dockerfile</span><span class="token punctuation">:</span> Dockerfile</span>
<span class="line">      <span class="token key atrule">args</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> NODE_ENV=production</span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 容器配置</span></span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>web</span>
<span class="line">    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> db</span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 环境变量</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> NODE_ENV=production</span>
<span class="line">      <span class="token punctuation">-</span> DB_HOST=db</span>
<span class="line">    <span class="token key atrule">env_file</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./config/.env</span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 端口映射</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"80:80"</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"443:443"</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 数据卷</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./src<span class="token punctuation">:</span>/app/src</span>
<span class="line">      <span class="token punctuation">-</span> static<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/app/static</span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 网络配置</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> frontend</span>
<span class="line">      <span class="token punctuation">-</span> backend</span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 健康检查</span></span>
<span class="line">    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">test</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"CMD"</span><span class="token punctuation">,</span> <span class="token string">"curl"</span><span class="token punctuation">,</span> <span class="token string">"-f"</span><span class="token punctuation">,</span> <span class="token string">"http://localhost"</span><span class="token punctuation">]</span></span>
<span class="line">      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 30s</span>
<span class="line">      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 10s</span>
<span class="line">      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="网络配置" tabindex="-1"><a class="header-anchor" href="#网络配置"><span>网络配置</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">frontend</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line">  <span class="token key atrule">backend</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line">    <span class="token key atrule">internal</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数据卷配置" tabindex="-1"><a class="header-anchor" href="#数据卷配置"><span>数据卷配置</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">mysql-data</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> local</span>
<span class="line">  <span class="token key atrule">static-data</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> local</span>
<span class="line">    <span class="token key atrule">driver_opts</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">type</span><span class="token punctuation">:</span> none</span>
<span class="line">      <span class="token key atrule">o</span><span class="token punctuation">:</span> bind</span>
<span class="line">      <span class="token key atrule">device</span><span class="token punctuation">:</span> /path/to/data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实际应用场景" tabindex="-1"><a class="header-anchor" href="#实际应用场景"><span>实际应用场景</span></a></h2>
<h3 id="_1-开发环境" tabindex="-1"><a class="header-anchor" href="#_1-开发环境"><span>1. 开发环境</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">build</span><span class="token punctuation">:</span> ./web</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./web<span class="token punctuation">:</span>/app</span>
<span class="line">      <span class="token punctuation">-</span> /app/node_modules</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"3000:3000"</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> NODE_ENV=development</span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> npm run dev</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token number">13</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">POSTGRES_PASSWORD</span><span class="token punctuation">:</span> secret</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/postgresql/data</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span><span class="token number">6</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"6379:6379"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres-data</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-生产环境" tabindex="-1"><a class="header-anchor" href="#_2-生产环境"><span>2. 生产环境</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">build</span><span class="token punctuation">:</span> ./web</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"80:80"</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> NODE_ENV=production</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> db</span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line">    <span class="token key atrule">deploy</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">      <span class="token key atrule">update_config</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">parallelism</span><span class="token punctuation">:</span> <span class="token number">1</span></span>
<span class="line">        <span class="token key atrule">delay</span><span class="token punctuation">:</span> 10s</span>
<span class="line">      <span class="token key atrule">restart_policy</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">condition</span><span class="token punctuation">:</span> on<span class="token punctuation">-</span>failure</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token number">13</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">POSTGRES_PASSWORD</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>DB_PASSWORD<span class="token punctuation">}</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/postgresql/data</span>
<span class="line">    <span class="token key atrule">deploy</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">placement</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">constraints</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>node.role == manager<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span><span class="token number">6</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> redis<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/data</span>
<span class="line">    <span class="token key atrule">deploy</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">placement</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">constraints</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>node.role == manager<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres-data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">redis-data</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-测试环境" tabindex="-1"><a class="header-anchor" href="#_3-测试环境"><span>3. 测试环境</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">build</span><span class="token punctuation">:</span> ./web</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> NODE_ENV=test</span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> npm test</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> db</span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token number">13</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">POSTGRES_PASSWORD</span><span class="token punctuation">:</span> test</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres<span class="token punctuation">-</span>test<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/postgresql/data</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span><span class="token number">6</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> redis<span class="token punctuation">-</span>test<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/data</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres-test-data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">redis-test-data</span><span class="token punctuation">:</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<h3 id="_1-环境变量管理" tabindex="-1"><a class="header-anchor" href="#_1-环境变量管理"><span>1. 环境变量管理</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># docker-compose.yml</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">env_file</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./config/.env</span>
<span class="line">      <span class="token punctuation">-</span> ./config/.env.$<span class="token punctuation">{</span>NODE_ENV<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-服务依赖" tabindex="-1"><a class="header-anchor" href="#_2-服务依赖"><span>2. 服务依赖</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">condition</span><span class="token punctuation">:</span> service_healthy</span>
<span class="line">      <span class="token key atrule">redis</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">condition</span><span class="token punctuation">:</span> service_started</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-资源限制" tabindex="-1"><a class="header-anchor" href="#_3-资源限制"><span>3. 资源限制</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">deploy</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">resources</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">limits</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">cpus</span><span class="token punctuation">:</span> <span class="token string">"0.50"</span></span>
<span class="line">          <span class="token key atrule">memory</span><span class="token punctuation">:</span> 512M</span>
<span class="line">        <span class="token key atrule">reservations</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">cpus</span><span class="token punctuation">:</span> <span class="token string">"0.25"</span></span>
<span class="line">          <span class="token key atrule">memory</span><span class="token punctuation">:</span> 256M</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-健康检查" tabindex="-1"><a class="header-anchor" href="#_4-健康检查"><span>4. 健康检查</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">test</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"CMD"</span><span class="token punctuation">,</span> <span class="token string">"curl"</span><span class="token punctuation">,</span> <span class="token string">"-f"</span><span class="token punctuation">,</span> <span class="token string">"http://localhost/health"</span><span class="token punctuation">]</span></span>
<span class="line">      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 30s</span>
<span class="line">      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 10s</span>
<span class="line">      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">      <span class="token key atrule">start_period</span><span class="token punctuation">:</span> 40s</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2>
<h3 id="_1-服务启动顺序" tabindex="-1"><a class="header-anchor" href="#_1-服务启动顺序"><span>1. 服务启动顺序</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> db</span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">></span><span class="token scalar string"></span>
<span class="line">      sh -c "</span>
<span class="line">        echo 'Waiting for services...' &amp;&amp;</span>
<span class="line">        sleep 10 &amp;&amp;</span>
<span class="line">        npm start</span>
<span class="line">      "</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-数据持久化" tabindex="-1"><a class="header-anchor" href="#_2-数据持久化"><span>2. 数据持久化</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">db</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> volume</span>
<span class="line">        <span class="token key atrule">source</span><span class="token punctuation">:</span> db<span class="token punctuation">-</span>data</span>
<span class="line">        <span class="token key atrule">target</span><span class="token punctuation">:</span> /var/lib/postgresql/data</span>
<span class="line">        <span class="token key atrule">volume</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">nocopy</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-网络问题" tabindex="-1"><a class="header-anchor" href="#_3-网络问题"><span>3. 网络问题</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> frontend</span>
<span class="line">      <span class="token punctuation">-</span> backend</span>
<span class="line">    <span class="token key atrule">dns</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> 8.8.8.8</span>
<span class="line">      <span class="token punctuation">-</span> 8.8.4.4</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="调试技巧" tabindex="-1"><a class="header-anchor" href="#调试技巧"><span>调试技巧</span></a></h2>
<h3 id="_1-查看服务日志" tabindex="-1"><a class="header-anchor" href="#_1-查看服务日志"><span>1. 查看服务日志</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看所有服务日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看特定服务日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs web</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 实时查看日志</span></span>
<span class="line"><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span> web</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-进入容器" tabindex="-1"><a class="header-anchor" href="#_2-进入容器"><span>2. 进入容器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 进入 web 服务容器</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token builtin class-name">exec</span> web <span class="token function">sh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 进入 db 服务容器</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token builtin class-name">exec</span> db psql <span class="token parameter variable">-U</span> postgres</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-服务调试" tabindex="-1"><a class="header-anchor" href="#_3-服务调试"><span>3. 服务调试</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看服务状态</span></span>
<span class="line"><span class="token function">docker-compose</span> <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看服务配置</span></span>
<span class="line"><span class="token function">docker-compose</span> config</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看服务依赖</span></span>
<span class="line"><span class="token function">docker-compose</span> config <span class="token parameter variable">--services</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>学习 <RouteLink to="/docker/monitoring.html">监控和日志</RouteLink></li>
<li>了解 <RouteLink to="/docker/security.html">安全实践</RouteLink></li>
<li>掌握 <RouteLink to="/docker/cicd.html">CI/CD 集成</RouteLink></li>
</ul>
</div></template>


