document.addEventListener("DOMContentLoaded", () => {
  initFunctionalModules();
  initLeadershipLabelTabs();
  initServiceTeamTabArrows();
  initLeadershipButtonTabs();
  initProcessStepHoverEffects();
  initProcessMobileSlider();
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
