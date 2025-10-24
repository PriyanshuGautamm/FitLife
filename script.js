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


  