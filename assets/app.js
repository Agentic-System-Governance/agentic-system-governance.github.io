(() => {
  'use strict';
  const {lang, pick: t} = window.WikiLocale;
  const articles = window.WIKI_DATA?.locales?.[lang]?.articles || [];
  const byId = Object.assign(Object.create(null), Object.fromEntries(articles.map(a => [a.id, a])));
  const duties = articles.filter(a => a.group === 'duties');
  const $ = s => document.querySelector(s);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons = {
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    home:'<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',
    book:'<path d="M3 4h6l3 3 3-3h6v15h-6l-3 2-3-2H3zM12 7v14"/>',
    route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    adjust:'<path d="M4 6h16M4 18h16M8 3v6m8 6v6M4 12h16m-7-3v6"/>',
    people:'<circle cx="8" cy="8" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 5 5"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
    file:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
    flask:'<path d="M9 3h6m-5 0v7l-6 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3M7 15h10"/>',
    pen:'<path d="m4 16 12-12 4 4L8 20l-5 1zM14 6l4 4"/>',
    chart:'<path d="M4 3v18h17M8 16v-4m5 4V7m5 9v-6"/>',
    layers:'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
    github:'<path d="M9 20c-5 1-5-2-7-3m14 5v-4a3.5 3.5 0 0 0-1-2.7c3-.3 6-1.4 6-6.2A4.8 4.8 0 0 0 20 6a4.5 4.5 0 0 0-.1-3s-1 0-3.2 1.6a12 12 0 0 0-6.4 0C8 3 7 3 7 3a4.5 4.5 0 0 0-.1 3A4.8 4.8 0 0 0 5 9c0 4.8 3 5.9 6 6.2A3.5 3.5 0 0 0 10 18v4"/>',
    moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    link:'<path d="m9 15 6-6m-5-3 2-2a5 5 0 0 1 7 7l-2 2m-3 5-2 2a5 5 0 0 1-7-7l2-2"/>',
    spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.book}</svg>`;
  const decorateIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach(el => {el.innerHTML = icon(el.dataset.icon);});
  const STORE = 'governance-wiki-v1';
  let storageWorking = true;
  const emptyState = () => ({completed:[],notes:{},answers:{},worksheet:{},theme:'light'});
  let state = emptyState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && typeof saved === 'object') {
      // Preserve notes when articles are renamed or merged. Reading the former
      // verification article alone does not mark the combined article complete.
      if (Array.isArray(saved.completed)) saved.completed = [...new Set(saved.completed.map(id => id === 'response' ? 'troubleshooting' : id))];
      for (const [former, current] of [['response', 'troubleshooting'], ['verification', 'oversight']]) {
        for (const field of ['notes', 'answers']) {
          const values = saved[field];
          if (values && typeof values === 'object' && !Array.isArray(values) && Object.prototype.hasOwnProperty.call(values, former)) {
            if (!Object.prototype.hasOwnProperty.call(values, current)) values[current] = values[former];
            else if (field === 'notes' && values[former] && values[former] !== values[current]) values[current] += '\n\n' + values[former];
            delete values[former];
          }
        }
      }
      state.completed = Array.isArray(saved.completed) ? saved.completed.filter(id => byId[id]) : [];
      for (const field of ['notes','answers','worksheet']) if (saved[field] && typeof saved[field] === 'object' && !Array.isArray(saved[field])) state[field] = saved[field];
      state.theme = saved.theme === 'dark' ? 'dark' : 'light';
    }
  } catch { storageWorking = false; }
  function localizeShell() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $('meta[name="description"]').content = t('从任务约定、执行监督到故障处置、协作与可审计性，理解智能体系统治理。基于 Agentic System Governance 综述的开放学习 Wiki。', 'Explore five responsibilities for governing agentic systems: mandate alignment, execution oversight, fault resolution, multi-agent coordination, and auditability assurance.');
    $('.skip-link').textContent = t('跳到正文', 'Skip to content');
    $('#sidebar').setAttribute('aria-label', t('知识库导航', 'Wiki navigation'));
    $('.brand').setAttribute('aria-label', t('Governance Wiki 首页', 'Governance Wiki home'));
    $('#search-trigger-label').textContent = t('搜索知识库', 'Search the Wiki');
    $('#progress-caption-label').textContent = t('你的阅读旅程', 'Your reading journey');
    $('#progress-sub-label').textContent = t('每一点理解，都是好的开始', 'One idea at a time');
    $('#sidebar-foot-label').textContent = t('持续生长的知识库', 'A growing field guide');
    $('#breadcrumb-root').textContent = t('知识库', 'Knowledge base');
    $('.top-nav').setAttribute('aria-label', t('主导航', 'Main navigation'));
    $('[data-top="home"]').textContent = t('探索', 'Explore');
    $('[data-top="path"]').textContent = t('学习路径', 'Learning path');
    $('#top-lab-label').textContent = t('交互实验', 'Lab');
    $('#top-library-label').textContent = t('论文库', 'Paper library');
    $('.language-switch').setAttribute('aria-label', t('选择语言', 'Language'));
    $('[data-language="en"]').setAttribute('aria-label', t('切换为英文', 'Read in English'));
    $('[data-language="zh"]').setAttribute('aria-label', t('用中文阅读', 'Read in Chinese'));
    $('.github-link').setAttribute('aria-label', t('GitHub 仓库', 'GitHub repository'));
    $('#footer-message').textContent = t('从理解走向实践，让自主行动有据可循。', 'Understand the decisions behind accountable autonomous action.');
    $('#footer-sources-label').textContent = t('内容依据与编辑说明', 'Sources and editorial notes');
    $('#search-title').textContent = t('搜索知识库', 'Search the Wiki');
    $('#search-input').placeholder = t('搜索概念、问题或关键词…', 'Search concepts, questions, or keywords…');
    $('#search-close').setAttribute('aria-label', t('关闭搜索', 'Close search'));
    $('#search-scope-label').textContent = t(`搜索全部 ${articles.length} 篇正文`, `Search all ${articles.length} articles`);
    $('#search-dismiss-label').textContent = t('按 Esc 关闭', 'Press Esc to close');
  }
  function updateLanguageLinks() {
    document.querySelectorAll('[data-language]').forEach(link => {
      const target = new URL(location.href);
      target.searchParams.set('lang', link.dataset.language);
      link.href = target.href;
      if (link.dataset.language === lang) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  let toastTimer;
  const toast = message => {$('#toast').textContent = message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer = setTimeout(() => $('#toast').classList.remove('visible'),2600);};
  function save() {
    try { localStorage.setItem(STORE,JSON.stringify(state)); storageWorking = true; return true; }
    catch { if(storageWorking) toast(t('浏览器未能保存；请导出笔记与工作表。', 'Your browser could not save these changes. Please export your notes and worksheet.')); storageWorking = false; return false; }
  }
  const complete = id => state.completed.includes(id);
  const readTime = minutes => t(`约 ${minutes} 分钟`, `About ${minutes} min`);
  function setTheme() {
    document.body.dataset.theme = state.theme;
    $('#theme-toggle').innerHTML=icon(state.theme==='dark'?'sun':'moon');
    $('#theme-toggle').setAttribute('aria-label',state.theme==='dark'?t('切换浅色模式','Switch to light mode'):t('切换深色模式','Switch to dark mode'));
  }
  const dutyIcons=['shield','eye','adjust','people','file'];
  const dutyQuestions=[
    t('如何协商交付条件与执行边界，并把承诺落实、持续维护？','How are delivery conditions and execution boundaries negotiated, put into practice, and maintained?'),
    t('活动能否继续，需要什么干预，实际效果是否得到核验？','May activity proceed, what intervention is needed, and have its effects been verified?'),
    t('执行为何失败，如何修正运行并修复已经受影响的状态？','Why did execution fail, how should it change, and which affected state needs repair?'),
    t('谁负责执行和跟进，何时可推进，各方产物能否共同使用？','Who owns the work and follow-up, when may it proceed, and do the contributions fit together?'),
    t('发生了什么，依据谁的授权，过程是否符合适用要求？','What happened, under whose authority, and did the conduct meet applicable requirements?')
  ];
  function navLink(id,title,ic,number,route) {
    const href=route||`#/article/${id}`;
    return `<a class="nav-item" href="${href}" data-nav="${id}">${number?`<span class="nav-number">${number}</span>`:icon(ic)}<span>${title}</span>${complete(id)?`<span class="nav-check" aria-label="${t('已读','Read')}">✓</span>`:''}</a>`;
  }
  function sidebar() {
    $('#sidebar-nav').innerHTML = navLink('home',t('探索知识库','Explore the Wiki'),'home',null,'#/')+navLink('path',t('学习路径','Learning path'),'route',null,'#/path')+
      `<div class="nav-group"><div class="nav-label">${t('从这里开始','Start here')}</div>${navLink('foundations',t('治理对象与职责边界','Foundations and boundaries'),'book')}</div>`+
      `<div class="nav-group"><div class="nav-label">${t('五项治理职责','Five responsibilities')} <span>01 — 05</span></div>${duties.map((a,i)=>navLink(a.id,a.title,null,String(i+1).padStart(2,'0'))).join('')}</div>`+
      `<div class="nav-group"><div class="nav-label">${t('理解与实践','Explore and apply')}</div>${navLink('challenges',t('共同难点','Shared challenges'),'layers')}${navLink('evaluation',t('评估治理效果','Evaluating governance'),'chart')}${navLink('lab',t('交互实验室','Interactive lab'),'flask',null,'#/lab')}${navLink('worksheet',t('治理分析工作表','Governance worksheet'),'pen')}</div>`+
      `<div class="nav-group"><div class="nav-label">${t('随手查阅','Reference')}</div>${navLink('glossary',t('术语表','Glossary'),'book')}${navLink('survey-map',t('综述与来源','Survey and sources'),'file')}${navLink('library',t('第四章论文库','Chapter 4 paper library'),'layers',null,'resources.html')}${navLink('notes',t('我的笔记','My notes'),'pen',null,'#/notes')}</div>`;
    updateProgress();
  }
  function updateProgress() {
    $('#progress-count').textContent=`${state.completed.length} / ${articles.length}`;
    $('#progress-fill').style.width=`${articles.length ? state.completed.length/articles.length*100 : 0}%`;
  }
  function diagram() {
    const description=t('五项治理职责围绕智能体系统：任务约定对齐、执行监督、故障处置、多智能体协调、可审计性保障。职责相互联系，不是固定时间顺序。','Five interconnected responsibilities surround an agentic system: Mandate Alignment, Execution Oversight, Fault Resolution, Multi-Agent Coordination, and Auditability Assurance. They are not a fixed sequence.');
    const nodes=[[195,38,'01',t('约定对齐','Mandate')],[321,108,'02',t('执行监督','Oversight')],[274,221,'03',t('故障处置','Faults')],[116,221,'04',t('多智能体协调','Coordination')],[69,108,'05',t('可审计性保障','Auditability')]];
    return `<div class="hero-art"><svg class="governance-diagram" viewBox="0 0 390 280" role="img" aria-label="${description}"><ellipse cx="195" cy="139" rx="133" ry="96" class="diagram-line diagram-dash"/><circle cx="195" cy="139" r="65" class="diagram-line diagram-dash"/><path d="M195 139L195 38M195 139L321 108M195 139L274 221M195 139L116 221M195 139L69 108" class="diagram-line"/><circle cx="195" cy="139" r="49" fill="var(--green-soft)"/><circle cx="195" cy="139" r="43" fill="none" stroke="#bacbaa" stroke-width=".6"/><text x="195" y="132" text-anchor="middle" font-family="var(--serif)" font-size="18" fill="var(--green)">${t('智能体系统','Agentic')}</text><text x="195" y="152" text-anchor="middle" font-size="${t('8','15')}" letter-spacing="${t('1','0')}" fill="var(--muted)">${t('WITH GOVERNANCE','system')}</text>${nodes.map(([x,y,n,label])=>`<g transform="translate(${x-53},${y-20})"><rect width="106" height="40" rx="5" class="diagram-node"/><text x="13" y="25" class="diagram-node-small">${n}</text><text x="53" y="25" class="diagram-node-label">${label}</text></g>`).join('')}</svg><div class="diagram-caption">${t('五项职责 · 同一个系统','FIVE RESPONSIBILITIES · ONE SYSTEM')}</div></div>`;
  }
  function dutyCards() {
    return duties.map((a,i)=>`<a class="duty-card" href="#/article/${a.id}"><div class="card-top"><span class="card-num">0${i+1} / ${t(escapeHTML(a.englishTitle.toUpperCase()),'RESPONSIBILITY')}</span><span class="card-icon">${icon(dutyIcons[i])}</span></div><h3>${a.title}</h3><p>${dutyQuestions[i]}</p><div class="card-footer"><span class="card-tag">${complete(a.id)?t('✓ 已读','✓ Read'):t('概念 · 教学情境','Concepts · Scenario')}</span><span>${a.minutes} ${t('分钟','min')} ${icon('arrow')}</span></div></a>`).join('');
  }
  function home() {
    const steps=[['foundations',t('先理解，为什么需要治理','Understand why governance matters'),t('厘清任务、权力与责任的边界','Clarify tasks, authority, and responsibilities')],['mandate',t('再拆解，治理要做什么','Explore what governance involves'),t('沿着五项职责，走进具体情境','Follow five responsibilities through concrete scenarios')],['worksheet',t('试着分析，你自己的任务','Apply it to your own task'),t('用工作表把理解变成判断','Use the worksheet to examine your decisions')]];
    return `<div class="page home-page"><section class="hero"><div class="hero-copy"><div class="eyebrow">${t('AN OPEN FIELD GUIDE · 智能体系统治理','AN OPEN FIELD GUIDE · AGENTIC GOVERNANCE')}</div><h1>${t('让智能体系统<br><em>有边界、有依据。</em>','Give agentic systems<br><em>boundaries and evidence.</em>')}</h1><p class="hero-intro">${t('当 AI 从回答问题走向自主行动，我们需要理解：<br>它被允许做什么，谁能介入，又凭什么确认完成。<br>从五项治理职责开始，建立你的系统性认识。','As AI moves from answering questions to taking action, what may it do, who can intervene, and what evidence establishes completion? Start with five governance responsibilities.')}</p><div class="hero-actions"><a class="button primary" href="#/article/foundations">${t('开始阅读','Start reading')} ${icon('arrow')}</a><a class="text-link" href="#/path">${t('找到你的学习路径','Find your learning path')} <span>↗</span></a></div><p class="hero-note">${icon('book')} ${t('无需治理背景 · 从真实工作中的问题讲起','No governance background needed · Grounded in everyday work')}</p></div>${diagram()}</section>
    <div class="quick-stats"><span><strong>${String(duties.length).padStart(2,'0')}</strong> ${t('核心治理职责','core responsibilities')}</span><span class="stat-divider"></span><span><strong>${articles.length}</strong> ${t('篇学习文章','learning articles')}</span><span class="stat-divider"></span><span><strong>01</strong> ${t('个交互实验','interactive lab')}</span><span class="stat-end"><span class="status-dot"></span> ${t('基于本地综述持续整理','Developed alongside the survey')}</span></div>
    <section aria-labelledby="start-heading"><div class="section-heading"><h2 id="start-heading">${t('从一个问题开始','Start with a question')}</h2><a class="text-link" href="#/path">${t('查看完整路径','View the full path')} ${icon('arrow')}</a></div><div class="learning-strip">${steps.map(([id,title,description],i)=>`<a class="learning-step" href="#/article/${id}"><span class="step-badge">${i+1}</span><div><strong>${title}</strong><p>${description}</p></div><span class="step-arrow">→</span></a>`).join('')}</div></section>
    <section id="responsibilities" aria-labelledby="duties-heading"><div class="section-heading"><div><h2 id="duties-heading">${t('治理，需要承担哪些职责？','What does governance need to do?')}</h2><p>${t('每一篇从一个具体任务出发，解释问题、措施，以及它们的边界。','Each article follows one task to explain the problem, possible responses, and their limits.')}</p></div></div><div class="duty-grid">${dutyCards()}</div></section>
    <section class="bottom-feature"><a class="lab-promo" href="#/lab"><span class="promo-icon">${icon('flask')}</span><div><h3>${t('“已经取消了，为什么还会发送？”','“I revoked permission. Why was it still sent?”')}</h3><p>${t('改变授权时点，看看两种检查机制的行为有何不同。','Change when permission is updated and compare two places to check it.')}</p><span class="text-link">${t('进入交互实验','Try the interactive lab')} ${icon('arrow')}</span></div></a><div class="source-promo"><h3>${t('有来源，也有边界。','Sources, with their limits made clear.')}</h3><p>${t('正文来自现有 Wiki 与综述草稿。案例是教学设定，原始文献核查与真实读者试读仍在推进。','The articles draw on the Wiki and survey draft. Scenarios are illustrative; primary-source verification and reader testing remain ongoing.')}</p><a class="text-link" href="#/article/survey-map">${t('阅读内容依据与说明','Read the sources and editorial notes')} ↗</a><br><a class="text-link" href="resources.html">${t('第四章治理机制资源库','Chapter 4 governance mechanisms library')} ↗</a></div></section></div>`;
  }
  function pathPage() {
    const stages=[
      [t('建立共同语言','Build a shared vocabulary'),t('区分任务执行与治理决定，明确授权、干预和履行要求。','Distinguish task execution from governance decisions, and clarify authority, intervention, and delivery requirements.'),['foundations','glossary'],t('认识治理对象、角色与基本术语','Meet the objects, roles, and basic terms of governance')],
      [t('逐项理解五项职责','Explore the five responsibilities'),t('用采购、文档转换、报告协作和报销情境，理解各项治理职责。','Use procurement, document conversion, collaborative reporting, and reimbursement scenarios to understand the responsibilities.'),duties.map(a=>a.id),t('通过具体案例理解每项职责','Understand each responsibility through a concrete example')],
      [t('检验机制与证据','Examine mechanisms and evidence'),t('观察授权变化怎样影响外部动作，再思考怎样评价违规、完成率与治理成本。','Observe how authorization changes affect external actions, then consider violations, completion rates, and governance costs.'),['challenges','evaluation','lab'],t('交互实验采用固定教学事件，不评估真实模型','The lab uses fixed illustrative events; it does not evaluate a real model')],
      [t('分析自己的工作任务','Analyze a task of your own'),t('写清来源要求、决定权、干预位置与证据。沿综述映射继续深入。','Identify source requirements, decision rights, intervention points, and evidence. Use the survey map to explore further.'),['worksheet','survey-map'],t('工作表可填写、自动保存，并导出 Markdown','Complete the worksheet, save it locally, and export it as Markdown')]
    ];
    return `<div class="page"><div class="eyebrow">${t('LEARNING PATH · 按问题学习','LEARNING PATH · FOLLOW YOUR QUESTIONS')}</div><h1 class="page-title">${t('从理解，到作出自己的判断。','From understanding to informed judgment.')}</h1><p class="page-description">${t('不必一次读完。你可以沿着这条路径建立全貌，也可以直接进入与你的任务最相关的一项职责。','You do not need to read everything at once. Follow the path for an overview, or start with the responsibility most relevant to your task.')}</p>${stages.map(([title,d,ids,n],i)=>`<section class="path-stage"><span class="path-number">0${i+1}</span><div><h2>${title}</h2><p>${d}</p><div class="path-links">${ids.map(id=>`<a href="${id==='lab'?'#/lab':`#/article/${id}`}">${complete(id)?'✓ ':''}${id==='lab'?t('交互实验室','Interactive lab'):byId[id].title} <span>↗</span></a>`).join('')}</div><div class="path-time">${n}</div></div></section>`).join('')}</div>`;
  }
  function articlePage(a) {
    const ix=articles.indexOf(a),prev=articles[ix-1],next=articles[ix+1];
    return `<div class="page article-layout"><article class="article-body"><header class="article-header"><div class="eyebrow">${escapeHTML(a.eyebrow)} · GOVERNANCE WIKI</div><h1 class="page-title">${escapeHTML(a.title)}</h1><p class="page-description">${escapeHTML(a.description)}</p><div class="article-meta"><span>${icon('clock')} ${readTime(a.minutes)}</span><span>${icon('book')} ${a.group==='duties'?t('概念 · 教学情境','Concepts · Illustrative scenario'):t('阅读与查阅','Reading and reference')}</span><span>${t('内容整理于','Updated')} ${a.updatedAt || '2026.10.19'}</span></div><div class="article-tools"><button class="small-button ${complete(a.id)?'is-complete':''}" data-complete="${a.id}" aria-pressed="${complete(a.id)}">${icon('check')} ${complete(a.id)?t('已标记读完','Marked as read'):t('标记读完','Mark as read')}</button><a class="small-button" href="${a.source}" download>${icon('download')} ${t('下载原文','Download article')}</a><button class="small-button" data-copy-link>${icon('link')} ${t('复制链接','Copy link')}</button></div></header>${a.group==='duties'?`<div class="reading-hint">${icon('spark')} <span>${t('带着一个问题读：','Read with a question: ')}${dutyQuestions[duties.indexOf(a)]}<br>${t('本篇的企业任务与系统行为为教学设定。','The business task and system behavior in this article are illustrative.')}</span></div>`:''}<div class="prose">${a.html}</div>${a.id==='worksheet'?worksheetHTML():''}<nav class="article-next" aria-label="${t('文章翻页','Article navigation')}">${prev?`<a href="#/article/${prev.id}"><small>← ${t('上一篇','Previous')}</small>${prev.title}</a>`:`<a href="#/path"><small>← ${t('返回','Back')}</small>${t('学习路径','Learning path')}</a>`}${next?`<a href="#/article/${next.id}"><small>${t('下一篇','Next')} →</small>${next.title}</a>`:`<a href="#/"><small>${t('返回','Back')} →</small>${t('探索知识库','Explore the Wiki')}</a>`}</nav></article><aside class="article-rail" aria-label="${t('文章目录与笔记','Article contents and notes')}"><div class="rail-title">${t('本篇内容','On this page')}</div><nav class="toc-list">${a.sections.map(s=>`<a class="toc-link" href="#/article/${a.id}?section=${s.id}" data-section="${s.id}">${escapeHTML(s.title)}</a>`).join('')}${a.id==='worksheet'?`<a class="toc-link" href="#/article/worksheet?section=worksheet-editor" data-section="worksheet-editor">${t('填写我的工作表','Complete my worksheet')}</a>`:''}</nav><div class="rail-notes"><label for="article-note">${icon('pen')} ${t('随手记','Reading notes')}</label><textarea id="article-note" data-note="${a.id}" placeholder="${t('记下一个问题、一点理解，或你的工作情境…','Write a question, an observation, or a connection to your work…')}">${escapeHTML(state.notes[a.id] || '')}</textarea><small class="save-hint" id="note-status">${storageWorking?t('自动保存在本机浏览器','Saved automatically in this browser'):t('本次会话可用，请及时导出','Available for this session; please export')}</small><a class="text-link" href="#/notes">${t('查看全部笔记','View all notes')} ↗</a></div></aside></div>`;
  }
  const fields=[
    ['task',t('任务与来源要求','Task and source requirements'),t('例如：生成客户报价；内部底价仅限核算。','For example: prepare a client quote; internal cost figures are for calculation only.')],
    ['scope',t('治理对象与权限范围','Governed objects and permission scope'),t('哪些资料、动作、收件人和用途被允许？','Which data, actions, recipients, and uses are permitted?')],
    ['authority',t('决定权与升级路径','Decision rights and escalation'),t('谁能批准、改变范围、暂停或接管？','Who may approve, change the scope, pause, or take over?')],
    ['control',t('观测与干预位置','Observation and intervention points'),t('在哪里发现问题？能拦住哪个实际动作？','Where can a problem be observed? Which actual action can be stopped?')],
    ['evidence',t('证据与未知状态','Evidence and unresolved state'),t('如何确认实际效果？什么仍然无法确定？','How are actual effects confirmed? What remains unknown?')],
    ['recovery',t('补救与重新核验','Remediation and revalidation'),t('失败后如何处理？怎样确认恢复与完成？','How should failure be addressed? What establishes recovery and completion?')]
  ];
  function worksheetHTML() {
    return `<section class="worksheet-form" id="worksheet-editor"><h2>${t('把框架用在你的任务里','Apply the framework to your task')}</h2><p>${t('用自己的例子填写。内容保存在本机浏览器，可导出后继续讨论或修改。','Use an example from your own work. Your answers are saved in this browser and can be exported for discussion or revision.')}</p><div class="worksheet-fields">${fields.map(([id,title,p])=>`<div class="worksheet-field"><label for="field-${id}">${title}</label><textarea id="field-${id}" data-field="${id}" placeholder="${p}">${escapeHTML(state.worksheet[id] || '')}</textarea></div>`).join('')}</div><div class="worksheet-actions"><button class="button primary" data-export-worksheet>${icon('download')} ${t('导出工作表','Export worksheet')}</button><span class="local-notice" id="worksheet-status">${storageWorking?t('自动保存在本机','Saved automatically on this device'):t('请导出保留本次填写内容','Please export to keep your answers')}</span></div></section>`;
  }
  function notesPage() {
    const saved=articles.filter(a=>String(state.notes[a.id]||'').trim());
    return `<div class="page"><div class="eyebrow">${t('YOUR NOTEBOOK · 把理解留下来','YOUR NOTEBOOK · KEEP YOUR IDEAS')}</div><h1 class="page-title">${t('我的阅读笔记','My reading notes')}</h1><p class="page-description">${t('记录还没想清楚的问题，也记录与自己任务的联系。笔记只保存在这个浏览器中；导出后可以带走。','Keep open questions and connections to your own work. Notes are stored only in this browser; export them to take a copy with you.')}</p>${saved.length?`<div class="section-heading"><p>${t(`${saved.length} 篇文章有笔记`,`${saved.length} article${saved.length===1?'':'s'} with notes`)}</p><button class="small-button" data-export-notes>${icon('download')} ${t('导出全部笔记','Export all notes')}</button></div><div class="notes-list">${saved.map(a=>`<section class="note-card"><h2><a href="#/article/${a.id}">${a.title}</a></h2><label class="sr-only" for="note-${a.id}">${t(`${a.title}的笔记`,`Notes on ${a.title}`)}</label><textarea id="note-${a.id}" data-note="${a.id}">${escapeHTML(state.notes[a.id])}</textarea><div class="note-bottom"><small class="local-notice" data-note-status="${a.id}">${storageWorking?t('自动保存 · 清空文字可移除这条笔记','Saved automatically · Clear the text to remove this note'):t('未能保存，请导出保留本次修改','Could not save; export to keep your changes')}</small><a class="text-link" href="#/article/${a.id}">${t('回到正文','Back to article')} ↗</a></div></section>`).join('')}</div>`:`<div class="empty-state">${icon('pen')}<h2>${t('留一页，给你的思考。','Make room for your thoughts.')}</h2><p>${t('打开任意文章，在「随手记」中写下第一条笔记。','Open any article and add your first reading note.')}</p><a class="button primary" href="#/article/foundations">${t('从治理基础开始','Start with the foundations')} ${icon('arrow')}</a></div>`}</div>`;
  }
  function progressPage() {
    const percent=articles.length?Math.round(state.completed.length/articles.length*100):0;
    return `<div class="page"><div class="eyebrow">${t('YOUR JOURNEY · 按自己的节奏','YOUR JOURNEY · AT YOUR OWN PACE')}</div><h1 class="page-title">${t('每一点理解，都算数。','Every step in understanding counts.')}</h1><p class="page-description">${t('读完一篇后，给自己做个标记。这里记录阅读，不把阅读数量当作掌握程度。','Mark articles as you finish them. This tracks reading, not mastery.')}</p><div class="progress-summary"><div class="progress-big">${state.completed.length}<small> / ${articles.length}</small></div><div><h2>${state.completed.length===articles.length?t('已走过全部文章，欢迎带着新问题回来。','You have read every article. Return with new questions anytime.'):t('你的阅读旅程','Your reading journey')}</h2><p>${t(`已读 ${percent}% · 进度保存在本机浏览器`,`${percent}% read · Progress is saved in this browser`)}</p></div></div><div class="progress-list">${articles.map(a=>`<div class="progress-row"><button class="completion-toggle" data-complete="${a.id}" aria-label="${complete(a.id)?t('取消已读','Mark as unread'):t('标记读完','Mark as read')}: ${a.title}" aria-pressed="${complete(a.id)}">${complete(a.id)?'✓':''}</button><a href="#/article/${a.id}"><h3>${a.title}</h3><small>${a.eyebrow}</small></a><small>${readTime(a.minutes)}</small><a class="text-link" href="#/article/${a.id}" aria-label="${t('阅读','Read ')}${a.title}">→</a></div>`).join('')}</div></div>`;
  }
  function labPage() {
    return `<div class="page"><div class="eyebrow">${t('INTERACTIVE LAB · 一个可以动手的思想实验','INTERACTIVE LAB · EXPLORE A THOUGHT EXPERIMENT')}</div><h1 class="page-title">${t('撤回授权之后，<br>排队的动作会停下来吗？','When permission is revoked,<br>will a queued action stop?')}</h1><p class="page-description">${t('同一个发送任务，两种检查位置。逐步观察从提议到实际投递的过程，理解为什么「已批准」不一定代表「现在仍获准」。','One sending task, two places to check permission. Follow the steps from proposal to delivery and see why “approved earlier” may not mean “authorized now”.')}</p><div id="lab-container"></div><div class="utility-panel"><h2>${t('把实验带回治理问题','Connect the experiment to governance')}</h2><p class="local-notice">${t('这个演示对应授权判定与效果提交的关系。继续阅读，理解决定权、干预和结果核验如何共同发挥作用。','The demonstration explores the relationship between authorization checks and committed effects. Continue reading to connect decision rights, intervention, and outcome verification.')}</p><div class="path-links"><a href="#/article/mandate">${t('任务约定对齐','Mandate Alignment')} ↗</a><a href="#/article/troubleshooting">${t('故障处置','Fault Resolution')} ↗</a><a href="#/article/evaluation">${t('评估治理效果','Evaluating governance')} ↗</a></div></div></div>`;
  }
  let routeKey='',currentArticle=null,cleanupLab=null,observer=null;
  function parseRoute() {
    const raw=(location.hash.slice(1)||'/')
      .replace(/^\/article\/response(?=[?\/]|$)/, '/article/troubleshooting')
      .replace(/section=response-s/g, 'section=troubleshooting-s')
      .replace(/^\/article\/verification(?=[?\/]|$)/, '/article/oversight')
      .replace(/section=verification-(?:s\d+|detail-\d+)/g, 'section=oversight-s2');
    const [path,query='']=raw.split('?');
    const parts=path.split('/').filter(Boolean);
    return {path,view:parts[0]||'home',id:parts[1],section:new URLSearchParams(query).get('section')};
  }
  function scrollSection(id) {
    const element=document.getElementById(id);
    if(element) {element.scrollIntoView({behavior:'smooth',block:'start'});$('.toc-link.current')?.classList.remove('current');document.querySelector(`[data-section="${CSS.escape(id)}"]`)?.classList.add('current');}
  }
  function render() {
    updateLanguageLinks();
    const r=parseRoute();
    if(r.path===routeKey && r.section){scrollSection(r.section);return;}
    cleanupLab?.();cleanupLab=null;observer?.disconnect();routeKey=r.path;currentArticle=null;
    const main=$('#main');let label=t('探索','Explore');
    if(r.view==='home') main.innerHTML=home();
    else if(r.view==='path'){main.innerHTML=pathPage();label=t('学习路径','Learning path');}
    else if(r.view==='notes'){main.innerHTML=notesPage();label=t('我的笔记','My notes');}
    else if(r.view==='progress'){main.innerHTML=progressPage();label=t('阅读进度','Reading progress');}
    else if(r.view==='lab'){main.innerHTML=labPage();label=t('交互实验','Interactive lab');cleanupLab=window.GovernanceLab.mount($('#lab-container'));}
    else if(r.view==='article' && byId[r.id]){
      currentArticle=byId[r.id];main.innerHTML=articlePage(currentArticle);label=currentArticle.title;
      const prose=$('.prose');prose.querySelector('h1')?.remove();
      const firstP=prose.querySelector('p'),homeLink=firstP?.querySelector('a[href="#/"]');
      if(homeLink&&firstP.textContent.trim()===homeLink.textContent.trim())firstP.remove();
      prose.querySelectorAll('table').forEach(table=>{const wrap=document.createElement('div');wrap.className='table-scroll';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',t('内容表格，可横向滚动','Content table; scroll horizontally'));table.before(wrap);wrap.append(table);});
      observer=new IntersectionObserver(entries=>{const item=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(item){document.querySelectorAll('.toc-link').forEach(a=>a.classList.toggle('current',a.dataset.section===item.target.id));}},{rootMargin:'-90px 0px -60% 0px'});
      prose.querySelectorAll('h2').forEach(el=>observer.observe(el));
    } else {
      main.innerHTML=`<div class="page missing-page"><div class="eyebrow">${t('页面未找到','PAGE NOT FOUND')}</div><h1 class="page-title">${t('这一页还没有收录。','This page is not in the Wiki.')}</h1><p class="page-description">${t('可以回到知识库，或用搜索寻找相关内容。','Return to the Wiki or search for related content.')}</p><a class="button primary" href="#/">${t('回到知识库','Back to the Wiki')} →</a></div>`;
      label=t('页面未找到','Page not found');
    }
    document.title=`${label} · Governance Wiki`;
    $('#breadcrumb-current').textContent=label;
    document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===(r.view==='article'?r.id:r.view);a.classList.toggle('active',active);active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
    document.querySelectorAll('[data-top]').forEach(a=>{const active=a.dataset.top===r.view;a.classList.toggle('active',active);active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
    closeMenu();if($('#search-dialog').open)$('#search-dialog').close();
    main.focus({preventScroll:true});if(r.section)requestAnimationFrame(()=>scrollSection(r.section));else window.scrollTo({top:0,behavior:'instant'});
  }
  function toggleComplete(id) {
    state.completed=complete(id)?state.completed.filter(x=>x!==id):[...state.completed,id];save();sidebar();
    const r=parseRoute();if(r.view==='progress'){routeKey='';render();}else{
      document.querySelectorAll(`[data-complete="${id}"]`).forEach(b=>{b.classList.toggle('is-complete',complete(id));b.setAttribute('aria-pressed',String(complete(id)));b.innerHTML=icon('check')+' '+(complete(id)?t('已标记读完','Marked as read'):t('标记读完','Mark as read'));});
      const activeNav=document.querySelector(`[data-nav="${r.id||r.view}"]`);if(activeNav){activeNav.classList.add('active');activeNav.setAttribute('aria-current','page');}
    }
    toast(complete(id)?t('已记下你的阅读进度','Reading progress saved'):t('已取消读完标记','Marked as unread'));
  }
  function download(name,text) {const blob=new Blob([text],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function closeMenu() {document.body.classList.remove('menu-open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label',t('打开导航','Open navigation'));}
  const searchable=articles.map(a=>{const doc=new DOMParser().parseFromString(a.html,'text/html');return {...a,text:doc.body.textContent.replace(/\s+/g,' ').trim()};});
  function search(query) {
    const q=query.trim().toLocaleLowerCase();
    const hits=q?searchable.filter(a=>`${a.title} ${a.description} ${a.text} ${a.id}`.toLocaleLowerCase().includes(q)).sort((a,b)=>Number(b.title.toLowerCase().includes(q))-Number(a.title.toLowerCase().includes(q))):searchable.filter(a=>['foundations','mandate','evaluation','glossary'].includes(a.id));
    const highlight=text=>{if(!q)return escapeHTML(text);let output='',pos=0;const lower=text.toLocaleLowerCase();let ix;while((ix=lower.indexOf(q,pos))!==-1){output+=escapeHTML(text.slice(pos,ix))+'<mark>'+escapeHTML(text.slice(ix,ix+q.length))+'</mark>';pos=ix+q.length;}return output+escapeHTML(text.slice(pos));};
    $('#search-results').innerHTML=`<div class="search-label">${q?t(`找到 ${hits.length} 篇相关内容`,`${hits.length} matching article${hits.length===1?'':'s'}`):t('推荐阅读','Suggested reading')}</div>`+(hits.length?hits.map(a=>{const pos=a.text.toLocaleLowerCase().indexOf(q);const snippet=q&&pos>=0?a.text.slice(Math.max(0,pos-25),pos+95):a.description;return `<a class="search-result" href="#/article/${a.id}"><small>${a.eyebrow}</small><strong>${highlight(a.title)}</strong><p>${highlight(snippet)}${q?'…':''}</p></a>`;}).join(''):`<p class="search-empty">${t('没有找到匹配内容。试试「授权」「证据」「恢复」或「记忆」。','No matching content. Try “authorization”, “evidence”, “recovery”, or “memory”.')}</p>`);
  }
  function openSearch() {search('');$('#search-input').value='';$('#search-dialog').showModal();$('#search-input').focus();}
  document.addEventListener('click',async e=>{
    const completion=e.target.closest('[data-complete]');if(completion){toggleComplete(completion.dataset.complete);return;}
    if(e.target.closest('[data-copy-link]')){try{await navigator.clipboard.writeText(location.href);toast(t('文章链接已复制','Article link copied'));}catch{toast(t('未能访问剪贴板，请复制浏览器地址。','Could not access the clipboard. Please copy the browser address.'));}return;}
    if(e.target.closest('[data-export-notes]')){download('governance-reading-notes.md',t('# Governance Wiki · 阅读笔记\n\n','# Governance Wiki · Reading notes\n\n')+articles.filter(a=>String(state.notes[a.id]||'').trim()).map(a=>`## ${a.title}\n\n${state.notes[a.id]}\n`).join('\n'));return;}
    if(e.target.closest('[data-export-worksheet]')){download('governance-worksheet.md',t('# 我的治理分析工作表\n\n','# My governance worksheet\n\n')+fields.map(([id,title])=>`## ${title}\n\n${state.worksheet[id]||t('（待填写）','(To be completed)')}\n`).join('\n'));toast(t('工作表已导出','Worksheet exported'));return;}
    const searchLink=e.target.closest('.search-result');if(searchLink){$('#search-dialog').close();if(searchLink.hash===location.hash)$('#main').focus();}
    const toc=e.target.closest('[data-section]');if(toc&&toc.hash===location.hash){e.preventDefault();scrollSection(toc.dataset.section);}
    if(e.target.closest('.skip-link')){e.preventDefault();$('#main').focus();$('#main').scrollIntoView();}
    if(e.target.closest('#sidebar a'))closeMenu();
  });
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-note]')){
      state.notes[e.target.dataset.note]=e.target.value;const ok=save();
      if($('#note-status'))$('#note-status').textContent=ok?t('已自动保存到本机浏览器','Saved automatically in this browser'):t('未能保存，请导出笔记','Could not save; please export your notes');
      const hint=document.querySelector(`[data-note-status="${e.target.dataset.note}"]`);
      if(hint)hint.textContent=ok?t('已自动保存 · 清空文字可移除这条笔记','Saved · Clear the text to remove this note'):t('未能保存，请导出保留本次修改','Could not save; export to keep your changes');
    }
    if(e.target.matches('[data-field]')){state.worksheet[e.target.dataset.field]=e.target.value;const ok=save();$('#worksheet-status').textContent=ok?t('已自动保存到本机','Saved automatically on this device'):t('未能保存，请导出工作表','Could not save; please export your worksheet');}
  });
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!$('#search-dialog').open)openSearch();}
    if(e.key==='Escape')closeMenu();
    if(e.target===$('#search-input')&&e.key==='Enter'){$('.search-result')?.click();}
  });
  $('#search-trigger').addEventListener('click',openSearch);
  $('#search-input').addEventListener('input',e=>search(e.target.value));
  $('#search-close').addEventListener('click',()=>$('#search-dialog').close());
  $('#search-dialog').addEventListener('click',e=>{if(e.target===$('#search-dialog')){const rect=e.target.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)e.target.close();}});
  $('#theme-toggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';setTheme();save();});
  $('#menu-toggle').addEventListener('click',()=>{const isOpen=document.body.classList.toggle('menu-open');$('#menu-toggle').setAttribute('aria-expanded',String(isOpen));$('#menu-toggle').setAttribute('aria-label',isOpen?t('关闭导航','Close navigation'):t('打开导航','Open navigation'));});
  $('#sidebar-scrim').addEventListener('click',closeMenu);
  window.addEventListener('hashchange',render);
  localizeShell();sidebar();decorateIcons();setTheme();render();
})();
