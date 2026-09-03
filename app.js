// Nimbus - Local-first Personal To-Do & Agenda Web App

(function () {
  "use strict";

  // Elements
  const dateEl = document.getElementById("app-date");
  const timeEl = document.getElementById("app-time");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const aboutBtn = document.getElementById("about-btn");
  const aboutModal = document.getElementById("about-modal");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const exportDataBtn = document.getElementById("export-data-btn");
  const importDataBtn = document.getElementById("import-data-btn");
  const importFileInput = document.getElementById("import-file-input");
  const cloudPhraseInput = document.getElementById("cloud-phrase");
  const rememberCloudPhraseInput = document.getElementById("remember-cloud-phrase");
  const toggleCloudPhraseBtn = document.getElementById("toggle-cloud-phrase-btn");
  const generateCloudPhraseBtn = document.getElementById("generate-cloud-phrase-btn");
  const cloudPhraseOutput = document.getElementById("cloud-phrase-output");
  const cloudLoadDataBtn = document.getElementById("cloud-load-data-btn");
  const cloudSaveDataBtn = document.getElementById("cloud-save-data-btn");
  const downloadEncryptedDataBtn = document.getElementById("download-encrypted-data-btn");
  const importEncryptedDataBtn = document.getElementById("import-encrypted-data-btn");
  const importEncryptedFileInput = document.getElementById("import-encrypted-file-input");
  const cloudDataStatus = document.getElementById("cloud-data-status");
  const randomizeDataBtn = document.getElementById("randomize-data-btn");
  const clearDataBtn = document.getElementById("clear-data-btn");
  const app = document.querySelector(".app");
  const tabBar = document.getElementById("tab-bar");
  const appCanvas = document.getElementById("app-canvas");
  const tabDeleteModal = document.getElementById("tab-delete-modal");
  const tabDeleteMessage = document.getElementById("tab-delete-message");
  const deleteTabBtn = document.getElementById("delete-tab-btn");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const addGroupBtn = document.getElementById("add-group-btn");
  const collapseAllBtn = document.getElementById("collapse-all-btn");
  const expandAllBtn = document.getElementById("expand-all-btn");
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
  const moveActionModal = document.getElementById("move-action-modal");
  const moveActionList = document.getElementById("move-action-list");
  const WEEKDAYS = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
  const DEFAULT_TAB_ID = "tab-default";
  const CLOUD_SYNC_ENDPOINT = "https://nimbus-sync.nimbus-sync.workers.dev";
  const CLOUD_SYNC_FORMAT = "kashikoi-encrypted-backup-v1";
  const LEGACY_CLOUD_SYNC_FORMAT = "nimbus-encrypted-backup-v1";
  const UNIFIED_BACKUP_SCHEMA = "kashikoi-app-backup-v1";
  const REMEMBER_CLOUD_PHRASE_KEY = "nimbus.cloudPhrase";
  const CLOUD_KDF_ITERATIONS = 600000;
  const RECOVERY_PHRASE_WORD_COUNT = 16;
  const RECOVERY_WORDS = [
    "anchor", "apricot", "arbor", "atlas", "autumn", "baker", "bamboo", "beacon", "birch", "breeze", "brook", "cabin", "cactus", "canvas", "cedar", "cinder",
    "clover", "cobalt", "comet", "copper", "coral", "cotton", "cricket", "daisy", "delta", "denim", "dolphin", "dragon", "ember", "falcon", "fennel", "field",
    "forest", "fossil", "garden", "ginger", "glacier", "harbor", "hazel", "honest", "indigo", "island", "jacket", "jasper", "juniper", "kernel", "lagoon", "lantern",
    "laurel", "lemon", "linen", "lotus", "maple", "marble", "meadow", "meteor", "misty", "nectar", "nickel", "oasis", "olive", "onward", "orchid", "otter",
    "palace", "paper", "pepper", "plume", "pocket", "prairie", "quartz", "quiet", "rabbit", "raven", "river", "rocket", "saffron", "sailor", "shadow", "silver",
    "sincere", "sketch", "spring", "stone", "sunset", "tandem", "timber", "topaz", "tulip", "velvet", "violet", "walnut", "willow", "window", "winter", "zephyr",
    "acorn", "almond", "amber", "artist", "basket", "blossom", "border", "bottle", "branch", "bridge", "butter", "castle", "cherry", "circle", "coffee", "compass",
    "dancer", "desert", "doctor", "engine", "fabric", "feather", "flower", "galaxy", "gentle", "golden", "guitar", "hammer", "helmet", "hollow", "jungle", "ladder",
    "magnet", "market", "mirror", "mother", "museum", "napkin", "needle", "orange", "pencil", "picnic", "planet", "puzzle", "ribbon", "saddle", "school", "secret",
    "signal", "smooth", "spirit", "summer", "thunder", "ticket", "tomato", "tunnel", "wander", "whisper", "yellow", "zipper", "agenda", "bright", "camera", "donut",
    "eagle", "fable", "glimmer", "horizon", "icicle", "jovial", "keeper", "lively", "mellow", "native", "opal", "pastel", "quiver", "relish", "shelter", "tropic",
    "uplift", "voyage", "wonder", "yonder", "zenith", "banjo", "boulder", "carpet", "daring", "estate", "frozen", "gravel", "humble", "inlet", "joyful", "kettle",
    "little", "memory", "narrow", "object", "pebble", "quaint", "reward", "season", "tablet", "unison", "valley", "wealth", "yearly", "zesty", "banyan", "canopy",
    "detail", "effort", "future", "gather", "honor", "inside", "jigsaw", "kitten", "legacy", "motion", "number", "option", "poetry", "radial", "sample", "temple",
    "unique", "vision", "weekly", "yogurt", "zodiac", "bistro", "cloud", "drift", "echo", "fluent", "groove", "haven", "impact", "jewel", "kindle", "lunar",
    "minute", "novel", "origin", "parcel", "quorum", "rescue", "sierra", "travel", "useful", "volume", "waffle", "yearn", "zinnia", "apollo", "brisk", "crystal",
  ];
  const isMobile = window.matchMedia("(pointer: coarse), (max-width: 720px)");
  let draggedTaskId = null;
  let draggedTaskIds = [];
  let taskDropCommitted = false;
  let draggedGroupId = null;
  let groupDropCommitted = false;
  let draggedTabId = null;
  let tabDropCommitted = false;
  let dragScrollSpeed = 0;
  let dragScrollFrame = null;
  let tabDragScrollSpeed = 0;
  let tabDragScrollFrame = null;
  let selectedTaskIds = new Set();
  let selectionAnchorId = null;
  let tabs = loadTabs();
  let activeTabId = loadActiveTabId();
  if (!tabs.some((tab) => tab.id === activeTabId)) activeTabId = DEFAULT_TAB_ID;
  let tasks = loadTasks();
  let groups = loadGroups();
  let groupPendingDeletion = null;
  let actionPendingMove = null;
  let tabPendingDeletion = null;
  let cloudDataDirty = false;

  function updateMobileMode() {
    document.documentElement.classList.toggle("mobile", isMobile.matches);
  }

  updateMobileMode();
  isMobile.addEventListener("change", updateMobileMode);

  if (tasks.some((task) => task.day === "backlog")) {
    tasks.forEach((task) => {
      if (task.day === "backlog") task.day = null;
    });
    saveTasks();
  }

  function loadTasks() {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("nimbus.tasks") || "[]");
      return Array.isArray(savedTasks)
        ? savedTasks
            .filter((task) => task && typeof task.id === "string" && typeof task.text === "string")
            .map((task) => ({ ...task, tabId: typeof task.tabId === "string" ? task.tabId : DEFAULT_TAB_ID }))
        : [];
    } catch (error) {
      return [];
    }
  }

  function loadTabs() {
    try {
      const savedTabs = JSON.parse(localStorage.getItem("nimbus.tabs") || "null");
      if (Array.isArray(savedTabs) && savedTabs.length) {
        const cleaned = savedTabs.filter((tab) => tab && typeof tab.id === "string" && typeof tab.name === "string");
        if (!cleaned.some((tab) => tab.id === DEFAULT_TAB_ID)) {
          cleaned.unshift({ id: DEFAULT_TAB_ID, name: "This Week" });
        }
        if (cleaned.length) return cleaned;
      }
    } catch (error) {
      // fall through to default
    }
    return [{ id: DEFAULT_TAB_ID, name: "This Week" }];
  }

  function saveTabs() {
    localStorage.setItem("nimbus.tabs", JSON.stringify(tabs));
    markCloudDataDirty();
  }

  function loadActiveTabId() {
    return localStorage.getItem("nimbus.activeTab") || DEFAULT_TAB_ID;
  }

  function saveActiveTabId() {
    localStorage.setItem("nimbus.activeTab", activeTabId);
    markCloudDataDirty();
  }

  function saveTasks() {
    localStorage.setItem("nimbus.tasks", JSON.stringify(tasks));
    markCloudDataDirty();
  }

  function fitActionHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function loadGroups() {
    try {
      const savedGroups = JSON.parse(localStorage.getItem("nimbus.groups") || "[]");
      return Array.isArray(savedGroups)
        ? savedGroups
            .filter((group) => group && typeof group.id === "string" && typeof group.name === "string")
            .map((group) => ({
              ...group,
              collapsed: Boolean(group.collapsed),
              tabId: typeof group.tabId === "string" ? group.tabId : DEFAULT_TAB_ID,
            }))
        : [];
    } catch (error) {
      return [];
    }
  }

  function saveGroups() {
    localStorage.setItem("nimbus.groups", JSON.stringify(groups));
    markCloudDataDirty();
  }

  function syncCustomGroupListState(list, collapsed) {
    if (!list) return;
    list.classList.toggle("task-list--collapsed", collapsed);
    list.setAttribute("aria-hidden", String(collapsed));
    list.style.maxHeight = collapsed ? "0px" : `${list.scrollHeight}px`;
    list.style.opacity = collapsed ? "0" : "1";
    list.style.transform = collapsed ? "translateY(-8px)" : "translateY(0)";
    list.style.pointerEvents = collapsed ? "none" : "auto";
  }

  function syncCustomGroupListStates() {
    customGroups?.querySelectorAll(".custom-group .task-list").forEach((list) => {
      const group = groups.find((item) => item.id === list.dataset.list);
      syncCustomGroupListState(list, Boolean(group && group.collapsed));
    });
  }

  function setAllGroupsCollapsed(collapsed) {
    groups = groups.map((group) => (group.tabId === activeTabId ? { ...group, collapsed } : group));
    saveGroups();
    renderGroups();
    renderTasks();
  }

  function toggleGroupCollapse(groupId) {
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;
    group.collapsed = !Boolean(group.collapsed);
    saveGroups();
    renderGroups();
    renderTasks();
  }

  function renderGroups() {
    if (!customGroups) return;
    customGroups.replaceChildren();
    groups.filter((group) => group.tabId === activeTabId).forEach((group) => {
      const section = document.createElement("section");
      section.className = `custom-group${group.collapsed ? " custom-group--collapsed" : ""}`;
      section.dataset.groupId = group.id;

      const heading = document.createElement("div");
      heading.className = "custom-group__heading";
      heading.draggable = true;
      heading.title = "Drag to reorder group";

      const collapseButton = document.createElement("button");
      collapseButton.className = "custom-group__toggle";
      collapseButton.type = "button";
      collapseButton.textContent = group.collapsed ? "▸" : "▾";
      collapseButton.title = group.collapsed ? "Expand group" : "Collapse group";
      collapseButton.setAttribute("aria-label", `${group.collapsed ? "Expand" : "Collapse"} ${group.name || "group"}`);
      collapseButton.setAttribute("aria-expanded", String(!group.collapsed));

      const title = document.createElement("input");
      title.className = "day-group__title custom-group__name";
      title.type = "text";
      title.value = group.name;
      title.placeholder = "New group";
      title.readOnly = true;
      title.dataset.groupName = group.id;
      title.setAttribute("aria-label", "Group name");

      const convertButton = document.createElement("button");
      convertButton.className = "custom-group__convert";
      convertButton.type = "button";
      convertButton.textContent = "📑";
      convertButton.title = "Convert to tab";
      convertButton.setAttribute("aria-label", `Convert ${group.name || "group"} to a tab`);

      const deleteButton = document.createElement("button");
      deleteButton.className = "custom-group__delete";
      deleteButton.type = "button";
      deleteButton.textContent = "🗑";
      deleteButton.title = "Delete group";
      deleteButton.setAttribute("aria-label", `Delete ${group.name || "group"}`);

      heading.append(collapseButton, title, convertButton, deleteButton);

      const list = document.createElement("div");
      list.className = "task-list";
      list.dataset.list = group.id;
      list.setAttribute("aria-label", `${group.name || "New group"} to-dos`);
      syncCustomGroupListState(list, Boolean(group.collapsed));
      section.append(heading, list);
      customGroups.appendChild(section);
    });
  }

  function renderTasks() {
    if (!app) return;
    if (selectedTaskIds.size) {
      const existingIds = new Set(tasks.map((task) => task.id));
      [...selectedTaskIds].forEach((id) => {
        if (!existingIds.has(id)) selectedTaskIds.delete(id);
      });
    }
    app.querySelectorAll(".task-list").forEach((list) => {
      list.replaceChildren();
      const location = list.dataset.list;
      tasks.filter((task) => (task.day || "unassigned") === location && task.tabId === activeTabId).forEach((task) => {
        const card = document.createElement("article");
        card.className = `task-card${task.done ? " task-card--done" : ""}${selectedTaskIds.has(task.id) ? " task-card--selected" : ""}`;
        card.draggable = true;
        card.dataset.taskId = task.id;

        const check = document.createElement("input");
        check.className = "task-card__check";
        check.type = "checkbox";
        check.checked = Boolean(task.done);
        check.setAttribute("aria-label", `Mark ${task.text || "action"} as done`);

        const text = document.createElement("textarea");
        text.className = "task-card__text";
        text.value = task.text;
        text.placeholder = "New action";
        text.rows = 1;
        text.readOnly = true;
        text.dataset.taskText = task.id;
        text.setAttribute("aria-label", "Action text");

        const deleteButton = document.createElement("button");
        deleteButton.className = "task-card__delete";
        deleteButton.type = "button";
        deleteButton.textContent = "🗑";
        deleteButton.title = "Delete to-do";
        deleteButton.setAttribute("aria-label", `Delete ${task.text || "action"}`);

        const moveButton = document.createElement("button");
        moveButton.className = "task-card__move";
        moveButton.type = "button";
        moveButton.textContent = "Move";
        moveButton.setAttribute("aria-label", `Move ${task.text || "action"}`);

        card.append(text, moveButton, deleteButton, check);
        list.appendChild(card);
        fitActionHeight(text);
      });
      const group = groups.find((item) => item.id === location);
      if (group) {
        syncCustomGroupListState(list, Boolean(group.collapsed));
      }
    });
    syncCustomGroupListStates();
  }

  function openTodoModal() {
    todoModal.hidden = false;
    todoInput.focus();
  }

  function closeTodoModal() {
    todoModal.hidden = true;
    todoForm.reset();
  }

  function focusEditable(selector) {
    const editable = document.querySelector(selector);
    if (!editable) return;
    enterEditMode(editable);
  }

  function enterEditMode(field) {
    if (!field) return;
    field.readOnly = false;
    field.focus();
    field.select();
  }

  function addBlankTask() {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    tasks.push({ id, text: "", done: false, day: null, tabId: activeTabId });
    saveTasks();
    renderTasks();
    focusEditable(`[data-task-text="${id}"]`);
  }

  function updateCanvasVisibility() {
    if (appCanvas) appCanvas.hidden = activeTabId !== DEFAULT_TAB_ID;
  }

  function renderTabs() {
    if (!tabBar) return;
    tabBar.replaceChildren();
    tabs.forEach((tab) => {
      const chip = document.createElement("div");
      chip.className = `tab-bar__tab${tab.id === activeTabId ? " tab-bar__tab--active" : ""}`;
      chip.dataset.tabId = tab.id;
      chip.draggable = tab.id !== DEFAULT_TAB_ID;
      if (chip.draggable) chip.title = "Drag to reorder tab";

      const name = document.createElement("input");
      name.className = "tab-bar__name";
      name.type = "text";
      name.value = tab.name;
      name.placeholder = "New tab";
      name.readOnly = true;
      name.size = Math.max(4, tab.name.length);
      name.dataset.tabName = tab.id;
      name.setAttribute("aria-label", "Tab name");
      chip.appendChild(name);

      if (tab.id !== DEFAULT_TAB_ID) {
        const deleteButton = document.createElement("button");
        deleteButton.className = "tab-bar__delete";
        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.title = "Delete tab";
        deleteButton.setAttribute("aria-label", `Delete ${tab.name || "tab"}`);
        deleteButton.dataset.tabDelete = tab.id;
        chip.appendChild(deleteButton);
      }

      tabBar.appendChild(chip);
    });

    const addButton = document.createElement("button");
    addButton.className = "tab-bar__add";
    addButton.type = "button";
    addButton.id = "add-tab-btn";
    addButton.textContent = "+";
    addButton.title = "Add tab";
    addButton.setAttribute("aria-label", "Add tab");
    tabBar.appendChild(addButton);
  }

  function setActiveTab(tabId) {
    if (tabId === activeTabId || !tabs.some((tab) => tab.id === tabId)) return;
    activeTabId = tabId;
    clearSelection();
    saveActiveTabId();
    renderTabs();
    updateCanvasVisibility();
    renderGroups();
    renderTasks();
  }

  function addBlankTab() {
    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    tabs.push({ id, name: "" });
    activeTabId = id;
    saveTabs();
    saveActiveTabId();
    renderTabs();
    updateCanvasVisibility();
    renderGroups();
    renderTasks();
    focusEditable(`[data-tab-name="${id}"]`);
  }

  function openTabDeleteModal(tabId) {
    const tab = tabs.find((item) => item.id === tabId);
    if (!tab || tabId === DEFAULT_TAB_ID) return;
    tabPendingDeletion = tabId;
    tabDeleteMessage.textContent = `Delete "${tab.name || "this tab"}" and all of its groups and to-dos? This cannot be undone.`;
    tabDeleteModal.hidden = false;
  }

  function closeTabDeleteModal() {
    tabDeleteModal.hidden = true;
    tabPendingDeletion = null;
  }

  function deleteTab() {
    if (!tabPendingDeletion || tabPendingDeletion === DEFAULT_TAB_ID) return;
    tasks = tasks.filter((task) => task.tabId !== tabPendingDeletion);
    groups = groups.filter((group) => group.tabId !== tabPendingDeletion);
    tabs = tabs.filter((tab) => tab.id !== tabPendingDeletion);
    if (activeTabId === tabPendingDeletion) activeTabId = DEFAULT_TAB_ID;
    saveTasks();
    saveGroups();
    saveTabs();
    saveActiveTabId();
    closeTabDeleteModal();
    renderTabs();
    updateCanvasVisibility();
    renderGroups();
    renderTasks();
  }

  function openGroupModal() {
    groupModal.hidden = false;
    groupInput.focus();
  }

  function closeGroupModal() {
    groupModal.hidden = true;
    groupForm.reset();
  }

  function addBlankGroup() {
    const id = `group-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    groups.push({ id, tabId: activeTabId, name: "" });
    saveGroups();
    renderGroups();
    renderTasks();
    focusEditable(`[data-group-name="${id}"]`);
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

  function openMoveActionModal(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    actionPendingMove = taskId;
    const currentLocation = task.day || "unassigned";
    const destinations = [
      { id: "unassigned", label: "To-Dos" },
      ...(task.tabId === DEFAULT_TAB_ID ? WEEKDAYS.map((day) => ({ id: day, label: day[0].toUpperCase() + day.slice(1) })) : []),
      ...groups.filter((group) => group.tabId === task.tabId).map((group) => ({ id: group.id, label: group.name || "New group" })),
    ];
    moveActionList.replaceChildren();
    destinations.forEach((destination) => {
      const button = document.createElement("button");
      button.className = "move-action-list__option";
      button.type = "button";
      button.dataset.moveTo = destination.id;
      button.textContent = destination.label;
      button.disabled = destination.id === currentLocation;
      moveActionList.appendChild(button);
    });
    moveActionModal.hidden = false;
  }

  function closeMoveActionModal() {
    moveActionModal.hidden = true;
    actionPendingMove = null;
  }

  function moveActionTo(location) {
    if (!actionPendingMove) return;
    const task = tasks.find((item) => item.id === actionPendingMove);
    if (!task) return;
    task.day = location === "unassigned" ? null : location;
    saveTasks();
    renderTasks();
    closeMoveActionModal();
  }

  function convertGroupToTab(groupId) {
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;
    if (!confirm(`Convert "${group.name || "this group"}" to a new tab? Its to-dos will move to the new tab's pending actions.`)) return;

    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    tabs.push({ id, name: group.name });
    tasks.forEach((task) => {
      if (task.day === groupId && task.tabId === group.tabId) {
        task.tabId = id;
        task.day = null;
      }
    });
    groups = groups.filter((item) => item.id !== groupId);
    activeTabId = id;

    saveTabs();
    saveTasks();
    saveGroups();
    saveActiveTabId();
    clearSelection();
    renderTabs();
    updateCanvasVisibility();
    renderGroups();
    renderTasks();
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
    // Cards beyond the primary dragged one still sit at their original spot; bring them
    // along right next to it so the whole selection lands together at the drop point.
    const primaryCard = app.querySelector(`[data-task-id="${draggedTaskId}"]`);
    if (!primaryCard) return;
    let anchor = primaryCard;
    draggedTaskIds
      .filter((id) => id !== draggedTaskId)
      .forEach((id) => {
        const card = app.querySelector(`[data-task-id="${id}"]`);
        if (!card) return;
        anchor.after(card);
        anchor = card;
      });

    draggedTaskIds.forEach((id) => {
      const task = tasks.find((item) => item.id === id);
      if (task) task.day = location === "unassigned" ? null : location;
    });

    const taskOrder = [...app.querySelectorAll(".task-list .task-card")].map((card) => card.dataset.taskId);
    // Only the active tab's cards are in the DOM, so keep every other tab's tasks intact.
    const otherTabTasks = tasks.filter((task) => task.tabId !== activeTabId);
    const reordered = taskOrder.map((taskId) => tasks.find((task) => task.id === taskId)).filter(Boolean);
    tasks = [...otherTabTasks, ...reordered];
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
    const reordered = groupOrder.map((groupId) => groups.find((group) => group.id === groupId)).filter(Boolean);
    const otherTabGroups = groups.filter((group) => group.tabId !== activeTabId);
    groups = [...otherTabGroups, ...reordered];
    saveGroups();
  }

  function animateTabShuffle(reorder) {
    const positions = new Map(
      [...tabBar.querySelectorAll(".tab-bar__tab:not(.tab-bar__tab--dragging)")]
        .map((chip) => [chip, chip.getBoundingClientRect()])
    );

    reorder();

    positions.forEach((before, chip) => {
      const after = chip.getBoundingClientRect();
      const deltaX = before.left - after.left;
      if (!deltaX) return;
      chip.animate(
        [
          { transform: `translateX(${deltaX}px)` },
          { transform: "translateX(0)" },
        ],
        { duration: 200, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    });
  }

  function reorderDraggingTab(target, clientX) {
    // The default tab is never draggable, so bail whenever it's the hover target
    // to guarantee it can never end up anywhere but first.
    if (target.dataset.tabId === DEFAULT_TAB_ID) return;
    const draggedChip = tabBar.querySelector(`[data-tab-id="${draggedTabId}"]`);
    if (!draggedChip || target === draggedChip) return;

    const targetBounds = target.getBoundingClientRect();
    const insertAfter = clientX > targetBounds.left + targetBounds.width / 2;
    const reference = insertAfter ? target.nextSibling : target;
    if (reference === draggedChip || (target.nextElementSibling === draggedChip && insertAfter)) return;
    animateTabShuffle(() => tabBar.insertBefore(draggedChip, reference));
  }

  function saveTabOrder() {
    const tabOrder = [...tabBar.querySelectorAll(".tab-bar__tab")].map((chip) => chip.dataset.tabId);
    const reordered = tabOrder.map((tabId) => tabs.find((tab) => tab.id === tabId)).filter(Boolean);
    const defaultTab = reordered.find((tab) => tab.id === DEFAULT_TAB_ID);
    const others = reordered.filter((tab) => tab.id !== DEFAULT_TAB_ID);
    tabs = defaultTab ? [defaultTab, ...others] : reordered;
    saveTabs();
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

  function moveTasksToTab(tabId) {
    if (!tabs.some((tab) => tab.id === tabId)) return;
    draggedTaskIds.forEach((id) => {
      const task = tasks.find((item) => item.id === id);
      if (!task) return;
      task.tabId = tabId;
      task.day = null;
    });
    clearSelection();
    saveTasks();
    renderTabs();
    renderTasks();
  }

  function getVisibleTaskCards() {
    return [...app.querySelectorAll(".task-list .task-card")];
  }

  function clearSelection() {
    if (!selectedTaskIds.size) return;
    selectedTaskIds.clear();
    selectionAnchorId = null;
    app.querySelectorAll(".task-card--selected").forEach((card) => card.classList.remove("task-card--selected"));
  }

  function toggleTaskSelection(taskId) {
    if (selectedTaskIds.has(taskId)) {
      selectedTaskIds.delete(taskId);
    } else {
      selectedTaskIds.add(taskId);
    }
    selectionAnchorId = taskId;
    app.querySelector(`[data-task-id="${taskId}"]`)?.classList.toggle("task-card--selected", selectedTaskIds.has(taskId));
  }

  function selectTaskRange(taskId) {
    const cards = getVisibleTaskCards();
    const ids = cards.map((card) => card.dataset.taskId);
    const anchorIndex = ids.indexOf(selectionAnchorId);
    const targetIndex = ids.indexOf(taskId);
    if (anchorIndex === -1 || targetIndex === -1) {
      toggleTaskSelection(taskId);
      return;
    }
    const [start, end] = anchorIndex < targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex];
    selectedTaskIds = new Set(ids.slice(start, end + 1));
    cards.forEach((card) => card.classList.toggle("task-card--selected", selectedTaskIds.has(card.dataset.taskId)));
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

  function scrollTabBarWhileDragging() {
    if (!tabDragScrollSpeed || (!draggedTabId && !draggedTaskId)) {
      tabDragScrollFrame = null;
      return;
    }
    tabBar.scrollBy({ left: tabDragScrollSpeed, behavior: "instant" });
    tabDragScrollFrame = requestAnimationFrame(scrollTabBarWhileDragging);
  }

  function updateTabDragScroll(clientX) {
    const bounds = tabBar.getBoundingClientRect();
    const edgeSize = 60;
    const leftDistance = clientX - bounds.left;
    const rightDistance = bounds.right - clientX;

    if (leftDistance < edgeSize) {
      tabDragScrollSpeed = -Math.ceil(((edgeSize - leftDistance) / edgeSize) * 14);
    } else if (rightDistance < edgeSize) {
      tabDragScrollSpeed = Math.ceil(((edgeSize - rightDistance) / edgeSize) * 14);
    } else {
      tabDragScrollSpeed = 0;
    }

    if (tabDragScrollSpeed && !tabDragScrollFrame) {
      tabDragScrollFrame = requestAnimationFrame(scrollTabBarWhileDragging);
    }
  }

  function stopTabDragScroll() {
    tabDragScrollSpeed = 0;
    if (tabDragScrollFrame) cancelAnimationFrame(tabDragScrollFrame);
    tabDragScrollFrame = null;
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
      const currentWeekDate = new Date(saturday);
      currentWeekDate.setDate(saturday.getDate() + index);
      const nextWeekDate = new Date(currentWeekDate);
      nextWeekDate.setDate(currentWeekDate.getDate() + 7);
      const dateFormat = { month: "short", day: "numeric" };
      const dateLabel = `${currentWeekDate.toLocaleDateString(undefined, dateFormat)} | ${nextWeekDate.toLocaleDateString(undefined, dateFormat)}`;
      const dateElement = document.querySelector(`[data-date-for="${day}"]`);
      if (dateElement) dateElement.textContent = dateLabel;

      const group = document.querySelector(`.day-group[data-day="${day}"]`);
      if (group) group.classList.toggle("day-group--today", day === WEEKDAYS[(now.getDay() + 1) % 7]);
    });
  }

  // Atmosphere / Theme Handling (Day, Twilight, Night, Random)
  const themePicker = document.getElementById("theme-picker");
  // Reset on every script load (page open/refresh) so "random" re-rolls each time,
  // but stays put for the rest of that page's life once picked.
  let activeRandomTheme = null;

  function getThemePreference() {
    return localStorage.getItem("nimbus.theme") || "night";
  }

  function resolveEffectiveTheme(pref) {
    if (pref === "random") {
      if (activeRandomTheme) return activeRandomTheme;
      const modes = ["day", "twilight", "night"];
      activeRandomTheme = modes[Math.floor(Math.random() * modes.length)];
      return activeRandomTheme;
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

  function openAbout() {
    if (aboutModal) aboutModal.hidden = false;
  }

  function closeAbout() {
    if (aboutModal) aboutModal.hidden = true;
  }

  // Data Export & Import
  function createNimbusBackupData() {
    return {
      version: 2,
      appName: "Nimbus",
      exportedAt: new Date().toISOString(),
      theme: getThemePreference(),
      tasks,
      groups,
      tabs,
      activeTab: activeTabId,
    };
  }

  function getExistingBackupApps(existingBackup) {
    if (!existingBackup || typeof existingBackup !== "object") return {};
    if (existingBackup.schema === UNIFIED_BACKUP_SCHEMA && existingBackup.apps && typeof existingBackup.apps === "object") return { ...existingBackup.apps };
    if (existingBackup.appName === "Nimbus" || Array.isArray(existingBackup.tabs)) return { nimbus: existingBackup };
    if (existingBackup.appName === "Cumulus" || Array.isArray(existingBackup.accounts)) return { cumulus: existingBackup };
    return {};
  }

  function createBackupData(existingBackup) {
    const apps = getExistingBackupApps(existingBackup);
    apps.nimbus = createNimbusBackupData();
    return {
      schema: UNIFIED_BACKUP_SCHEMA,
      version: 1,
      appName: "Kashikoi Apps",
      exportedAt: new Date().toISOString(),
      apps,
    };
  }

  function downloadBackup(backup, filename) {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportData() {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadBackup(createBackupData(), `nimbus-backup-${dateStr}.json`);
    } catch (error) {
      alert("Export failed: stored data appears corrupted. Try reloading the app first.");
    }
  }

  function normalizeBackupData(data) {
    if (!data || typeof data !== "object") throw new Error("Invalid format");
    const nimbusData = data.schema === UNIFIED_BACKUP_SCHEMA && data.apps && data.apps.nimbus ? data.apps.nimbus : data;

    const importedTabs = Array.isArray(nimbusData.tabs)
      ? nimbusData.tabs.filter((tab) => tab && typeof tab.id === "string" && typeof tab.name === "string")
      : [];
    const importedTasks = Array.isArray(nimbusData.tasks)
      ? nimbusData.tasks.filter((task) => task && typeof task.id === "string" && typeof task.text === "string")
      : [];
    const importedGroups = Array.isArray(nimbusData.groups)
      ? nimbusData.groups.filter((group) => group && typeof group.id === "string" && typeof group.name === "string")
      : [];

    // Older backups (pre-multi-tab) never captured a tab list. Restoring their tasks/groups
    // would otherwise leave the current tab list untouched while wiping every tab's content,
    // so refuse anything that doesn't describe a full tab set instead of silently doing that.
    if (!importedTabs.length) {
      throw new Error("Missing tabs");
    }
    if (!importedTabs.some((tab) => tab.id === DEFAULT_TAB_ID)) {
      importedTabs.unshift({ id: DEFAULT_TAB_ID, name: "This Week" });
    }

    return {
      tabs: importedTabs,
      tasks: importedTasks,
      groups: importedGroups,
      activeTab: typeof nimbusData.activeTab === "string" ? nimbusData.activeTab : DEFAULT_TAB_ID,
      theme: nimbusData.theme,
    };
  }

  function restoreBackupData(data, sourceLabel) {
    const imported = normalizeBackupData(data);
    const summary = `${imported.tabs.length} tab${imported.tabs.length === 1 ? "" : "s"}, ${imported.groups.length} group${imported.groups.length === 1 ? "" : "s"}, and ${imported.tasks.length} action${imported.tasks.length === 1 ? "" : "s"}`;
    if (!confirm(`Restore ${summary} from ${sourceLabel}? This will overwrite your current tasks, groups, and tabs and cannot be undone.`)) return false;

    localStorage.setItem("nimbus.tabs", JSON.stringify(imported.tabs));
    localStorage.setItem("nimbus.tasks", JSON.stringify(imported.tasks));
    localStorage.setItem("nimbus.groups", JSON.stringify(imported.groups));
    localStorage.setItem("nimbus.activeTab", imported.activeTab);
    if (imported.theme) localStorage.setItem("nimbus.theme", imported.theme);
    location.reload();
    return true;
  }

  function importData(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        restoreBackupData(JSON.parse(evt.target.result), "this backup");
      } catch (err) {
        alert(err.message === "Missing tabs" ? "Failed to import: this backup doesn't include any tabs (it may be from an older version of Nimbus). Please use a backup made with a newer version." : "Failed to import: file is not a valid Nimbus backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function setCloudDataStatus(message, state) {
    if (!cloudDataStatus) return;
    cloudDataStatus.textContent = message;
    cloudDataStatus.dataset.state = state || "info";
  }

  function normalizeCloudPhrase(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function getCloudPhrase() {
    return cloudPhraseInput ? normalizeCloudPhrase(cloudPhraseInput.value) : "";
  }

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToArrayBuffer(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes.buffer;
  }

  async function sha256Hex(value) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function deriveCloudKey(phrase, salt) {
    const phraseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(phrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations: CLOUD_KDF_ITERATIONS },
      phraseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  function createRecoveryPhrase() {
    const indexes = new Uint8Array(RECOVERY_PHRASE_WORD_COUNT);
    crypto.getRandomValues(indexes);
    return [...indexes].map((index) => RECOVERY_WORDS[index]).join(" ");
  }

  async function getCloudSyncKey(phrase) {
    return sha256Hex(`kashikoi-cloud-sync-v1:${phrase}`);
  }

  async function getLegacyCloudSyncKey(phrase) {
    return sha256Hex(`nimbus-sync-location-v1:${phrase}`);
  }

  async function encryptCloudBackup(phrase, backupData) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveCloudKey(phrase, salt);
    const plaintext = new TextEncoder().encode(JSON.stringify(backupData || createBackupData()));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    return {
      app: "Nimbus",
      format: CLOUD_SYNC_FORMAT,
      updatedAt: new Date().toISOString(),
      kdf: {
        name: "PBKDF2",
        hash: "SHA-256",
        iterations: CLOUD_KDF_ITERATIONS,
        salt: arrayBufferToBase64(salt),
      },
      cipher: {
        name: "AES-GCM",
        iv: arrayBufferToBase64(iv),
      },
      payload: arrayBufferToBase64(encrypted),
    };
  }

  async function decryptCloudBackup(phrase, envelope) {
    if (!envelope || (envelope.app !== "Nimbus" && envelope.app !== "Cumulus") || (envelope.format !== CLOUD_SYNC_FORMAT && envelope.format !== LEGACY_CLOUD_SYNC_FORMAT)) {
      throw new Error("Invalid envelope");
    }
    const salt = new Uint8Array(base64ToArrayBuffer(envelope.kdf && envelope.kdf.salt));
    const iv = new Uint8Array(base64ToArrayBuffer(envelope.cipher && envelope.cipher.iv));
    const encrypted = base64ToArrayBuffer(envelope.payload);
    const key = await deriveCloudKey(phrase, salt);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  async function fetchEncryptedBackupAtKey(syncKey) {
    const response = await fetch(`${CLOUD_SYNC_ENDPOINT}/sync/${syncKey}`, { cache: "no-store" });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function fetchExistingCloudBackup(phrase) {
    const syncKey = await getCloudSyncKey(phrase);
    const envelope = await fetchEncryptedBackupAtKey(syncKey);
    if (envelope) return { syncKey, envelope };
    const legacySyncKey = await getLegacyCloudSyncKey(phrase);
    const legacyEnvelope = await fetchEncryptedBackupAtKey(legacySyncKey);
    return legacyEnvelope ? { syncKey, envelope: legacyEnvelope } : { syncKey, envelope: null };
  }

  async function createMergedCloudBackup(phrase) {
    const existing = await fetchExistingCloudBackup(phrase);
    let existingBackup = null;
    if (existing.envelope) existingBackup = await decryptCloudBackup(phrase, existing.envelope);
    return { syncKey: await getCloudSyncKey(phrase), backup: createBackupData(existingBackup) };
  }

  function markCloudDataDirty() {
    if (!cloudPhraseInput || !getCloudPhrase()) return;
    cloudDataDirty = true;
    setCloudDataStatus("Local changes are not saved to encrypted cloud sync yet.", "warn");
  }

  function updateCloudPhraseOutput(phrase) {
    if (!cloudPhraseOutput) return;
    cloudPhraseOutput.hidden = !phrase;
    cloudPhraseOutput.textContent = phrase ? phrase : "";
  }

  function saveRememberedCloudPhrase() {
    if (!rememberCloudPhraseInput) return;
    if (rememberCloudPhraseInput.checked && getCloudPhrase()) {
      localStorage.setItem(REMEMBER_CLOUD_PHRASE_KEY, getCloudPhrase());
    } else if (!rememberCloudPhraseInput.checked) {
      localStorage.removeItem(REMEMBER_CLOUD_PHRASE_KEY);
    }
  }

  function loadRememberedCloudPhrase() {
    if (!cloudPhraseInput || !rememberCloudPhraseInput) return;
    const savedPhrase = localStorage.getItem(REMEMBER_CLOUD_PHRASE_KEY) || "";
    if (!savedPhrase) return;
    cloudPhraseInput.value = savedPhrase;
    rememberCloudPhraseInput.checked = true;
    setCloudDataStatus("Recovery phrase remembered on this device.", "info");
  }

  async function loadCloudData() {
    const phrase = getCloudPhrase();
    if (!phrase) {
      setCloudDataStatus("Enter your recovery phrase first.", "error");
      return;
    }
    if (!crypto.subtle) {
      setCloudDataStatus("This browser does not support Web Crypto encryption.", "error");
      return;
    }
    setCloudDataStatus("Loading encrypted cloud backup...", "info");
    try {
      const existing = await fetchExistingCloudBackup(phrase);
      if (!existing.envelope) {
        setCloudDataStatus("No cloud backup exists for this phrase yet. Save to cloud from the first device first.", "error");
        return;
      }
      const data = await decryptCloudBackup(phrase, existing.envelope);
      const restored = restoreBackupData(data, "encrypted cloud sync");
      if (!restored) setCloudDataStatus("Cloud load cancelled.", "info");
    } catch (error) {
      setCloudDataStatus("Could not decrypt cloud backup. Check the phrase or try again later.", "error");
    }
  }

  async function saveCloudData() {
    const phrase = getCloudPhrase();
    if (!phrase) {
      setCloudDataStatus("Enter or create a recovery phrase first.", "error");
      return;
    }
    if (!crypto.subtle) {
      setCloudDataStatus("This browser does not support Web Crypto encryption.", "error");
      return;
    }
    setCloudDataStatus("Encrypting and saving cloud backup...", "info");
    try {
      const merged = await createMergedCloudBackup(phrase);
      const response = await fetch(`${CLOUD_SYNC_ENDPOINT}/sync/${merged.syncKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await encryptCloudBackup(phrase, merged.backup)),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      cloudDataDirty = false;
      setCloudDataStatus("Saved to cloud. Use the same recovery phrase to restore on another device.", "success");
    } catch (error) {
      setCloudDataStatus("Could not save encrypted cloud backup. Your local Nimbus data is still safe here.", "error");
    }
  }

  async function downloadEncryptedBackup() {
    const phrase = getCloudPhrase();
    if (!phrase) {
      setCloudDataStatus("Enter or create a recovery phrase first.", "error");
      return;
    }
    if (!crypto.subtle) {
      setCloudDataStatus("This browser does not support Web Crypto encryption.", "error");
      return;
    }
    setCloudDataStatus("Encrypting backup file...", "info");
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadBackup(await encryptCloudBackup(phrase), `nimbus-encrypted-backup-${dateStr}.json`);
      setCloudDataStatus("Encrypted backup downloaded. Keep it with your recovery phrase.", "success");
    } catch (error) {
      setCloudDataStatus("Could not create encrypted backup file.", "error");
    }
  }

  function importEncryptedBackup(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const phrase = getCloudPhrase();
    if (!phrase) {
      setCloudDataStatus("Enter the recovery phrase before importing an encrypted backup.", "error");
      event.target.value = "";
      return;
    }
    if (!crypto.subtle) {
      setCloudDataStatus("This browser does not support Web Crypto encryption.", "error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (evt) {
      setCloudDataStatus("Decrypting encrypted backup file...", "info");
      try {
        const data = await decryptCloudBackup(phrase, JSON.parse(evt.target.result));
        const restored = restoreBackupData(data, "encrypted backup file");
        if (!restored) setCloudDataStatus("Encrypted backup import cancelled.", "info");
      } catch (error) {
        setCloudDataStatus("Could not decrypt that file. Check the phrase and backup file.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function clearData() {
    if (confirm("Are you sure you want to clear all tasks, groups, and tabs? This cannot be undone.")) {
      localStorage.removeItem("nimbus.tasks");
      localStorage.removeItem("nimbus.groups");
      localStorage.removeItem("nimbus.tabs");
      localStorage.removeItem("nimbus.activeTab");
      location.reload();
    }
  }

  function randomizeDemoData() {
    if (!confirm("Replace all tabs, actions, and groups with a multi-tab demo? Export first if you want to keep them.")) return;

    const demoTabs = [
      {
        id: DEFAULT_TAB_ID,
        name: "This Week",
        groups: [{ id: "demo-home", name: "Home projects" }],
        items: [
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
        ],
      },
      {
        id: "demo-tab-side-projects",
        name: "Side Projects",
        groups: [
          { id: "demo-launch", name: "Website relaunch" },
          { id: "demo-garage", name: "Garage cleanup" },
        ],
        items: [
          ["Sketch new homepage layout", "demo-launch", false],
          ["Pick a hosting plan", "demo-launch", true],
          ["Write launch announcement", "demo-launch", false],
          ["Sort tools onto pegboard", "demo-garage", false],
          ["Donate old paint cans", "demo-garage", false],
          ["Label storage bins", "demo-garage", true],
          ["Research bike rack options", null, false],
        ],
      },
      {
        id: "demo-tab-someday",
        name: "Someday",
        groups: [{ id: "demo-travel", name: "Travel wishlist" }],
        items: [
          ["Learn to bake sourdough", null, false],
          ["Plan a long weekend hike", "demo-travel", false],
          ["Look into a used kayak", "demo-travel", false],
          ["Read that stack of novels", null, true],
        ],
      },
    ];

    let counter = 0;
    groups = [];
    tasks = [];
    tabs = demoTabs.map((tab) => ({ id: tab.id, name: tab.name }));
    demoTabs.forEach((tab) => {
      tab.groups.forEach((group) => groups.push({ ...group, tabId: tab.id }));
      tab.items.forEach(([text, day, done]) => {
        tasks.push({ id: `demo-${Date.now()}-${counter++}`, text, day, done, tabId: tab.id });
      });
    });
    activeTabId = DEFAULT_TAB_ID;
    saveTasks();
    saveGroups();
    saveTabs();
    saveActiveTabId();
    renderTabs();
    updateCanvasVisibility();
    renderGroups();
    renderTasks();
    closeSettings();
  }

  // Event Listeners
  if (settingsBtn) settingsBtn.addEventListener("click", openSettings);
  if (aboutBtn) aboutBtn.addEventListener("click", openAbout);
  if (themePicker) {
    themePicker.addEventListener("click", (e) => {
      const chip = e.target.closest(".theme-chip");
      if (!chip) return;
      const themeVal = chip.getAttribute("data-theme-val");
      if (themeVal === "random") {
        activeRandomTheme = null;
      }
      applyTheme(themeVal);
    });
  }
  if (exportDataBtn) exportDataBtn.addEventListener("click", exportData);
  if (importDataBtn && importFileInput) {
    importDataBtn.addEventListener("click", () => importFileInput.click());
    importFileInput.addEventListener("change", importData);
  }
  if (generateCloudPhraseBtn) {
    generateCloudPhraseBtn.addEventListener("click", () => {
      const phrase = createRecoveryPhrase();
      if (cloudPhraseInput) cloudPhraseInput.value = phrase;
      updateCloudPhraseOutput(phrase);
      saveRememberedCloudPhrase();
      setCloudDataStatus("Recovery phrase created. Save these words now. Nimbus cannot recover them.", "warn");
    });
  }
  if (toggleCloudPhraseBtn && cloudPhraseInput) {
    toggleCloudPhraseBtn.addEventListener("click", () => {
      const shouldShow = cloudPhraseInput.type === "password";
      cloudPhraseInput.type = shouldShow ? "text" : "password";
      toggleCloudPhraseBtn.textContent = shouldShow ? "Hide" : "Show";
      toggleCloudPhraseBtn.setAttribute("aria-pressed", shouldShow ? "true" : "false");
    });
  }
  if (cloudPhraseInput) {
    cloudPhraseInput.addEventListener("input", () => {
      updateCloudPhraseOutput("");
      saveRememberedCloudPhrase();
      if (cloudDataDirty) setCloudDataStatus("Local changes are not saved to encrypted cloud sync yet.", "warn");
    });
    cloudPhraseInput.addEventListener("change", () => {
      cloudPhraseInput.value = getCloudPhrase();
      saveRememberedCloudPhrase();
    });
  }
  if (rememberCloudPhraseInput) {
    loadRememberedCloudPhrase();
    rememberCloudPhraseInput.addEventListener("change", () => {
      saveRememberedCloudPhrase();
      setCloudDataStatus(rememberCloudPhraseInput.checked ? "Recovery phrase will be remembered on this device." : "Recovery phrase removed from this device.", "info");
    });
  }
  if (cloudLoadDataBtn) cloudLoadDataBtn.addEventListener("click", loadCloudData);
  if (cloudSaveDataBtn) cloudSaveDataBtn.addEventListener("click", saveCloudData);
  if (downloadEncryptedDataBtn) downloadEncryptedDataBtn.addEventListener("click", downloadEncryptedBackup);
  if (importEncryptedDataBtn && importEncryptedFileInput) {
    importEncryptedDataBtn.addEventListener("click", () => importEncryptedFileInput.click());
    importEncryptedFileInput.addEventListener("change", importEncryptedBackup);
  }
  if (randomizeDataBtn) randomizeDataBtn.addEventListener("click", randomizeDemoData);
  if (clearDataBtn) clearDataBtn.addEventListener("click", clearData);
  if (addTodoBtn) addTodoBtn.addEventListener("click", addBlankTask);
  if (addGroupBtn) addGroupBtn.addEventListener("click", addBlankGroup);
  if (collapseAllBtn) collapseAllBtn.addEventListener("click", () => setAllGroupsCollapsed(true));
  if (expandAllBtn) expandAllBtn.addEventListener("click", () => setAllGroupsCollapsed(false));
  if (todoForm) {
    todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;
      tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, done: false, day: null, tabId: activeTabId });
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
      groups.push({ id: `group-${Date.now()}-${Math.random().toString(36).slice(2)}`, tabId: activeTabId, name });
      saveGroups();
      renderGroups();
      renderTasks();
      closeGroupModal();
    });
  }
  if (moveGroupTasksBtn) moveGroupTasksBtn.addEventListener("click", () => deleteGroup(true));
  if (deleteGroupTasksBtn) deleteGroupTasksBtn.addEventListener("click", () => deleteGroup(false));
  if (deleteTabBtn) deleteTabBtn.addEventListener("click", deleteTab);
  if (moveActionList) {
    moveActionList.addEventListener("click", (event) => {
      const option = event.target.closest("[data-move-to]");
      if (option) moveActionTo(option.dataset.moveTo);
    });
  }

  if (tabBar) {
    tabBar.addEventListener("click", (event) => {
      if (event.target.closest("#add-tab-btn")) {
        addBlankTab();
        return;
      }
      const deleteButton = event.target.closest("[data-tab-delete]");
      if (deleteButton) {
        openTabDeleteModal(deleteButton.dataset.tabDelete);
        return;
      }
      const chip = event.target.closest(".tab-bar__tab");
      if (chip && !event.target.closest("input, button")) {
        setActiveTab(chip.dataset.tabId);
      }
    });

    tabBar.addEventListener("focusout", (event) => {
      const tabName = event.target.closest("[data-tab-name]");
      if (!tabName) return;
      const tab = tabs.find((item) => item.id === tabName.dataset.tabName);
      if (tab) {
        tab.name = tabName.value.trim();
        saveTabs();
        renderTabs();
      }
    });

    tabBar.addEventListener("keydown", (event) => {
      const tabName = event.target.closest("[data-tab-name]");
      if (tabName && event.key === "Enter") {
        event.preventDefault();
        tabName.blur();
      }
    });

    tabBar.addEventListener("dblclick", (event) => {
      if (event.target.closest("button")) return;
      const chip = event.target.closest(".tab-bar__tab");
      if (chip) enterEditMode(chip.querySelector("[data-tab-name]"));
    });

    tabBar.addEventListener("dragstart", (event) => {
      const chip = event.target.closest(".tab-bar__tab");
      if (!chip || !chip.draggable || event.target.closest("button")) return;
      draggedTabId = chip.dataset.tabId;
      tabDropCommitted = false;
      chip.classList.add("tab-bar__tab--dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedTabId);
    });

    tabBar.addEventListener("dragend", (event) => {
      const chip = event.target.closest(".tab-bar__tab");
      if (chip) chip.classList.remove("tab-bar__tab--dragging");
      stopTabDragScroll();
      if (!tabDropCommitted) renderTabs();
      draggedTabId = null;
    });

    tabBar.addEventListener("dragover", (event) => {
      const target = event.target.closest(".tab-bar__tab");
      if (draggedTaskId) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        updateTabDragScroll(event.clientX);
        tabBar.querySelectorAll(".tab-bar__tab").forEach((chip) => {
          chip.classList.toggle("tab-bar__tab--task-drop-target", chip === target);
        });
        return;
      }
      if (!draggedTabId) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      updateTabDragScroll(event.clientX);
      if (target) reorderDraggingTab(target, event.clientX);
    });

    tabBar.addEventListener("drop", (event) => {
      const target = event.target.closest(".tab-bar__tab");
      if (!target) return;
      if (draggedTaskId) {
        event.preventDefault();
        taskDropCommitted = true;
        moveTasksToTab(target.dataset.tabId);
        return;
      }
      if (!draggedTabId) return;
      stopTabDragScroll();
      event.preventDefault();
      tabDropCommitted = true;
      saveTabOrder();
      renderTabs();
    });
  }

  if (app) {
    app.addEventListener("input", (event) => {
      const taskText = event.target.closest("[data-task-text]");
      if (taskText) fitActionHeight(taskText);
    });

    app.addEventListener("focusout", (event) => {
      const taskText = event.target.closest("[data-task-text]");
      if (taskText) {
        const task = tasks.find((item) => item.id === taskText.dataset.taskText);
        if (task) {
          task.text = taskText.value.trim();
          saveTasks();
        }
        taskText.readOnly = true;
        return;
      }

      const groupName = event.target.closest("[data-group-name]");
      if (groupName) {
        const group = groups.find((item) => item.id === groupName.dataset.groupName);
        if (group) {
          group.name = groupName.value.trim();
          saveGroups();
          renderGroups();
          renderTasks();
        }
      }
    });

    app.addEventListener("dblclick", (event) => {
      if (event.target.closest("button, .task-card__check")) return;

      const card = event.target.closest(".task-card");
      if (card) {
        enterEditMode(card.querySelector("[data-task-text]"));
        return;
      }

      const heading = event.target.closest(".custom-group__heading");
      if (heading) {
        enterEditMode(heading.querySelector("[data-group-name]"));
      }
    });

    app.addEventListener("keydown", (event) => {
      const groupName = event.target.closest("[data-group-name]");
      if (groupName && event.key === "Enter") {
        event.preventDefault();
        groupName.blur();
      }
    });

    app.addEventListener("click", (event) => {
      const selectableCard = event.target.closest(".task-card");
      const editingTextarea = event.target.closest("textarea:not([readonly])");
      if (selectableCard && !event.target.closest("button, input") && !editingTextarea) {
        if (event.metaKey || event.ctrlKey) {
          toggleTaskSelection(selectableCard.dataset.taskId);
          return;
        }
        if (event.shiftKey) {
          selectTaskRange(selectableCard.dataset.taskId);
          return;
        }
        clearSelection();
      } else if (!selectableCard) {
        clearSelection();
      }

      const collapseButton = event.target.closest(".custom-group__toggle");
      if (collapseButton) {
        toggleGroupCollapse(collapseButton.closest(".custom-group").dataset.groupId);
        return;
      }

      const moveButton = event.target.closest(".task-card__move");
      if (moveButton) {
        openMoveActionModal(moveButton.closest(".task-card").dataset.taskId);
        return;
      }
      const groupConvertButton = event.target.closest(".custom-group__convert");
      if (groupConvertButton) {
        convertGroupToTab(groupConvertButton.closest(".custom-group").dataset.groupId);
        return;
      }
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
      if (groupHeading && !event.target.closest("button, input")) {
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

      // Drag the whole selection together when the dragged card is part of it.
      if (selectedTaskIds.has(draggedTaskId) && selectedTaskIds.size > 1) {
        const selectedIds = selectedTaskIds;
        draggedTaskIds = getVisibleTaskCards().map((c) => c.dataset.taskId).filter((id) => selectedIds.has(id));
      } else {
        clearSelection();
        draggedTaskIds = [draggedTaskId];
      }

      draggedTaskIds.forEach((id) => {
        app.querySelector(`[data-task-id="${id}"]`)?.classList.add("task-card--dragging");
      });

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedTaskId);

      if (draggedTaskIds.length > 1) {
        const badge = document.createElement("div");
        badge.className = "drag-count-badge";
        badge.textContent = String(draggedTaskIds.length);
        document.body.appendChild(badge);
        event.dataTransfer.setDragImage(badge, -12, -12);
        setTimeout(() => badge.remove(), 0);
      }
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

      draggedTaskIds.forEach((id) => {
        app.querySelector(`[data-task-id="${id}"]`)?.classList.remove("task-card--dragging");
      });
      tabBar?.querySelectorAll(".tab-bar__tab--task-drop-target").forEach((chip) => {
        chip.classList.remove("tab-bar__tab--task-drop-target");
      });
      stopDragScroll();
      stopTabDragScroll();
      if (!taskDropCommitted) renderTasks();
      draggedTaskId = null;
      draggedTaskIds = [];
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
    if (e.target.matches("[data-close-about]")) {
      closeAbout();
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
    if (e.target.matches("[data-close-tab-delete]")) {
      closeTabDeleteModal();
    }
    if (e.target.matches("[data-close-move-action]")) {
      closeMoveActionModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsModal && !settingsModal.hidden) {
      closeSettings();
    }
    if (e.key === "Escape" && aboutModal && !aboutModal.hidden) {
      closeAbout();
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
    if (e.key === "Escape" && tabDeleteModal && !tabDeleteModal.hidden) {
      closeTabDeleteModal();
    }
    if (e.key === "Escape" && moveActionModal && !moveActionModal.hidden) {
      closeMoveActionModal();
    }
    if (e.key === "Escape" && selectedTaskIds.size) {
      clearSelection();
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
  if (!tabs.some((tab) => tab.id === activeTabId)) activeTabId = DEFAULT_TAB_ID;
  renderTabs();
  updateCanvasVisibility();
  renderGroups();
  renderTasks();
  initClouds();
})();
