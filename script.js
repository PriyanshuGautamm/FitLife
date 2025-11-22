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


   // ===== Fii AI Assistant Logic (replace old code block) =====

const FII_BACKEND = "http://localhost:5000"; // change to your deployed backend URL when live

const fiiBtn = document.getElementById("fiiAiBtn");
const fiiChat = document.getElementById("fiiAiChat");
const closeFiiAi = document.getElementById("closeFiiAi");
const sendMsg = document.getElementById("sendMsg");
const userInput = document.getElementById("userInput");
const fiiChatBody = document.getElementById("fiiChatBody");
const openHistoryBtn = document.getElementById("openHistory");

// Local storage key
const STORAGE_KEY = "fii_history_v1";

// Load history from localStorage (array of {role, content})
let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// Helper: render the chat body from history
function renderChatBody() {
  fiiChatBody.innerHTML = "";
  if (history.length === 0) {
    const welcome = document.createElement("div");
    welcome.className = "ai-message";
    welcome.textContent = "Hi 👋 I'm Fii AI! How can I help you today?";
    fiiChatBody.appendChild(welcome);
    return;
  }
  for (const m of history) {
    const div = document.createElement("div");
    div.textContent = m.content;
    div.className = m.role === "assistant" ? "ai-message" : "user-message";
    fiiChatBody.appendChild(div);
  }
  fiiChatBody.scrollTop = fiiChatBody.scrollHeight;
}

// Save history helper
function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Open chat
fiiBtn.addEventListener("click", () => {
  fiiChat.style.display = "flex";
  renderChatBody();
});

// Close chat
closeFiiAi.addEventListener("click", () => {
  fiiChat.style.display = "none";
});

// Scroll effect → button changes to circle
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    fiiBtn.classList.add("scrolled");
    fiiBtn.textContent = "Fii";
  } else {
    fiiBtn.classList.remove("scrolled");
    fiiBtn.textContent = "Fii AI";
  }
});

// Open History - toggles a simple modal/panel inside the chat top
openHistoryBtn && openHistoryBtn.addEventListener("click", () => {
  // We'll reuse the chat body as a simple history list view
  // For a nicer UI you can implement a separate panel instead
  const historyPanel = document.createElement("div");
  historyPanel.style.position = "absolute";
  historyPanel.style.left = "12px";
  historyPanel.style.top = "56px";
  historyPanel.style.width = "260px";
  historyPanel.style.maxHeight = "320px";
  historyPanel.style.overflow = "auto";
  historyPanel.style.background = "#fff";
  historyPanel.style.border = "1px solid #eee";
  historyPanel.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
  historyPanel.style.padding = "8px";
  historyPanel.style.zIndex = 1100;

  historyPanel.innerHTML = `<strong>Conversation history</strong><button id="closeHistoryPanel" style="float:right">Close</button><div style="clear:both"></div>`;
  if (history.length === 0) {
    const p = document.createElement("div");
    p.textContent = "No history yet.";
    p.style.marginTop = "8px";
    historyPanel.appendChild(p);
  } else {
    history.slice().reverse().forEach((m, i) => {
      const r = document.createElement("div");
      r.style.padding = "6px";
      r.style.borderBottom = "1px solid #f1f1f1";
      r.innerHTML = `<small style="color:#888">${m.role}</small><div>${m.content}</div>`;
      historyPanel.appendChild(r);
    });
  }

  document.querySelector(".fii-ai-chatbox").appendChild(historyPanel);

  document.getElementById("closeHistoryPanel").addEventListener("click", () => {
    historyPanel.remove();
  });
});

// Send message handler - sends to backend and updates history
async function sendFiiMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // push user message to history and render immediately
  history.push({ role: "user", content: text });
  saveHistory();
  renderChatBody();

  userInput.value = "";
  userInput.focus();

  // show temporary typing indicator
  const typingEl = document.createElement("div");
  typingEl.className = "ai-message";
  typingEl.textContent = "Fii AI is typing...";
  fiiChatBody.appendChild(typingEl);
  fiiChatBody.scrollTop = fiiChatBody.scrollHeight;

  try {
    const res = await fetch(`${FII_BACKEND}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history // send existing history for context
      })
    });

    const data = await res.json();
    // remove typing
    typingEl.remove();

    const reply = data.reply || "Sorry, I couldn't generate a response.";
    // append assistant message to history and save
    history.push({ role: "assistant", content: reply });
    saveHistory();
    renderChatBody();
  } catch (err) {
    console.error("Fii AI request error:", err);
    typingEl.remove();
    const errDiv = document.createElement("div");
    errDiv.className = "ai-message";
    errDiv.textContent = "Network error. Please try again.";
    fiiChatBody.appendChild(errDiv);
  }
}

// Wire send button and Enter key
sendMsg.addEventListener("click", sendFiiMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendFiiMessage();
  }
});

// initial render
renderChatBody();


