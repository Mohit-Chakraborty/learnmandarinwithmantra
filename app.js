(() => {
  "use strict";
  const D = window.DATA;

  /* ---------- Config ---------- */
  const LEVELS = [
    { id: "beginner", name: "Beginner", zh: "初学", py: "chūxué", desc: "Never studied Mandarin? Start here. Pinyin hints on every question." },
    { id: "early", name: "Early learner", zh: "进步", py: "jìnbù", desc: "You know the basics. Hints fade and pronunciation questions appear." },
    { id: "expert", name: "Expert", zh: "高手", py: "gāoshǒu", desc: "No hints. Listening challenges, idioms and very big numbers." }
  ];
  const CATS = [
    { id: "characters", name: "Characters", zh: "字", py: "zì", blurb: "Single characters and the pictures hidden inside them." },
    { id: "words", name: "Words", zh: "词", py: "cí", blurb: "Everyday vocabulary you'll hear and use." },
    { id: "phrases", name: "Phrases", zh: "句", py: "jù", blurb: "Ready-made sentences for real conversations." },
    { id: "numbers", name: "Numbers", zh: "数", py: "shù", blurb: "A simple, logical system for counting, prices and dates." },
    { id: "tones", name: "Tones", zh: "声", py: "shēng", blurb: "Train your ear to tell mā, má, mǎ and mà apart." }
  ];
  // Categories whose progress is a best score rather than a count of mastered items.
  const SCORED = ["numbers", "tones"];
  // Words the learner saved from the lookup page. Not shown as a home card.
  const MYCAT = { id: "mywords", name: "My words", zh: "我的", py: "wǒ de" };
  const RANKS = [
    [0, "新手", "Newcomer"], [100, "学生", "Student"], [300, "学者", "Scholar"],
    [700, "高手", "Adept"], [1500, "大师", "Master"], [3000, "龙", "Dragon"]
  ];
  const PRAISE = ["太好了! Great!", "对了! Correct!", "真棒! Awesome!", "很好! Very good!", "厉害! Impressive!"];
  const COMFORT = ["Almost! Here's the answer.", "Not quite. You'll get it next time.", "Good try! Take a look:", "Mistakes help it stick. Here it is:"];
  const QUIZ_LEN = 10;

  /* ---------- Storage ---------- */
  const KEY = "xiaobu-progress-v1";
  const defaults = { level: "beginner", xp: 0, streak: 0, lastDay: null, mastery: {}, best: {}, answered: 0, correct: 0, saved: [] };
  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, defaults); }
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }

  const dayStr = (d) => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
  function touchStreak() {
    const t = dayStr(new Date());
    if (S.lastDay === t) return;
    S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1;
    S.lastDay = t;
  }
  const currentStreak = () => (S.lastDay === dayStr(new Date()) || S.lastDay === yesterday()) ? S.streak : 0;

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const app = $("#app");
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const levelOf = (id) => LEVELS.find((l) => l.id === id);
  const catOf = (id) => CATS.find((c) => c.id === id) || (id === MYCAT.id ? MYCAT : undefined);
  // Size class for big characters. Saved words vary in length, so size them by character count.
  const sz = (cat, hz) => {
    if (cat !== MYCAT.id) return cat;
    const n = [...hz].length;
    return n <= 1 ? "characters" : n <= 3 ? "words" : "phrases";
  };
  const mkey = (cat, hz) => cat + ":" + hz;

  function rank(xp) {
    let r = RANKS[0], next = null;
    for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i][0]) { r = RANKS[i]; next = RANKS[i + 1] || null; } }
    return { zh: r[1], en: r[2], from: r[0], to: next ? next[0] : null, nextName: next ? next[2] : null };
  }

  /* ---------- Tones ---------- */
  const MARKS = { 1: "āēīōūǖĀĒĪŌŪǕ", 2: "áéíóúǘÁÉÍÓÚǗ", 3: "ǎěǐǒǔǚǍĚǏǑǓǙ", 4: "àèìòùǜÀÈÌÒÙǛ" };
  function toneOf(s) { for (const t of [1, 2, 3, 4]) for (const ch of MARKS[t]) if (s.includes(ch)) return t; return 5; }
  const colorPy = (py) => py.split(" ").map((s) => `<span class="t${toneOf(s)}">${esc(s)}</span>`).join(" ");
  function colorHz(hz, py) {
    const syl = py.split(" "), chars = [...hz];
    if (syl.length !== chars.length) return esc(hz);
    return chars.map((c, i) => `<span class="t${toneOf(syl[i])}">${esc(c)}</span>`).join("");
  }
  const TONE_NAMES = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "neutral" };
  const MARK_CODES = { 1: "̄", 2: "́", 3: "̌", 4: "̀" };
  const plainSyl = (s) => s.normalize("NFD").replace(/[̀́̄̌]/g, "").normalize("NFC");
  const plainPy = (py) => py.split(" ").map(plainSyl).join(" ");
  const tonesOf = (py) => py.split(" ").map(toneOf);
  // Put a tone mark on a toneless syllable, following the standard pinyin placement rules.
  function withTone(base, t) {
    if (!MARK_CODES[t]) return base;
    const low = base.toLowerCase();
    let i = low.indexOf("a");
    if (i < 0) i = low.indexOf("e");
    if (i < 0 && low.includes("ou")) i = low.indexOf("o");
    if (i < 0) for (let k = low.length - 1; k >= 0; k--) if ("aeiouü".includes(low[k])) { i = k; break; }
    if (i < 0) return base;
    return (base.slice(0, i + 1) + MARK_CODES[t] + base.slice(i + 1)).normalize("NFC");
  }
  // Phrases have punctuation and joined words, so they are shown uncolored.
  const pyHtml = (cat, py) => cat === "phrases" ? esc(py) : colorPy(py);
  const hzHtml = (cat, it) => cat === "phrases" || it.ph ? esc(it.hz) : colorHz(it.hz, it.py);

  /* ---------- Numbers ---------- */
  const DIG = "零一二三四五六七八九";
  const PY = { "零": "líng", "一": "yī", "二": "èr", "两": "liǎng", "三": "sān", "四": "sì", "五": "wǔ", "六": "liù", "七": "qī", "八": "bā", "九": "jiǔ", "十": "shí", "百": "bǎi", "千": "qiān", "万": "wàn" };
  function section(n, leading) {
    const units = ["千", "百", "十", ""];
    const ds = String(n).padStart(4, "0").split("").map(Number);
    let out = "", started = false, zero = false;
    ds.forEach((d, i) => {
      if (d === 0) { if (started) zero = true; return; }
      if (zero) { out += "零"; zero = false; }
      let ch = DIG[d];
      if (leading && !started && d === 2 && (units[i] === "千" || units[i] === "百")) ch = "两";
      if (leading && !started && d === 1 && units[i] === "十") ch = "";
      out += ch + units[i];
      started = true;
    });
    return out;
  }
  function numZh(n) {
    if (n === 0) return "零";
    if (n < 10000) return section(n, true);
    const hi = Math.floor(n / 10000), lo = n % 10000;
    let s = section(hi, true);
    if (hi === 2) s = "两";
    s += "万";
    if (lo) s += (lo < 1000 ? "零" : "") + section(lo, false);
    return s;
  }
  const numPy = (zh) => [...zh].map((c) => PY[c]).join(" ");
  const fmt = (n) => n.toLocaleString("en-US");
  const numItem = (n) => { const hz = numZh(n); return { hz, py: numPy(hz), en: fmt(n), n }; };

  const RANGE = { beginner: [0, 10], early: [11, 999], expert: [1000, 99999999] };
  function randNum(level) {
    if (level === "beginner") return rand(11);
    if (level === "early") return Math.random() < 0.4 ? 11 + rand(89) : 100 + rand(900);
    const len = 4 + rand(5);
    let s = String(1 + rand(9));
    for (let i = 1; i < len; i++) s += Math.random() < 0.45 ? "0" : String(1 + rand(9));
    return Number(s);
  }
  function numDistractors(n, level) {
    const [lo, hi] = RANGE[level], set = new Set([n]), out = [];
    const add = (x) => { if (Number.isInteger(x) && x >= lo && x <= hi && !set.has(x)) { set.add(x); out.push(x); } };
    let guard = 0;
    while (out.length < 3 && guard++ < 200) {
      if (level === "beginner") { add(rand(11)); continue; }
      const s = String(n).split(""), r = rand(4);
      if (r === 0) { const i = rand(s.length); s[i] = String((Number(s[i]) + 1 + rand(8)) % 10); if (s[0] !== "0") add(Number(s.join(""))); }
      else if (r === 1 && s.length > 1) { const i = rand(s.length - 1); [s[i], s[i + 1]] = [s[i + 1], s[i]]; if (s[0] !== "0") add(Number(s.join(""))); }
      else if (r === 2) { add(n * 10); add(Math.floor(n / 10)); }
      else { add(Number(s.slice().reverse().join(""))); add(randNum(level)); }
    }
    while (out.length < 3) add(lo + rand(hi - lo + 1));
    return out;
  }

  /* ---------- Speech ---------- */
  const tts = {
    voice: null,
    init() {
      if (!("speechSynthesis" in window)) return;
      const pick = () => {
        const vs = speechSynthesis.getVoices();
        this.voice = vs.find((v) => /zh[-_]CN/i.test(v.lang)) || vs.find((v) => /^(zh|cmn)/i.test(v.lang)) || null;
      };
      pick();
      speechSynthesis.addEventListener("voiceschanged", pick);
    },
    ok() { return !!this.voice; },
    say(text, rate = 0.8) {
      if (!this.ok()) { toast("Audio needs a Chinese voice. Try Chrome, Edge or Safari, or add one in your system settings."); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = this.voice; u.lang = this.voice.lang; u.rate = rate;
      speechSynthesis.speak(u);
    }
  };
  tts.init();

  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  const speakerSvg = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>`;
  const speakBtn = (text, label = "Listen") => `<button class="speak" data-say="${esc(text)}" aria-label="${label}" title="${label}">${speakerSvg}</button>`;

  /* ---------- Writing practice (stroke order) ---------- */
  const penSvg = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
  const writeBtn = (hz) => `<button class="speak write" data-write="${esc(hz)}" aria-label="Practice writing ${esc(hz)}" title="Practice writing">${penSvg}</button>`;
  const canWrite = (cat) => cat === "characters" || cat === "words" || cat === "tones" || cat === MYCAT.id;
  const HAN = /[\u3400-\u9fff]/;
  function findItem(hz) {
    for (const cat of ["characters", "words"]) for (const l of LEVELS) {
      const it = D[cat][l.id].find((x) => x.hz === hz);
      if (it) return it;
    }
    const saved = S.saved.find((x) => x.hz === hz);
    if (saved) return saved;
    const e = dict && dict.find((x) => x.hz === hz);
    return e ? { hz: e.hz, py: e.py, en: e.short } : null;
  }
  let writer = null, writerChars = [], writerIdx = 0, writerReturn = null;
  const writerOpen = () => $("#writer").classList.contains("show");
  const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  function openWriter(hz) {
    const it = findItem(hz) || { hz, py: "", en: "" };
    writerChars = [...it.hz].filter((c) => HAN.test(c));
    if (!writerChars.length) return;
    writerReturn = document.activeElement;
    const box = $("#writer");
    box.innerHTML = `
      <div class="w-card" role="dialog" aria-modal="true" aria-labelledby="wTitle">
        <button class="w-x" id="wClose" aria-label="Close">✕</button>
        <p class="eyebrow" id="wTitle">Write it · 写</p>
        <div class="w-word">${it.py && !it.ph ? colorHz(it.hz, it.py) : esc(it.hz)}<span class="w-mean">${esc(it.py)}${it.en ? " · " + esc(it.en) : ""}</span></div>
        ${writerChars.length > 1 ? `<div class="w-tabs">${writerChars.map((c, k) => `<button class="w-tab" data-wi="${k}" aria-label="Character ${k + 1}: ${esc(c)}">${esc(c)}</button>`).join("")}</div>` : ""}
        <div class="w-pad" id="wPad">
          <svg class="w-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L100 100M100 0L0 100M50 0V100M0 50H100"/></svg>
          <div id="wTarget"></div>
        </div>
        <p class="w-msg" id="wMsg" aria-live="polite"></p>
        <div class="w-ctl">
          <button class="btn soft" id="wWatch">Watch strokes</button>
          <button class="btn primary" id="wQuiz">Write it yourself</button>
        </div>
      </div>`;
    box.classList.add("show");
    document.body.classList.add("modal-open");
    $("#wClose").addEventListener("click", closeWriter);
    $("#wWatch").addEventListener("click", watchStrokes);
    $("#wQuiz").addEventListener("click", startWriting);
    box.querySelectorAll("[data-wi]").forEach((b) => b.addEventListener("click", () => loadWriterChar(+b.dataset.wi)));
    $("#wClose").focus();
    loadWriterChar(0);
  }

  function loadWriterChar(k) {
    writerIdx = k;
    document.querySelectorAll(".w-tab").forEach((b, j) => b.classList.toggle("on", j === k));
    const target = $("#wTarget"), pad = $("#wPad");
    target.innerHTML = "";
    const size = Math.max(180, Math.min(280, window.innerWidth - 100));
    pad.style.width = pad.style.height = size + "px";
    if (!window.HanziWriter) {
      writer = null;
      $("#wMsg").textContent = "Writing practice couldn't load. Check your connection and try again.";
      return;
    }
    $("#wMsg").textContent = "Loading strokes…";
    writer = HanziWriter.create(target, writerChars[k], {
      width: size, height: size, padding: 14,
      showOutline: true, showCharacter: true,
      strokeColor: cssVar("--ink"), outlineColor: cssVar("--line"),
      drawingColor: cssVar("--red"), highlightColor: cssVar("--jade"),
      strokeAnimationSpeed: 1, delayBetweenStrokes: 250,
      // Lesson characters are bundled with the site; anything else (e.g. from the lookup page)
      // comes from the same data set on the jsDelivr CDN.
      charDataLoader: (c, onLoad, onError) => {
        const get = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
        get("strokes/" + encodeURIComponent(c) + ".json")
          .catch(() => get("https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/" + encodeURIComponent(c) + ".json"))
          .then(onLoad).catch(onError);
      },
      onLoadCharDataSuccess: (data) => {
        const n = data.strokes.length;
        $("#wMsg").textContent = `${n} stroke${n === 1 ? "" : "s"}. Watch the order, then write it yourself.`;
      },
      onLoadCharDataError: () => {
        $("#wMsg").textContent = "Sorry, the strokes for this character couldn't be loaded.";
      }
    });
    watchStrokes();
  }

  function watchStrokes() {
    if (!writer) return;
    writer.cancelQuiz();
    writer.showOutline();
    writer.animateCharacter();
  }

  function startWriting() {
    if (!writer) return;
    const expert = S.level === "expert";
    if (expert) writer.hideOutline(); else writer.showOutline();
    $("#wMsg").textContent = expert ? "Write it from memory. A hint appears after 3 misses." : "Trace each stroke over the gray outline, in order.";
    const w = writer;
    writer.quiz({
      showHintAfterMisses: 3,
      onMistake: () => { if (w === writer) $("#wMsg").textContent = "Not quite. Try that stroke again: check its start point and direction."; },
      onCorrectStroke: (d) => { if (w === writer && d.strokesRemaining) $("#wMsg").textContent = `Good. ${d.strokesRemaining} to go.`; },
      onComplete: (d) => {
        if (w !== writer) return;
        const gained = d.totalMistakes <= 2 ? 5 : 2;
        touchStreak(); S.xp += gained; save(); renderHeader();
        const more = writerIdx < writerChars.length - 1;
        $("#wMsg").innerHTML = `<b>${d.totalMistakes === 0 ? "完美! Perfect!" : "写好了! Well done!"}</b> ${d.totalMistakes} mistake${d.totalMistakes === 1 ? "" : "s"} · +${gained} XP${more ? " · next character…" : ""}`;
        if (more) setTimeout(() => { if (w === writer && writerOpen()) loadWriterChar(writerIdx + 1); }, 1600);
      }
    });
  }

  function closeWriter() {
    if (!writerOpen()) return;
    if (writer) { try { writer.cancelQuiz(); } catch (e) { /* already stopped */ } }
    writer = null;
    const box = $("#writer");
    box.classList.remove("show");
    box.innerHTML = "";
    document.body.classList.remove("modal-open");
    if (writerReturn && document.contains(writerReturn)) writerReturn.focus({ preventScroll: true });
  }

  /* ---------- Pools & progress ---------- */
  function pool(cat, level) {
    if (cat === "numbers") return D.numberStudy[level].map(numItem);
    if (cat === "tones") return tonePool(level);
    if (cat === MYCAT.id) return S.saved;
    return D[cat][level];
  }
  function masteredCount(cat, level) {
    return pool(cat, level).filter((it) => (S.mastery[mkey(cat, it.hz)] || 0) >= 3).length;
  }
  function totalMastered() {
    let n = 0;
    for (const c of CATS) if (!SCORED.includes(c.id)) for (const l of LEVELS) n += masteredCount(c.id, l.id);
    return n;
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    const r = rank(S.xp);
    const pct = r.to ? Math.round(((S.xp - r.from) / (r.to - r.from)) * 100) : 100;
    $("#stats").innerHTML = `
      <div class="stat" title="Day streak"><span class="stat-ico flame">火</span><b>${currentStreak()}</b><span class="stat-lbl">day streak</span></div>
      <div class="stat rank" title="${r.to ? (r.to - S.xp) + " XP to " + r.nextName : "Top rank!"}">
        <span class="stat-ico seal">${r.zh}</span>
        <div class="rank-body"><b>${S.xp} XP</b><span class="stat-lbl">${r.en}</span>
          <div class="xpbar"><i style="width:${pct}%"></i></div></div>
      </div>`;
  }

  /* ---------- Home ---------- */
  function wordOfDay() {
    const all = [];
    for (const cat of ["characters", "words"]) for (const lv of ["beginner", "early"]) D[cat][lv].forEach((it) => all.push({ it, cat }));
    const d = new Date(); const seed = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    return all[(seed * 7) % all.length];
  }

  function renderHome() {
    const lv = levelOf(S.level);
    const w = wordOfDay();
    app.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">Mandarin in little steps · 小步 xiǎobù</p>
        <h1>Learn Mandarin one small step at a time.</h1>
        <p class="lede">No experience needed. Meet a character, hear how it sounds, see the picture inside it, then test yourself. Ten questions take about two minutes.</p>
        <div class="hero-cta">
          <a class="btn primary" href="#/learn/characters">Start learning</a>
          <a class="btn ghost" href="#/tones">The 4 tones in 60 seconds</a>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <svg class="mountains" viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
          <path d="M0 220 L0 150 Q60 80 110 130 Q150 60 210 120 Q260 40 320 110 Q360 80 400 120 L400 220Z" class="m1"/>
          <path d="M0 220 L0 180 Q80 120 150 170 Q220 110 290 165 Q350 135 400 160 L400 220Z" class="m2"/>
        </svg>
        <div class="sun"></div>
        <div class="hero-glyph"><span class="t3">你</span><span class="t3">好</span></div>
        <div class="hero-py"><span class="t3">nǐ</span> <span class="t3">hǎo</span> · hello</div>
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Choose your level</h2>
        <p>You can switch at any time. Your progress is saved separately for each level.</p>
      </div>
      <div class="levels" role="radiogroup" aria-label="Experience level">
        ${LEVELS.map((l, i) => `
          <button class="level ${l.id === S.level ? "on" : ""}" role="radio" aria-checked="${l.id === S.level}" data-level="${l.id}">
            <span class="level-steps">${"<i></i>".repeat(i + 1)}${"<i class='off'></i>".repeat(2 - i)}</span>
            <span class="level-zh">${l.zh}<small>${l.py}</small></span>
            <span class="level-name">${l.name}</span>
            <span class="level-desc">${l.desc}</span>
          </button>`).join("")}
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>What would you like to practice?</h2>
        <p>Study the cards first, then take a 10-question practice round. Level: <b>${lv.name}</b>.</p>
      </div>
      <div class="cats">
        ${CATS.map((c) => {
          const items = pool(c.id, S.level);
          const best = S.best[S.level + ":" + c.id];
          const scored = SCORED.includes(c.id);
          const m = scored ? null : masteredCount(c.id, S.level);
          const pct = scored ? (best || 0) : Math.round((m / items.length) * 100);
          const label = scored ? (best != null ? `Best score ${best}%` : "Not tried yet") : `${m} / ${items.length} mastered`;
          return `
          <article class="cat cat-${c.id}">
            <div class="cat-top">
              <div class="cat-glyph">${c.zh}<small>${c.py}</small></div>
              <div class="ring" style="--p:${pct}"><span>${pct}%</span></div>
            </div>
            <h3>${c.name}</h3>
            <p>${c.blurb}</p>
            <div class="cat-meta">${label}${best != null && !scored ? ` · best ${best}%` : ""}</div>
            <div class="cat-actions">
              <a class="btn soft" href="#/learn/${c.id}">Study</a>
              <a class="btn primary" href="#/quiz/${c.id}">Practice</a>
            </div>
          </article>`;
        }).join("")}
      </div>
    </section>

    <section class="block">
      <form class="panel lk-teaser" id="homeLookup" role="search">
        <div class="lk-teaser-text">
          <h2><label for="homeLookupInput">How do you say…?</label></h2>
          <p>Type any English word to see it in Mandarin, hear it and practice writing it.${S.saved.length ? ` You have <a href="#/lookup">${S.saved.length} saved word${S.saved.length === 1 ? "" : "s"}</a>.` : ""}</p>
        </div>
        <div class="lk-row">
          <input id="homeLookupInput" type="search" placeholder="e.g. water, friend, thank you" autocomplete="off" autocapitalize="off" spellcheck="false">
          <button class="btn primary" type="submit">Look up</button>
        </div>
      </form>
    </section>

    <section class="block split">
      <article class="panel wotd">
        <p class="eyebrow">Word of the day</p>
        <div class="wotd-body">
          <div class="wotd-hz">${hzHtml(w.cat, w.it)}</div>
          <div>
            <div class="wotd-py">${pyHtml(w.cat, w.it.py)} ${speakBtn(w.it.hz)}</div>
            <div class="wotd-en">${esc(w.it.en)}</div>
            ${w.it.note ? `<p class="wotd-note">${esc(w.it.note)}</p>` : ""}
          </div>
        </div>
      </article>
      <article class="panel journey">
        <p class="eyebrow">Your journey</p>
        <div class="journey-grid">
          <div><b>${totalMastered()}</b><span>items mastered</span></div>
          <div><b>${S.answered}</b><span>questions answered</span></div>
          <div><b>${S.answered ? Math.round((S.correct / S.answered) * 100) : 0}%</b><span>accuracy</span></div>
          <div><b>${currentStreak()}</b><span>day streak</span></div>
        </div>
        <p class="journey-tip">An item counts as <b>mastered</b> after 3 correct answers. Practice rounds bring up what you know least.</p>
      </article>
    </section>

    <section class="block guide">
      <div class="guide-card">
        <div class="guide-glyph">声调</div>
        <div>
          <h3>New to Mandarin? Read this first.</h3>
          <p>Mandarin is written in <b>characters</b> (汉字) and spelled out in the Latin alphabet with <b>pinyin</b>. Pinyin uses accent marks for the four <b>tones</b>: the same sound with a different pitch is a different word. Throughout the site tones have colors:
            <span class="chip t1">1st ā</span> <span class="chip t2">2nd á</span> <span class="chip t3">3rd ǎ</span> <span class="chip t4">4th à</span> <span class="chip t5">neutral a</span></p>
          <div class="guide-ctl"><a class="btn soft" href="#/tones">Hear the tones</a> <a class="btn primary" href="#/quiz/tones">Practice tones</a></div>
        </div>
      </div>
    </section>`;

    app.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => {
      S.level = b.dataset.level; save(); renderHome();
    }));
    const hl = $("#homeLookupInput");
    hl.addEventListener("focus", () => { loadDict().catch(() => {}); }, { once: true });
    $("#homeLookup").addEventListener("submit", (e) => {
      e.preventDefault();
      location.hash = "#/lookup/" + encodeURIComponent(hl.value.trim());
    });
  }

  /* ---------- Tones page ---------- */
  function renderTones() {
    app.innerHTML = `
    <section class="page-head">
      <a class="back" href="#/">← Home</a>
      <h1>The four tones <span class="zh-sub">四声</span></h1>
      <p class="lede">In Mandarin the pitch of your voice changes the meaning. Here is the syllable <b>ma</b> in each tone. Tap a card to hear it, then test your ear with tone practice.</p>
    </section>
    <div class="tone-grid">
      ${D.tones.map((t) => `
        <button class="tone t${t.n}" data-say="${t.hz}">
          <svg viewBox="0 0 120 70" class="contour" aria-hidden="true"><line x1="6" x2="114" y1="10" y2="10"/><line x1="6" x2="114" y1="62" y2="62"/><path d="${t.path}"/></svg>
          <span class="tone-num">${t.n === 5 ? "Neutral" : "Tone " + t.n}</span>
          <span class="tone-py">${t.py}</span>
          <span class="tone-hz">${t.hz}</span>
          <span class="tone-en">${t.en}</span>
          <span class="tone-how">${t.how}</span>
        </button>`).join("")}
    </div>
    <section class="block facts">
      <div class="fact"><b>1</b><p><b>Characters are pictures and parts.</b> Many started as drawings (山 mountain, 木 tree). Others combine parts: 女 woman + 子 child = 好 good.</p></div>
      <div class="fact"><b>2</b><p><b>Grammar is friendly.</b> No verb conjugations, no plurals, no genders. 我吃, 你吃, 他吃: I eat, you eat, he eats.</p></div>
      <div class="fact"><b>3</b><p><b>Tone colors help memory.</b> Watch the colors as you study and your brain will start to link pitch and character.</p></div>
    </section>
    <div class="center cta-row">
      <a class="btn primary big" href="#/quiz/tones">Test your ear: practice tones →</a>
      <a class="btn soft big" href="#/learn/characters">Start with your first characters</a>
    </div>`;
  }

  /* ---------- Study (flashcards) ---------- */
  let study = null;
  function renderLearn(cat) {
    const items = pool(cat, S.level);
    study = { cat, items, i: 0, flipped: false };
    drawLearn();
  }
  function drawLearn() {
    const { cat, items, i, flipped } = study;
    const c = catOf(cat), lv = levelOf(S.level), it = items[i];
    const isNum = cat === "numbers";
    const m = S.mastery[mkey(cat, it.hz)] || 0;
    const tips = isNum ? D.numberTips[S.level] : null;
    app.innerHTML = `
    <section class="page-head">
      <a class="back" href="#/">← Home</a>
      <h1>${c.name} <span class="zh-sub">${c.zh}</span></h1>
      <p class="lede">${lv.name} · Tap the card to flip it. Use ← → keys or swipe.${canWrite(cat) ? " Tap the pen to practice writing." : ""}</p>
    </section>
    ${tips ? `<div class="tips">${tips.map((t) => `<div class="tip"><b>${esc(t[0])}</b><span>${esc(t[1])}</span></div>`).join("")}</div>` : ""}
    <div class="study">
      <div class="counter"><span>${i + 1}</span> / ${items.length}</div>
      <div class="flip ${flipped ? "flipped" : ""}" id="card" tabindex="0" role="button" aria-label="Flip card">
        <div class="face front">
          ${isNum ? `<div class="num-big">${it.en}</div>` : `<div class="card-hz ${sz(cat, it.hz)}">${esc(it.hz)}</div>`}
          <div class="hint">tap to reveal</div>
        </div>
        <div class="face rear">
          <div class="card-hz small ${sz(cat, it.hz)}">${hzHtml(cat, it)}</div>
          <div class="card-py">${pyHtml(cat, it.py)}</div>
          <div class="card-en">${isNum ? it.en : esc(it.en)}</div>
          ${it.note ? `<p class="card-note">${esc(it.note)}</p>` : ""}
          ${!isNum ? `<div class="stars" title="Mastery">${[1, 2, 3].map((k) => `<i class="${m >= k ? "on" : ""}"></i>`).join("")}</div>` : ""}
        </div>
      </div>
      <div class="study-ctl">
        <button class="btn round" id="prev" ${i === 0 ? "disabled" : ""} aria-label="Previous">←</button>
        ${speakBtn(it.hz, "Hear it")}
        ${canWrite(cat) ? writeBtn(it.hz) : ""}
        <button class="btn soft" id="flipBtn">${flipped ? "Show front" : "Reveal"}</button>
        <button class="btn round" id="next" aria-label="Next">${i === items.length - 1 ? "✓" : "→"}</button>
      </div>
      <div class="dots">${items.map((_, k) => `<button class="dot ${k === i ? "on" : ""} ${k < i ? "seen" : ""}" data-go="${k}" aria-label="Card ${k + 1}"></button>`).join("")}</div>
    </div>
    <div class="study-end ${i === items.length - 1 && flipped ? "show" : ""}">
      <p>You've seen every card. Ready to test yourself?</p>
      <a class="btn primary big" href="#/quiz/${cat}">Practice ${c.name.toLowerCase()} →</a>
    </div>
    <section class="block">
      <div class="block-head"><h2>All cards</h2></div>
      <div class="mini-grid">
        ${items.map((x, k) => `<button class="mini ${k === i ? "on" : ""}" data-go="${k}">
          <span class="mini-hz ${sz(cat, x.hz)}">${isNum ? x.en : hzHtml(cat, x)}</span>
          <span class="mini-en">${isNum ? esc(x.hz) : esc(x.en)}</span></button>`).join("")}
      </div>
    </section>`;

    const card = $("#card");
    const flip = () => {
      study.flipped = !study.flipped;
      card.classList.toggle("flipped", study.flipped);
      $("#flipBtn").textContent = study.flipped ? "Show front" : "Reveal";
      $(".study-end").classList.toggle("show", study.flipped && study.i === items.length - 1);
      if (study.flipped && tts.ok()) tts.say(it.hz);
    };
    card.addEventListener("click", flip);
    $("#flipBtn").addEventListener("click", flip);
    $("#prev").addEventListener("click", () => go(study.i - 1));
    $("#next").addEventListener("click", () => {
      if (study.i === items.length - 1) { if (!study.flipped) flip(); else location.hash = "#/quiz/" + cat; }
      else go(study.i + 1);
    });
    app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { go(+b.dataset.go); window.scrollTo({ top: 0, behavior: "smooth" }); }));
    let sx = null;
    card.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    card.addEventListener("touchend", (e) => {
      if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { e.preventDefault(); go(study.i + (dx < 0 ? 1 : -1)); }
    });
  }
  function go(k) {
    if (!study || k < 0 || k >= study.items.length) return;
    study.i = k; study.flipped = false; drawLearn();
  }

  /* ---------- Quiz ---------- */
  let quiz = null;

  function distractFrom(list, item, field, n = 3) {
    const seen = new Set([item[field]]);
    const out = [];
    for (const x of shuffle(list)) {
      if (out.length >= n) break;
      if (!seen.has(x[field])) { seen.add(x[field]); out.push(x); }
    }
    return out;
  }

  function buildVocabQuestion(cat, level, item) {
    const mine = cat === MYCAT.id;
    const own = mine ? S.saved : D[cat][level];
    const wide = mine
      ? own.concat(D.words.beginner, D.words.early, D.characters.beginner)
      : own.concat(...LEVELS.filter((l) => l.id !== level).map((l) => D[cat][l.id]));
    const types = level === "beginner" ? ["meaning", "meaning", "reverse"]
      : level === "early" ? ["meaning", "reverse", "pinyin"]
      : ["meaning", "reverse", "pinyin", "listen"];
    let kind = types[rand(types.length)];
    if (kind === "listen" && !tts.ok()) kind = "pinyin";
    const showPy = level === "beginner";
    const ds = distractFrom(own.length >= 4 ? own : wide, item, kind === "meaning" ? "en" : kind === "pinyin" ? "py" : "hz");
    const opts = shuffle([item, ...ds]);
    const q = { cat, item, kind, say: item.hz };
    if (kind === "meaning") {
      q.prompt = "What does this mean?";
      q.big = `<div class="q-hz ${sz(cat, item.hz)}">${esc(item.hz)}</div>${showPy ? `<div class="q-py">${pyHtml(cat, item.py)}</div>` : ""}`;
      q.options = opts.map((o) => ({ html: esc(o.en), correct: o === item }));
    } else if (kind === "reverse") {
      q.prompt = "Which one means…";
      q.big = `<div class="q-en">“${esc(item.en)}”</div>`;
      q.options = opts.map((o) => ({ html: `<span class="opt-hz ${sz(cat, o.hz)}">${esc(o.hz)}</span>${showPy ? `<span class="opt-sub">${esc(o.py)}</span>` : ""}`, correct: o === item }));
    } else if (kind === "pinyin") {
      q.prompt = "How is this pronounced?";
      q.big = `<div class="q-hz ${sz(cat, item.hz)}">${esc(item.hz)}</div>`;
      q.options = opts.map((o) => ({ html: `<span class="opt-py">${esc(o.py)}</span>`, correct: o === item }));
    } else {
      q.prompt = "Listen. Which one did you hear?";
      q.big = `<button class="listen-big" data-say="${esc(item.hz)}">${speakerSvg}<span>Play again</span></button>`;
      q.autoplay = true;
      q.options = opts.map((o) => ({ html: `<span class="opt-hz ${sz(cat, o.hz)}">${esc(o.hz)}</span>`, correct: o === item }));
    }
    return q;
  }

  function buildNumberQuestion(level, n) {
    const item = numItem(n);
    const types = level === "beginner" ? ["toHanzi", "toDigits"] : ["toHanzi", "toDigits", "listen"];
    let kind = types[rand(types.length)];
    if (kind === "listen" && !tts.ok()) kind = "toDigits";
    const showPy = level === "beginner";
    const opts = shuffle([n, ...numDistractors(n, level)]).map(numItem);
    const q = { cat: "numbers", item, kind, say: item.hz };
    if (kind === "toHanzi") {
      q.prompt = "How do you write this number in Chinese?";
      q.big = `<div class="q-num">${item.en}</div>`;
      q.options = opts.map((o) => ({ html: `<span class="opt-hz numbers">${o.hz}</span>${showPy ? `<span class="opt-sub">${o.py}</span>` : ""}`, correct: o.n === n }));
    } else if (kind === "toDigits") {
      q.prompt = "Which number is this?";
      q.big = `<div class="q-hz numbers ${item.hz.length > 6 ? "long" : ""}">${item.hz}</div>${showPy ? `<div class="q-py">${colorPy(item.py)}</div>` : ""}`;
      q.options = opts.map((o) => ({ html: `<span class="opt-num">${o.en}</span>`, correct: o.n === n }));
    } else {
      q.prompt = "Listen. Which number did you hear?";
      q.big = `<button class="listen-big" data-say="${item.hz}">${speakerSvg}<span>Play again</span></button>`;
      q.autoplay = true;
      q.options = opts.map((o) => ({ html: `<span class="opt-num">${o.en}</span>`, correct: o.n === n }));
    }
    return q;
  }

  /* ---------- Look up (English, pinyin or characters → Mandarin) ---------- */
  // lookupMain: matches for the whole query; lookupBreakdown: one match per word of a phrase.
  // lookupResults is both lists together, indexed by the Save buttons.
  let dict = null, dictLoading = null, lookupMain = [], lookupBreakdown = [], lookupResults = [], lookupTimer = null;
  const STOP = new Set(["a", "an", "the", "to", "of", "is", "are", "am", "be", "was", "were", "and", "it", "do", "does"]);
  const RARE = /^\((archaic|old|literary|classical|dialect|obsolete|Taiwan|Tw|Cantonese|loanword|slang)\b/i;
  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();
  const coreOf = (s) => clean(s.replace(/\([^)]*\)|\[[^\]]*\]/g, " ")).replace(/^(to|a|an|the) /, "");
  const toneless = (s) => plainSyl(s.toLowerCase()).replace(/[üv]/g, "u").replace(/[^a-z]/g, "");
  const markedKey = (s) => s.toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, "");
  const shorten = (s, n) => s.length > n ? s.slice(0, n - 1).replace(/[;,\s]+\S*$/, "") + "…" : s;

  function makeEntry(hz, py, meanings, freq, hsk, lesson, note, ph) {
    // A label like "(archaic)" marks its own senses as rare, and the whole reading as uncommon.
    const oddForm = meanings.some((m) => RARE.test(m));
    const parts = meanings.flatMap((m) => { const r = RARE.test(m); return m.split(/;\s*/).filter(Boolean).map((x) => [x, r || RARE.test(x)]); });
    const senses = parts.map(([x]) => x);
    return {
      hz, py, freq, hsk, lesson, note, ph,
      en: meanings.slice(0, 3).join("; "),
      short: shorten(senses[0] || "", 48),
      senses: parts.map(([x, rare]) => ({ full: clean(x), core: coreOf(x), rare, odd: oddForm })),
      pyKey: toneless(py), pyMark: markedKey(py)
    };
  }
  function buildIndex(rows) {
    const out = [], lessonByKey = new Map();
    for (const cat of ["phrases", "words", "characters"]) for (const l of LEVELS) for (const it of D[cat][l.id]) {
      const e = makeEntry(it.hz, it.py, [it.en], 50000, 0, true, it.note, cat === "phrases");
      e.short = it.en;
      lessonByKey.set(it.hz + "|" + e.pyMark, e);
      out.push(e);
    }
    for (const [hz, py, ms, freq, hsk] of rows) {
      const lesson = lessonByKey.get(hz + "|" + markedKey(py));
      if (lesson) {
        // Same word as a lesson item: keep the lesson's wording, but let its dictionary senses match too.
        lesson.freq = freq; lesson.hsk = hsk;
        lesson.senses.push(...makeEntry(hz, py, ms, freq, hsk).senses.map((x) => ({ ...x, extra: true })));
        continue;
      }
      out.push(makeEntry(hz, py, ms, freq, hsk, false));
    }
    return out;
  }
  function loadDict() {
    if (dict) return Promise.resolve(dict);
    if (!dictLoading) {
      dictLoading = fetch("dict/hsk.json")
        .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then((rows) => (dict = buildIndex(rows)))
        .catch((e) => { dictLoading = null; throw e; });
    }
    return dictLoading;
  }

  function searchDict(raw, limit = 15) {
    const q = raw.trim();
    if (!q) return [];
    const scored = [];
    if (/[㐀-鿿]/.test(q)) {
      const h = q.replace(/[^㐀-鿿]/g, "");
      for (const e of dict) {
        const s = e.hz === h ? 100 : e.hz.replace(/[^㐀-鿿]/g, "") === h ? 95 : e.hz.startsWith(h) ? 70 : e.hz.includes(h) ? 50 : 0;
        if (s) scored.push([s + (e.lesson ? 12 : 0), e]);
      }
    } else {
      const marked = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(q) ? markedKey(q) : null;
      const en = marked ? "" : clean(q), core = en.replace(/^(to|a|an|the) /, "");
      const sing = core.length > 3 && /[^s]s$/.test(core) ? core.replace(/(ies)$/, "y").replace(/(ches|shes|xes|ses)$/, (m) => m.slice(0, -2)).replace(/([^s])s$/, "$1") : null;
      const pk = toneless(q);
      if (!core && !pk) return [];
      for (const e of dict) {
        let s = 0;
        // Pinyin: exact with tone marks beats everything; toneless pinyin ranks below English matches.
        if (marked && e.pyMark === marked) s = 100;
        else if (!marked && pk.length > 1 && e.pyKey === pk) s = 50;
        if (core) for (let k = 0; k < e.senses.length; k++) {
          const x = e.senses[k];
          let t = 0;
          if (x.core === core) t = 100;
          else if (x.full === en) t = 95;
          else if (sing && x.core === sing) t = 90;
          else if (x.core.startsWith(core + " ")) t = 60;
          else if ((" " + x.full + " ").includes(" " + core + " ")) t = 40;
          // Dictionaries list a word's main meaning first.
          if (t >= 90) t += k === 0 ? 6 : k < 3 ? 2 : 0;
          if (t && x.extra) t -= 14; // cancels the lesson bonus below
          if (t && x.rare) t -= 30;
          else if (t && x.odd) t -= 15;
          if (t > s) s = t;
        }
        if (s) scored.push([s + (e.lesson ? 12 : 0) + (e.hsk && e.hsk <= 3 ? 4 : 0), e]);
      }
    }
    scored.sort((a, b) => b[0] - a[0] || a[1].freq - b[1].freq);
    return scored.slice(0, limit).map(([score, entry]) => ({ score, entry }));
  }

  const savedKey = (x) => x.hz + "|" + markedKey(x.py);
  const isSaved = (e) => S.saved.some((x) => savedKey(x) === savedKey(e));
  function toggleSave(e) {
    const k = savedKey(e);
    if (isSaved(e)) S.saved = S.saved.filter((x) => savedKey(x) !== k);
    else S.saved.unshift({ hz: e.hz, py: e.py, en: e.short, ...(e.note ? { note: e.note } : {}), ...(e.ph ? { ph: true } : {}) });
    save();
  }

  function resultCard(e, i) {
    const saved = isSaved(e);
    const hzH = e.ph ? esc(e.hz) : colorHz(e.hz, e.py);
    const pyH = e.ph ? esc(e.py) : colorPy(e.py);
    const writable = !e.ph && HAN.test(e.hz);
    return `<article class="lk-item">
      <div class="lk-hz ${sz(MYCAT.id, e.hz)}">${hzH}</div>
      <div class="lk-body">
        <div class="lk-py">${pyH} ${speakBtn(e.hz)}${writable ? writeBtn(e.hz) : ""}</div>
        <div class="lk-en">${esc(e.en)}</div>
        <div class="lk-tags">${e.lesson ? `<span class="tag lesson">In your lessons</span>` : ""}${e.hsk ? `<span class="tag">HSK ${e.hsk === 7 ? "7–9" : e.hsk}</span>` : ""}</div>
      </div>
      <button class="lk-save ${saved ? "on" : ""}" data-save="${i}" aria-pressed="${saved}">${saved ? "★ Saved" : "☆ Save"}</button>
    </article>`;
  }

  function myWordsPanel() {
    const n = S.saved.length;
    return `<p class="eyebrow">My words · ${n}</p>
      ${n ? `<div class="mw-list">${S.saved.map((x, i) => `<span class="mw-chip"><button class="mw-word" data-mwsay="${i}" title="Hear it"><b>${esc(x.hz)}</b> ${esc(x.py)}</button><button class="mw-x" data-unsave="${i}" aria-label="Remove ${esc(x.hz)}">✕</button></span>`).join("")}</div>`
        : `<p class="mw-empty">Tap <b>☆ Save</b> on any result to collect words here, then study them as flashcards or practice them in a quiz.</p>`}
      <div class="mw-ctl">
        ${n ? `<a class="btn soft" href="#/learn/mywords">Study cards</a>` : ""}
        ${n >= 4 ? `<a class="btn primary" href="#/quiz/mywords">Practice my words</a>` : n ? `<p class="mw-hint">Save ${4 - n} more to start a practice round.</p>` : ""}
      </div>`;
  }

  const SUGGEST = ["hello", "thank you", "water", "eat", "friend", "happy", "cat", "beautiful", "ni hao", "爱"];

  function renderLookup(q0) {
    app.innerHTML = `
    <section class="page-head">
      <a class="back" href="#/">← Home</a>
      <h1>Look up a word <span class="zh-sub">查</span></h1>
      <p class="lede">Type an English word to see it in Mandarin. You can also type pinyin (<i>ni hao</i>) or characters (你好). Save words to study and practice them later.</p>
    </section>
    <div class="lk-layout">
      <div>
        <div class="lk-search" role="search">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input id="lkInput" type="search" aria-label="Word to look up" placeholder="e.g. water, friend, thank you" autocomplete="off" autocapitalize="off" spellcheck="false">
        </div>
        <div id="lkResults" class="lk-results" aria-live="polite"></div>
      </div>
      <aside class="panel mywords" id="myWords">${myWordsPanel()}</aside>
    </div>
    <p class="lk-credit">Dictionary: ${(12000).toLocaleString("en-US")}+ words from the HSK exam vocabulary, with meanings from <a href="https://cc-cedict.org/wiki/" target="_blank" rel="noopener">CC-CEDICT</a> (CC BY-SA 4.0), via <a href="https://github.com/drkameleon/complete-hsk-vocabulary" target="_blank" rel="noopener">complete-hsk-vocabulary</a>.</p>`;

    const input = $("#lkInput");
    input.value = q0;
    input.addEventListener("input", () => {
      clearTimeout(lookupTimer);
      lookupTimer = setTimeout(runLookup, 120);
    });
    $("#lkResults").addEventListener("click", (e) => {
      const b = e.target.closest("[data-save]");
      if (b) { toggleSave(lookupResults[+b.dataset.save]); drawLookupResults(); refreshMyWords(); return; }
      const sug = e.target.closest("[data-suggest]");
      if (sug) { input.value = sug.dataset.suggest; runLookup(); input.focus(); }
    });
    $("#myWords").addEventListener("click", (e) => {
      const x = e.target.closest("[data-unsave]");
      if (x) { S.saved.splice(+x.dataset.unsave, 1); save(); refreshMyWords(); drawLookupResults(); return; }
      const w = e.target.closest("[data-mwsay]");
      if (w) tts.say(S.saved[+w.dataset.mwsay].hz);
    });
    if (window.matchMedia("(hover: hover)").matches) input.focus();
    if (!dict) $("#lkResults").innerHTML = `<p class="lk-empty">Loading the dictionary…</p>`;
    loadDict().then(runLookup).catch(() => {
      $("#lkResults").innerHTML = `<p class="lk-empty">The dictionary couldn't load. Check your connection and try again.</p>`;
    });
  }

  function refreshMyWords() { const m = $("#myWords"); if (m) m.innerHTML = myWordsPanel(); }

  function runLookup() {
    const input = $("#lkInput");
    if (!input || !dict) return;
    const q = input.value;
    history.replaceState(null, "", "#/lookup" + (q.trim() ? "/" + encodeURIComponent(q.trim()) : ""));
    lookupMain = searchDict(q).map((r) => r.entry);
    lookupBreakdown = [];
    // A phrase with no strong match: also look up its words one at a time.
    const words = /[㐀-鿿]/.test(q) ? [] : clean(q).split(" ").filter((w) => w && !STOP.has(w));
    const top = searchDict(q, 1)[0];
    const pinyinHit = lookupMain.some((e) => e.pyKey === toneless(q));
    if (words.length > 1 && !pinyinHit && (!top || top.score < 90)) {
      for (const w of words) {
        const hit = searchDict(w, 1)[0];
        if (hit && hit.score >= 60) lookupBreakdown.push({ word: w, entry: hit.entry });
      }
    }
    drawLookupResults();
  }

  function drawLookupResults() {
    const box = $("#lkResults"), input = $("#lkInput");
    if (!box || !input || !dict) return;
    const q = input.value.trim();
    if (!q) {
      box.innerHTML = `<div class="lk-empty"><p>Try one of these:</p><div class="lk-sugs">${SUGGEST.map((w) => `<button class="chip lk-sug" data-suggest="${esc(w)}">${esc(w)}</button>`).join("")}</div></div>`;
      return;
    }
    const offset = lookupMain.length;
    lookupResults = lookupMain.concat(lookupBreakdown.map((b) => b.entry));
    let html = "";
    if (lookupBreakdown.length) {
      html += `<div class="lk-break"><p class="eyebrow">Word by word</p><p class="lk-note">This looks up each word on its own. It can't translate whole sentences, and Chinese word order can differ.</p>
        ${lookupBreakdown.map((b, i) => `<div class="lk-break-row"><span class="lk-break-en">${esc(b.word)}</span>${resultCard(b.entry, offset + i)}</div>`).join("")}</div>`;
    }
    if (lookupMain.length) html += (lookupBreakdown.length ? `<p class="eyebrow lk-sub">Closest matches for the whole phrase</p>` : "") + lookupMain.map((e, i) => resultCard(e, i)).join("");
    if (!html) html = `<p class="lk-empty">No match for “${esc(q)}”. Try a simpler word or check the spelling.</p>`;
    box.innerHTML = html;
  }

  /* ---------- Tone practice ---------- */
  // Skip words whose spoken tones differ from the written ones (tone sandhi):
  // 一 and 不 change tone, and a 3rd tone before another 3rd tone is said as a 2nd.
  const sandhiSafe = (it) => !/[一不]/.test(it.hz) && !tonesOf(it.py).some((t, i, a) => t === 3 && a[i + 1] === 3);
  function tonePool(level) {
    const C = D.characters, W = D.words;
    if (level === "beginner") return C.beginner.concat(C.early);
    const words = level === "early" ? W.beginner.concat(W.early) : W.early.concat(W.expert);
    return words.filter((it) => it.py.split(" ").length >= 2 && sandhiSafe(it));
  }
  function patternVariants(pat, n) {
    const out = [], seen = new Set([pat.join()]);
    let guard = 0;
    while (out.length < n && guard++ < 300) {
      const p = pat.slice();
      const changes = guard > 60 ? 2 : 1;
      for (let c = 0; c < changes; c++) {
        const i = rand(p.length);
        const choices = [1, 2, 3, 4].concat(i > 0 && i === p.length - 1 ? [5] : []).filter((t) => t !== p[i]);
        p[i] = choices[rand(choices.length)];
      }
      if (!seen.has(p.join())) { seen.add(p.join()); out.push(p); }
    }
    return out;
  }
  const contour = (t) => `<svg viewBox="0 0 120 70" class="mini-contour t${t}" aria-hidden="true"><path d="${D.tones.find((x) => x.n === t).path}"/></svg>`;
  const patternHtml = (pat) => `<span class="opt-tones">${pat.map((t) => `<span class="t${t}">${TONE_NAMES[t]}</span>`).join(" + ")}</span>`;

  function buildToneQuestion(level, item) {
    const pat = tonesOf(item.py);
    const kind = tts.ok() && (level === "beginner" || Math.random() < 0.75) ? "listen" : "recall";
    const q = { cat: "tones", item, kind, say: item.hz };
    const hint = level !== "expert" ? `<div class="q-py">${esc(plainPy(item.py))}</div>` : "";
    const one = pat.length === 1;
    if (kind === "listen") {
      q.prompt = one ? "Listen. Which tone do you hear?" : "Listen. Which tones do you hear?";
      q.big = `<button class="listen-big" data-say="${esc(item.hz)}">${speakerSvg}<span>Play again</span></button>${hint}`;
      q.autoplay = true;
    } else {
      q.prompt = one ? "Which tone does this character have?" : "Which tones does this word have?";
      q.big = `<div class="q-hz words">${esc(item.hz)}</div>${hint}`;
    }
    if (one) {
      q.options = [1, 2, 3, 4].map((t) => ({ html: `<span class="opt-tone">${contour(t)}<span class="t${t}">${TONE_NAMES[t]} tone</span></span>`, correct: t === pat[0] }));
    } else {
      const key = pat.join();
      const sylls = item.py.split(" ").map(plainSyl);
      q.options = shuffle([pat, ...patternVariants(pat, 3)]).map((p) => ({
        html: level === "expert" ? `<span class="opt-py">${esc(sylls.map((s, i) => withTone(s, p[i])).join(" "))}</span>` : patternHtml(p),
        correct: p.join() === key
      }));
    }
    return q;
  }

  function startQuiz(cat) {
    const level = S.level;
    let qs;
    if (cat === "numbers") {
      const nums = new Set();
      let guard = 0;
      while (nums.size < QUIZ_LEN && guard++ < 500) nums.add(randNum(level));
      qs = [...nums].map((n) => buildNumberQuestion(level, n));
    } else if (cat === "tones") {
      qs = shuffle(tonePool(level)).slice(0, QUIZ_LEN).map((it) => buildToneQuestion(level, it));
    } else {
      const items = pool(cat, level)
        .map((it) => ({ it, w: Math.random() + (5 - (S.mastery[mkey(cat, it.hz)] || 0)) * 0.3 }))
        .sort((a, b) => b.w - a.w).slice(0, QUIZ_LEN).map((x) => x.it);
      qs = shuffle(items).map((it) => buildVocabQuestion(cat, level, it));
    }
    quiz = { cat, level, qs, i: 0, score: 0, combo: 0, bestCombo: 0, xp: 0, missed: [], answered: false };
    drawQuestion();
  }

  function drawQuestion() {
    const q = quiz.qs[quiz.i], c = catOf(quiz.cat), lv = levelOf(quiz.level);
    const pct = (quiz.i / quiz.qs.length) * 100;
    app.innerHTML = `
    <section class="quiz">
      <div class="quiz-top">
        <a class="back" href="#/" aria-label="Quit practice">✕</a>
        <div class="qbar"><i style="width:${pct}%"></i></div>
        <div class="combo ${quiz.combo >= 2 ? "hot" : ""}" title="Correct in a row">连 ×${quiz.combo}</div>
      </div>
      <div class="quiz-meta">${c.name} · ${lv.name} · Question ${quiz.i + 1} of ${quiz.qs.length}</div>
      <div class="q-card">
        <p class="q-prompt">${q.prompt}</p>
        <div class="q-big">${q.big}</div>
      </div>
      <div class="options">
        ${q.options.map((o, k) => `<button class="opt" data-k="${k}"><span class="key">${k + 1}</span><span class="opt-body">${o.html}</span></button>`).join("")}
      </div>
      <div class="feedback" id="fb" aria-live="polite"></div>
    </section>`;
    app.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => answer(+b.dataset.k)));
    if (q.autoplay) setTimeout(() => tts.say(q.say), 300);
  }

  function answer(k) {
    if (quiz.answered) return;
    quiz.answered = true;
    const q = quiz.qs[quiz.i], ok = q.options[k].correct;
    const btns = app.querySelectorAll(".opt");
    btns.forEach((b, j) => {
      b.disabled = true;
      if (q.options[j].correct) b.classList.add("right");
      else if (j === k) b.classList.add("wrong");
      else b.classList.add("dim");
    });
    touchStreak();
    S.answered++;
    let gained = 0;
    if (ok) {
      quiz.score++; quiz.combo++; quiz.bestCombo = Math.max(quiz.bestCombo, quiz.combo);
      gained = 10 + Math.min(quiz.combo - 1, 5) * 2;
      quiz.xp += gained; S.xp += gained; S.correct++;
    } else {
      quiz.combo = 0; quiz.missed.push(q.item);
    }
    if (!SCORED.includes(q.cat)) {
      const key = mkey(q.cat, q.item.hz), cur = S.mastery[key] || 0;
      S.mastery[key] = ok ? Math.min(cur + 1, 5) : Math.max(cur - 1, 0);
    }
    save(); renderHeader();

    const it = q.item, isNum = q.cat === "numbers";
    const msg = ok ? PRAISE[rand(PRAISE.length)] : COMFORT[rand(COMFORT.length)];
    const last = quiz.i === quiz.qs.length - 1;
    $("#fb").className = "feedback show " + (ok ? "good" : "bad");
    $("#fb").innerHTML = `
      <div class="fb-head"><b>${msg}</b>${ok ? `<span class="xp-pop">+${gained} XP</span>` : ""}</div>
      <div class="fb-card">
        <div class="fb-hz ${sz(q.cat, it.hz)}">${hzHtml(q.cat, it)}</div>
        <div class="fb-info">
          <div class="fb-py">${pyHtml(q.cat, it.py)} ${speakBtn(it.hz)}${canWrite(q.cat) ? writeBtn(it.hz) : ""}</div>
          <div class="fb-en">${isNum ? it.en : esc(it.en)}</div>
          ${q.cat === "tones" ? `<div class="fb-note">Tones: ${patternHtml(tonesOf(it.py))}</div>` : ""}
          ${it.note ? `<div class="fb-note">${esc(it.note)}</div>` : ""}
        </div>
      </div>
      <button class="btn primary big" id="nextQ">${last ? "See results" : "Continue"} <kbd>Enter</kbd></button>`;
    $("#nextQ").addEventListener("click", nextQuestion);
    $("#nextQ").focus({ preventScroll: true });
    $("#fb").scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (tts.ok() && !q.autoplay) tts.say(it.hz);
    if (ok) pulse(btns[k]);
  }

  function pulse(el) { el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 300 }); }

  function nextQuestion() {
    quiz.i++; quiz.answered = false;
    if (quiz.i >= quiz.qs.length) return drawResults();
    drawQuestion(); window.scrollTo({ top: 0 });
  }

  function drawResults() {
    const { score, qs, xp, missed, bestCombo, cat, level } = quiz;
    const pct = Math.round((score / qs.length) * 100);
    const bk = level + ":" + cat;
    const prevBest = S.best[bk];
    const newBest = prevBest == null || pct > prevBest;
    if (newBest) S.best[bk] = pct;
    save();
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
    const title = stars === 3 ? ["完美!", "Outstanding!"] : stars === 2 ? ["很好!", "Great work!"] : stars === 1 ? ["不错!", "Good progress!"] : ["加油!", "Keep going!"];
    const sub = stars >= 2 ? "Your memory is getting stronger with every round."
      : "Every expert started here. Review the cards below, then try again. It gets easier fast.";
    const isNum = cat === "numbers";
    app.innerHTML = `
    <section class="results">
      <div class="res-card">
        <div class="res-stars">${[1, 2, 3].map((k) => `<span class="star ${stars >= k ? "on" : ""}" style="animation-delay:${k * 0.15}s">★</span>`).join("")}</div>
        <div class="res-zh">${title[0]}</div>
        <h1>${title[1]}</h1>
        <p class="lede">${sub}</p>
        <div class="res-stats">
          <div><b>${score}/${qs.length}</b><span>correct</span></div>
          <div><b>+${xp}</b><span>XP earned</span></div>
          <div><b>${bestCombo}</b><span>best streak</span></div>
        </div>
        ${newBest && prevBest != null ? `<div class="badge">New personal best! (was ${prevBest}%)</div>` : ""}
        <div class="res-actions">
          <a class="btn primary big" href="#/quiz/${cat}" id="again">Practice again</a>
          <a class="btn soft big" href="#/learn/${cat}">Study cards</a>
          <a class="btn ghost big" href="#/">Home</a>
        </div>
      </div>
      ${missed.length ? `
      <div class="block">
        <div class="block-head"><h2>Worth another look</h2><p>These tripped you up this round. Tap the speaker to hear each one.</p></div>
        <div class="review">
          ${missed.map((it) => `<div class="rev">
            <div class="rev-hz ${sz(cat, it.hz)}">${hzHtml(cat, it)}</div>
            <div class="rev-info"><div class="rev-py">${pyHtml(cat, it.py)}</div><div class="rev-en">${isNum ? it.en : esc(it.en)}</div></div>
            <div class="rev-btns">${speakBtn(it.hz)}${canWrite(cat) ? writeBtn(it.hz) : ""}</div></div>`).join("")}
        </div>
      </div>` : `<p class="center perfect">No mistakes. 一百分! (a perfect hundred)</p>`}
      ${level !== "expert" && pct >= 90 ? `<div class="center"><button class="btn soft" id="levelUp">Feeling confident? Try ${levelOf(LEVELS[LEVELS.findIndex((l) => l.id === level) + 1].id).name} →</button></div>` : ""}
    </section>`;
    $("#again").addEventListener("click", (e) => { e.preventDefault(); startQuiz(cat); window.scrollTo({ top: 0 }); });
    const lu = $("#levelUp");
    if (lu) lu.addEventListener("click", () => { S.level = LEVELS[LEVELS.findIndex((l) => l.id === level) + 1].id; save(); location.hash = "#/"; });
    if (pct >= 70) confetti();
  }

  /* ---------- Confetti ---------- */
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = $("#confetti");
    const colors = ["var(--red)", "var(--gold)", "var(--jade)", "var(--t3)"];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.6 + "s";
      p.style.animationDuration = 2 + Math.random() * 1.5 + "s";
      p.style.transform = `rotate(${rand(360)}deg)`;
      box.appendChild(p);
    }
    setTimeout(() => { box.innerHTML = ""; }, 4200);
  }

  /* ---------- Global events ---------- */
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-say]");
    if (s) { e.stopPropagation(); tts.say(s.dataset.say); return; }
    const w = e.target.closest("[data-write]");
    if (w) { e.stopPropagation(); openWriter(w.dataset.write); }
  }, true);
  $("#writer").addEventListener("click", (e) => { if (e.target.id === "writer") closeWriter(); });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (writerOpen()) { if (e.key === "Escape") closeWriter(); return; }
    const route = location.hash;
    if (route.startsWith("#/quiz") && quiz) {
      if (!quiz.answered && /^[1-4]$/.test(e.key)) { const k = +e.key - 1; if (k < quiz.qs[quiz.i]?.options.length) answer(k); }
      else if (quiz.answered && e.key === "Enter") { e.preventDefault(); nextQuestion(); }
    } else if (route.startsWith("#/learn") && study) {
      if (e.key === "ArrowRight") go(study.i + 1);
      else if (e.key === "ArrowLeft") go(study.i - 1);
      else if (e.key === " " || e.key === "Enter") { if (e.target.tagName === "BUTTON" && e.target.id !== "card") return; e.preventDefault(); $("#card").click(); }
    }
  });

  /* ---------- Router ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    study = null;
    closeWriter();
    const need = h[1] === MYCAT.id ? (h[0] === "quiz" ? 4 : 1) : 0;
    if ((h[0] === "learn" || h[0] === "quiz") && S.saved.length < need) {
      location.replace("#/lookup");
      toast(h[0] === "quiz" ? "Save at least 4 words to practice them." : "Save some words first.");
      return;
    }
    if (h[0] === "learn" && h[1] === "tones") renderTones();
    else if (h[0] === "learn" && catOf(h[1])) renderLearn(h[1]);
    else if (h[0] === "quiz" && catOf(h[1])) startQuiz(h[1]);
    else if (h[0] === "tones") renderTones();
    else if (h[0] === "lookup") {
      let q = "";
      try { q = decodeURIComponent(h.slice(1).join("/")); } catch (e) { /* malformed link */ }
      renderLookup(q);
    }
    else { quiz = null; renderHome(); }
    renderHeader();
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", route);
  route();
})();
