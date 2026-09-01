// Nimbus - Local-first Personal To-Do & Agenda Web App

(function () {
  "use strict";

  // Elements
  const dateEl = document.getElementById("app-date");
  const timeEl = document.getElementById("app-time");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const exportDataBtn = document.getElementById("export-data-btn");
  const importDataBtn = document.getElementById("import-data-btn");
  const importFileInput = document.getElementById("import-file-input");
  const clearDataBtn = document.getElementById("clear-data-btn");

  // Clock
  function updateClock() {
    const now = new Date();
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  // Atmosphere / Theme Handling (Day, Twilight, Night, Random)
  const themePicker = document.getElementById("theme-picker");

  function getThemePreference() {
    return localStorage.getItem("nimbus.theme") || "night";
  }

  function resolveEffectiveTheme(pref) {
    if (pref === "random") {
      const cached = sessionStorage.getItem("nimbus.activeRandomTheme");
      if (cached && ["day", "twilight", "night"].includes(cached)) return cached;
      const modes = ["day", "twilight", "night"];
      const picked = modes[Math.floor(Math.random() * modes.length)];
      sessionStorage.setItem("nimbus.activeRandomTheme", picked);
      return picked;
    }
    if (pref === "dark") return "night";
    if (pref === "light") return "day";
    return pref;
  }

  function applyTheme(pref) {
    localStorage.setItem("nimbus.theme", pref);
    const effective = resolveEffectiveTheme(pref);

    document.documentElement.classList.remove("night", "dark", "twilight");

    if (effective === "night") {
      document.documentElement.classList.add("night", "dark");
    } else if (effective === "twilight") {
      document.documentElement.classList.add("twilight");
    } // "day" has no extra class

    updateThemePickerUI(pref);
  }

  function updateThemePickerUI(pref) {
    if (!themePicker) return;
    const chips = themePicker.querySelectorAll(".theme-chip");
    chips.forEach((chip) => {
      const val = chip.getAttribute("data-theme-val");
      const isSelected = val === pref || (pref === "dark" && val === "night") || (pref === "light" && val === "day");
      chip.classList.toggle("theme-chip--active", isSelected);
      chip.setAttribute("aria-checked", isSelected ? "true" : "false");
    });
  }

  // Settings Modal
  function openSettings() {
    if (settingsModal) settingsModal.hidden = false;
  }

  function closeSettings() {
    if (settingsModal) settingsModal.hidden = true;
  }

  // Data Export & Import
  function exportData() {
    const backup = {
      version: 1,
      appName: "Nimbus",
      exportedAt: new Date().toISOString(),
      theme: getThemePreference(),
      tasks: JSON.parse(localStorage.getItem("nimbus.tasks") || "[]"),
      lists: JSON.parse(localStorage.getItem("nimbus.lists") || "[]"),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `nimbus-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        const data = JSON.parse(evt.target.result);
        if (!data || typeof data !== "object") throw new Error("Invalid format");
        if (confirm("Restore data from backup? This will overwrite your current tasks.")) {
          if (Array.isArray(data.tasks)) localStorage.setItem("nimbus.tasks", JSON.stringify(data.tasks));
          if (Array.isArray(data.lists)) localStorage.setItem("nimbus.lists", JSON.stringify(data.lists));
          if (data.theme) localStorage.setItem("nimbus.theme", data.theme);
          location.reload();
        }
      } catch (err) {
        alert("Failed to import: file is not a valid Nimbus backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearData() {
    if (confirm("Are you sure you want to clear all tasks and lists? This cannot be undone.")) {
      localStorage.removeItem("nimbus.tasks");
      localStorage.removeItem("nimbus.lists");
      location.reload();
    }
  }

  // Event Listeners
  if (settingsBtn) settingsBtn.addEventListener("click", openSettings);
  if (themePicker) {
    themePicker.addEventListener("click", (e) => {
      const chip = e.target.closest(".theme-chip");
      if (!chip) return;
      const themeVal = chip.getAttribute("data-theme-val");
      if (themeVal === "random") {
        sessionStorage.removeItem("nimbus.activeRandomTheme");
      }
      applyTheme(themeVal);
    });
  }
  if (exportDataBtn) exportDataBtn.addEventListener("click", exportData);
  if (importDataBtn && importFileInput) {
    importDataBtn.addEventListener("click", () => importFileInput.click());
    importFileInput.addEventListener("change", importData);
  }
  if (clearDataBtn) clearDataBtn.addEventListener("click", clearData);

  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-settings]")) {
      closeSettings();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsModal && !settingsModal.hidden) {
      closeSettings();
    }
  });

  // Dynamic Drifting Nimbus Clouds System
  const cloudsLayer = document.getElementById("clouds-layer");
  let clouds = [];
  let lastFrameTime = null;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function createCloudElement(width, height) {
    const cloudEl = document.createElement("div");
    cloudEl.className = "nimbus-cloud";
    cloudEl.style.width = width + "px";
    cloudEl.style.height = height + "px";

    // Build an uneven bank of overlapping lobes for a fuller cumulus silhouette.
    const lobeCount = randInt(7, 10);
    for (let i = 0; i < lobeCount; i++) {
      const lobe = document.createElement("span");
      const altType = i % 3 === 1 ? " nimbus-lobe--alt1" : i % 3 === 2 ? " nimbus-lobe--alt2" : "";
      lobe.className = "nimbus-lobe" + altType;

      const lobeW = rand(width * 0.26, width * 0.46);
      const lobeH = rand(height * 0.38, height * 0.7);
      const lobeLeft = rand(width * -0.04, width * 0.74);
      const lobeTop = rand(height * 0.04, height * 0.42);

      lobe.style.width = lobeW + "px";
      lobe.style.height = lobeH + "px";
      lobe.style.left = lobeLeft + "px";
      lobe.style.top = lobeTop + "px";
      lobe.style.opacity = rand(0.72, 0.96);

      cloudEl.appendChild(lobe);
    }

    return cloudEl;
  }

  function spawnCloud(initialX) {
    if (!cloudsLayer) return null;

    const width = randInt(720, 1040);
    const height = randInt(360, 540);
    const scale = rand(0.92, 1.22);
    // Keep clouds in upper sky region (0% to 22% of viewport height)
    const maxY = Math.max(20, window.innerHeight * 0.22);
    const y = rand(0, maxY);
    // Large cloud banks move slowly enough to feel distant and weighty.
    const speed = rand(3.5, 6.8);

    const el = createCloudElement(width, height);
    const x = initialX !== undefined ? initialX : -width - rand(60, 240);

    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    cloudsLayer.appendChild(el);

    const cloud = { el, x, y, width, height, speed, scale };
    clouds.push(cloud);
    return cloud;
  }

  function initClouds() {
    if (!cloudsLayer) return;
    cloudsLayer.innerHTML = "";
    clouds = [];

    const screenW = window.innerWidth || 1200;
    // Initial staggered population across viewport
    const count = Math.max(2, Math.min(4, Math.ceil(screenW / 700)));
    const step = (screenW + 520) / count;

    for (let i = 0; i < count; i++) {
      const startX = -200 + i * step + rand(-60, 60);
      spawnCloud(startX);
    }

    lastFrameTime = performance.now();
    requestAnimationFrame(cloudAnimationLoop);
  }

  function cloudAnimationLoop(now) {
    if (!lastFrameTime) lastFrameTime = now;
    let dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Cap delta time to prevent jumps when tab is in background
    if (dt > 0.1) dt = 0.1;

    const screenW = window.innerWidth || 1200;

    for (let i = clouds.length - 1; i >= 0; i--) {
      const c = clouds[i];
      c.x += c.speed * dt;
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.scale})`;

      // If cloud drifted fully past the right edge of the screen, recycle it
      if (c.x > screenW + 100) {
        if (c.el.parentNode) c.el.parentNode.removeChild(c.el);
        clouds.splice(i, 1);
        spawnCloud(-c.width - rand(80, 300));
      }
    }

    requestAnimationFrame(cloudAnimationLoop);
  }

  // Init
  updateClock();
  setInterval(updateClock, 1000);
  applyTheme(getThemePreference());
  initClouds();
})();
