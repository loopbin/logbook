<template><div><h1 id="docker-数据持久化" tabindex="-1"><a class="header-anchor" href="#docker-数据持久化"><span>Docker 数据持久化</span></a></h1>
<h2 id="数据卷-volumes" tabindex="-1"><a class="header-anchor" href="#数据卷-volumes"><span>数据卷（Volumes）</span></a></h2>
<h3 id="创建数据卷" tabindex="-1"><a class="header-anchor" href="#创建数据卷"><span>创建数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume create my-volume</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看数据卷列表</span></span>
<span class="line"><span class="token function">docker</span> volume <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看数据卷详情</span></span>
<span class="line"><span class="token function">docker</span> volume inspect my-volume</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用数据卷" tabindex="-1"><a class="header-anchor" href="#使用数据卷"><span>使用数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 运行容器时挂载数据卷</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> my-volume:/app/data <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用绝对路径挂载</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /host/path:/container/path <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="管理数据卷" tabindex="-1"><a class="header-anchor" href="#管理数据卷"><span>管理数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 删除数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume <span class="token function">rm</span> my-volume</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除未使用的数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume prune</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="绑定挂载-bind-mounts" tabindex="-1"><a class="header-anchor" href="#绑定挂载-bind-mounts"><span>绑定挂载（Bind Mounts）</span></a></h2>
<h3 id="基本用法" tabindex="-1"><a class="header-anchor" href="#基本用法"><span>基本用法</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 挂载本地目录</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/src:/app/src <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 挂载单个文件</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/config.json:/app/config.json <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="权限设置" tabindex="-1"><a class="header-anchor" href="#权限设置"><span>权限设置</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 设置只读挂载</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/src:/app/src:ro <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置读写挂载（默认）</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/src:/app/src:rw <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tmpfs-挂载" tabindex="-1"><a class="header-anchor" href="#tmpfs-挂载"><span>tmpfs 挂载</span></a></h2>
<h3 id="内存文件系统" tabindex="-1"><a class="header-anchor" href="#内存文件系统"><span>内存文件系统</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 tmpfs 挂载</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--tmpfs</span> /app/tmp <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置 tmpfs 选项</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-container <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--tmpfs</span> /app/tmp:rw,noexec,nosuid,size<span class="token operator">=</span>100m <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实际应用场景" tabindex="-1"><a class="header-anchor" href="#实际应用场景"><span>实际应用场景</span></a></h2>
<h3 id="_1-数据库持久化" tabindex="-1"><a class="header-anchor" href="#_1-数据库持久化"><span>1. 数据库持久化</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># MySQL 数据持久化</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> mysql <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> mysql-data:/var/lib/mysql <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_ROOT_PASSWORD</span><span class="token operator">=</span>secret <span class="token punctuation">\</span></span>
<span class="line">  mysql:8.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># PostgreSQL 数据持久化</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> postgres <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> postgres-data:/var/lib/postgresql/data <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">POSTGRES_PASSWORD</span><span class="token operator">=</span>secret <span class="token punctuation">\</span></span>
<span class="line">  postgres:13</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置文件管理" tabindex="-1"><a class="header-anchor" href="#_2-配置文件管理"><span>2. 配置文件管理</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># Nginx 配置</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> nginx <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/nginx.conf:/etc/nginx/nginx.conf <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/conf.d:/etc/nginx/conf.d <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Node.js 应用配置</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> node-app <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/.env:/app/.env <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/config:/app/config <span class="token punctuation">\</span></span>
<span class="line">  node:14</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-日志管理" tabindex="-1"><a class="header-anchor" href="#_3-日志管理"><span>3. 日志管理</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 应用日志</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-app <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/logs:/app/logs <span class="token punctuation">\</span></span>
<span class="line">  my-app</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 系统日志</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> syslog <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /var/log:/var/log <span class="token punctuation">\</span></span>
<span class="line">  syslog-ng</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数据备份和恢复" tabindex="-1"><a class="header-anchor" href="#数据备份和恢复"><span>数据备份和恢复</span></a></h2>
<h3 id="备份数据卷" tabindex="-1"><a class="header-anchor" href="#备份数据卷"><span>备份数据卷</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 备份 MySQL 数据</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> mysql-data:/source <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/backup:/backup <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">tar</span> <span class="token parameter variable">-czf</span> /backup/mysql-backup.tar.gz <span class="token parameter variable">-C</span> /source <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 备份 PostgreSQL 数据</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> postgres-data:/source <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/backup:/backup <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">tar</span> <span class="token parameter variable">-czf</span> /backup/postgres-backup.tar.gz <span class="token parameter variable">-C</span> /source <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="恢复数据" tabindex="-1"><a class="header-anchor" href="#恢复数据"><span>恢复数据</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 恢复 MySQL 数据</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> mysql-data:/target <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/backup:/backup <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">"rm -rf /target/* &amp;&amp; tar -xzf /backup/mysql-backup.tar.gz -C /target"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 恢复 PostgreSQL 数据</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> postgres-data:/target <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/backup:/backup <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">"rm -rf /target/* &amp;&amp; tar -xzf /backup/postgres-backup.tar.gz -C /target"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<h3 id="_1-数据卷命名" tabindex="-1"><a class="header-anchor" href="#_1-数据卷命名"><span>1. 数据卷命名</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用有意义的名称</span></span>
<span class="line"><span class="token function">docker</span> volume create app-data</span>
<span class="line"><span class="token function">docker</span> volume create db-data</span>
<span class="line"><span class="token function">docker</span> volume create logs-data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-权限管理" tabindex="-1"><a class="header-anchor" href="#_2-权限管理"><span>2. 权限管理</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 设置适当的权限</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-app <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> app-data:/app/data:rw <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> config-data:/app/config:ro <span class="token punctuation">\</span></span>
<span class="line">  my-app</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-数据隔离" tabindex="-1"><a class="header-anchor" href="#_3-数据隔离"><span>3. 数据隔离</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 为不同环境使用不同的数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume create dev-data</span>
<span class="line"><span class="token function">docker</span> volume create prod-data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-定期备份" tabindex="-1"><a class="header-anchor" href="#_4-定期备份"><span>4. 定期备份</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建备份脚本</span></span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token assign-left variable">BACKUP_DIR</span><span class="token operator">=</span><span class="token string">"/backup"</span></span>
<span class="line"><span class="token assign-left variable">DATE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y%m%d<span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 备份 MySQL 数据</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> mysql-data:/source <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable">$BACKUP_DIR</span>:/backup <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">tar</span> <span class="token parameter variable">-czf</span> /backup/mysql-<span class="token variable">$DATE</span>.tar.gz <span class="token parameter variable">-C</span> /source <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 备份 PostgreSQL 数据</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> postgres-data:/source <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token variable">$BACKUP_DIR</span>:/backup <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">tar</span> <span class="token parameter variable">-czf</span> /backup/postgres-<span class="token variable">$DATE</span>.tar.gz <span class="token parameter variable">-C</span> /source <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2>
<h3 id="_1-权限问题" tabindex="-1"><a class="header-anchor" href="#_1-权限问题"><span>1. 权限问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 修改数据卷权限</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> my-volume:/data <span class="token punctuation">\</span></span>
<span class="line">  alpine <span class="token function">chown</span> <span class="token parameter variable">-R</span> <span class="token number">1000</span>:1000 /data</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-空间问题" tabindex="-1"><a class="header-anchor" href="#_2-空间问题"><span>2. 空间问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看数据卷使用情况</span></span>
<span class="line"><span class="token function">docker</span> system <span class="token function">df</span> <span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理未使用的数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume prune</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-性能问题" tabindex="-1"><a class="header-anchor" href="#_3-性能问题"><span>3. 性能问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用本地 SSD 存储</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> my-app <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /ssd/data:/app/data <span class="token punctuation">\</span></span>
<span class="line">  my-app</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>学习 <RouteLink to="/docker/networking.html">网络管理</RouteLink></li>
<li>了解 <RouteLink to="/docker/compose.html">容器编排</RouteLink></li>
<li>掌握 <RouteLink to="/docker/monitoring.html">监控和日志</RouteLink></li>
</ul>
</div></template>


