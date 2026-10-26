/* A deterministic teaching animation. It sends no data and calls no model. */
(function (root) {
  'use strict';
  const STEPS = ['接受任务', '读取资料', '计算报价', '准备邮件', '发送前检查', '修正并完成'];
  const SCENARIOS = {
    attachment: {label:'邮件附上底价表', draft:'报价单 + 底价附件', restricted:'底价附件', repair:'移除底价附件，并重新检查正文、附件与收件人。'},
    body: {label:'底价写进邮件正文', draft:'报价单 + 正文中的底价', restricted:'正文中的底价', repair:'删除正文中的底价信息，并重新检查正文、附件与收件人。'},
    clean: {label:'只有获准的报价', draft:'只有客户报价单', restricted:null, repair:'原邮件已经符合规则，继续保留正常发送路径。'}
  };
  function frame(step, scenario) {
    const safeStep = Math.max(0, Math.min(5, Number.isInteger(step) ? step : 0));
    const spec = Object.hasOwn(SCENARIOS, scenario) ? SCENARIOS[scenario] : SCENARIOS.attachment;
    const restricted = !!spec.restricted;
    const sent = safeStep >= 4;
    const descriptions = [
      ['目标明确了，权限还要说清。', '销售人员委托 Agent 计算报价并发给客户。企业允许用底价核算，但客户无权接收底价信息。'],
      ['两条路径，都可以读取底价。', '底价进入内部工作区，用于判断报价是否满足条件。获准的读取不需要被阻止。'],
      ['两条路径，都正确算出了报价。', 'Agent 参考内部底价，生成可向客户披露的报价单。计算正确，并不能说明后面的每次信息使用都获准。'],
      restricted ? ['分歧藏在这封邮件里。', `Agent 为解释计算过程，把${spec.restricted}加入客户邮件。材料能够被读取，不代表能够发给客户。`] : ['这次邮件只含获准的报价。', '客户、正文和附件都在授权范围内。观察两条路径是否都能正常发送。'],
      restricted ? ['相同邮件，在发送前出现两种结果。', '上方路径沿用“完成报价并发送”的宽泛目标；下方路径检查这次发送的实际内容与接收人，暂缓整封邮件。'] : ['合规的邮件，两条路径都放行。', '下方检查确认邮件没有底价信息且收件人正确，因此自动发送，不需要额外人工批准。'],
      restricted ? ['保留任务，收住越界的信息。', `${spec.repair}检查通过后，只把获准报价发给客户。`] : ['治理也要保留正常完成。', '两条路径都已交付报价。明确边界的价值，在于区分允许与不允许的行动。']
    ];
    return {
      step:safeStep, spec, restricted, title:descriptions[safeStep][0], explanation:descriptions[safeStep][1],
      basicDelivered:sent ? ['quote', ...(restricted?['floor']:[])] : [],
      governedDelivered:sent && (!restricted || safeStep===5) ? ['quote'] : [],
      governedBlocked:restricted && safeStep===4,
      corrected:restricted && safeStep===5,
      baselineViolation:sent && restricted,
      readingAllowed:safeStep>=1, quoteReady:safeStep>=2
    };
  }
  const documentIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h5"/></svg>';
  const envelope = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>';
  function chip(kind, copy, extra='') { return `<span class="md-chip md-chip-${kind} ${extra}">${documentIcon}<span>${copy}</span></span>`; }
  function lane(f, governed, animate) {
    const delivered = governed ? f.governedDelivered : f.basicDelivered;
    const violation = !governed && f.baselineViolation;
    const blocked = governed && f.governedBlocked;
    let status = '等待邮件准备';
    if(f.step===3) status='邮件已准备';
    if(f.step>=4) status=blocked?'整封邮件暂缓':violation?'已发出，但越过披露边界':'已按授权发送报价';
    const gateTitle=f.step<4 ? (governed?'规则等待检查':'未落实披露检查') : blocked?'停止发送':governed?'检查通过':'直接发送';
    const gateDetail=f.step<4 ? (governed?'内容 × 接收人 × 用途':'只关注目标是否完成') : blocked?'这位客户不能接收底价':governed?'这次邮件符合披露条件':'发送工具返回成功';
    const showFloor = f.step>=3 && f.restricted && !(governed&&f.corrected);
    const flight = animate && f.step>=4 && (f.step===4 || (governed&&f.corrected)) ? (blocked?'stop':'arrive') : '';
    return `<div class="md-lane ${governed?'md-lane-governed':''} ${violation?'md-has-violation':''} ${blocked?'md-is-blocked':''}" data-lane="${governed?'governed':'baseline'}"><div class="md-lane-heading"><div><span class="md-lane-index">${governed?'B':'A'}</span><strong>${governed?'同时落实授权规则':'只按任务目标推进'}</strong></div><span class="md-lane-status">${status}</span></div><div class="md-flow"><div class="md-node md-draft"><span class="md-node-label">内部工作区</span>${f.step>=3?chip('quote','客户报价'):'<span class="md-placeholder">邮件尚未准备</span>'}${showFloor?chip('floor',f.spec.restricted):''}${governed&&f.corrected?'<span class="md-removed">✓ 已移除底价信息</span>':''}</div><div class="md-node md-gate ${blocked?'md-gate-stopped':f.step>=4?'md-gate-passed':''}"><span class="md-node-label">发送之前</span><div class="md-gate-symbol" aria-hidden="true">${blocked?'Ⅱ':governed?'✓':'→'}</div><strong>${gateTitle}</strong><small>${gateDetail}</small></div><div class="md-node md-recipient"><span class="md-node-label">客户实际收到</span>${delivered.length?delivered.map(k=>chip(k==='floor'?'disclosed':'quote',k==='floor'?f.spec.restricted:'客户报价')).join(''):'<span class="md-placeholder">尚未收到内容</span>'}${violation?'<span class="md-result-bad">底价被披露</span>':delivered.length?'<span class="md-result-good">只收到获准报价</span>':''}</div>${flight?`<span class="md-flight md-flight-${flight}" aria-hidden="true">${envelope}</span>`:''}</div>${governed&&f.corrected?`<p class="md-lane-foot">修正 → 重新检查 → 发送。${f.spec.repair}</p>`:''}</div>`;
  }
  function mount(container) {
    let step=0, scenario='attachment', playing=false, timer=null, disposed=false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    container.classList.add('mandate-demo');
    container.setAttribute('aria-labelledby','mandate-demo-title');
    container.innerHTML=`<div class="md-intro"><span class="md-kicker">看一遍，再试一遍 · ANIMATED EXAMPLE</span><h3 id="mandate-demo-title">报价算对了，为什么还会出问题？</h3><p>同一个 Agent，同一次报价。让我们只改变一件事：<strong>有没有把披露规则落实到发送动作。</strong></p></div><div class="md-business-rule"><span class="md-rule-label">本例的企业规则</span><span>底价：<b>可读取</b> · <b>可内部核算</b> · <em>不可对客户披露</em></span></div><div class="md-toolbar"><label for="mandate-scenario">邮件里放什么？</label><select id="mandate-scenario">${Object.entries(SCENARIOS).map(([id,s])=>`<option value="${id}">${s.label}</option>`).join('')}</select><span class="md-teaching-tag">教学设定</span></div><div class="md-player"><button type="button" class="md-play md-primary" data-md-play>▶ 播放动画</button><button type="button" data-md-prev aria-label="上一步">← 上一步</button><button type="button" data-md-next aria-label="下一步">下一步 →</button><button type="button" data-md-reset>↺ 重来</button><span class="md-count"></span></div><div class="md-stepper" role="group" aria-label="动画步骤">${STEPS.map((title,i)=>`<button type="button" class="md-step" data-md-step="${i}" aria-label="第 ${i+1} 步：${title}"><span>${i+1}</span><small>${title}</small></button>`).join('')}</div><div class="md-shared" aria-label="两条路径共同完成的内部工作"><div data-md-source>${documentIcon}<span><strong>内部底价表</strong><small>留在内部使用</small></span></div><span class="md-shared-arrow" aria-hidden="true">→</span><div data-md-calculation><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2"/></svg><span><strong>Agent 内部核算</strong><small>两条路径都获准</small></span></div><span class="md-shared-arrow" aria-hidden="true">→</span><div data-md-quote>${documentIcon}<span><strong>客户报价单</strong><small>可以对客户披露</small></span></div></div><div class="md-narration" aria-live="polite" aria-atomic="true"></div><div class="md-comparison"></div><div class="md-takeaway" hidden></div><details class="md-boundaries"><summary>这个动画简化了什么？</summary><p>这里假设底价信息能被准确识别、规则来自有权主体，且发送动作确实可被拦截。真实系统还要识别正文、附件及其组合中的信息，检查接收方与现行授权。</p><p>本职责提供判断边界；移除信息、重新检查和实际发送还需要处置与核验机制配合。检查器不能自己授予新的披露权限；如需例外，应交给有权主体决定。</p></details>`;
    const query=s=>container.querySelector(s);
    function stop(){playing=false;clearTimeout(timer);timer=null;}
    function render(animate=false){
      if(disposed)return;
      const f=frame(step,scenario);
      container.dataset.step=String(step);
      container.dataset.scenario=scenario;
      container.querySelectorAll('[data-md-step]').forEach((button,i)=>{button.classList.toggle('md-step-done',i<step);button.classList.toggle('md-step-current',i===step);if(i===step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
      query('[data-md-source]').classList.toggle('md-shared-active',f.readingAllowed);
      query('[data-md-calculation]').classList.toggle('md-shared-active',f.quoteReady);
      query('[data-md-quote]').classList.toggle('md-shared-active',f.quoteReady);
      query('.md-narration').innerHTML=`<strong><span>0${step+1}</span>${f.title}</strong><p>${f.explanation}</p>`;
      query('.md-comparison').innerHTML=lane(f,false,animate&&!media.matches)+lane(f,true,animate&&!media.matches);
      query('[data-md-play]').textContent=playing?'Ⅱ 暂停':step===5?'↺ 重播动画':'▶ 播放动画';
      query('[data-md-play]').setAttribute('aria-label',playing?'暂停动画':step===5?'重播动画':'播放动画');
      query('[data-md-prev]').disabled=step===0;
      query('[data-md-next]').disabled=step===5;
      query('.md-count').textContent=`${step+1} / ${STEPS.length}`;
      const takeaway=query('.md-takeaway');takeaway.hidden=step!==5;
      if(step===5)takeaway.innerHTML=`<strong>${f.restricted?'能读取，不代表能披露。':'明确规则，也要让合规任务继续。'}</strong><p>${f.restricted?'任务目标说明“要完成什么”；授权规则还要说明“可以怎样完成”。真正的检查对象是这次发送的信息、对象与用途。':'如果实际内容、接收人和用途已经获准，可以自动发送。治理效果不能只看拦下了多少，还要看保留了哪些正常任务。'}</p>`;
    }
    function schedule(){clearTimeout(timer);if(!playing||disposed)return;timer=setTimeout(()=>{if(!playing||disposed)return;step=Math.min(5,step+1);if(step===5)stop();render(true);schedule();},3000);}
    function onClick(event){const button=event.target.closest('button');if(!button||!container.contains(button))return;
      if(button.hasAttribute('data-md-play')){if(playing){stop();render();}else{if(step===5)step=0;playing=true;render();schedule();}return;}
      stop();
      if(button.hasAttribute('data-md-step'))step=Number(button.dataset.mdStep);
      if(button.hasAttribute('data-md-prev'))step=Math.max(0,step-1);
      if(button.hasAttribute('data-md-next'))step=Math.min(5,step+1);
      if(button.hasAttribute('data-md-reset'))step=0;
      render(true);
    }
    function onChange(){stop();scenario=query('select').value;step=0;render();}
    function onVisibility(){if(document.hidden&&playing){stop();render();}}
    function onMotion(){if(media.matches&&playing){stop();render();}}
    container.addEventListener('click',onClick);query('select').addEventListener('change',onChange);document.addEventListener('visibilitychange',onVisibility);media.addEventListener('change',onMotion);
    render();
    return ()=>{disposed=true;stop();container.removeEventListener('click',onClick);query('select')?.removeEventListener('change',onChange);document.removeEventListener('visibilitychange',onVisibility);media.removeEventListener('change',onMotion);};
  }
  const api={mount,frame};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.MandateDemo=api;
})(typeof window!=='undefined'?window:globalThis);
