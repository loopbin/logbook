<template><div><h1 id="docker-ci-cd-集成" tabindex="-1"><a class="header-anchor" href="#docker-ci-cd-集成"><span>Docker CI/CD 集成</span></a></h1>
<h2 id="github-actions-集成" tabindex="-1"><a class="header-anchor" href="#github-actions-集成"><span>GitHub Actions 集成</span></a></h2>
<h3 id="_1-基础配置" tabindex="-1"><a class="header-anchor" href="#_1-基础配置"><span>1. 基础配置</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .github/workflows/docker-build.yml</span></span>
<span class="line"><span class="token key atrule">name</span><span class="token punctuation">:</span> Docker Build</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">on</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">push</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>main<span class="token punctuation">]</span></span>
<span class="line">  <span class="token key atrule">pull_request</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>main<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">jobs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest</span>
<span class="line">    <span class="token key atrule">steps</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3</span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Set up Docker Buildx</span>
<span class="line">        <span class="token key atrule">uses</span><span class="token punctuation">:</span> docker/setup<span class="token punctuation">-</span>buildx<span class="token punctuation">-</span>action@v2</span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Login to DockerHub</span>
<span class="line">        <span class="token key atrule">uses</span><span class="token punctuation">:</span> docker/login<span class="token punctuation">-</span>action@v2</span>
<span class="line">        <span class="token key atrule">with</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">username</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.DOCKERHUB_USERNAME <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          <span class="token key atrule">password</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.DOCKERHUB_TOKEN <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build and push</span>
<span class="line">        <span class="token key atrule">uses</span><span class="token punctuation">:</span> docker/build<span class="token punctuation">-</span>push<span class="token punctuation">-</span>action@v4</span>
<span class="line">        <span class="token key atrule">with</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">context</span><span class="token punctuation">:</span> .</span>
<span class="line">          <span class="token key atrule">push</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">          <span class="token key atrule">tags</span><span class="token punctuation">:</span> myapp<span class="token punctuation">:</span>latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-多阶段构建" tabindex="-1"><a class="header-anchor" href="#_2-多阶段构建"><span>2. 多阶段构建</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .github/workflows/docker-multi-stage.yml</span></span>
<span class="line"><span class="token key atrule">name</span><span class="token punctuation">:</span> Docker Multi<span class="token punctuation">-</span>stage Build</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">on</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">push</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>main<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">jobs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest</span>
<span class="line">    <span class="token key atrule">steps</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3</span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build and push</span>
<span class="line">        <span class="token key atrule">uses</span><span class="token punctuation">:</span> docker/build<span class="token punctuation">-</span>push<span class="token punctuation">-</span>action@v4</span>
<span class="line">        <span class="token key atrule">with</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">context</span><span class="token punctuation">:</span> .</span>
<span class="line">          <span class="token key atrule">push</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">          <span class="token key atrule">tags</span><span class="token punctuation">:</span> myapp<span class="token punctuation">:</span>latest</span>
<span class="line">          <span class="token key atrule">cache-from</span><span class="token punctuation">:</span> type=registry<span class="token punctuation">,</span>ref=myapp<span class="token punctuation">:</span>buildcache</span>
<span class="line">          <span class="token key atrule">cache-to</span><span class="token punctuation">:</span> type=registry<span class="token punctuation">,</span>ref=myapp<span class="token punctuation">:</span>buildcache<span class="token punctuation">,</span>mode=max</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-测试集成" tabindex="-1"><a class="header-anchor" href="#_3-测试集成"><span>3. 测试集成</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .github/workflows/docker-test.yml</span></span>
<span class="line"><span class="token key atrule">name</span><span class="token punctuation">:</span> Docker Test</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">on</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">push</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>main<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">jobs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">test</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest</span>
<span class="line">    <span class="token key atrule">steps</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3</span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build test image</span>
<span class="line">        <span class="token key atrule">run</span><span class="token punctuation">:</span> docker build <span class="token punctuation">-</span>t myapp<span class="token punctuation">:</span>test .</span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Run tests</span>
<span class="line">        <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">          docker run --rm myapp:test npm test</span></span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Run integration tests</span>
<span class="line">        <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">          docker-compose -f docker-compose.test.yml up -d</span>
<span class="line">          docker-compose -f docker-compose.test.yml run --rm test npm run test:integration</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="gitlab-ci-集成" tabindex="-1"><a class="header-anchor" href="#gitlab-ci-集成"><span>GitLab CI 集成</span></a></h2>
<h3 id="_1-基础配置-1" tabindex="-1"><a class="header-anchor" href="#_1-基础配置-1"><span>1. 基础配置</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .gitlab-ci.yml</span></span>
<span class="line"><span class="token key atrule">image</span><span class="token punctuation">:</span> docker<span class="token punctuation">:</span>20.10.16</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> docker<span class="token punctuation">:</span>20.10.16<span class="token punctuation">-</span>dind</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">variables</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">DOCKER_TLS_CERTDIR</span><span class="token punctuation">:</span> <span class="token string">"/certs"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">stages</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> build</span>
<span class="line">  <span class="token punctuation">-</span> test</span>
<span class="line">  <span class="token punctuation">-</span> deploy</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> build</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> docker build <span class="token punctuation">-</span>t myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA .</span>
<span class="line">    <span class="token punctuation">-</span> docker push myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-多环境部署" tabindex="-1"><a class="header-anchor" href="#_2-多环境部署"><span>2. 多环境部署</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .gitlab-ci.yml</span></span>
<span class="line"><span class="token key atrule">stages</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> build</span>
<span class="line">  <span class="token punctuation">-</span> test</span>
<span class="line">  <span class="token punctuation">-</span> deploy</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> build</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> docker build <span class="token punctuation">-</span>t myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA .</span>
<span class="line">    <span class="token punctuation">-</span> docker push myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">deploy_staging</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> deploy</span>
<span class="line">  <span class="token key atrule">environment</span><span class="token punctuation">:</span> staging</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> docker pull myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA</span>
<span class="line">    <span class="token punctuation">-</span> docker tag myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA myapp<span class="token punctuation">:</span>staging</span>
<span class="line">    <span class="token punctuation">-</span> docker push myapp<span class="token punctuation">:</span>staging</span>
<span class="line">    <span class="token punctuation">-</span> docker<span class="token punctuation">-</span>compose <span class="token punctuation">-</span>f docker<span class="token punctuation">-</span>compose.staging.yml up <span class="token punctuation">-</span>d</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">deploy_production</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> deploy</span>
<span class="line">  <span class="token key atrule">environment</span><span class="token punctuation">:</span> production</span>
<span class="line">  <span class="token key atrule">when</span><span class="token punctuation">:</span> manual</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> docker pull myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA</span>
<span class="line">    <span class="token punctuation">-</span> docker tag myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA myapp<span class="token punctuation">:</span>production</span>
<span class="line">    <span class="token punctuation">-</span> docker push myapp<span class="token punctuation">:</span>production</span>
<span class="line">    <span class="token punctuation">-</span> docker<span class="token punctuation">-</span>compose <span class="token punctuation">-</span>f docker<span class="token punctuation">-</span>compose.production.yml up <span class="token punctuation">-</span>d</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-缓存优化" tabindex="-1"><a class="header-anchor" href="#_3-缓存优化"><span>3. 缓存优化</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .gitlab-ci.yml</span></span>
<span class="line"><span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> build</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> docker build</span>
<span class="line">      <span class="token punctuation">-</span><span class="token punctuation">-</span>cache<span class="token punctuation">-</span>from myapp<span class="token punctuation">:</span>latest</span>
<span class="line">      <span class="token punctuation">-</span><span class="token punctuation">-</span>cache<span class="token punctuation">-</span>from myapp<span class="token punctuation">:</span>buildcache</span>
<span class="line">      <span class="token punctuation">-</span><span class="token punctuation">-</span>tag myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA</span>
<span class="line">      <span class="token punctuation">-</span><span class="token punctuation">-</span>tag myapp<span class="token punctuation">:</span>latest</span>
<span class="line">      .</span>
<span class="line">    <span class="token punctuation">-</span> docker push myapp<span class="token punctuation">:</span>$CI_COMMIT_SHA</span>
<span class="line">    <span class="token punctuation">-</span> docker push myapp<span class="token punctuation">:</span>latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="jenkins-集成" tabindex="-1"><a class="header-anchor" href="#jenkins-集成"><span>Jenkins 集成</span></a></h2>
<h3 id="_1-pipeline-配置" tabindex="-1"><a class="header-anchor" href="#_1-pipeline-配置"><span>1. Pipeline 配置</span></a></h3>
<div class="language-groovy line-numbers-mode" data-highlighter="prismjs" data-ext="groovy"><pre v-pre><code class="language-groovy"><span class="line"><span class="token comment">// Jenkinsfile</span></span>
<span class="line">pipeline <span class="token punctuation">{</span></span>
<span class="line">    agent any</span>
<span class="line"></span>
<span class="line">    environment <span class="token punctuation">{</span></span>
<span class="line">        DOCKER_IMAGE <span class="token operator">=</span> <span class="token string">'myapp'</span></span>
<span class="line">        DOCKER_TAG <span class="token operator">=</span> <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">env<span class="token punctuation">.</span>BUILD_NUMBER</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    stages <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'docker run ${DOCKER_IMAGE}:${DOCKER_TAG} npm test'</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Push'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                <span class="token function">withCredentials</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token function">usernamePassword</span><span class="token punctuation">(</span>credentialsId<span class="token punctuation">:</span> <span class="token string">'dockerhub'</span><span class="token punctuation">,</span> passwordVariable<span class="token punctuation">:</span> <span class="token string">'DOCKER_PASSWORD'</span><span class="token punctuation">,</span> usernameVariable<span class="token punctuation">:</span> <span class="token string">'DOCKER_USERNAME'</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    sh <span class="token string">'docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}'</span></span>
<span class="line">                    sh <span class="token string">'docker push ${DOCKER_IMAGE}:${DOCKER_TAG}'</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-多阶段构建-1" tabindex="-1"><a class="header-anchor" href="#_2-多阶段构建-1"><span>2. 多阶段构建</span></a></h3>
<div class="language-groovy line-numbers-mode" data-highlighter="prismjs" data-ext="groovy"><pre v-pre><code class="language-groovy"><span class="line"><span class="token comment">// Jenkinsfile</span></span>
<span class="line">pipeline <span class="token punctuation">{</span></span>
<span class="line">    agent any</span>
<span class="line"></span>
<span class="line">    stages <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'''</span>
<span class="line">                    docker build \</span>
<span class="line">                        --target builder \</span>
<span class="line">                        --cache-from myapp:builder \</span>
<span class="line">                        --tag myapp:builder \</span>
<span class="line">                        .</span>
<span class="line">                '''</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'docker run myapp:builder npm test'</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Production'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'''</span>
<span class="line">                    docker build \</span>
<span class="line">                        --target production \</span>
<span class="line">                        --cache-from myapp:builder \</span>
<span class="line">                        --tag myapp:${BUILD_NUMBER} \</span>
<span class="line">                        .</span>
<span class="line">                '''</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-部署配置" tabindex="-1"><a class="header-anchor" href="#_3-部署配置"><span>3. 部署配置</span></a></h3>
<div class="language-groovy line-numbers-mode" data-highlighter="prismjs" data-ext="groovy"><pre v-pre><code class="language-groovy"><span class="line"><span class="token comment">// Jenkinsfile</span></span>
<span class="line">pipeline <span class="token punctuation">{</span></span>
<span class="line">    agent any</span>
<span class="line"></span>
<span class="line">    stages <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy to Staging'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'''</span>
<span class="line">                    docker-compose -f docker-compose.staging.yml up -d</span>
<span class="line">                    sleep 30</span>
<span class="line">                    curl -f http://staging.myapp.com/health || exit 1</span>
<span class="line">                '''</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy to Production'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            when <span class="token punctuation">{</span></span>
<span class="line">                branch <span class="token string">'main'</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            steps <span class="token punctuation">{</span></span>
<span class="line">                sh <span class="token string">'''</span>
<span class="line">                    docker-compose -f docker-compose.production.yml up -d</span>
<span class="line">                    sleep 30</span>
<span class="line">                    curl -f http://myapp.com/health || exit 1</span>
<span class="line">                '''</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2>
<h3 id="_1-镜像标签策略" tabindex="-1"><a class="header-anchor" href="#_1-镜像标签策略"><span>1. 镜像标签策略</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用语义化版本</span></span>
<span class="line"><span class="token function">docker</span> tag myapp:latest myapp:1.2.3</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 Git 提交哈希</span></span>
<span class="line"><span class="token function">docker</span> tag myapp:latest myapp:<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> rev-parse <span class="token parameter variable">--short</span> HEAD<span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用环境标识</span></span>
<span class="line"><span class="token function">docker</span> tag myapp:latest myapp:staging</span>
<span class="line"><span class="token function">docker</span> tag myapp:latest myapp:production</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-缓存优化" tabindex="-1"><a class="header-anchor" href="#_2-缓存优化"><span>2. 缓存优化</span></a></h3>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre v-pre><code class="language-docker"><span class="line"><span class="token comment"># Dockerfile</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14-alpine <span class="token keyword">AS</span> builder</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 缓存依赖安装</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm ci</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 复制源代码</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm run build</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 生产镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> nginx:alpine</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">builder</span></span> /app/dist /usr/share/nginx/html</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-安全扫描" tabindex="-1"><a class="header-anchor" href="#_3-安全扫描"><span>3. 安全扫描</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># .github/workflows/security-scan.yml</span></span>
<span class="line"><span class="token key atrule">name</span><span class="token punctuation">:</span> Security Scan</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">on</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">push</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>main<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">jobs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">scan</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest</span>
<span class="line">    <span class="token key atrule">steps</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3</span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Run Trivy vulnerability scanner</span>
<span class="line">        <span class="token key atrule">uses</span><span class="token punctuation">:</span> aquasecurity/trivy<span class="token punctuation">-</span>action@master</span>
<span class="line">        <span class="token key atrule">with</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">image-ref</span><span class="token punctuation">:</span> myapp<span class="token punctuation">:</span>latest</span>
<span class="line">          <span class="token key atrule">format</span><span class="token punctuation">:</span> <span class="token string">"table"</span></span>
<span class="line">          <span class="token key atrule">exit-code</span><span class="token punctuation">:</span> <span class="token string">"1"</span></span>
<span class="line">          <span class="token key atrule">ignore-unfixed</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">          <span class="token key atrule">vuln-type</span><span class="token punctuation">:</span> <span class="token string">"os,library"</span></span>
<span class="line">          <span class="token key atrule">severity</span><span class="token punctuation">:</span> <span class="token string">"CRITICAL,HIGH"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2>
<h3 id="_1-构建性能" tabindex="-1"><a class="header-anchor" href="#_1-构建性能"><span>1. 构建性能</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用构建缓存</span></span>
<span class="line"><span class="token function">docker</span> build --cache-from myapp:latest <span class="token parameter variable">-t</span> myapp:new <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 并行构建</span></span>
<span class="line"><span class="token function">docker</span> buildx build <span class="token parameter variable">--parallel</span> <span class="token number">4</span> <span class="token parameter variable">-t</span> myapp:latest <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 BuildKit</span></span>
<span class="line"><span class="token assign-left variable">DOCKER_BUILDKIT</span><span class="token operator">=</span><span class="token number">1</span> <span class="token function">docker</span> build <span class="token parameter variable">-t</span> myapp:latest <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-部署问题" tabindex="-1"><a class="header-anchor" href="#_2-部署问题"><span>2. 部署问题</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 健康检查</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> web <span class="token punctuation">\</span></span>
<span class="line">  --health-cmd<span class="token operator">=</span><span class="token string">"curl -f http://localhost/health || exit 1"</span> <span class="token punctuation">\</span></span>
<span class="line">  --health-interval<span class="token operator">=</span>30s <span class="token punctuation">\</span></span>
<span class="line">  --health-timeout<span class="token operator">=</span>3s <span class="token punctuation">\</span></span>
<span class="line">  --health-retries<span class="token operator">=</span><span class="token number">3</span> <span class="token punctuation">\</span></span>
<span class="line">  nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 优雅关闭</span></span>
<span class="line"><span class="token function">docker</span> stop <span class="token parameter variable">--time</span><span class="token operator">=</span><span class="token number">30</span> web</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 零停机部署</span></span>
<span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span> --no-deps <span class="token parameter variable">--scale</span> <span class="token assign-left variable">web</span><span class="token operator">=</span><span class="token number">2</span> web</span>
<span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span> --no-deps <span class="token parameter variable">--scale</span> <span class="token assign-left variable">web</span><span class="token operator">=</span><span class="token number">1</span> web</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-监控集成" tabindex="-1"><a class="header-anchor" href="#_3-监控集成"><span>3. 监控集成</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token comment"># docker-compose.yml</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"3.8"</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> myapp<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">deploy</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line">      <span class="token key atrule">update_config</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">parallelism</span><span class="token punctuation">:</span> <span class="token number">1</span></span>
<span class="line">        <span class="token key atrule">delay</span><span class="token punctuation">:</span> 10s</span>
<span class="line">        <span class="token key atrule">order</span><span class="token punctuation">:</span> start<span class="token punctuation">-</span>first</span>
<span class="line">      <span class="token key atrule">restart_policy</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">condition</span><span class="token punctuation">:</span> on<span class="token punctuation">-</span>failure</span>
<span class="line">    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">test</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"CMD"</span><span class="token punctuation">,</span> <span class="token string">"curl"</span><span class="token punctuation">,</span> <span class="token string">"-f"</span><span class="token punctuation">,</span> <span class="token string">"http://localhost/health"</span><span class="token punctuation">]</span></span>
<span class="line">      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 30s</span>
<span class="line">      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 3s</span>
<span class="line">      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">3</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<ul>
<li>了解 <RouteLink to="/docker/troubleshooting.html">故障排查</RouteLink></li>
<li>掌握 <RouteLink to="/docker/performance.html">性能优化</RouteLink></li>
<li>学习 <RouteLink to="/docker/security.html">安全实践</RouteLink></li>
</ul>
</div></template>


