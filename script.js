// script.js
document.addEventListener('DOMContentLoaded', () => {
  const heightInput = document.getElementById('height');
  const heightUnit = document.getElementById('height-unit');
  const weightInput = document.getElementById('weight');
  const weightUnit = document.getElementById('weight-unit');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const bmiValueEl = document.getElementById('bmiValue');
  const bmiCategoryEl = document.getElementById('bmiCategory');
  const viewRecBtn = document.getElementById('viewRec');
  const gaugeNeedle = document.getElementById('gaugeNeedle');
  const scrollToCalc = document.getElementById('scrollToCalc');

  scrollToCalc && scrollToCalc.addEventListener('click', () => {
    document.getElementById('calculator').scrollIntoView({behavior:'smooth'});
  });

  function convertHeightToMeters(val, unit) {
    // val is a number
    if (unit === 'cm') return val / 100;
    if (unit === 'm') return val;
    if (unit === 'ft') {
      // assume val in feet (like 5.6? better to ask feet+inches, but we keep simple)
      return val * 0.3048;
    }
    return val;
  }
  function convertWeightToKg(val, unit) {
    if (unit === 'kg') return val;
    if (unit === 'lb') return val * 0.45359237;
    return val;
  }

  function getCategory(bmi) {
    // Standard adult BMI categories
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  function setGaugeRotation(bmi) {
    // map BMI (10..40) to rotation -80deg .. 80deg
    const min = 10, max = 40;
    const clamped = Math.max(min, Math.min(max, bmi));
    const ratio = (clamped - min) / (max - min);
    const deg = -80 + (ratio * 160);
    gaugeNeedle.style.transform = `translateX(-50%) rotate(${deg}deg)`;
  }

  calculateBtn.addEventListener('click', () => {
    const hRaw = parseFloat(heightInput.value);
    const wRaw = parseFloat(weightInput.value);
    if (!hRaw || !wRaw || hRaw <= 0 || wRaw <= 0) {
      alert('Please enter valid height and weight.');
      return;
    }

    const hMeters = convertHeightToMeters(hRaw, heightUnit.value);
    const wKg = convertWeightToKg(wRaw, weightUnit.value);

    // BMI = weight(kg) / height(m)^2
    const bmi = wKg / (hMeters * hMeters);
    const bmiRounded = Math.round(bmi * 10) / 10; // one decimal

    const category = getCategory(bmiRounded);

    bmiValueEl.textContent = `BMI: ${bmiRounded}`;
    bmiCategoryEl.innerHTML = `Category: <strong>${category}</strong>`;

    // style category color
    let col = '#000';
    if (category === 'Underweight') col = '#f59e0b'; // yellow
    if (category === 'Normal') col = '#10b981'; // green
    if (category === 'Overweight') col = '#f97316'; // orange
    if (category === 'Obese') col = '#ef4444'; // red
    bmiCategoryEl.querySelector('strong').style.color = col;

    setGaugeRotation(bmiRounded);

    // enable view recommendation button and attach link with query params
    viewRecBtn.disabled = false;
    const params = new URLSearchParams({
      bmi: bmiRounded.toString(),
      category
    });
    viewRecBtn.onclick = () => {
      window.location.href = `recommendation.html?${params.toString()}`;
    };
  });

  resetBtn.addEventListener('click', () => {
    heightInput.value = '';
    weightInput.value = '';
    bmiValueEl.textContent = '—';
    bmiCategoryEl.textContent = 'Category: —';
    viewRecBtn.disabled = true;
    gaugeNeedle.style.transform = 'translateX(-50%) rotate(0deg)';
  });
});


  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  // Toggle menu open/close
  hamburger.addEventListener("click", () => {
    const isActive = sideMenu.classList.toggle("active");
    overlay.classList.toggle("active", isActive);
    hamburger.classList.toggle("active", isActive);
  });

  // Close menu when clicking outside (overlay)
  overlay.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    hamburger.classList.remove("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".side-menu a").forEach(link => {
    link.addEventListener("click", () => {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

// scroll button
  const scrollBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 200);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Dark mode toggle
    const darkToggle = document.getElementById('darkToggle');
    function applyTheme(theme){
      if(theme === 'dark'){ document.documentElement.setAttribute('data-theme','dark'); darkToggle.textContent='☀️ Light'; darkToggle.setAttribute('aria-pressed','true'); }
      else{ document.documentElement.removeAttribute('data-theme'); darkToggle.textContent='🌙 Dark'; darkToggle.setAttribute('aria-pressed','false'); }
    }
    const savedTheme = localStorage.getItem('fitlife-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    darkToggle.addEventListener('click',()=>{ const next = document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark'; applyTheme(next); localStorage.setItem('fitlife-theme', next); });


   // ===== Fii AI — Robust Professional Implementation =====
document.addEventListener("DOMContentLoaded", () => {
  const FII_BACKEND = "http://localhost:5000"; // change for production

  // DOM refs
  const fiiBtn = document.getElementById("fiiAiBtn");
  const fiiChat = document.getElementById("fiiAiChat");
  const closeFiiAi = document.getElementById("closeFiiAi");
  const sendBtn = document.getElementById("sendMsg");
  const userInput = document.getElementById("userInput");
  const chatBody = document.getElementById("fiiChatBody");
  const openHistoryBtn = document.getElementById("openHistory");
  const historyPanel = document.getElementById("fiiHistoryPanel");
  const historyList = document.getElementById("historyList");
  const historyOverlay = document.getElementById("historyOverlay");
  const clearBtn = document.getElementById("clearSession");

  const STORAGE_KEY = "fii_sessions_v3";

  // sessions: array of sessions; each session = {id,timestamp, messages:[{role,content}]}
  let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  let currentSession = { id: genId(), timestamp: Date.now(), messages: [] };

  // helpers
  function genId() { return "s_" + Math.random().toString(36).slice(2, 9); }
  function saveSessions() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); } catch(e) { console.warn("saveSessions err",e); } }
  function nowReadable(ts) { const d = new Date(ts); return d.toLocaleString(); }

  // render chat (takes messages array)
  function renderMessages(msgs = currentSession.messages) {
    chatBody.innerHTML = "";
    if (!msgs.length) {
      const el = document.createElement("div");
      el.className = "ai-bubble ai-msg";
      el.textContent = "Hi 👋 I'm Fii AI! How can I help you today?";
      chatBody.appendChild(el);
      return;
    }
    msgs.forEach(m => {
      const el = document.createElement("div");
      el.className = m.role === "assistant" ? "ai-bubble ai-msg" : "ai-bubble user-msg";
      el.textContent = m.content;
      chatBody.appendChild(el);
    });
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // history UI
  function openHistory() {
    rebuildHistoryList();
    historyPanel.classList.add("open");
    historyOverlay.style.display = "block";
    historyPanel.setAttribute("aria-hidden", "false");
    historyOverlay.setAttribute("aria-hidden", "false");
  }
  function closeHistory() {
    historyPanel.classList.remove("open");
    historyOverlay.style.display = "none";
    historyPanel.setAttribute("aria-hidden", "true");
    historyOverlay.setAttribute("aria-hidden", "true");
  }

  function rebuildHistoryList() {
    historyList.innerHTML = "";
    if (!sessions.length) {
      const p = document.createElement("div"); p.className = "history-item"; p.textContent = "No previous chats.";
      historyList.appendChild(p); return;
    }
    // recent first
    sessions.slice().reverse().forEach(s => {
      const item = document.createElement("div"); item.className = "history-item";
      // summary: first user message OR first assistant if none
      const firstUser = s.messages.find(m => m.role === "user");
      const summaryText = firstUser ? firstUser.content.slice(0, 80) : (s.messages[0]?.content?.slice(0,80) || "Empty session");
      const title = document.createElement("div"); title.textContent = summaryText;
      const meta = document.createElement("div"); meta.className = "meta"; meta.textContent = nowReadable(s.timestamp);
      item.appendChild(title); item.appendChild(meta);
      item.addEventListener("click", () => {
        // open that session in chat body (do not change currentSession array)
        currentSession = { id: s.id, timestamp: s.timestamp, messages: JSON.parse(JSON.stringify(s.messages)) };
        renderMessages(currentSession.messages);
        closeHistory();
      });
      historyList.appendChild(item);
    });
  }

  // open/close chat controls
  fiiBtn.addEventListener("click", () => {
    fiiChat.style.display = "flex";
    fiiChat.setAttribute("aria-hidden", "false");
    renderMessages();
    userInput.focus();
  });
  closeFiiAi.addEventListener("click", () => {
    fiiChat.style.display = "none";
    fiiChat.setAttribute("aria-hidden", "true");
  });

  // open/close history
  openHistoryBtn.addEventListener("click", openHistory);
  historyOverlay.addEventListener("click", closeHistory);
  document.getElementById("closeHistoryBtn").addEventListener("click", closeHistory);

  // clear current session (start new)
  clearBtn && clearBtn.addEventListener("click", () => {
    // push current to sessions if has messages
    if (currentSession.messages.length) {
      sessions.push(currentSession);
      saveSessions();
    }
    currentSession = { id: genId(), timestamp: Date.now(), messages: [] };
    renderMessages();
  });

  // sending msg
  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    // push user message
    currentSession.messages.push({ role: "user", content: text });
    renderMessages(currentSession.messages);
    userInput.value = ""; userInput.focus();

    // typing indicator
    const typingEl = document.createElement("div");
    typingEl.className = "typing";
    typingEl.textContent = "Fii AI is typing...";
    chatBody.appendChild(typingEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const resp = await fetch(`${FII_BACKEND}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: currentSession.messages })
      });
      const data = await resp.json();
      typingEl.remove();
      const reply = data.reply || "Sorry, I couldn't generate a response.";
      currentSession.messages.push({ role: "assistant", content: reply });
      renderMessages(currentSession.messages);
    } catch (err) {
      console.error("Fii AI fetch error:", err);
      typingEl.remove();
      currentSession.messages.push({ role: "assistant", content: "⚠️ Network error. Please try again." });
      renderMessages(currentSession.messages);
    }
  }

  // send on click or Enter
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    // auto-resize textarea
    setTimeout(() => {
      userInput.style.height = "auto";
      userInput.style.height = (userInput.scrollHeight) + "px";
    }, 0);
  });

  // scroll shrinking button
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) { fiiBtn.classList.add("scrolled"); fiiBtn.textContent = "Fii"; }
    else { fiiBtn.classList.remove("scrolled"); fiiBtn.textContent = "Fii AI"; }
  });

  // before unload: save current session if not empty
  window.addEventListener("beforeunload", () => {
    if (currentSession.messages.length) {
      // store snapshot
      sessions.push(JSON.parse(JSON.stringify(currentSession)));
      saveSessions();
    }
  });

  // initial render (fresh session)
  renderMessages();

  // small helper: if sessions exist and you want to auto-load last, you can... (we don't auto-load per spec)
});
// edit
// ===== Fii AI — Mobile keyboard / viewport adapt (paste at end of script.js) =====
(function(){
  const chatbox = document.querySelector('.fii-ai-chatbox');
  const chatBody = document.getElementById('fiiChatBody'); // .fii-ai-body
  const userInput = document.getElementById('userInput');

  if (!chatbox || !userInput || !chatBody) return; // safety

  // remember original bottom (use computed value)
  const computed = window.getComputedStyle(chatbox);
  const originalBottom = parseInt(computed.bottom, 10) || 98;

  // helper: set bottom safely
  function setChatBottom(px) {
    // ensure px is number
    chatbox.style.bottom = px + 'px';
  }

  // VisualViewport approach (best for modern mobile browsers)
  if (window.visualViewport) {
    let lastViewportHeight = window.visualViewport.height;

    function onViewportResize() {
      const vv = window.visualViewport;
      const vh = vv.height;
      const delta = window.innerHeight - vh; // approximate keyboard height (px)
      // If delta is significant (keyboard likely open), raise the chatbox
      if (delta > 120) {
        // add small padding so input not flush to keyboard
        setChatBottom(delta + 12);
        // also reduce chatBody max-height so scrolling works
        chatBody.style.maxHeight = (vh - 140) + 'px';
      } else {
        // keyboard likely closed
        setChatBottom(originalBottom);
        chatBody.style.maxHeight = '';
      }
      lastViewportHeight = vh;
    }

    window.visualViewport.addEventListener('resize', onViewportResize, { passive: true });
    window.visualViewport.addEventListener('scroll', onViewportResize, { passive: true });

    // also when input gains focus (some browsers don't fire resize reliably)
    userInput.addEventListener('focus', () => {
      // small timeout to allow keyboard to open
      setTimeout(onViewportResize, 50);
    });
    userInput.addEventListener('blur', () => {
      setTimeout(() => {
        setChatBottom(originalBottom);
        chatBody.style.maxHeight = '';
      }, 120);
    });
  }
  else {
    // Fallback: listen to window resize + focus events
    function fallbackResize() {
      const delta = window.innerHeight - document.documentElement.clientHeight;
      if (Math.abs(delta) > 120) {
        setChatBottom(Math.abs(delta) + 12);
        chatBody.style.maxHeight = (window.innerHeight - 140) + 'px';
      } else {
        setChatBottom(originalBottom);
        chatBody.style.maxHeight = '';
      }
    }

    window.addEventListener('resize', () => setTimeout(fallbackResize, 50), { passive: true });
    userInput.addEventListener('focus', () => setTimeout(fallbackResize, 120));
    userInput.addEventListener('blur', () => {
      setTimeout(() => {
        setChatBottom(originalBottom);
        chatBody.style.maxHeight = '';
      }, 120);
    });
  }

  // Extra: when opening chat (Fii AI button), ensure scroll to bottom and focus behavior
  const fiiBtn = document.getElementById('fiiAiBtn');
  const closeBtn = document.getElementById('closeFiiAi');
  if (fiiBtn) {
    fiiBtn.addEventListener('click', () => {
      // slight delay to let chat display; then scroll to bottom
      setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 220);
    });
  }
  // when send or new message appended, ensure scroll to bottom
  const origRender = null; // no override here; existing code already scrolls in renderMessages()
})();

