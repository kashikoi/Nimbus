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

  // Theme Handling
  function getTheme() {
    return localStorage.getItem("nimbus.theme") || "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      if (themeToggleBtn) themeToggleBtn.innerHTML = "&#9728;&#65039; Light mode";
    } else {
      document.documentElement.classList.remove("dark");
      if (themeToggleBtn) themeToggleBtn.innerHTML = "&#127769; Dark mode";
    }
    localStorage.setItem("nimbus.theme", theme);
  }

  function toggleTheme() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
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
      theme: getTheme(),
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
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
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

  // Init
  updateClock();
  setInterval(updateClock, 1000);
  applyTheme(getTheme());
})();
