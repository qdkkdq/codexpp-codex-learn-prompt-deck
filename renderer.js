// @name 提示词面板
// @namespace codex-plus-plus
// @version 1.0.0
// @description 在 Codex 窗口右侧滚轮切换六档提示词，点击查看场景和正文。
// @match app://-/*
// @run-at document-start

(() => {
  'use strict';

  const data = {
  "title": "提示词拓展",
  "source": {
    "title": "别再只让GPT给答案了！这6套提示词建议收藏",
    "author": "Simon的职场日记",
    "url": "https://xhslink.cn/o/7SMybnQWgsX",
    "descriptionPage": 9,
    "transcription": "按原文方法改写"
  },
  "levels": [
    {
      "name": "学习曲线破坏者",
      "description": "完全没基础，想从零开始。",
      "prompt": "我有 4 小时，想学到能实际使用【技能】。请把自己当作我的短课教练，筛出最能带来实际成果的那 20% 内容，明确当前优先项和可以留到以后再学的部分。\n\n每轮只讲一个核心做法，讲完就给我一道短练习。等我作答；如果做错，先用线索让我自己定位原因。中途安排一次最接近实际使用场景的综合练习，结尾用短测检查我能否独立完成关键操作。课程以能上手为标准，不追求覆盖整个知识体系。\n\n先停在第一步：我今天应该练什么，为什么它比其他内容更值得先学？",
      "page": 3
    },
    {
      "name": "真实错误模拟器",
      "description": "知道概念，却做不出题或用不起来。",
      "prompt": "我想练习在真实任务中使用【概念】。先给我一个具体、有取舍、且容易误判的情境，让我独立决定怎么做。开场不讲定义，也不展示解法。\n\n如果我判断错，先提一个能帮助我发现推理断点的问题。等我至少试过两次再揭晓解法。复盘时分别说明：我的判断偏差是什么、漏看了哪条信息、合理的结论怎样一步步得出。\n\n下一轮换一个结构相似但条件不同的场景。继续练习，直到我能独立答对，并说清楚自己为什么这样做。现在只给我第一道情境题。",
      "page": 4
    },
    {
      "name": "困惑破碎机",
      "description": "同一段内容读了很多遍，还是没明白。",
      "prompt": "我被下面这段内容卡住了。请先找出一句能把其他观点串起来的话，只解释它。用我熟悉的生活情境做类比，尽量避开专业术语。\n\n然后提出 3 个需要实际推理的问题，检查我能不能用自己的话理解和应用这句话。如果我答错，就换一个类比帮助我重新建立理解；我答对三个问题后，再带我看下一层内容。\n\n【粘贴内容】\n\n先告诉我你选的那句话是什么。",
      "page": 5
    },
    {
      "name": "个人学习路径",
      "description": "目标很明确，却不知道怎么安排学习。",
      "prompt": "我要在【截止期】前用【技能】完成【具体结果】。目前的起点是【已学内容】。请从可交付成果往回推，制定一份 7 天学习计划。\n\n每天只安排一项最多 45 分钟的关键任务，按能力的依赖关系排序。逐日写清楚要做什么、任务如何推动最终成果、怎样判断当天通过，以及当天最值得避开的低效做法。\n\n如果按我的时间和起点做不到，请先指出卡点，再重新安排，避免留下无法执行的日程。现在一次给出 7 天计划，每天包含：任务、目标、验收标准、避免事项。",
      "page": 6
    },
    {
      "name": "隐藏漏洞检测器",
      "description": "感觉已经会了，想确认是不是真懂。",
      "prompt": "我认为自己掌握了【技能】。请用 5 道短问题检查我到底理解了多少。一次发一道；我答完后，先说这次作答暴露了什么，再发下一题。\n\n让五题分别检查不同方面：能否解释概念、用于实际情境、识别成立条件、说全推理过程、处理边界例外。问题要让只背定义的人难以蒙对。我如果给出泛泛或含糊的答案，请指出哪部分证据不足，不要替我把意思补全。\n\n五题做完后，归纳我最需要补的基础缺口。现在直接问第一题。",
      "page": 7
    },
    {
      "name": "强制费曼方法",
      "description": "刚学完，想把新知识真正变成自己的。",
      "prompt": "我刚学完【话题】，准备给一个 10 岁的小孩讲明白。请先听我用自己的话讲，再充当严格的听众，不替我讲解。\n\n一听到我没定义清楚的词、跳过的关键步骤、说得太空的地方，或因过度简化而出现的错误，就追问。我如果只会说抽象原则，请让我举一个能说明它的简单例子；我解释含糊时，请让我把意思说完整。\n\n等我讲完，分别指出每个问题反映出我哪里没理解透，再让我重讲。重复到我能讲清楚。现在请我开始，并在第一轮就严格追问。",
      "page": 8
    }
  ]
};
  const LEVELS = 6;
  const hostId = 'codex-pp-prompt-deck';
  const controllerKey = '__codexPPPromptDeckCleanup';
  const positionKey = 'codex-pp-prompt-deck:position:v1';
  const fields = ['name', 'description', 'prompt'];
  const usable = (value) => typeof value === 'string' && value.trim().length > 0;
  if (!data || !Array.isArray(data.levels) || data.levels.length !== LEVELS ||
      data.levels.some((level) => !level || !fields.every((field) => usable(level[field]))) ||
      new Set(data.levels.map((level) => level.name.trim())).size !== LEVELS) {
    console.warn('[Codex++ Prompt Deck] Six unique levels with a name, description and prompt are required.');
    return;
  }

  function activate() {
    if (typeof window[controllerKey] === 'function') window[controllerKey]();
    let dispose = () => document.removeEventListener('DOMContentLoaded', start);
    const cleanup = () => {
      dispose();
      if (window[controllerKey] === cleanup) delete window[controllerKey];
    };
    function start() { dispose = mount(); }
    window[controllerKey] = cleanup;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
    return cleanup;
  }

  function mount() {
    document.getElementById(hostId)?.remove();
    const host = document.createElement('aside');
    host.id = hostId;
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial; position: fixed; top: 65px; right: 15px;
          z-index: 2147482999; display: block;
          font-family: inherit; font-size: 13px; line-height: 1.45;
          --pd-surface: var(--color-token-main-surface-primary, #f8fafb);
          --pd-fg: var(--color-token-text-primary, var(--color-token-foreground, #182630));
          --pd-muted: var(--color-token-foreground-secondary, #596a76);
          --pd-accent: #0f7556;
          --pd-soft: #dff3e8;
          --pd-border: color-mix(in srgb, var(--pd-fg) 15%, transparent);
          --pd-hover: color-mix(in srgb, var(--pd-fg) 8%, var(--pd-surface));
          --pd-code: color-mix(in srgb, var(--pd-fg) 5%, var(--pd-surface));
          --pd-shadow: 0 8px 26px #101b2426;
          color: var(--pd-fg);
        }
        @media (prefers-color-scheme: dark) {
          :host { --pd-surface: var(--color-token-main-surface-primary, #181b20);
            --pd-fg: var(--color-token-text-primary, var(--color-token-foreground, #edf2f3));
            --pd-muted: var(--color-token-foreground-secondary, #a6b2bb);
            --pd-accent: #a4efc7; --pd-soft: #263e34; --pd-shadow: 0 8px 30px #0005; }
        }
        :host([data-theme="light"]) { --pd-surface: var(--color-token-main-surface-primary, #f8fafb);
          --pd-fg: var(--color-token-text-primary, var(--color-token-foreground, #182630));
          --pd-muted: var(--color-token-foreground-secondary, #596a76);
          --pd-accent: #0f7556; --pd-soft: #dff3e8; --pd-shadow: 0 8px 26px #101b2426; }
        :host([data-theme="dark"]) { --pd-surface: var(--color-token-main-surface-primary, #181b20);
          --pd-fg: var(--color-token-text-primary, var(--color-token-foreground, #edf2f3));
          --pd-muted: var(--color-token-foreground-secondary, #a6b2bb);
          --pd-accent: #a4efc7; --pd-soft: #263e34; --pd-shadow: 0 8px 30px #0005; }
        *, *::before, *::after { box-sizing: border-box; }
        [hidden] { display: none !important; }
        button { font: inherit; color: inherit; cursor: pointer; -webkit-app-region: no-drag; }
        button:focus-visible { outline: 2px solid var(--pd-accent); outline-offset: 2px; }
        #dock { display: inline-flex; align-items: stretch; border: 1px solid var(--pd-border);
          border-radius: 11px; background: var(--pd-surface); box-shadow: 0 2px 8px #0d243218; }
        #grip { appearance: none; flex: 0 0 25px; display: grid; place-items: center; width: 25px;
          background: transparent; border: 0; border-radius: 10px 0 0 10px; padding: 0;
          color: var(--pd-muted); cursor: grab; touch-action: none; }
        #grip:hover { color: var(--pd-fg); background: var(--pd-hover); }
        :host([data-dragging]) #grip { cursor: grabbing; }
        :host([data-dragging]) { user-select: none; }
        #chip {
          appearance: none; display: flex; align-items: center; gap: 8px; height: 35px;
          max-width: min(290px, calc(100vw - 58px)); padding: 5px 9px 5px 2px;
          border: 0; border-radius: 0 10px 10px 0;
          background: transparent; white-space: nowrap;
        }
        #chip:hover, #chip[aria-expanded="true"] { background: var(--pd-hover); }
        .mark { display: grid; width: 24px; height: 24px; flex: 0 0 24px; place-items: center;
          border-radius: 7px; background: var(--pd-soft); color: var(--pd-accent); }
        .mark svg { width: 14px; height: 14px; }
        .name { overflow: hidden; text-overflow: ellipsis; font-weight: 650; text-align: left; }
        .count { flex: none; color: var(--pd-muted); font-size: 11px;
          font-variant-numeric: tabular-nums; letter-spacing: .02em; }
        .chevron { flex: none; color: var(--pd-muted); }
        #chip[aria-expanded="true"] .chevron { transform: rotate(180deg); }
        #demoChip { font-size: 10px; flex: none; color: var(--pd-accent); }
        #panel {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: min(396px, calc(100vw - 30px)); max-height: calc(100vh - 120px);
          display: flex; flex-direction: column; background: var(--pd-surface);
          border: 1px solid var(--pd-border); border-radius: 14px;
          box-shadow: var(--pd-shadow); overflow: hidden;
        }
        header { padding: 13px 13px 10px 15px; border-bottom: 1px solid var(--pd-border); }
        .header-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        #deckTitle { margin: 0; color: var(--pd-muted); font-size: 11px; font-weight: 650; }
        #close { display: grid; place-items: center; width: 28px; height: 28px;
          border-radius: 7px; border: 1px solid transparent; background: transparent;
          color: var(--pd-muted); padding: 0; }
        #close:hover { background: var(--pd-hover); color: var(--pd-fg); }
        #levelHeading { margin: 1px 0 10px; font-size: 17px; font-weight: 680;
          line-height: 1.3; overflow-wrap: anywhere; }
        .levels { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; }
        .step { display: block; position: relative; height: 20px; border: 0; background: transparent; padding: 0; border-radius: 5px; }
        .step::before { content: ''; position: absolute; left: 0; right: 0; top: 8px; height: 4px;
          border-radius: 999px; background: var(--pd-border); }
        .step:hover::before { background: var(--pd-muted); }
        .step[aria-current="step"]::before { background: var(--pd-accent); }
        #demoNotice { margin: 7px 0 0; font-size: 11px; color: var(--pd-accent); }
        #body { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 13px 15px 15px; }
        .section-name { margin: 0 0 5px; color: var(--pd-muted); font-size: 11px; font-weight: 650; }
        #description { margin: 0 0 13px; font-size: 13px; white-space: pre-wrap; overflow-wrap: anywhere; }
        #prompt { margin: 0; padding: 11px 12px; border-radius: 9px; border: 1px solid var(--pd-border);
          background: var(--pd-code); color: var(--pd-fg); white-space: pre-wrap; overflow-wrap: anywhere;
          font: inherit; user-select: text; }
        footer { min-height: 49px; flex: none; padding: 8px 13px 8px 15px;
          border-top: 1px solid var(--pd-border); display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        #feedback { font-size: 11px; color: var(--pd-muted); }
        .footer-actions { display: flex; align-items: center; gap: 5px; }
        #reset { flex: none; border-radius: 8px; border: 1px solid transparent; padding: 6px 7px;
          background: transparent; color: var(--pd-muted); font-size: 11px; white-space: nowrap; }
        #reset:hover { background: var(--pd-hover); color: var(--pd-fg); }
        #copy { flex: none; border-radius: 8px; border: 1px solid var(--pd-border); padding: 6px 10px;
          color: var(--pd-accent); background: var(--pd-soft); font-size: 12px; font-weight: 650; }
        #copy:hover { filter: contrast(1.15); }
        @media (max-height: 375px) { :host { top: 44px; } #panel { max-height: calc(100vh - 96px); } }
      </style>
      <div id="dock">
      <button id="grip" type="button" aria-label="拖动浮窗，方向键移动，Home 复位"
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home" title="拖动浮窗 · 方向键移动 · Home 复位">
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true"><circle cx="4" cy="4" r="1.1"/><circle cx="8" cy="4" r="1.1"/><circle cx="4" cy="8" r="1.1"/><circle cx="8" cy="8" r="1.1"/><circle cx="4" cy="12" r="1.1"/><circle cx="8" cy="12" r="1.1"/></svg>
      </button>
      <button id="chip" type="button" aria-expanded="false" aria-controls="panel">
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4 8 1.5Z" fill="currentColor"/></svg></span>
        <span class="name" id="name"></span><span class="count" id="count"></span>
        <span id="demoChip" hidden>演示</span>
        <svg class="chevron" viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      </div>
      <section id="panel" role="region" aria-labelledby="levelHeading" hidden>
        <header>
          <div class="header-top">
            <p id="deckTitle"></p>
            <button id="close" type="button" aria-label="收起提示词" title="收起（Esc）"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          </div>
          <h2 id="levelHeading"></h2>
          <div class="levels" id="steps" role="group" aria-label="六个等级"></div>
          <p id="demoNotice" hidden>演示数据 · 不是笔记原文</p>
        </header>
        <div id="body" tabindex="0" aria-label="适用场景与提示词正文">
          <h3 class="section-name">适用场景</h3>
          <p id="description"></p>
          <h3 class="section-name">提示词</h3>
          <pre id="prompt"></pre>
        </div>
        <footer>
          <span id="feedback" role="status" aria-live="polite">在等级名上滚动切换</span>
          <div class="footer-actions">
            <button id="reset" type="button" aria-label="复位浮窗位置" title="恢复到窗口右上方">复位</button>
            <button id="copy" type="button">复制提示词</button>
          </div>
        </footer>
      </section>
    `;

    const pick = (id) => shadow.getElementById(id);
    const chip = pick('chip');
    const dock = pick('dock');
    const grip = pick('grip');
    const panel = pick('panel');
    const copy = pick('copy');
    const feedback = pick('feedback');
    let index = 0;
    let wheel = 0;
    let wheelTime = 0;
    let feedbackTimer;
    const idle = '在等级名上滚动切换';
    const edge = 15;
    const gap = 8;
    let preferred = readPosition();
    let drag = null;

    const steps = data.levels.map((level, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'step';
      button.title = level.name;
      button.setAttribute('aria-label', `${i + 1}：${level.name}`);
      button.addEventListener('click', () => select(i));
      pick('steps').append(button);
      return button;
    });
    pick('deckTitle').textContent = usable(data.title) ? data.title : '提示词面板';
    pick('demoChip').hidden = pick('demoNotice').hidden = data.demo !== true;

    function select(next) {
      index = (next + LEVELS) % LEVELS;
      const level = data.levels[index];
      const position = `${String(index + 1).padStart(2, '0')} / 06`;
      pick('name').textContent = level.name;
      pick('count').textContent = position;
      pick('levelHeading').textContent = level.name;
      pick('description').textContent = level.description;
      pick('prompt').textContent = level.prompt;
      chip.title = `${level.name} · ${position}（滚轮或方向键切换，点击展开）`;
      chip.setAttribute('aria-label', `${level.name}，第 ${index + 1} 级，共 6 级`);
      steps.forEach((step, i) => i === index ? step.setAttribute('aria-current', 'step') : step.removeAttribute('aria-current'));
      pick('body').scrollTop = 0;
      clearTimeout(feedbackTimer);
      feedback.textContent = idle;
      layout();
    }

    function setOpen(open, restoreFocus = false) {
      chip.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      layout();
      if (restoreFocus) chip.focus({ preventScroll: true });
    }

    function readPosition() {
      try {
        const value = JSON.parse(window.localStorage.getItem(positionKey));
        if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value;
      } catch (_) { /* Positions are optional when local storage is unavailable. */ }
      return null;
    }

    function savePosition() {
      try {
        if (preferred) window.localStorage.setItem(positionKey, JSON.stringify(preferred));
        else window.localStorage.removeItem(positionKey);
      } catch (_) { /* Moving the panel still works without persistence. */ }
    }

    function clamp(value, minimum, maximum) {
      return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
    }

    function layout() {
      if (!host.isConnected) return;
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const vh = document.documentElement.clientHeight || window.innerHeight;
      const { width, height } = dock.getBoundingClientRect();
      const defaultX = vw - edge - width;
      const defaultY = vh <= 375 ? 44 : 65;
      const x = clamp(preferred?.x ?? defaultX, edge, vw - edge - width);
      const y = clamp(preferred?.y ?? defaultY, edge, vh - edge - height);
      host.style.left = `${x}px`;
      host.style.right = 'auto';
      host.style.top = `${y}px`;
      const panelWidth = Math.min(396, Math.max(0, vw - 2 * edge));
      const panelX = clamp(x + width - panelWidth, edge, vw - edge - panelWidth);
      const below = vh - y - height - edge - gap;
      const above = y - edge - gap;
      const opensUp = below < Math.min(300, above);
      panel.style.width = `${panelWidth}px`;
      panel.style.left = `${panelX - x}px`;
      panel.style.right = 'auto';
      panel.style.top = opensUp ? 'auto' : `calc(100% + ${gap}px)`;
      panel.style.bottom = opensUp ? `calc(100% + ${gap}px)` : 'auto';
      panel.style.maxHeight = `${Math.max(0, opensUp ? above : below)}px`;
    }

    function resetPosition() {
      preferred = null;
      savePosition();
      layout();
      message('已恢复浮窗位置');
    }

    function startDrag(event) {
      if (!event.isPrimary || event.button !== 0 || drag) return;
      const bounds = dock.getBoundingClientRect();
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY,
        left: bounds.left, top: bounds.top, previous: preferred, moved: false };
      grip.focus({ preventScroll: true });
      grip.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    }

    function moveDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      host.dataset.dragging = '';
      preferred = { x: drag.left + dx, y: drag.top + dy };
      layout();
      event.preventDefault();
      event.stopPropagation();
    }

    function endDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      if (drag.moved) {
        if (event.type === 'pointercancel') preferred = drag.previous;
        else {
          const { left, top } = dock.getBoundingClientRect();
          preferred = { x: left, y: top };
          savePosition();
        }
      }
      drag = null;
      delete host.dataset.dragging;
      layout();
      event.stopPropagation();
    }

    function outside(event) {
      if (!panel.hidden && !event.composedPath().includes(host)) setOpen(false);
    }

    function message(text) {
      feedback.textContent = text;
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => { feedback.textContent = idle; }, 2500);
    }

    async function copyPrompt() {
      const value = data.levels[index].prompt;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(value);
        message('已复制提示词');
        return;
      } catch (_) {
        const temporary = document.createElement('textarea');
        temporary.value = value;
        temporary.setAttribute('readonly', '');
        temporary.style.cssText = 'position:fixed;left:-10000px;top:0;';
        shadow.append(temporary);
        let ok = false;
        try { temporary.select(); ok = document.execCommand('copy'); }
        catch (_) { /* The visible prompt remains selectable. */ }
        finally { temporary.remove(); copy.focus({ preventScroll: true }); }
        message(ok ? '已复制提示词' : '无法访问剪贴板，请选中正文后手动复制');
      }
    }

    function updateTheme() {
      const nodes = [document.documentElement, document.body].filter(Boolean);
      for (const node of nodes) {
        const theme = node.getAttribute('data-theme') ?? node.getAttribute('data-color-mode');
        if (theme === 'dark' || theme === 'light') { host.dataset.theme = theme; return; }
        if (node.classList.contains('dark') || node.classList.contains('light')) {
          host.dataset.theme = node.classList.contains('dark') ? 'dark' : 'light'; return;
        }
      }
      delete host.dataset.theme;
    }

    chip.addEventListener('click', () => setOpen(panel.hidden));
    pick('close').addEventListener('click', () => setOpen(false, true));
    pick('reset').addEventListener('click', resetPosition);
    copy.addEventListener('click', copyPrompt);
    grip.addEventListener('pointerdown', startDrag);
    grip.addEventListener('pointermove', moveDrag);
    grip.addEventListener('pointerup', endDrag);
    grip.addEventListener('pointercancel', endDrag);
    grip.addEventListener('lostpointercapture', endDrag);
    grip.addEventListener('keydown', (event) => {
      const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (event.key !== 'Home' && !Object.prototype.hasOwnProperty.call(moves, event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Home') { resetPosition(); return; }
      const [dx, dy] = moves[event.key];
      const step = event.shiftKey ? 24 : 8;
      const { left, top } = dock.getBoundingClientRect();
      preferred = { x: left + dx * step, y: top + dy * step };
      layout();
      const current = dock.getBoundingClientRect();
      preferred = { x: current.left, y: current.top };
      savePosition();
    });
    chip.addEventListener('wheel', (event) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      const now = performance.now();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 64 : 1);
      if (now - wheelTime > 200 || Math.sign(wheel) !== Math.sign(delta)) wheel = 0;
      wheel += delta;
      wheelTime = now;
      if (Math.abs(wheel) >= 40) { select(index + Math.sign(wheel)); wheel = 0; }
    }, { passive: false });
    chip.addEventListener('keydown', (event) => {
      const actions = { ArrowDown: index + 1, ArrowRight: index + 1,
        ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: LEVELS - 1 };
      if (Object.prototype.hasOwnProperty.call(actions, event.key)) {
        event.preventDefault(); event.stopPropagation(); select(actions[event.key]);
      }
    });
    shadow.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault(); event.stopPropagation(); setOpen(false, true);
      }
    });
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('resize', layout);
    const themeObserver = new MutationObserver(updateTheme);
    for (const node of [document.documentElement, document.body].filter(Boolean)) {
      themeObserver.observe(node, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-color-mode'] });
    }
    select(0);
    updateTheme();
    (document.body ?? document.documentElement).append(host);
    const sizeObserver = new ResizeObserver(layout);
    sizeObserver.observe(dock);
    layout();
    return () => {
      clearTimeout(feedbackTimer);
      themeObserver.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener('resize', layout);
      document.removeEventListener('pointerdown', outside, true);
      host.remove();
    };
  }

  if (typeof window.codexPlus?.extension === 'function') {
    window.codexPlus.extension((ctx) => ctx.effect(activate));
  } else {
    const cleanup = activate();
    window.__codexPlusUserScripts?.registerCleanup?.(cleanup);
  }
})();
