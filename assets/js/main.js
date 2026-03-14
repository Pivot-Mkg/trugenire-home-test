document.addEventListener("DOMContentLoaded", () => {
  initFunctionalModules();
  initLeadershipLabelTabs();
  initServiceTeamTabArrows();
  initServicesTeamMobileSlider();
  initLeadershipButtonTabs();
  initProcessStepHoverEffects();
  initProcessMobileSlider();
  initHoverCardAnimation();
});

function initFunctionalModules() {
  const section = document.querySelector(".functional-modules-section");
  const sidebar = section?.querySelector(".functional-modules-sidebar");
  const toggles = Array.from(section?.querySelectorAll(".module-toggle") || []);
  const icon = document.getElementById("functional-module-icon");
  const title = document.getElementById("functional-module-title");
  const image = document.getElementById("functional-module-image");
  const points = document.getElementById("functional-module-points");
  const mobileMedia = window.matchMedia("(max-width: 767.98px)");

  if (!section || !sidebar || !toggles.length || !title || !image || !points) return;

  let pagination = section.querySelector("[data-module-pagination]");
  let dots = [];
  let scrollFrame = null;

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.className = "functional-modules-mobile-pagination";
    pagination.setAttribute("data-module-pagination", "");
    pagination.setAttribute("aria-label", "Functional module navigation");
    sidebar.insertAdjacentElement("afterend", pagination);
  }

  const updatePagination = (activeButton) => {
    dots.forEach((dot, index) => {
      const isActive = toggles[index] === activeButton;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  const scrollToggleIntoView = (button, behavior = "smooth") => {
    if (!mobileMedia.matches || !button) return;

    const maxScroll = Math.max(0, sidebar.scrollWidth - sidebar.clientWidth);
    const targetLeft = Math.min(maxScroll, Math.max(0, button.offsetLeft - 2));

    sidebar.scrollTo({
      left: targetLeft,
      behavior,
    });
  };

  const renderModule = (button, options = {}) => {
    if (!button) return;

    const nextIcon = button.getAttribute("data-icon") || "";
    const nextTitle = button.getAttribute("data-title") || "";
    const nextImage = button.getAttribute("data-image") || "";
    const rawPoints = (button.getAttribute("data-points") || "").toString();
    const items = rawPoints.split("|").map((value) => value.trim()).filter(Boolean);

    toggles.forEach((toggle) => {
      const isActive = toggle === button;
      toggle.classList.toggle("is-active", isActive);
      toggle.setAttribute("aria-pressed", String(isActive));
    });

    button.classList.add("is-active");

    title.textContent = nextTitle;
    if (icon && nextIcon) {
      icon.setAttribute("src", nextIcon);
      icon.setAttribute("alt", `${nextTitle} icon`);
    }
    if (nextImage) {
      image.setAttribute("src", nextImage);
      image.setAttribute("alt", `${nextTitle} preview`);
    }

    points.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      points.appendChild(li);
    });

    updatePagination(button);

    if (options.syncSlider !== false) {
      scrollToggleIntoView(button, options.behavior || "smooth");
    }
  };

  const buildPagination = () => {
    pagination.innerHTML = "";

    dots = toggles.map((toggle, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "functional-modules-pagination-dot";
      dot.setAttribute(
        "aria-label",
        `Show ${toggle.getAttribute("data-title") || `module ${index + 1}`}`,
      );
      dot.addEventListener("click", () => {
        renderModule(toggle, { behavior: "smooth" });
      });
      pagination.appendChild(dot);
      return dot;
    });

    pagination.hidden = !mobileMedia.matches || toggles.length < 2;
  };

  const getClosestToggle = () => {
    if (!toggles.length) return null;

    const currentCenter = sidebar.scrollLeft + sidebar.clientWidth / 2;

    return toggles.reduce((closest, toggle) => {
      const closestCenter = closest.offsetLeft + closest.offsetWidth / 2;
      const toggleCenter = toggle.offsetLeft + toggle.offsetWidth / 2;

      return Math.abs(toggleCenter - currentCenter) <
        Math.abs(closestCenter - currentCenter)
        ? toggle
        : closest;
    }, toggles[0]);
  };

  const syncFromScroll = () => {
    if (!mobileMedia.matches || scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null;

      const closestToggle = getClosestToggle();
      if (closestToggle && !closestToggle.classList.contains("is-active")) {
        renderModule(closestToggle, { behavior: "auto", syncSlider: false });
      }
    });
  };

  const handleBreakpointChange = () => {
    pagination.hidden = !mobileMedia.matches || toggles.length < 2;

    const activeToggle =
      toggles.find((toggle) => toggle.classList.contains("is-active")) || toggles[0];

    if (mobileMedia.matches && activeToggle) {
      scrollToggleIntoView(activeToggle, "auto");
    }
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => renderModule(toggle));
  });

  sidebar.addEventListener("scroll", syncFromScroll, { passive: true });

  if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener("change", handleBreakpointChange);
  } else if (typeof mobileMedia.addListener === "function") {
    mobileMedia.addListener(handleBreakpointChange);
  }

  buildPagination();
  renderModule(section.querySelector(".module-toggle.is-active") || toggles[0], {
    behavior: "auto",
  });
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

function initServiceTeamTabArrows() {
  const tabScroller = document.querySelector(".tb-services-page [data-services-tab-scroller]");
  const tabPrevButton = document.querySelector(".tb-services-page [data-services-tab-prev]");
  const tabNextButton = document.querySelector(".tb-services-page [data-services-tab-next]");
  const mobileMedia = window.matchMedia("(max-width: 767.98px)");
  const labels = Array.from(
    tabScroller?.querySelectorAll(".leadership-tab-buttom[for]") || [],
  );

  if (!tabScroller || !tabPrevButton || !tabNextButton) return;

  const updateTabArrows = () => {
    if (!mobileMedia.matches) {
      tabPrevButton.hidden = true;
      tabNextButton.hidden = true;
      return;
    }

    const maxScroll = tabScroller.scrollWidth - tabScroller.clientWidth;
    const hasOverflow = maxScroll > 2;
    const atStart = tabScroller.scrollLeft <= 2;
    const atEnd = tabScroller.scrollLeft >= maxScroll - 2;

    tabPrevButton.hidden = !hasOverflow || atStart;
    tabNextButton.hidden = !hasOverflow || atEnd;
  };

  const getItemLeft = (item) => {
    const scrollerRect = tabScroller.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return tabScroller.scrollLeft + (itemRect.left - scrollerRect.left);
  };

  const getClosestItemIndex = () => {
    if (!labels.length) return 0;

    let closestIndex = 0;
    let closestDiff = Number.POSITIVE_INFINITY;
    const currentLeft = tabScroller.scrollLeft;

    labels.forEach((label, index) => {
      const diff = Math.abs(getItemLeft(label) - currentLeft);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const scrollTabsByOne = (direction) => {
    if (!mobileMedia.matches || !labels.length) return;

    const step = direction < 0 ? -1 : 1;
    const currentIndex = getClosestItemIndex();
    const targetIndex = Math.max(0, Math.min(labels.length - 1, currentIndex + step));

    tabScroller.scrollTo({
      left: getItemLeft(labels[targetIndex]),
      behavior: "smooth",
    });
  };

  tabPrevButton.addEventListener("click", () => scrollTabsByOne(-1));
  tabNextButton.addEventListener("click", () => scrollTabsByOne(1));
  tabScroller.addEventListener("scroll", updateTabArrows, { passive: true });
  window.addEventListener("resize", updateTabArrows);

  labels.forEach((label) => {
    label.addEventListener("click", () => {
      if (!mobileMedia.matches) return;

      label.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });

      window.setTimeout(updateTabArrows, 220);
    });
  });

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener("change", updateTabArrows);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(updateTabArrows);
  }

  updateTabArrows();
}

function initServicesTeamMobileSlider() {
  const section = document.querySelector(".tb-services-page .leadership-section");
  const tabs = Array.from(section?.querySelectorAll(".leadership-tab") || []);
  const labels = Array.from(
    section?.querySelectorAll(".leadership-tab-button-wrapper .leadership-tab-buttom[for]") || [],
  );
  const pagination = section?.querySelector("[data-services-pagination]");
  const mobileMedia = window.matchMedia("(max-width: 767.98px)");

  if (!section || !tabs.length || !pagination) return;

  let activeTab = null;
  let dots = [];
  let scrollFrame = null;

  const getActiveTab = () => tabs.find((tab) => !tab.hidden) || tabs[0] || null;

  const getCards = (tab) =>
    Array.from(tab?.querySelectorAll(".leadership-card") || []);

  const updateDots = (activeIndex) => {
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const getClosestCardIndex = () => {
    const cards = getCards(activeTab);
    if (!cards.length || !activeTab) return 0;

    return cards.reduce((closestIndex, card, index) => {
      const closestCard = cards[closestIndex];
      const currentDiff = Math.abs(card.offsetLeft - activeTab.scrollLeft);
      const closestDiff = Math.abs(closestCard.offsetLeft - activeTab.scrollLeft);
      return currentDiff < closestDiff ? index : closestIndex;
    }, 0);
  };

  const scrollToCard = (index) => {
    const cards = getCards(activeTab);
    const targetCard = cards[index];
    if (!targetCard || !activeTab) return;

    activeTab.scrollTo({
      left: targetCard.offsetLeft,
      behavior: "smooth",
    });
  };

  const syncFromScroll = () => {
    if (!mobileMedia.matches || !activeTab) return;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null;
      updateDots(getClosestCardIndex());
    });
  };

  const buildPagination = () => {
    activeTab = getActiveTab();
    const cards = getCards(activeTab);

    pagination.innerHTML = "";
    dots = [];

    if (!mobileMedia.matches || cards.length < 2) {
      pagination.hidden = true;
      return;
    }

    dots = cards.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "tb-services-pagination-dot";
      dot.setAttribute("aria-label", `Go to service team profile ${index + 1}`);
      dot.setAttribute("aria-current", index === 0 ? "true" : "false");
      dot.addEventListener("click", () => {
        scrollToCard(index);
        updateDots(index);
      });
      pagination.appendChild(dot);
      return dot;
    });

    pagination.hidden = false;
    updateDots(getClosestCardIndex());
  };

  const syncSliderState = () => {
    activeTab = getActiveTab();

    if (!mobileMedia.matches) {
      pagination.hidden = true;
      pagination.innerHTML = "";
      return;
    }

    if (activeTab) {
      activeTab.scrollTo({ left: 0, behavior: "auto" });
    }

    buildPagination();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("scroll", () => {
      if (tab !== activeTab) return;
      syncFromScroll();
    }, { passive: true });
  });

  labels.forEach((label) => {
    label.addEventListener("click", () => {
      window.setTimeout(syncSliderState, 0);
    });
  });

  if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener("change", syncSliderState);
  } else if (typeof mobileMedia.addListener === "function") {
    mobileMedia.addListener(syncSliderState);
  }

  window.addEventListener("resize", syncSliderState);
  syncSliderState();
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

function initProcessMobileSlider() {
  const section = document.querySelector(".tb-truegenie-page .how-its-work");
  if (!section) return;

  const wrapper = section.querySelector(".process-wrapper");
  const iconItems = Array.from(
    section.querySelectorAll(".process-icons-grid .process-icon-wrapper"),
  );
  const cardItems = Array.from(section.querySelectorAll(".process-wrapper .process-card"));
  const pairCount = Math.min(iconItems.length, cardItems.length);

  if (!wrapper || pairCount < 2) return;

  const mobileMedia = window.matchMedia("(max-width: 767.98px)");
  const reduceMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const AUTO_SLIDE_MS = 3200;
  const AUTO_RESUME_MS = 4200;

  let currentIndex = 0;
  let autoSlideTimer = null;
  let resumeTimer = null;

  const getWrapperPaddingLeft = () => {
    const style = window.getComputedStyle(wrapper);
    return parseFloat(style.paddingLeft || "0") || 0;
  };

  const getStepLeft = (index) => {
    const safeIndex = Math.max(0, Math.min(index, pairCount - 1));
    const card = cardItems[safeIndex];
    if (!card) return 0;
    return Math.max(0, card.offsetLeft - getWrapperPaddingLeft());
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
    if (resumeTimer) {
      clearTimeout(resumeTimer);
      resumeTimer = null;
    }
  };

  const setActiveStep = (index) => {
    const safeIndex = Math.max(0, Math.min(index, pairCount - 1));
    currentIndex = safeIndex;

    iconItems.forEach((icon, iconIndex) => {
      icon.classList.toggle("is-active-step", iconIndex === safeIndex);
    });

    cardItems.forEach((card, cardIndex) => {
      card.classList.toggle("is-active-step", cardIndex === safeIndex);
    });
  };

  const getClosestVisibleIndex = () => {
    const currentLeft = wrapper.scrollLeft;
    let closestIndex = 0;
    let closestDiff = Number.POSITIVE_INFINITY;

    for (let index = 0; index < pairCount; index += 1) {
      const diff = Math.abs(getStepLeft(index) - currentLeft);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = index;
      }
    }

    return closestIndex;
  };

  const goToStep = (index, behavior = "smooth") => {
    const safeIndex = ((index % pairCount) + pairCount) % pairCount;

    wrapper.scrollTo({
      left: getStepLeft(safeIndex),
      behavior,
    });
    setActiveStep(safeIndex);
  };

  const startAutoSlide = () => {
    if (!mobileMedia.matches || reduceMotionMedia.matches || autoSlideTimer) return;
    autoSlideTimer = setInterval(() => {
      const nextIndex = currentIndex >= pairCount - 1 ? 0 : currentIndex + 1;
      goToStep(nextIndex, "smooth");
    }, AUTO_SLIDE_MS);
  };

  const scheduleAutoResume = () => {
    if (!mobileMedia.matches || reduceMotionMedia.matches) return;
    if (resumeTimer) {
      clearTimeout(resumeTimer);
    }
    resumeTimer = setTimeout(() => {
      startAutoSlide();
    }, AUTO_RESUME_MS);
  };

  const pauseAutoTemporarily = () => {
    if (!mobileMedia.matches) return;
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
    scheduleAutoResume();
  };

  const handleScroll = () => {
    if (!mobileMedia.matches) return;
    setActiveStep(getClosestVisibleIndex());
  };

  const handleModeChange = () => {
    stopAutoSlide();

    if (!mobileMedia.matches) {
      wrapper.classList.remove("is-mobile-slider");
      iconItems.forEach((icon) => icon.classList.remove("is-active-step"));
      cardItems.forEach((card) => card.classList.remove("is-active-step"));
      return;
    }

    wrapper.classList.add("is-mobile-slider");
    currentIndex = getClosestVisibleIndex();
    setActiveStep(currentIndex);
    startAutoSlide();
  };

  wrapper.addEventListener("scroll", handleScroll, { passive: true });
  wrapper.addEventListener("touchstart", pauseAutoTemporarily, { passive: true });
  wrapper.addEventListener("pointerdown", pauseAutoTemporarily);
  wrapper.addEventListener("wheel", pauseAutoTemporarily, { passive: true });

  iconItems.forEach((icon, index) => {
    icon.addEventListener("click", () => {
      if (!mobileMedia.matches) return;
      pauseAutoTemporarily();
      goToStep(index, "smooth");
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
      return;
    }
    scheduleAutoResume();
  });

  const handleReducedMotionChange = () => {
    if (reduceMotionMedia.matches) {
      stopAutoSlide();
      return;
    }
    scheduleAutoResume();
  };

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener("change", handleModeChange);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(handleModeChange);
  }

  if (reduceMotionMedia.addEventListener) {
    reduceMotionMedia.addEventListener("change", handleReducedMotionChange);
  } else if (reduceMotionMedia.addListener) {
    reduceMotionMedia.addListener(handleReducedMotionChange);
  }

  handleModeChange();
}

function initHoverCardAnimation() {
  const cards = Array.from(document.querySelectorAll(".hover-card-animation"));
  if (!cards.length) return;

  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsHover || prefersReducedMotion) return;

  const MAX_ROTATE_X = 9;
  const MAX_ROTATE_Y = 12;

  cards.forEach((card) => {
    const resetCard = () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--card-rotate-x", "0deg");
      card.style.setProperty("--card-rotate-y", "0deg");
    };

    const setTilt = (event) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const px = Math.max(0, Math.min(1, localX / rect.width));
      const py = Math.max(0, Math.min(1, localY / rect.height));

      const rotateY = (px - 0.5) * (MAX_ROTATE_Y * 2);
      const rotateX = (0.5 - py) * (MAX_ROTATE_X * 2);

      card.classList.add("is-tilting");
      card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
    };

    card.addEventListener("pointerenter", setTilt);
    card.addEventListener("pointermove", setTilt);
    card.addEventListener("pointerleave", resetCard);
    card.addEventListener("blur", resetCard, true);
  });
}
