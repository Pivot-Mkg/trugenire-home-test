const trustSegments = [
  "Developers & Asset Owners",
  "Lenders & Banks",
  "NBFCs & Alternative Capital",
  "Funds & Institutional Investors",
];

const offerings = [
  {
    tab: "TruGenie",
    title: "TruGenie - Real Estate Intelligence",
    description:
      "TruGenie transforms raw project data into actionable insights.\n\nKey capabilities:",
    capabilities: [
      { text: "Construction progress & cost tracking", icon: "B" },
      { text: "Sales velocity and collection monitoring", icon: "U" },
      { text: "Cashflow and fund-flow intelligence", icon: "F" },
      { text: "NOC and approval workflows", icon: "N" },
      { text: "Compliance, covenant & risk tracking", icon: "C" },
    ],
  },
  {
    tab: "PDMS",
    title: "PDMS - Project Development Management",
    description:
      "End-to-end project development management system for real estate.\n\nKey capabilities:",
    capabilities: [
      { text: "Project planning & scheduling", icon: "P" },
      { text: "Resource allocation & tracking", icon: "R" },
      { text: "Quality assurance monitoring", icon: "Q" },
      { text: "Vendor & contractor management", icon: "V" },
      { text: "Budget & milestone oversight", icon: "$" },
    ],
  },
  {
    tab: "Advisory",
    title: "Advisory - Strategic Asset Services",
    description:
      "Expert advisory services for real estate asset optimization.\n\nKey capabilities:",
    capabilities: [
      { text: "Portfolio strategy & optimization", icon: "S" },
      { text: "Risk assessment & mitigation", icon: "!" },
      { text: "Market analysis & benchmarking", icon: "U" },
      { text: "Regulatory compliance advisory", icon: "N" },
      { text: "Capital structuring guidance", icon: "$" },
    ],
  },
];

let offeringIndex = 0;

const heroStageImages = [
  {
    src: "./assets/images/home-page/hero-banner-right-1.png",
    alt: "Monetize stage illustration",
  },
  {
    src: "./assets/images/home-page/hero-banner-right-1.png",
    alt: "Plan stage illustration",
  },
  {
    src: "./assets/images/home-page/hero-banner-right-1.png",
    alt: "Build stage illustration",
  },
  {
    src: "./assets/images/home-page/hero-banner-right-1.png",
    alt: "Exit stage illustration",
  },
];

function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

function animateCounter(element, target, durationMs) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initImpactCounters() {
  const counters = document.querySelectorAll(".count-up[data-target]");
  if (!counters.length) return;

  let played = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        counters.forEach((counter) => {
          const target = Number(counter.getAttribute("data-target") || "0");
          animateCounter(counter, target, 2000);
        });
        observer.disconnect();
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(counters[0]);
}

function initTrustTabs() {
  const root = document.getElementById("trustTabs");
  if (!root) return;

  let active = 0;

  function render() {
    root.innerHTML = trustSegments
      .map((segment, idx) => {
        const isActive = idx === active;
        return `
          <button type="button" class="tb-trust-btn w-100${isActive ? " is-active" : ""}" data-trust-index="${idx}">
            <span>${segment}</span>${isActive ? ' <span class="tb-arrow">&rarr;</span>' : ""}
          </button>
        `;
      })
      .join("");

    root.querySelectorAll("[data-trust-index]").forEach((button) => {
      button.addEventListener("click", () => {
        active = Number(button.getAttribute("data-trust-index"));
        render();
      });
    });
  }

  render();
}

function initLifecycleToggles() {
  const toggles = Array.from(
    document.querySelectorAll(".tb-lifecycle-item[data-phase-index]"),
  );
  const grid = document.querySelector(".tb-lifecycle-grid");
  const heroStageImage = document.getElementById("tbHeroStageImage");
  if (!toggles.length) return;

  function setActive(activeIndex) {
    toggles.forEach((toggle, idx) => {
      const active = idx === activeIndex;
      toggle.classList.toggle("is-active", active);
      toggle.setAttribute("aria-pressed", String(active));
    });

    if (grid) {
      grid.classList.remove("phase-0", "phase-1", "phase-2", "phase-3");
      grid.classList.add(`phase-${activeIndex}`);
    }

    if (heroStageImage && heroStageImages[activeIndex]) {
      heroStageImage.style.opacity = "0.08";
      heroStageImage.src = heroStageImages[activeIndex].src;
      heroStageImage.alt = heroStageImages[activeIndex].alt;
      heroStageImage.onload = () => {
        heroStageImage.style.opacity = "1";
      };
    }
  }

  toggles.forEach((toggle, idx) => {
    toggle.addEventListener("click", () => {
      setActive(idx);
    });
  });

  setActive(0);
}

function renderOfferingTabs() {
  const tabs = document.getElementById("offeringTabs");
  if (!tabs) return;

  tabs.innerHTML = offerings
    .map(
      (offering, idx) => `
        <button type="button" class="tb-offering-tab${idx === offeringIndex ? " is-active" : ""}" data-offering-index="${idx}">
          ${offering.tab}
        </button>
      `,
    )
    .join("");

  tabs.querySelectorAll("[data-offering-index]").forEach((button) => {
    button.addEventListener("click", () => {
      offeringIndex = Number(button.getAttribute("data-offering-index"));
      renderOfferings();
    });
  });
}

function renderOfferings() {
  const current = offerings[offeringIndex];
  const title = document.getElementById("offeringTitle");
  const description = document.getElementById("offeringDescription");
  const capabilityGrid = document.getElementById("offeringCapabilities");

  if (title) title.textContent = current.title;
  if (description) description.textContent = current.description;

  if (capabilityGrid) {
    capabilityGrid.innerHTML = current.capabilities
      .map(
        (item, idx) => `
          <article class="tb-capability-card${idx === 0 ? " is-highlight" : ""}">
            <span class="tb-capability-icon" aria-hidden="true">${item.icon}</span>
            <p>${item.text}</p>
          </article>
        `,
      )
      .join("");
  }

  renderOfferingTabs();
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initImpactCounters();
  initLifecycleToggles();
  initTrustTabs();
  renderOfferings();
});
