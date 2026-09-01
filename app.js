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
  const randomizeDataBtn = document.getElementById("randomize-data-btn");
  const clearDataBtn = document.getElementById("clear-data-btn");
  const app = document.querySelector(".app");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const addGroupBtn = document.getElementById("add-group-btn");
  const customGroups = document.getElementById("custom-groups");
  const todoModal = document.getElementById("todo-modal");
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const groupModal = document.getElementById("group-modal");
  const groupForm = document.getElementById("group-form");
  const groupInput = document.getElementById("group-input");
  const groupDeleteModal = document.getElementById("group-delete-modal");
  const groupDeleteMessage = document.getElementById("group-delete-message");
  const moveGroupTasksBtn = document.getElementById("move-group-tasks-btn");
  const deleteGroupTasksBtn = document.getElementById("delete-group-tasks-btn");
  const WEEKDAYS = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
  let draggedTaskId = null;
  let taskDropCommitted = false;
  let draggedGroupId = null;
  let groupDropCommitted = false;
  let dragScrollSpeed = 0;
  let dragScrollFrame = null;
  let tasks = loadTasks();
  let groups = loadGroups();
  let groupPendingDeletion = null;

  if (tasks.some((task) => task.day === "backlog")) {
    tasks.forEach((task) => {
      if (task.day === "backlog") task.day = null;
    });
    saveTasks();
  }

  function loadTasks() {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("nimbus.tasks") || "[]");
      return Array.isArray(savedTasks) ? savedTasks.filter((task) => task && typeof task.id === "string" && typeof task.text === "string") : [];
    } catch (error) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem("nimbus.tasks", JSON.stringify(tasks));
  }

  function loadGroups() {
    try {
      const savedGroups = JSON.parse(localStorage.getItem("nimbus.groups") || "[]");
      return Array.isArray(savedGroups)
        ? savedGroups.filter((group) => group && typeof group.id === "string" && typeof group.name === "string" && group.name.trim())
        : [];
    } catch (error) {
      return [];
    }
  }

  function saveGroups() {
    localStorage.setItem("nimbus.groups", JSON.stringify(groups));
  }

  function renderGroups() {
    if (!customGroups) return;
    customGroups.replaceChildren();
    groups.forEach((group) => {
      const section = document.createElement("section");
      section.className = "custom-group";
      section.dataset.groupId = group.id;

      const heading = document.createElement("div");
      heading.className = "custom-group__heading";
      heading.draggable = true;
      heading.title = "Drag to reorder group";
      const title = document.createElement("h2");
      title.className = "day-group__title";
      title.textContent = group.name;
      const deleteButton = document.createElement("button");
      deleteButton.className = "custom-group__delete";
      deleteButton.type = "button";
      deleteButton.textContent = "🗑";
      deleteButton.title = "Delete group";
      deleteButton.setAttribute("aria-label", `Delete ${group.name}`);
      heading.append(title, deleteButton);

      const list = document.createElement("div");
      list.className = "task-list";
      list.dataset.list = group.id;
      list.setAttribute("aria-label", `${group.name} to-dos`);
      section.append(heading, list);
      customGroups.appendChild(section);
    });
  }

  function renderTasks() {
    if (!app) return;
    app.querySelectorAll(".task-list").forEach((list) => {
      list.replaceChildren();
      const location = list.dataset.list;
      tasks.filter((task) => (task.day || "unassigned") === location).forEach((task) => {
        const card = document.createElement("article");
        card.className = `task-card${task.done ? " task-card--done" : ""}`;
        card.draggable = true;
        card.dataset.taskId = task.id;

        const check = document.createElement("input");
        check.className = "task-card__check";
        check.type = "checkbox";
        check.checked = Boolean(task.done);
        check.setAttribute("aria-label", `Mark ${task.text} as done`);

        const text = document.createElement("span");
        text.className = "task-card__text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "task-card__delete";
        deleteButton.type = "button";
        deleteButton.textContent = "🗑";
        deleteButton.title = "Delete to-do";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        card.append(text, deleteButton, check);
        list.appendChild(card);
      });
    });
  }

  function openTodoModal() {
    todoModal.hidden = false;
    todoInput.focus();
  }

  function closeTodoModal() {
    todoModal.hidden = true;
    todoForm.reset();
  }

  function openGroupModal() {
    groupModal.hidden = false;
    groupInput.focus();
  }

  function closeGroupModal() {
    groupModal.hidden = true;
    groupForm.reset();
  }

  function openGroupDeleteModal(groupId) {
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;
    groupPendingDeletion = groupId;
    groupDeleteMessage.textContent = `What should happen to the to-dos in ${group.name}?`;
    groupDeleteModal.hidden = false;
  }

  function closeGroupDeleteModal() {
    groupDeleteModal.hidden = true;
    groupPendingDeletion = null;
  }

  function deleteGroup(moveTasks) {
    if (!groupPendingDeletion) return;
    if (moveTasks) {
      tasks.forEach((task) => {
        if (task.day === groupPendingDeletion) task.day = null;
      });
    } else {
      tasks = tasks.filter((task) => task.day !== groupPendingDeletion);
    }
    groups = groups.filter((group) => group.id !== groupPendingDeletion);
    saveTasks();
    saveGroups();
    renderGroups();
    renderTasks();
    closeGroupDeleteModal();
  }

  function saveTaskOrder(location) {
    const draggedTask = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTask) return;
    draggedTask.day = location === "unassigned" ? null : location;

    const taskOrder = [...app.querySelectorAll(".task-list .task-card")].map((card) => card.dataset.taskId);
    tasks = taskOrder.map((taskId) => tasks.find((task) => task.id === taskId)).filter(Boolean);
    saveTasks();
  }

  function animateTaskShuffle(reorder) {
    const positions = new Map(
      [...app.querySelectorAll(".task-card:not(.task-card--dragging)")]
        .map((card) => [card, card.getBoundingClientRect()])
    );

    reorder();

    positions.forEach((before, card) => {
      const after = card.getBoundingClientRect();
      const deltaY = before.top - after.top;
      if (!deltaY) return;
      card.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0)" },
        ],
        { duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    });
  }

  function animateGroupShuffle(reorder) {
    const positions = new Map(
      [...customGroups.querySelectorAll(".custom-group:not(.custom-group--dragging)")]
        .map((group) => [group, group.getBoundingClientRect()])
    );

    reorder();

    positions.forEach((before, group) => {
      const after = group.getBoundingClientRect();
      const deltaY = before.top - after.top;
      if (!deltaY) return;
      group.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0)" },
        ],
        { duration: 240, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    });
  }

  function reorderDraggingGroup(target, clientY) {
    const draggedGroup = customGroups.querySelector(`[data-group-id="${draggedGroupId}"]`);
    if (!draggedGroup || target === draggedGroup) return;

    const targetBounds = target.getBoundingClientRect();
    const insertAfter = clientY > targetBounds.top + targetBounds.height / 2;
    const reference = insertAfter ? target.nextSibling : target;
    if (reference === draggedGroup || target.nextElementSibling === draggedGroup && insertAfter) return;
    animateGroupShuffle(() => customGroups.insertBefore(draggedGroup, reference));
  }

  function saveGroupOrder() {
    const groupOrder = [...customGroups.querySelectorAll(".custom-group")].map((group) => group.dataset.groupId);
    groups = groupOrder.map((groupId) => groups.find((group) => group.id === groupId)).filter(Boolean);
    saveGroups();
  }

  function reorderDraggingCard(list, target, clientY) {
    const draggedCard = app.querySelector(`[data-task-id="${draggedTaskId}"]`);
    if (!draggedCard || target === draggedCard) return;

    if (!target) {
      if (draggedCard.parentElement === list && draggedCard.nextElementSibling === null) return;
      animateTaskShuffle(() => list.appendChild(draggedCard));
      return;
    }

    const targetBounds = target.getBoundingClientRect();
    const insertAfter = clientY > targetBounds.top + targetBounds.height / 2;
    const reference = insertAfter ? target.nextSibling : target;
    if (reference === draggedCard || target.nextElementSibling === draggedCard && insertAfter) return;
    animateTaskShuffle(() => list.insertBefore(draggedCard, reference));
  }

  function moveTask(location) {
    saveTaskOrder(location);
    renderTasks();
  }

  function scrollWhileDragging() {
    if (!dragScrollSpeed || !draggedTaskId) {
      dragScrollFrame = null;
      return;
    }
    window.scrollBy({ top: dragScrollSpeed, behavior: "instant" });
    dragScrollFrame = requestAnimationFrame(scrollWhileDragging);
  }

  function updateDragScroll(clientY) {
    const edgeSize = 110;
    const topDistance = clientY;
    const bottomDistance = window.innerHeight - clientY;

    if (topDistance < edgeSize) {
      dragScrollSpeed = -Math.ceil(((edgeSize - topDistance) / edgeSize) * 18);
    } else if (bottomDistance < edgeSize) {
      dragScrollSpeed = Math.ceil(((edgeSize - bottomDistance) / edgeSize) * 18);
    } else {
      dragScrollSpeed = 0;
    }

    if (dragScrollSpeed && !dragScrollFrame) {
      dragScrollFrame = requestAnimationFrame(scrollWhileDragging);
    }
  }

  function stopDragScroll() {
    dragScrollSpeed = 0;
    if (dragScrollFrame) cancelAnimationFrame(dragScrollFrame);
    dragScrollFrame = null;
  }

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
    updateWeekDates(now);
  }

  function updateWeekDates(now) {
    const saturday = new Date(now);
    saturday.setDate(now.getDate() - ((now.getDay() + 1) % 7));

    WEEKDAYS.forEach((day, index) => {
      const date = new Date(saturday);
      date.setDate(saturday.getDate() + index);
      const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const dateElement = document.querySelector(`[data-date-for="${day}"]`);
      if (dateElement) dateElement.textContent = dateLabel;

      const group = document.querySelector(`.day-group[data-day="${day}"]`);
      if (group) group.classList.toggle("day-group--today", day === WEEKDAYS[(now.getDay() + 1) % 7]);
    });
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
      groups: JSON.parse(localStorage.getItem("nimbus.groups") || "[]"),
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
          if (Array.isArray(data.groups)) localStorage.setItem("nimbus.groups", JSON.stringify(data.groups));
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
      localStorage.removeItem("nimbus.groups");
      location.reload();
    }
  }

  function randomizeDemoData() {
    if (!confirm("Replace your current to-dos with demo data? Export first if you want to keep them.")) return;

    const demoItems = [
      ["Pick up fresh flowers", null, true],
      ["Choose a recipe for the week", null, false],
      ["Call the dentist", null, false],
      ["Organize photo library", "demo-home", false],
      ["Research weekend getaway", "demo-home", false],
      ["Refill travel mug", "saturday", true],
      ["Morning trail walk", "saturday", false],
      ["Order pantry staples", "saturday", false],
      ["Slow breakfast", "sunday", true],
      ["Plan meals and groceries", "sunday", false],
      ["Set out Monday clothes", "sunday", false],
      ["Review weekly priorities", "monday", false],
      ["Send project update", "monday", false],
      ["Book focus time", "tuesday", false],
      ["Water the plants", "wednesday", false],
      ["Laundry load", "thursday", false],
      ["Close out the week", "friday", false],
    ];

    groups = [{ id: "demo-home", name: "Home projects" }];
    tasks = demoItems.map(([text, day, done], index) => ({
      id: `demo-${Date.now()}-${index}`,
      text,
      day,
      done,
    }));
    saveTasks();
    saveGroups();
    renderGroups();
    renderTasks();
    closeSettings();
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
  if (randomizeDataBtn) randomizeDataBtn.addEventListener("click", randomizeDemoData);
  if (clearDataBtn) clearDataBtn.addEventListener("click", clearData);
  if (addTodoBtn) addTodoBtn.addEventListener("click", openTodoModal);
  if (addGroupBtn) addGroupBtn.addEventListener("click", openGroupModal);
  if (todoForm) {
    todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;
      tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, done: false, day: null });
      saveTasks();
      renderTasks();
      closeTodoModal();
    });
  }
  if (groupForm) {
    groupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = groupInput.value.trim();
      if (!name) return;
      groups.push({ id: `group-${Date.now()}-${Math.random().toString(36).slice(2)}`, name });
      saveGroups();
      renderGroups();
      renderTasks();
      closeGroupModal();
    });
  }
  if (moveGroupTasksBtn) moveGroupTasksBtn.addEventListener("click", () => deleteGroup(true));
  if (deleteGroupTasksBtn) deleteGroupTasksBtn.addEventListener("click", () => deleteGroup(false));

  if (app) {
    app.addEventListener("click", (event) => {
      const groupDeleteButton = event.target.closest(".custom-group__delete");
      if (groupDeleteButton) {
        openGroupDeleteModal(groupDeleteButton.closest(".custom-group").dataset.groupId);
        return;
      }
      const deleteButton = event.target.closest(".task-card__delete");
      if (!deleteButton) return;
      const card = deleteButton.closest(".task-card");
      tasks = tasks.filter((task) => task.id !== card.dataset.taskId);
      saveTasks();
      card.remove();
    });

    app.addEventListener("change", (event) => {
      const check = event.target.closest(".task-card__check");
      if (!check) return;
      const task = tasks.find((item) => item.id === check.closest(".task-card").dataset.taskId);
      if (!task) return;
      task.done = check.checked;
      saveTasks();
      check.closest(".task-card").classList.toggle("task-card--done", task.done);
    });

    app.addEventListener("dragstart", (event) => {
      const groupHeading = event.target.closest(".custom-group__heading");
      if (groupHeading && !event.target.closest("button")) {
        const group = groupHeading.closest(".custom-group");
        draggedGroupId = group.dataset.groupId;
        groupDropCommitted = false;
        group.classList.add("custom-group--dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", draggedGroupId);
        return;
      }

      const card = event.target.closest(".task-card");
      if (!card || event.target.closest("input, button")) return;
      draggedTaskId = card.dataset.taskId;
      taskDropCommitted = false;
      card.classList.add("task-card--dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedTaskId);
    });

    app.addEventListener("dragend", (event) => {
      const group = event.target.closest(".custom-group__heading")?.closest(".custom-group");
      if (group) {
        group.classList.remove("custom-group--dragging");
        if (!groupDropCommitted) {
          renderGroups();
          renderTasks();
        }
        draggedGroupId = null;
        return;
      }

      event.target.closest(".task-card")?.classList.remove("task-card--dragging");
      stopDragScroll();
      if (!taskDropCommitted) renderTasks();
      draggedTaskId = null;
    });

    app.addEventListener("dragover", (event) => {
      if (draggedGroupId) {
        const target = event.target.closest(".custom-group");
        if (!target) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        reorderDraggingGroup(target, event.clientY);
        return;
      }

      const list = event.target.closest(".task-list");
      if (!list || !draggedTaskId) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      reorderDraggingCard(list, event.target.closest(".task-card"), event.clientY);
    });

    app.addEventListener("drop", (event) => {
      if (draggedGroupId) {
        const target = event.target.closest(".custom-group");
        if (!target) return;
        event.preventDefault();
        groupDropCommitted = true;
        saveGroupOrder();
        renderGroups();
        renderTasks();
        return;
      }

      const list = event.target.closest(".task-list");
      if (!list || !draggedTaskId) return;
      event.preventDefault();
      taskDropCommitted = true;
      stopDragScroll();
      moveTask(list.dataset.list);
    });
  }

  document.addEventListener("dragover", (event) => {
    if (draggedTaskId) updateDragScroll(event.clientY);
  });

  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-settings]")) {
      closeSettings();
    }
    if (e.target.matches("[data-close-todo]")) {
      closeTodoModal();
    }
    if (e.target.matches("[data-close-group]")) {
      closeGroupModal();
    }
    if (e.target.matches("[data-close-group-delete]")) {
      closeGroupDeleteModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsModal && !settingsModal.hidden) {
      closeSettings();
    }
    if (e.key === "Escape" && todoModal && !todoModal.hidden) {
      closeTodoModal();
    }
    if (e.key === "Escape" && groupModal && !groupModal.hidden) {
      closeGroupModal();
    }
    if (e.key === "Escape" && groupDeleteModal && !groupDeleteModal.hidden) {
      closeGroupDeleteModal();
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

    // Build 4 to 6 randomized overlapping volumetric lobes
    const lobeCount = randInt(4, 6);
    for (let i = 0; i < lobeCount; i++) {
      const lobe = document.createElement("span");
      const altType = i % 3 === 1 ? " nimbus-lobe--alt1" : i % 3 === 2 ? " nimbus-lobe--alt2" : "";
      lobe.className = "nimbus-lobe" + altType;

      const lobeW = rand(width * 0.45, width * 0.72);
      const lobeH = rand(height * 0.48, height * 0.78);
      const lobeLeft = rand(width * 0.05, width * 0.48);
      const lobeTop = rand(height * 0.05, height * 0.45);

      lobe.style.width = lobeW + "px";
      lobe.style.height = lobeH + "px";
      lobe.style.left = lobeLeft + "px";
      lobe.style.top = lobeTop + "px";
      lobe.style.opacity = rand(0.78, 0.94);

      cloudEl.appendChild(lobe);
    }

    return cloudEl;
  }

  function spawnCloud(initialX) {
    if (!cloudsLayer) return null;

    const width = randInt(500, 750);
    const height = randInt(280, 420);
    const scale = rand(0.82, 1.15);
    // Keep clouds in upper sky region (0% to 22% of viewport height)
    const maxY = Math.max(20, window.innerHeight * 0.22);
    const y = rand(0, maxY);
    // Smooth, gentle drift speed limit (between 8px/s and 18px/s)
    const speed = rand(8.5, 17.5);

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
    const count = Math.max(3, Math.min(5, Math.floor(screenW / 380)));
    const step = (screenW + 300) / count;

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
  renderGroups();
  renderTasks();
  initClouds();
})();
