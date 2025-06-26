<template><div><h1 id="docker-故障排查" tabindex="-1"><a class="header-anchor" href="#docker-故障排查"><span>Docker 故障排查</span></a></h1>
<h2 id="容器问题" tabindex="-1"><a class="header-anchor" href="#容器问题"><span>容器问题</span></a></h2>
<h3 id="_1-容器无法启动" tabindex="-1"><a class="header-anchor" href="#_1-容器无法启动"><span>1. 容器无法启动</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看容器详细信息</span></span>
<span class="line"><span class="token function">docker</span> inspect container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看容器状态</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查容器配置</span></span>
<span class="line"><span class="token function">docker</span> container inspect container_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-容器异常退出" tabindex="-1"><a class="header-anchor" href="#_2-容器异常退出"><span>2. 容器异常退出</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看退出状态码</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查系统日志</span></span>
<span class="line">journalctl <span class="token parameter variable">-u</span> <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查容器资源使用</span></span>
<span class="line"><span class="token function">docker</span> stats container_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-容器网络问题" tabindex="-1"><a class="header-anchor" href="#_3-容器网络问题"><span>3. 容器网络问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查网络连接</span></span>
<span class="line"><span class="token function">docker</span> network inspect bridge</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试容器网络</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">ping</span> google.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 DNS 配置</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">cat</span> /etc/resolv.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看网络统计</span></span>
<span class="line"><span class="token function">docker</span> network <span class="token function">ls</span></span>
<span class="line"><span class="token function">docker</span> network inspect network_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="镜像问题" tabindex="-1"><a class="header-anchor" href="#镜像问题"><span>镜像问题</span></a></h2>
<h3 id="_1-镜像构建失败" tabindex="-1"><a class="header-anchor" href="#_1-镜像构建失败"><span>1. 镜像构建失败</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看构建日志</span></span>
<span class="line"><span class="token function">docker</span> build <span class="token parameter variable">-t</span> myapp <span class="token builtin class-name">.</span> <span class="token operator"><span class="token file-descriptor important">2</span>></span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">|</span> <span class="token function">tee</span> build.log</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用详细输出</span></span>
<span class="line"><span class="token function">docker</span> build <span class="token parameter variable">--progress</span><span class="token operator">=</span>plain <span class="token parameter variable">-t</span> myapp <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 Dockerfile 语法</span></span>
<span class="line"><span class="token function">docker</span> build --no-cache <span class="token parameter variable">-t</span> myapp <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分步构建</span></span>
<span class="line"><span class="token function">docker</span> build <span class="token parameter variable">--target</span> builder <span class="token parameter variable">-t</span> myapp:builder <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-镜像拉取失败" tabindex="-1"><a class="header-anchor" href="#_2-镜像拉取失败"><span>2. 镜像拉取失败</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查网络连接</span></span>
<span class="line"><span class="token function">ping</span> registry-1.docker.io</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查认证信息</span></span>
<span class="line"><span class="token function">docker</span> login</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理本地缓存</span></span>
<span class="line"><span class="token function">docker</span> system prune <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用镜像加速器</span></span>
<span class="line"><span class="token function">docker</span> pull registry.docker-cn.com/library/nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-镜像安全问题" tabindex="-1"><a class="header-anchor" href="#_3-镜像安全问题"><span>3. 镜像安全问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 扫描镜像漏洞</span></span>
<span class="line"><span class="token function">docker</span> scan myapp:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查镜像层</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">history</span> myapp:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查镜像配置</span></span>
<span class="line"><span class="token function">docker</span> inspect myapp:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证镜像签名</span></span>
<span class="line"><span class="token function">docker</span> trust inspect myapp:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="存储问题" tabindex="-1"><a class="header-anchor" href="#存储问题"><span>存储问题</span></a></h2>
<h3 id="_1-数据卷问题" tabindex="-1"><a class="header-anchor" href="#_1-数据卷问题"><span>1. 数据卷问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume <span class="token function">ls</span></span>
<span class="line"><span class="token function">docker</span> volume inspect volume_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理未使用数据卷</span></span>
<span class="line"><span class="token function">docker</span> volume prune</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 备份数据卷</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token parameter variable">-v</span> volume_name:/source <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>:/backup alpine <span class="token function">tar</span> <span class="token parameter variable">-czf</span> /backup/backup.tar.gz <span class="token parameter variable">-C</span> /source <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 恢复数据卷</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token parameter variable">-v</span> volume_name:/target <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>:/backup alpine <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">"cd /target &amp;&amp; tar -xzf /backup/backup.tar.gz"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-磁盘空间问题" tabindex="-1"><a class="header-anchor" href="#_2-磁盘空间问题"><span>2. 磁盘空间问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看磁盘使用</span></span>
<span class="line"><span class="token function">docker</span> system <span class="token function">df</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理未使用资源</span></span>
<span class="line"><span class="token function">docker</span> system prune</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 清理特定资源</span></span>
<span class="line"><span class="token function">docker</span> container prune</span>
<span class="line"><span class="token function">docker</span> image prune</span>
<span class="line"><span class="token function">docker</span> volume prune</span>
<span class="line"><span class="token function">docker</span> network prune</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查大文件</span></span>
<span class="line"><span class="token function">docker</span> system <span class="token function">df</span> <span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-权限问题" tabindex="-1"><a class="header-anchor" href="#_3-权限问题"><span>3. 权限问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查文件权限</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">ls</span> <span class="token parameter variable">-la</span> /path/to/directory</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改文件权限</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">chown</span> <span class="token parameter variable">-R</span> user:group /path/to/directory</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查用户权限</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">id</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改容器用户</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--user</span> <span class="token number">1000</span>:1000 image_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="网络问题" tabindex="-1"><a class="header-anchor" href="#网络问题"><span>网络问题</span></a></h2>
<h3 id="_1-容器间通信" tabindex="-1"><a class="header-anchor" href="#_1-容器间通信"><span>1. 容器间通信</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查网络连接</span></span>
<span class="line"><span class="token function">docker</span> network inspect bridge</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试容器间通信</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container1 <span class="token function">ping</span> container2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查端口映射</span></span>
<span class="line"><span class="token function">docker</span> port container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查网络配置</span></span>
<span class="line"><span class="token function">docker</span> network inspect network_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-端口冲突" tabindex="-1"><a class="header-anchor" href="#_2-端口冲突"><span>2. 端口冲突</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查端口使用</span></span>
<span class="line"><span class="token function">netstat</span> <span class="token parameter variable">-tulpn</span> <span class="token operator">|</span> <span class="token function">grep</span> LISTEN</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改端口映射</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">8080</span>:80 nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用随机端口</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-P</span> nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查容器端口</span></span>
<span class="line"><span class="token function">docker</span> port container_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-dns-问题" tabindex="-1"><a class="header-anchor" href="#_3-dns-问题"><span>3. DNS 问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 DNS 配置</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">cat</span> /etc/resolv.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置自定义 DNS</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--dns</span> <span class="token number">8.8</span>.8.8 nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试 DNS 解析</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">nslookup</span> google.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查网络连接</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">ping</span> <span class="token number">8.8</span>.8.8</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="性能问题" tabindex="-1"><a class="header-anchor" href="#性能问题"><span>性能问题</span></a></h2>
<h3 id="_1-cpu-使用率" tabindex="-1"><a class="header-anchor" href="#_1-cpu-使用率"><span>1. CPU 使用率</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 监控 CPU 使用</span></span>
<span class="line"><span class="token function">docker</span> stats container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 限制 CPU 使用</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--cpus</span><span class="token operator">=</span><span class="token number">0.5</span> nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 CPU 配置</span></span>
<span class="line"><span class="token function">docker</span> inspect container_name <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> cpu</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分析 CPU 使用</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">top</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-内存使用" tabindex="-1"><a class="header-anchor" href="#_2-内存使用"><span>2. 内存使用</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 监控内存使用</span></span>
<span class="line"><span class="token function">docker</span> stats container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 限制内存使用</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--memory</span><span class="token operator">=</span>512m nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查内存配置</span></span>
<span class="line"><span class="token function">docker</span> inspect container_name <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> memory</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分析内存使用</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">free</span> <span class="token parameter variable">-m</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-磁盘-i-o" tabindex="-1"><a class="header-anchor" href="#_3-磁盘-i-o"><span>3. 磁盘 I/O</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 监控磁盘 I/O</span></span>
<span class="line"><span class="token function">docker</span> stats container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查磁盘使用</span></span>
<span class="line"><span class="token function">docker</span> system <span class="token function">df</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分析 I/O 性能</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name iostat</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查文件系统</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> container_name <span class="token function">df</span> <span class="token parameter variable">-h</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见错误" tabindex="-1"><a class="header-anchor" href="#常见错误"><span>常见错误</span></a></h2>
<h3 id="_1-权限错误" tabindex="-1"><a class="header-anchor" href="#_1-权限错误"><span>1. 权限错误</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 错误：Permission denied</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--user</span> <span class="token number">1000</span>:1000 image_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误：Cannot connect to the Docker daemon</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">usermod</span> <span class="token parameter variable">-aG</span> <span class="token function">docker</span> <span class="token environment constant">$USER</span></span>
<span class="line"><span class="token function">sudo</span> systemctl restart <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误：Access denied</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> login</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-网络错误" tabindex="-1"><a class="header-anchor" href="#_2-网络错误"><span>2. 网络错误</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 错误：Connection refused</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> network inspect bridge</span>
<span class="line"><span class="token function">docker</span> network connect bridge container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误：No route to host</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> network prune</span>
<span class="line"><span class="token function">docker</span> network create new_network</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误：DNS resolution failed</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--dns</span> <span class="token number">8.8</span>.8.8 image_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-存储错误" tabindex="-1"><a class="header-anchor" href="#_3-存储错误"><span>3. 存储错误</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 错误：No space left on device</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> system prune <span class="token parameter variable">-a</span></span>
<span class="line"><span class="token function">docker</span> volume prune</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误：Invalid volume specification</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> volume create volume_name</span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-v</span> volume_name:/data image_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误：Mount denied</span></span>
<span class="line"><span class="token comment"># 解决方案：</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--privileged</span> image_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="调试工具" tabindex="-1"><a class="header-anchor" href="#调试工具"><span>调试工具</span></a></h2>
<h3 id="_1-日志分析" tabindex="-1"><a class="header-anchor" href="#_1-日志分析"><span>1. 日志分析</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看容器日志</span></span>
<span class="line"><span class="token function">docker</span> logs container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 实时查看日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token parameter variable">-f</span> container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看最后 N 行日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token parameter variable">--tail</span> <span class="token number">100</span> container_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看特定时间段的日志</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token parameter variable">--since</span> <span class="token number">2023</span>-01-01T00:00:00 container_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-性能分析" tabindex="-1"><a class="header-anchor" href="#_2-性能分析"><span>2. 性能分析</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 cAdvisor</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span><span class="token operator">=</span>cadvisor <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">8080</span>:8080 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /:/rootfs:ro <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /var/run:/var/run:ro <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /sys:/sys:ro <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /var/lib/docker/:/var/lib/docker:ro <span class="token punctuation">\</span></span>
<span class="line">  gcr.io/cadvisor/cadvisor</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 Prometheus</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span><span class="token operator">=</span>prometheus <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">9090</span>:9090 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /path/to/prometheus.yml:/etc/prometheus/prometheus.yml <span class="token punctuation">\</span></span>
<span class="line">  prom/prometheus</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-网络分析" tabindex="-1"><a class="header-anchor" href="#_3-网络分析"><span>3. 网络分析</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用 tcpdump</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--net</span><span class="token operator">=</span>host <span class="token parameter variable">-v</span> /var/run/docker.sock:/var/run/docker.sock nicolaka/netshoot tcpdump <span class="token parameter variable">-i</span> any</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 netstat</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--net</span><span class="token operator">=</span>host nicolaka/netshoot <span class="token function">netstat</span> <span class="token parameter variable">-tulpn</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 iperf</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--rm</span> networkstatic/iperf3 <span class="token parameter variable">-c</span> iperf3-server</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>掌握 <RouteLink to="/docker/performance.html">性能优化</RouteLink></li>
<li>学习 <RouteLink to="/docker/security.html">安全实践</RouteLink></li>
<li>了解 <RouteLink to="/docker/cicd.html">CI/CD 集成</RouteLink></li>
</ul>
</div></template>


