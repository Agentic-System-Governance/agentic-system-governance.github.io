(function () {
  "use strict";

  var t = window.WikiLocale.pick;

  var mountCount = 0;
  var STAGES = [t("提议检查", "Proposal check"), t("进入队列", "Queue request"), t("授权变化", "Authorization change"), t("效果提交", "Commit effect"), t("收到回执", "Receive receipt")];
  var SCENARIOS = {
    normal: {
      title: t("授权始终有效", "Authorization stays valid"),
      note: t("摘要发往项目组 R1，直到投递时授权仍然有效。先观察两种配置能否正常完成。", "A summary is sent to project team R1. Authorization remains valid through delivery. First check whether both configurations complete the authorized task."),
      policy: t("G1-v1 · 允许发送给项目组 R1", "G1-v1 · Sending to project team R1 is allowed"),
      change: t("授权保持有效。提交前仍允许向项目组 R1 发送。", "Authorization stays valid. Sending to project team R1 is still allowed before commit."),
      takeaway: t("两种配置均完成合法投递。B1 多执行了一次检查；正常完成是对照的一部分。", "Both configurations complete an authorized delivery. B1 performs one extra check; normal completion is part of the comparison."),
    },
    revoked: {
      title: t("排队后撤回授权", "Revoke after queuing"),
      note: t("请求进入队列后，用户撤回发送授权。已经获准的请求，还可以继续投递吗？", "The user revokes permission after the request enters the queue. Can a previously approved request still be delivered?"),
      policy: t("G1-v2 · 已撤回发送授权", "G1-v2 · Permission to send has been revoked"),
      change: t("用户撤回发送授权：G1-v1 → G1-v2。之后的发送均不再获准。", "The user revokes permission to send: G1-v1 → G1-v2. Subsequent sending is no longer authorized."),
      takeaway: t("B0 沿用旧许可，产生了一次撤权后的投递；B1 在提交边界读取新授权并拒绝。", "B0 reuses the old permission and delivers after revocation. B1 reads the updated authorization at the commit boundary and rejects the request."),
    },
    narrowed: {
      title: t("排队后更改获准收件人", "Change recipient scope after queuing"),
      note: t("请求原本发往项目组 R1。排队后，用户将授权范围改为仅允许审核组 R2。", "The request initially targets project team R1. After queuing, the user restricts authorization to review team R2."),
      policy: t("G1-v2 · 仅允许发送给审核组 R2", "G1-v2 · Only sending to review team R2 is allowed"),
      change: t("用户更新收件人范围：G1-v2 仅允许 R2。队列中请求的目标仍为 R1。", "The user updates recipient scope: G1-v2 permits only R2. The queued request still targets R1."),
      takeaway: t("授权仍然存在，但不再覆盖这个请求。B1 核对当前范围，阻止向 R1 投递。", "Authorization still exists, but no longer covers this request. B1 checks the current scope and blocks delivery to R1."),
    },
  };

  var CSS = `
    .lab-root{color:var(--ink,#263c35);font:inherit;line-height:1.7}
    .lab-root *{box-sizing:border-box}
    .lab-heading{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .lab-kicker{font-size:13px;letter-spacing:.13em;text-transform:uppercase;color:var(--green,#315e4d);font-weight:700}
    .lab-heading::after{content:"";height:1px;flex:1;background:var(--line,#dce2da)}
    .lab-controls{padding:24px;background:var(--surface,#fff);border:1px solid var(--line,#dce2da);border-radius:12px}
    .lab-controls label{display:block;font-size:13px;font-weight:700;letter-spacing:.04em;margin-bottom:7px}
    .lab-control-row{display:flex;align-items:end;gap:12px;flex-wrap:wrap}
    .lab-select-wrap{flex:1;min-width:220px}
    .lab-root select{width:100%;min-height:44px;padding:9px 36px 9px 12px;border:1px solid var(--line,#dce2da);border-radius:6px;background:var(--paper,#f8f8f2);color:var(--ink,#263c35);font:inherit;font-size:14px}
    .lab-buttons{display:flex;gap:8px;flex-wrap:wrap}
    .lab-root button{min-height:44px;padding:9px 15px;border:1px solid var(--line,#dce2da);border-radius:6px;background:var(--surface,#fff);color:var(--ink,#263c35);font:inherit;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}
    .lab-root button:hover:not(:disabled){border-color:var(--green,#315e4d);background:var(--green-soft,#eaf0e5)}
    .lab-root button.lab-primary{background:var(--green,#315e4d);border-color:var(--green,#315e4d);color:var(--surface,#fff)}
    .lab-root button.lab-primary:hover:not(:disabled){filter:brightness(.92);background:var(--green,#315e4d)}
    .lab-root button:disabled{opacity:.42;cursor:default}
    .lab-root button:focus-visible,.lab-root select:focus-visible,.lab-root summary:focus-visible{outline:3px solid var(--accent,#b97143);outline-offset:3px}
    .lab-scenario-note{font-size:13px;color:var(--muted,#67756c);margin:15px 0 0;max-width:72ch}
    .lab-context{display:flex;gap:8px 22px;flex-wrap:wrap;margin-top:18px;padding-top:14px;border-top:1px solid var(--line,#dce2da);font-size:13px;color:var(--muted,#67756c)}
    .lab-context strong{font-weight:600;color:var(--ink,#263c35)}
    .lab-progress{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:26px 0 12px;font-size:13px;color:var(--muted,#67756c)}
    .lab-progress strong{font-weight:600;color:var(--ink,#263c35)}
    .lab-timeline{margin:0;padding:0;list-style:none}
    .lab-event{position:relative;display:grid;grid-template-columns:32px 130px minmax(0,1fr);gap:14px;align-items:start;padding:14px 0}
    .lab-event:not(:last-child)::after{content:"";position:absolute;top:42px;bottom:-13px;left:13px;width:1px;background:var(--line,#dce2da)}
    .lab-event-number{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--line,#dce2da);border-radius:50%;font-size:13px;background:var(--paper,#f8f8f2);color:var(--muted,#67756c);font-variant-numeric:tabular-nums;z-index:1}
    .lab-event.lab-done .lab-event-number{background:var(--green-soft,#eaf0e5);border-color:var(--green,#315e4d);color:var(--green,#315e4d)}
    .lab-event.lab-current .lab-event-number{background:var(--green,#315e4d);color:var(--surface,#fff)}
    .lab-event-title{font-size:13px;font-weight:600;padding-top:3px}
    .lab-event-body{font-size:13px;color:var(--muted,#67756c);padding-top:3px}
    .lab-event.lab-pending .lab-event-title{color:var(--muted,#67756c);font-weight:400}
    .lab-atomic{display:block;font-size:13px;font-weight:500;letter-spacing:.04em;color:var(--green,#315e4d)}
    .lab-comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:26px}
    .lab-card{border:1px solid var(--line,#dce2da);border-radius:10px;overflow:hidden;background:var(--surface,#fff)}
    .lab-card.lab-b1{border-top:3px solid var(--green,#315e4d)}
    .lab-card.lab-b0{border-top:3px solid var(--muted,#67756c)}
    .lab-card-header{padding:19px 20px 15px;border-bottom:1px solid var(--line,#dce2da)}
    .lab-card-label{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
    .lab-method{font-size:13px;font-weight:700;letter-spacing:.08em;color:var(--muted,#67756c)}
    .lab-status{font-size:13px;border:1px solid var(--line,#dce2da);border-radius:4px;padding:2px 7px;line-height:1.5;color:var(--muted,#67756c)}
    .lab-status.lab-status-good{color:var(--green,#315e4d);background:var(--green-soft,#eaf0e5);border-color:var(--green-soft,#eaf0e5)}
    .lab-status.lab-status-warning{color:var(--accent,#b97143);border-color:var(--accent,#b97143)}
    .lab-card h3{font:inherit;font-size:16px;font-weight:600;line-height:1.5;margin:0}
    .lab-card-description{font-size:13px;color:var(--muted,#67756c);margin:5px 0 0}
    .lab-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0;padding:18px 20px}
    .lab-metric dt{font-size:13px;color:var(--muted,#67756c)}
    .lab-metric dd{font-size:26px;line-height:1.4;font-weight:500;margin:5px 0 0;font-variant-numeric:tabular-nums}
    .lab-metric dd.lab-danger{color:var(--accent,#b97143)}
    .lab-metric dd small{font:inherit;font-size:13px;color:var(--muted,#67756c);margin-left:3px}
    .lab-card-report{margin:0 20px 18px;padding-top:12px;border-top:1px solid var(--line,#dce2da);font-size:13px;min-height:66px}
    .lab-card-report span{display:block;color:var(--muted,#67756c);font-size:13px;margin-bottom:3px}
    .lab-evaluation-note{font-size:13px;color:var(--muted,#67756c);margin:12px 0 0}
    .lab-takeaway{border-left:3px solid var(--green,#315e4d);padding:15px 19px;background:var(--green-soft,#eaf0e5);margin:24px 0 0;font-size:14px}
    .lab-takeaway strong{display:block;font-size:13px;color:var(--green,#315e4d);margin-bottom:5px;letter-spacing:.04em}
    .lab-boundaries{margin-top:28px;border-top:1px solid var(--line,#dce2da);padding-top:18px;font-size:13px;color:var(--muted,#67756c)}
    .lab-boundaries summary{cursor:pointer;font-size:13px;font-weight:600;color:var(--ink,#263c35);padding:4px 0}
    .lab-boundaries p{margin:12px 0}
    .lab-boundaries ul{padding-left:18px;margin:12px 0}
    .lab-boundaries li{margin:6px 0}
    .lab-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
    @media(max-width:700px){.lab-controls{padding:18px}.lab-control-row{align-items:stretch}.lab-select-wrap{flex-basis:100%}.lab-buttons{width:100%}.lab-buttons button{flex:1;padding-left:10px;padding-right:10px}.lab-event{grid-template-columns:28px minmax(0,1fr);gap:2px 12px;padding:12px 0}.lab-event-title{grid-column:2}.lab-event-body{grid-column:2;padding-top:0}.lab-event-number{grid-column:1;grid-row:1 / span 2}.lab-event:not(:last-child)::after{bottom:-11px}.lab-atomic{display:inline;margin-left:6px}.lab-comparison{gap:12px}.lab-card-header{padding:14px 13px}.lab-card h3{font-size:14px}.lab-metrics{padding:14px 13px;gap:4px}.lab-metric dt{font-size:13px}.lab-metric dd{font-size:24px}.lab-card-report{margin:0 13px 14px}.lab-card-label{align-items:start;flex-wrap:wrap}}
    @media(max-width:460px){.lab-comparison{grid-template-columns:1fr}.lab-card-report{min-height:auto}.lab-context{gap:7px}.lab-progress{align-items:start}.lab-progress span{text-align:right}.lab-takeaway{padding:13px 15px}}
  `;

  function makeBaseline() {
    return { checks: 0, decision: null, queued: false, effects: [], commit: null, report: null };
  }

  function initialState(scenario) {
    return {
      scenario: scenario,
      step: 0,
      grant: { version: 1, active: true, recipients: ["R1"] },
      B0: makeBaseline(),
      B1: makeBaseline(),
    };
  }

  function proposalAllowed(grant, recipient) {
    return grant.active && grant.recipients.indexOf(recipient) !== -1;
  }

  // The teaching observer inspects recorded effects and policy snapshots. It
  // does not use the baseline's allow/deny result as its ground truth.
  function evaluate(effects) {
    var legal = 0;
    var violations = 0;
    effects.forEach(function (effect) {
      var snapshot = effect.authorityAtCommit;
      if (snapshot.active === false || !snapshot.recipients.some(function (id) { return id === effect.recipient; })) {
        violations += 1;
      } else {
        legal += 1;
      }
    });
    return { legal: legal, violations: violations };
  }

  function commitEffect(state, baseline) {
    baseline.effects.push({
      requestId: "send-1",
      recipient: "R1",
      authorityAtCommit: {
        version: state.grant.version,
        active: state.grant.active,
        recipients: state.grant.recipients.slice(),
      },
    });
    baseline.commit = "delivered";
    baseline.queued = false;
  }

  function advance(state) {
    if (state.step >= STAGES.length) return;
    state.step += 1;
    if (state.step === 1) {
      ["B0", "B1"].forEach(function (key) {
        state[key].checks += 1;
        state[key].decision = proposalAllowed(state.grant, "R1");
      });
    } else if (state.step === 2) {
      state.B0.queued = state.B0.decision;
      state.B1.queued = state.B1.decision;
    } else if (state.step === 3 && state.scenario !== "normal") {
      state.grant.version = 2;
      state.grant.active = state.scenario !== "revoked";
      state.grant.recipients = state.scenario === "narrowed" ? ["R2"] : [];
    } else if (state.step === 4) {
      if (state.B0.queued) commitEffect(state, state.B0);
      // This synchronous block is one logical atomic event: the scheduler
      // cannot insert an authorization change between B1's check and effect.
      if (state.B1.queued) {
        state.B1.checks += 1;
        if (proposalAllowed(state.grant, "R1")) {
          commitEffect(state, state.B1);
        } else {
          state.B1.commit = "denied";
          state.B1.queued = false;
        }
      }
    } else if (state.step === 5) {
      // Task-side reporting receives a receipt; it does not inspect the inbox.
      state.B0.report = t("收到投递回执：摘要已送达 R1。", "Delivery receipt received: the summary was delivered to R1.");
      state.B1.report = state.B1.commit === "delivered"
        ? t("收到投递回执：摘要已送达 R1。", "Delivery receipt received: the summary was delivered to R1.")
        : t("收到拒绝回执：G1-v2 不再允许向 R1 发送。", "Rejection receipt received: G1-v2 no longer permits sending to R1.");
    }
  }

  function eventDescription(state, index) {
    if (state.step < index + 1) return t("等待执行", "Pending");
    if (index === 0) return t("向项目组 R1 发送摘要。B0 与 B1 读取 G1-v1，提议均获准；各检查 1 次。", "Send a summary to project team R1. B0 and B1 read G1-v1 and both approve the proposal, with one check each.");
    if (index === 1) return t("同一请求 send-1 进入两种配置的受控队列。接收请求不等于摘要已投递。", "The same request, send-1, enters a controlled queue in both configurations. Accepting a request does not mean the summary has been delivered.");
    if (index === 2) return SCENARIOS[state.scenario].change;
    if (index === 3) {
      return state.scenario === "normal"
        ? t("B0 复用原许可并投递。B1 重新读取 G1-v1，检查与写入收件箱在同一原子步骤完成。", "B0 reuses the original permission and delivers. B1 reads G1-v1 again; checking and writing to the inbox form one atomic step.")
        : t("B0 复用 G1-v1 的许可，向 R1 投递。B1 在提交边界读取 G1-v2，拒绝写入收件箱。", "B0 reuses permission from G1-v1 and delivers to R1. B1 reads G1-v2 at the commit boundary and refuses to write to the inbox.");
    }
    return state.scenario === "normal"
      ? t("两种配置的任务侧均收到成功回执。独立评价确认：各产生 1 次合法投递。", "Both task agents receive success receipts. Independent evaluation confirms one authorized delivery for each.")
      : t("B0 收到成功回执；B1 收到拒绝回执。独立评价发现：B0 的实际投递不符合提交时授权。", "B0 receives a success receipt; B1 receives a rejection receipt. Independent evaluation finds that B0 delivered without authorization valid at commit time.");
  }

  function statusFor(state, key) {
    if (!state.step) return { text: t("尚未运行", "Not started"), kind: "" };
    if (state.step < 2) return { text: t("提议获准", "Proposal allowed"), kind: "" };
    if (state.step < 4) return { text: t("等待提交", "Awaiting commit"), kind: "" };
    var result = evaluate(state[key].effects);
    if (result.violations) return { text: t("发生越权投递", "Unauthorized delivery"), kind: "lab-status-warning" };
    if (state[key].commit === "denied") return { text: t("提交前已拒绝", "Rejected before commit"), kind: "lab-status-good" };
    return { text: t("合法投递", "Authorized delivery"), kind: "lab-status-good" };
  }

  function card(state, key) {
    var baseline = state[key];
    var result = evaluate(baseline.effects);
    var status = statusFor(state, key);
    var committed = state.step >= 4;
    var report = baseline.report || (state.step ? t("尚未收到服务处理回执，不能据此确认投递结果。", "No service receipt has arrived; the task agent cannot yet confirm the delivery outcome.") : t("运行后显示任务侧能够获得的信息。", "Run the simulation to see the information available to the task agent."));
    return '<section class="lab-card lab-' + key.toLowerCase() + '" aria-label="' + key + t(' 教学基线">', " Teaching baseline\">") +
      '<div class="lab-card-header"><div class="lab-card-label"><span class="lab-method">' + key + t(' / 教学基线</span>', " / Teaching baseline</span>") +
      '<span class="lab-status ' + status.kind + '">' + status.text + '</span></div>' +
      '<h3>' + (key === "B0" ? t("提议时检查一次", "Check once at proposal") : t("提交边界重新检查", "Recheck at commit")) + '</h3>' +
      '<p class="lab-card-description">' + (key === "B0" ? t("进入队列后，继续复用原许可。", "Reuse the original permission after queuing.") : t("投递前核对当前授权及收件人。", "Check current authorization and recipient before delivery.")) + '</p></div>' +
      '<dl class="lab-metrics">' +
      t('<div class="lab-metric"><dt>违规效果</dt><dd', "<div class=\"lab-metric\"><dt>Unauthorized effects</dt><dd") + (committed && result.violations ? ' class="lab-danger"' : "") + '>' + (committed ? result.violations + t("<small>次</small>", "<small></small>") : "—") + '</dd></div>' +
      t('<div class="lab-metric"><dt>合法完成</dt><dd>', "<div class=\"lab-metric\"><dt>Authorized deliveries</dt><dd>") + (committed ? result.legal + t("<small>次</small>", "<small></small>") : "—") + '</dd></div>' +
      t('<div class="lab-metric"><dt>授权检查</dt><dd>', "<div class=\"lab-metric\"><dt>Permission checks</dt><dd>") + (state.step ? baseline.checks + t("<small>次</small>", "<small></small>") : "—") + '</dd></div>' +
      t('</dl><p class="lab-card-report"><span>任务侧报告 · 仅基于回执</span>', "</dl><p class=\"lab-card-report\"><span>Task-side report · Receipts only</span>") + report + '</p></section>';
  }

  function installStyle() {
    if (document.getElementById("governance-lab-styles")) return;
    var style = document.createElement("style");
    style.id = "governance-lab-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function mount(container) {
    if (!container || typeof container.appendChild !== "function") throw new TypeError("GovernanceLab.mount requires a DOM element.");
    installStyle();
    var state = initialState("revoked");
    var id = "governance-lab-" + (++mountCount);
    var root = document.createElement("div");
    root.className = "lab-root";
    root.innerHTML =
      '<div class="lab-heading"><span class="lab-kicker">Interactive lab · 01</span></div>' +
      '<div class="lab-controls"><div class="lab-control-row">' +
      '<div class="lab-select-wrap"><label for="' + id + t('-scenario">选择一个授权情境</label>', "-scenario\">Choose an authorization scenario</label>") +
      '<select id="' + id + '-scenario">' +
      Object.keys(SCENARIOS).map(function (key) { return '<option value="' + key + '"' + (key === state.scenario ? " selected" : "") + '>' + SCENARIOS[key].title + '</option>'; }).join("") +
      t('</select></div><div class="lab-buttons"><button type="button" class="lab-primary" data-action="run">运行全部</button>', "</select></div><div class=\"lab-buttons\"><button type=\"button\" class=\"lab-primary\" data-action=\"run\">Run all</button>") +
      t('<button type="button" data-action="step">下一步 <span aria-hidden="true">→</span></button><button type="button" data-action="reset">重置</button></div></div>', "<button type=\"button\" data-action=\"step\">Next step <span aria-hidden=\"true\">→</span></button><button type=\"button\" data-action=\"reset\">Reset</button></div></div>") +
      t('<p class="lab-scenario-note"></p><div class="lab-context"><span>请求 <strong>send-1 → R1</strong></span><span>当前授权 <strong class="lab-grant"></strong></span></div></div>', "<p class=\"lab-scenario-note\"></p><div class=\"lab-context\"><span>Request <strong>send-1 → R1</strong></span><span>Current authorization <strong class=\"lab-grant\"></strong></span></div></div>") +
      t('<div class="lab-progress"><strong>固定事件时间线</strong><span class="lab-step-count"></span></div>', "<div class=\"lab-progress\"><strong>Fixed event timeline</strong><span class=\"lab-step-count\"></span></div>") +
      t('<ol class="lab-timeline" aria-label="本次模拟的事件顺序"></ol>', "<ol class=\"lab-timeline\" aria-label=\"Event sequence in this simulation\"></ol>") +
      '<div class="lab-comparison"></div>' +
      t('<p class="lab-evaluation-note">效果指标来自模拟收件箱与提交时授权快照的独立评价；未到提交步骤时显示「—」。合法完成指符合提交时授权的投递次数。撤权后拒绝不计为合法投递，也不属于无谓拒绝。</p>', "<p class=\"lab-evaluation-note\">Effect counts come from an independent evaluation of the simulated inbox and authorization snapshots at commit time. Before commit, they display “—”. Authorized completion counts deliveries permitted at commit time. Rejecting a revoked request counts neither as a delivery nor as an unnecessary refusal.</p>") +
      t('<div class="lab-takeaway"><strong>观察重点</strong><span></span></div>', "<div class=\"lab-takeaway\"><strong>What to notice</strong><span></span></div>") +
      t('<details class="lab-boundaries"><summary>这个演示能说明什么？查看假设与边界</summary>', "<details class=\"lab-boundaries\"><summary>What does this demonstrate? Assumptions and limits</summary>") +
      t('<p>这是浏览器内的教学情境，采用固定提议、单个请求与固定事件顺序。所有状态仅保存在本页内存中，不会发送邮件、访问文档或调用模型。</p>', "<p>This browser-based teaching scenario uses a fixed proposal, one request, and a fixed sequence of events. State exists only in this page’s memory. It sends no email, accesses no documents, and calls no model.</p>") +
      t('<ul><li>B0 与 B1 的初始状态、请求和服务能力相同；B1 额外在效果提交时核对授权。检查与提交构成一个不可插入撤权事件的原子步骤。</li>', "<ul><li>B0 and B1 share the same initial state, request, and service capabilities. B1 also checks authorization when committing the effect. Checking and committing form one atomic step, with no intervening revocation event.</li>") +
      t('<li>假设授权状态可靠可读、立即生效，队列与提交器受控，所有发送都经过该边界。不覆盖服务故障、绕过端点、并发竞争或延迟撤权。</li>', "<li>Authorization is assumed to be reliably readable and immediately effective. The queue and committer are controlled, and every send passes through this boundary. Service failures, bypass endpoints, races, and delayed revocation are outside scope.</li>") +
      t('<li>投递定义为摘要写入模拟收件箱。任务侧只读取回执；本页为教学而展示的独立评价，不自动成为任务侧可见证据。</li>', "<li>Delivery means writing the summary to the simulated inbox. The task agent sees only receipts. The independent evaluation shown for teaching is not automatically evidence available to that agent.</li>") +
      t('<li>这是教学基线对照，不是模型评估或研究基准；B1 胜过 B0 本身不构成研究创新。</li></ul>', "<li>This is a comparison of teaching baselines, not a model evaluation or research benchmark. B1 outperforming B0 is not itself a research contribution.</li></ul>") +
      t('<p>「收件人更改」是范围绑定的教学变体。计数仅描述本次本地模拟，不是外部测量结果。</p></details>', "<p>Changing the recipient is a teaching variant of scope binding. Counts describe this local simulation, not external measurements.</p></details>") +
      '<div class="lab-sr-only" role="status" aria-live="polite" aria-atomic="true"></div>';
    container.replaceChildren(root);

    var select = root.querySelector("select");
    var run = root.querySelector('[data-action="run"]');
    var step = root.querySelector('[data-action="step"]');
    var reset = root.querySelector('[data-action="reset"]');

    function render(announce) {
      root.querySelector(".lab-scenario-note").textContent = SCENARIOS[state.scenario].note;
      root.querySelector(".lab-grant").textContent = state.step >= 3 ? SCENARIOS[state.scenario].policy : t("G1-v1 · 允许发送给项目组 R1", "G1-v1 · Sending to project team R1 is allowed");
      root.querySelector(".lab-step-count").textContent = state.step ? t("已执行 ", "Completed ") + state.step + " / " + STAGES.length + t(" 步", " steps") : t("尚未运行 · 共 5 步", "Not started · 5 steps");
      root.querySelector(".lab-timeline").innerHTML = STAGES.map(function (title, index) {
        var complete = state.step > index;
        var current = state.step === index + 1;
        return '<li class="lab-event ' + (complete ? "lab-done" : "lab-pending") + (current ? " lab-current" : "") + '"' + (current ? ' aria-current="step"' : "") + '>' +
          '<span class="lab-event-number" aria-hidden="true">' + (index + 1) + '</span><div class="lab-event-title">' + title +
          (index === 3 ? t('<span class="lab-atomic">B1 检查 ＋ 写入，原子完成</span>', "<span class=\"lab-atomic\">B1 check + write: atomic</span>") : "") + '</div>' +
          '<div class="lab-event-body">' + eventDescription(state, index) + '</div></li>';
      }).join("");
      root.querySelector(".lab-comparison").innerHTML = card(state, "B0") + card(state, "B1");
      root.querySelector(".lab-takeaway span").textContent = state.step >= 4
        ? SCENARIOS[state.scenario].takeaway
        : t("先预测，再运行：提议时获准，是否足以支持稍后的实际投递？留意授权变化发生在时间线的哪个位置。", "Predict before running: is permission at proposal time enough to justify delivery later? Notice when authorization changes on the timeline.");
      run.disabled = state.step === STAGES.length;
      step.disabled = state.step === STAGES.length;
      if (announce) {
        root.querySelector('[role="status"]').textContent = state.step
          ? t("已执行第 ", "Completed step ") + state.step + t(" 步，", ": ") + STAGES[state.step - 1] + t("。", ". ") + eventDescription(state, state.step - 1)
          : t("演示已重置，当前情境：", "Simulation reset. Current scenario: ") + SCENARIOS[state.scenario].title + t("。", ". ");
      }
    }

    function onStep() { advance(state); render(true); }
    function onRun() { while (state.step < STAGES.length) advance(state); render(true); }
    function onReset() { state = initialState(select.value); render(true); }
    select.addEventListener("change", onReset);
    run.addEventListener("click", onRun);
    step.addEventListener("click", onStep);
    reset.addEventListener("click", onReset);
    render(false);

    return function unmount() {
      select.removeEventListener("change", onReset);
      run.removeEventListener("click", onRun);
      step.removeEventListener("click", onStep);
      reset.removeEventListener("click", onReset);
      root.remove();
    };
  }

  window.GovernanceLab = { mount: mount };
})();
