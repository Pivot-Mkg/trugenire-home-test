document.addEventListener("DOMContentLoaded", () => {
  initFunctionalModules();
  initLeadershipLabelTabs();
  initLeadershipButtonTabs();
  initProcessStepHoverEffects();
});

function initFunctionalModules() {
  const toggles = Array.from(document.querySelectorAll(".module-toggle"));
  const icon = document.getElementById("functional-module-icon");
  const title = document.getElementById("functional-module-title");
  const image = document.getElementById("functional-module-image");
  const points = document.getElementById("functional-module-points");

  if (!toggles.length || !title || !image || !points) return;

  const renderModule = (button) => {
    if (!button) return;

    const nextIcon = button.getAttribute("data-icon") || "";
    const nextTitle = button.getAttribute("data-title") || "";
    const nextImage = button.getAttribute("data-image") || "";
    const rawPoints = (button.getAttribute("data-points") || "").toString();
    const items = rawPoints.split("|").map((value) => value.trim()).filter(Boolean);

    toggles.forEach((toggle) => toggle.classList.remove("is-active"));
    button.classList.add("is-active");

    title.textContent = nextTitle;
    if (nextIcon) icon.setAttribute("src", nextIcon);
    if (nextImage) image.setAttribute("src", nextImage);

    points.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      points.appendChild(li);
    });
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => renderModule(toggle));
  });

  renderModule(document.querySelector(".module-toggle.is-active") || toggles[0]);
}

function initLeadershipLabelTabs() {
  const activeClass = "leadership-tab-buttom-active";
  const labels = Array.from(
    document.querySelectorAll(".leadership-tab-button-wrapper .leadership-tab-buttom[for]"),
  );
  const panels = Array.from(document.querySelectorAll(".leadership-tab"));

  if (!labels.length || !panels.length) return;

  const showPanel = (panelId) => {
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });
  };

  const setActiveLabel = (label) => {
    labels.forEach((item) => item.classList.remove(activeClass));
    label.classList.add(activeClass);
    showPanel(label.getAttribute("for"));
  };

  const initialLabel =
    labels.find((label) => label.classList.contains(activeClass)) || labels[0];

  if (initialLabel) setActiveLabel(initialLabel);

  labels.forEach((label) => {
    label.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveLabel(label);
    });
  });
}

function initLeadershipButtonTabs() {
  const buttons = Array.from(document.querySelectorAll(".leadership-tab-btn[data-tab]"));
  const contents = Array.from(document.querySelectorAll(".leadership-tab-content"));

  if (!buttons.length || !contents.length) return;

  const setActive = (button) => {
    const tabName = button.getAttribute("data-tab");
    if (!tabName) return;

    buttons.forEach((item) => item.classList.remove("is-active"));
    contents.forEach((item) => item.classList.remove("is-active"));

    button.classList.add("is-active");
    const target = document.getElementById(tabName);
    if (target) target.classList.add("is-active");
  };

  const initialButton =
    buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
  if (initialButton) setActive(initialButton);

  buttons.forEach((button) => {
    button.addEventListener("click", () => setActive(button));
  });
}

function initProcessStepHoverEffects() {
  const section = document.querySelector(".tb-truegenie-page .how-its-work");
  if (!section) return;

  const iconItems = Array.from(
    section.querySelectorAll(".process-icons-grid .process-icon-wrapper"),
  );
  const cardItems = Array.from(section.querySelectorAll(".process-wrapper .process-card"));
  const pairCount = Math.min(iconItems.length, cardItems.length);

  if (!pairCount) return;

  const setLinkedHover = (index, isActive) => {
    const icon = iconItems[index];
    const card = cardItems[index];
    if (!icon || !card) return;

    icon.classList.toggle("is-linked-hover", isActive);
    card.classList.toggle("is-linked-hover", isActive);
  };

  for (let index = 0; index < pairCount; index += 1) {
    const activate = () => setLinkedHover(index, true);
    const deactivate = () => setLinkedHover(index, false);

    iconItems[index].addEventListener("mouseenter", activate);
    iconItems[index].addEventListener("mouseleave", deactivate);
    cardItems[index].addEventListener("mouseenter", activate);
    cardItems[index].addEventListener("mouseleave", deactivate);
  }
}
