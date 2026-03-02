const trustGroups = [
  {
    label: "Developers & Asset Owners",
    logos: [
      {
        src: "./assets/images/trusted-logos/brookfield.png",
        alt: "Brookfield",
      },
      { src: "./assets/images/trusted-logos/upes.png", alt: "UPES" },
      { src: "./assets/images/trusted-logos/merusri.png", alt: "Merusri" },
      { src: "./assets/images/trusted-logos/hcltech.png", alt: "HCLTech" },
      {
        src: "./assets/images/trusted-logos/clearpack.png",
        alt: "Clearpack Group",
      },
      { src: "./assets/images/trusted-logos/transcon.png", alt: "Transcon" },
      { src: "./assets/images/trusted-logos/bc.png", alt: "B.C.C." },
      { src: "./assets/images/trusted-logos/kanakia.png", alt: "Kanakia" },
    ],
  },
  {
    label: "Lenders & Banks",
    logos: [
      {
        src: "./assets/images/trusted-logos/hdfc_capital.png",
        alt: "HDFC Capital",
      },
      {
        src: "./assets/images/trusted-logos/sbicap_ventures.png",
        alt: "SBICAP Ventures",
      },
      {
        src: "./assets/images/trusted-logos/icici_venture.png",
        alt: "ICICI Venture",
      },
      {
        src: "./assets/images/trusted-logos/motilal_more.png",
        alt: "Motilal Oswal More",
      },
      { src: "./assets/images/trusted-logos/hdfc_bank.png", alt: "HDFC Bank" },
      {
        src: "./assets/images/trusted-logos/icici_bank.png",
        alt: "ICICI Bank",
      },
      { src: "./assets/images/trusted-logos/yes_bank.png", alt: "YES BANK" },
      {
        src: "./assets/images/trusted-logos/tata_capital.png",
        alt: "Tata Capital",
      },
    ],
  },
  {
    label: "NBFCs & Alternative Capital",
    logos: [
      {
        src: "./assets/images/trusted-logos/eaaa_alternatives.png",
        alt: "EAAA Alternatives",
      },
      {
        src: "./assets/images/trusted-logos/tata_capital.png",
        alt: "Tata Capital",
      },
      { src: "./assets/images/trusted-logos/edelweiss.png", alt: "Edelweiss" },
      { src: "./assets/images/trusted-logos/nifco.png", alt: "NiFCO" },
      { src: "./assets/images/trusted-logos/experion.png", alt: "Experion" },
      {
        src: "./assets/images/trusted-logos/hdfc_capital.png",
        alt: "HDFC Capital",
      },
      {
        src: "./assets/images/trusted-logos/sbicap_ventures.png",
        alt: "SBICAP Ventures",
      },
      {
        src: "./assets/images/trusted-logos/motilal_more.png",
        alt: "Motilal Oswal More",
      },
    ],
  },
  {
    label: "Funds & Institutional Investors",
    logos: [
      {
        src: "./assets/images/trusted-logos/avenue_capital.png",
        alt: "Avenue Capital Group",
      },
      { src: "./assets/images/trusted-logos/cerberus.png", alt: "Cerberus" },
      { src: "./assets/images/trusted-logos/acre.png", alt: "ACRE" },
      {
        src: "./assets/images/trusted-logos/jc_flowers.png",
        alt: "J.C. Flowers & Co.",
      },
      {
        src: "./assets/images/trusted-logos/bailey_properties.png",
        alt: "Bailey Properties, Inc. (USA)",
      },
      {
        src: "./assets/images/trusted-logos/eaaa_alternatives.png",
        alt: "EAAA Alternatives",
      },
      {
        src: "./assets/images/trusted-logos/hdfc_capital.png",
        alt: "HDFC Capital",
      },
      {
        src: "./assets/images/trusted-logos/motilal_more.png",
        alt: "Motilal Oswal More",
      },
    ],
  },
];

const offerings = [
  {
    tab: "TruGenie",
    title: "TruGenie - Real Estate Intelligence",
    description:
      "TruGenie transforms raw project data into actionable insights.\n\nKey capabilities:",
    image: {
      src: "./assets/images/trugenie-card-home.jpg",
      alt: "TruGenie real estate intelligence dashboard",
    },
    capabilities: [
      {
        text: "Construction progress & cost tracking",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M11.667 11.6667V5.83341C11.667 5.524 11.7899 5.22725 12.0087 5.00846C12.2275 4.78966 12.5242 4.66675 12.8337 4.66675H15.167C15.4764 4.66675 15.7732 4.78966 15.9919 5.00846C16.2107 5.22725 16.3337 5.524 16.3337 5.83341V11.6667" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.333 7C18.1895 7 19.97 7.7375 21.2828 9.05025C22.5955 10.363 23.333 12.1435 23.333 14V17.5" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.66699 17.5V14C4.66699 12.1435 5.40449 10.363 6.71724 9.05025C8.03 7.7375 9.81048 7 11.667 7" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.4997 17.5H3.49967C2.85534 17.5 2.33301 18.0223 2.33301 18.6667V21C2.33301 21.6443 2.85534 22.1667 3.49967 22.1667H24.4997C25.144 22.1667 25.6663 21.6443 25.6663 21V18.6667C25.6663 18.0223 25.144 17.5 24.4997 17.5Z" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
      {
        text: "Sales velocity and collection monitoring",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M25.6663 8.16675L15.7497 18.0834L9.91634 12.2501L2.33301 19.8334" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18.667 8.16675H25.667V15.1667" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
      {
        text: "Cashflow and fund-flow intelligence",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M22.1667 8.16667V4.66667C22.1667 4.35725 22.0438 4.0605 21.825 3.84171C21.6062 3.62292 21.3094 3.5 21 3.5H5.83333C5.21449 3.5 4.621 3.74583 4.18342 4.18342C3.74583 4.621 3.5 5.21449 3.5 5.83333C3.5 6.45217 3.74583 7.04566 4.18342 7.48325C4.621 7.92083 5.21449 8.16667 5.83333 8.16667H23.3333C23.6428 8.16667 23.9395 8.28958 24.1583 8.50838C24.3771 8.72717 24.5 9.02391 24.5 9.33333V14M24.5 14H21C20.3812 14 19.7877 14.2458 19.3501 14.6834C18.9125 15.121 18.6667 15.7145 18.6667 16.3333C18.6667 16.9522 18.9125 17.5457 19.3501 17.9832C19.7877 18.4208 20.3812 18.6667 21 18.6667H24.5C24.8094 18.6667 25.1062 18.5437 25.325 18.325C25.5438 18.1062 25.6667 17.8094 25.6667 17.5V15.1667C25.6667 14.8572 25.5438 14.5605 25.325 14.3417C25.1062 14.1229 24.8094 14 24.5 14Z" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3.5 5.83325V22.1666C3.5 22.7854 3.74583 23.3789 4.18342 23.8165C4.621 24.2541 5.21449 24.4999 5.83333 24.4999H23.3333C23.6428 24.4999 23.9395 24.377 24.1583 24.1582C24.3771 23.9394 24.5 23.6427 24.5 23.3333V18.6666" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
      {
        text: "NOC and approval workflows",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M17.5003 2.33325H7.00033C6.38149 2.33325 5.78799 2.57908 5.35041 3.01667C4.91282 3.45425 4.66699 4.04775 4.66699 4.66659V23.3333C4.66699 23.9521 4.91282 24.5456 5.35041 24.9832C5.78799 25.4208 6.38149 25.6666 7.00033 25.6666H21.0003C21.6192 25.6666 22.2127 25.4208 22.6502 24.9832C23.0878 24.5456 23.3337 23.9521 23.3337 23.3333V8.16659L17.5003 2.33325Z" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.333 2.33325V6.99992C16.333 7.61876 16.5788 8.21225 17.0164 8.64983C17.454 9.08742 18.0475 9.33325 18.6663 9.33325H23.333" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5 17.5001L12.8333 19.8334L17.5 15.1667" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
      {
        text: "Compliance, covenant & risk tracking",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M23.3337 15.1669C23.3337 21.0002 19.2503 23.9169 14.397 25.6085C14.1428 25.6947 13.8668 25.6905 13.6153 25.5969C8.75033 23.9169 4.66699 21.0002 4.66699 15.1669V7.0002C4.66699 6.69078 4.78991 6.39403 5.0087 6.17524C5.22749 5.95645 5.52424 5.83353 5.83366 5.83353C8.16699 5.83353 11.0837 4.43353 13.1137 2.6602C13.3608 2.44903 13.6752 2.33301 14.0003 2.33301C14.3254 2.33301 14.6398 2.44903 14.887 2.6602C16.9287 4.4452 19.8337 5.83353 22.167 5.83353C22.4764 5.83353 22.7732 5.95645 22.992 6.17524C23.2107 6.39403 23.3337 6.69078 23.3337 7.0002V15.1669Z" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5 13.9998L12.8333 16.3332L17.5 11.6665" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
    ],
  },
  {
    tab: "PDMS",
    title: "PDMS - Project Development Management",
    description:
      "End-to-end project development management system for real estate.\n\nKey capabilities:",
    image: {
      src: "./assets/images/pdms-card-home.jpg",
      alt: "PDMS project planning and site execution visualization",
    },
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
    image: {
      src: "./assets/images/advisory.jpg",
      alt: "Advisory portfolio and capital strategy visualization",
    },
    capabilities: [
      {
        text: "Portfolio strategy & optimization",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M11.667 11.6667V5.83341C11.667 5.524 11.7899 5.22725 12.0087 5.00846C12.2275 4.78966 12.5242 4.66675 12.8337 4.66675H15.167C15.4764 4.66675 15.7732 4.78966 15.9919 5.00846C16.2107 5.22725 16.3337 5.524 16.3337 5.83341V11.6667" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.333 7C18.1895 7 19.97 7.7375 21.2828 9.05025C22.5955 10.363 23.333 12.1435 23.333 14V17.5" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.66699 17.5V14C4.66699 12.1435 5.40449 10.363 6.71724 9.05025C8.03 7.7375 9.81048 7 11.667 7" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.4997 17.5H3.49967C2.85534 17.5 2.33301 18.0223 2.33301 18.6667V21C2.33301 21.6443 2.85534 22.1667 3.49967 22.1667H24.4997C25.144 22.1667 25.6663 21.6443 25.6663 21V18.6667C25.6663 18.0223 25.144 17.5 24.4997 17.5Z" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      },
      { text: "Risk assessment & mitigation", icon: "!" },
      { text: "Market analysis & benchmarking", icon: "U" },
      { text: "Regulatory compliance advisory", icon: "N" },
      { text: "Capital structuring guidance", icon: "$" },
    ],
  },
];

const capabilityPlaceholderIcons = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <rect x="4.66699" y="4.66699" width="18.6667" height="18.6667" rx="3.5" stroke="#286FED" stroke-width="2.33333"/>
  <path d="M9.33301 11.6667H18.6663" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
  <path d="M9.33301 16.3333H16.333" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
</svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M6.41699 21.5833H21.5837" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
  <path d="M8.75 21.5833V14.5833" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
  <path d="M14 21.5833V9.91675" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
  <path d="M19.25 21.5833V12.2501" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
</svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <circle cx="14.0003" cy="14.0003" r="9.33333" stroke="#286FED" stroke-width="2.33333"/>
  <path d="M10.5 14.0001L12.8333 16.3334L17.5 11.6667" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <rect x="4.66699" y="7.00024" width="18.6667" height="14" rx="3.5" stroke="#286FED" stroke-width="2.33333"/>
  <path d="M4.66699 11.6667H23.3337" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
  <circle cx="9.33333" cy="16.3333" r="1.16667" fill="#286FED"/>
</svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M14 4.66675L22.1667 9.33341V18.6667L14 23.3334L5.83334 18.6667V9.33341L14 4.66675Z" stroke="#286FED" stroke-width="2.33333" stroke-linejoin="round"/>
  <path d="M10.5 14.0001H17.5" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
  <path d="M14 10.5001V17.5001" stroke="#286FED" stroke-width="2.33333" stroke-linecap="round"/>
</svg>`,
];

function getCapabilityIcon(icon, index) {
  const rawIcon = typeof icon === "string" ? icon.trim() : "";
  if (rawIcon && rawIcon.includes("<svg")) return rawIcon;
  return capabilityPlaceholderIcons[index % capabilityPlaceholderIcons.length];
}

let offeringIndex = 0;
let offeringImageLoadToken = 0;
let offeringTransitionTimer = null;
let offeringRenderToken = 0;
const OFFERING_TRANSITION_OUT_MS = 170;
const OFFERING_IMAGE_FADE_MS = 320;

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

  const desktopMedia = window.matchMedia("(min-width: 992px)");
  const dropdownItems = Array.from(
    mainNav.querySelectorAll(".tb-nav-item.tb-has-dropdown"),
  );

  function setDropdownState(item, isOpen) {
    const trigger = item.querySelector(".tb-nav-trigger");
    item.classList.toggle("is-open", isOpen);
    if (trigger) {
      trigger.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function closeAllDropdowns(exceptItem = null) {
    dropdownItems.forEach((item) => {
      if (exceptItem && item === exceptItem) return;
      setDropdownState(item, false);
    });
  }

  function closeMobileMenu() {
    if (!mainNav.classList.contains("open")) return;
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    closeAllDropdowns();
  }

  dropdownItems.forEach((item, index) => {
    const trigger = item.querySelector(".tb-nav-trigger");
    const dropdown = item.querySelector(".tb-nav-dropdown");
    if (!trigger || !dropdown) return;
    let closeTimer = null;

    const clearCloseTimer = () => {
      if (!closeTimer) return;
      clearTimeout(closeTimer);
      closeTimer = null;
    };

    const scheduleClose = () => {
      clearCloseTimer();
      closeTimer = setTimeout(() => {
        setDropdownState(item, false);
      }, 130);
    };

    if (!dropdown.id) {
      dropdown.id = `tb-nav-menu-${index + 1}`;
    }

    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-controls", dropdown.id);
    trigger.setAttribute("aria-expanded", "false");

    item.addEventListener("mouseenter", () => {
      if (!desktopMedia.matches) return;
      clearCloseTimer();
      closeAllDropdowns(item);
      setDropdownState(item, true);
    });

    item.addEventListener("mouseleave", () => {
      if (!desktopMedia.matches) return;
      scheduleClose();
    });

    dropdown.addEventListener("mouseenter", () => {
      if (!desktopMedia.matches) return;
      clearCloseTimer();
    });

    dropdown.addEventListener("mouseleave", () => {
      if (!desktopMedia.matches) return;
      scheduleClose();
    });

    item.addEventListener("focusin", () => {
      if (!desktopMedia.matches) return;
      clearCloseTimer();
      closeAllDropdowns(item);
      setDropdownState(item, true);
    });

    item.addEventListener("focusout", (event) => {
      if (!desktopMedia.matches) return;
      const nextFocused = event.relatedTarget;
      if (nextFocused && item.contains(nextFocused)) return;
      setDropdownState(item, false);
    });

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !item.classList.contains("is-open");
      closeAllDropdowns(item);
      setDropdownState(item, shouldOpen);
    });
  });

  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target)) {
      closeAllDropdowns();
    }

    if (desktopMedia.matches || !mainNav.classList.contains("open")) return;
    if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAllDropdowns();
    if (!desktopMedia.matches) closeMobileMenu();
  });

  const handleViewportChange = () => {
    closeAllDropdowns();
    if (desktopMedia.matches) closeMobileMenu();
  };

  if (desktopMedia.addEventListener) {
    desktopMedia.addEventListener("change", handleViewportChange);
  } else if (desktopMedia.addListener) {
    desktopMedia.addListener(handleViewportChange);
  }

  menuToggle.addEventListener("click", () => {
    const shouldOpen = !mainNav.classList.contains("open");
    if (shouldOpen) {
      mainNav.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      return;
    }

    closeMobileMenu();
  });
}

function getCurrentPageFile(pathname) {
  const cleanPath = (pathname || "").split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";
  if (!lastSegment || !lastSegment.includes(".")) return "index.html";
  return lastSegment.toLowerCase();
}

function initActiveNavLink() {
  const mainNav = document.getElementById("mainNav");
  if (!mainNav) return;

  const currentFile = getCurrentPageFile(window.location.pathname);
  const navLinks = Array.from(mainNav.querySelectorAll("a[href]"));

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    let targetUrl;
    try {
      targetUrl = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (targetUrl.origin !== window.location.origin) return;

    const targetFile = getCurrentPageFile(targetUrl.pathname);
    if (targetFile !== currentFile) return;

    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
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

function initImpactSlider() {
  const sliderRoot = document.querySelector("[data-impact-slider]");
  const viewport =
    sliderRoot && sliderRoot.querySelector("[data-impact-viewport]");
  const track = sliderRoot && sliderRoot.querySelector("[data-impact-track]");
  const slides = track
    ? Array.from(track.querySelectorAll(".tb-impact-slide"))
    : [];
  const prevButton = sliderRoot
    ? sliderRoot.querySelector('[data-impact-nav="prev"]')
    : null;
  const nextButton = sliderRoot
    ? sliderRoot.querySelector('[data-impact-nav="next"]')
    : null;
  const pagination = document.querySelector("[data-impact-pagination]");

  if (
    !sliderRoot ||
    !viewport ||
    !track ||
    slides.length < 2 ||
    typeof window.Swiper !== "function"
  ) {
    return;
  }

  const mobileMedia = window.matchMedia("(max-width: 767.98px)");
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let swiperInstance = null;

  const syncPaginationAria = () => {
    if (!pagination) return;
    const dots = Array.from(pagination.querySelectorAll(".tb-impact-dot"));
    dots.forEach((dot) => {
      const isActive = dot.classList.contains("is-active");
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const createSlider = () => {
    if (swiperInstance || !mobileMedia.matches) return;

    swiperInstance = new window.Swiper(viewport, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: reduceMotion ? 0 : 550,
      loop: slides.length > 1,
      allowTouchMove: true,
      watchOverflow: false,
      autoplay: reduceMotion
        ? false
        : {
            delay: 2600,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      navigation:
        prevButton && nextButton
          ? {
              prevEl: prevButton,
              nextEl: nextButton,
            }
          : undefined,
      pagination: pagination
        ? {
            el: pagination,
            clickable: true,
            bulletClass: "tb-impact-dot",
            bulletActiveClass: "is-active",
            renderBullet: (index, className) =>
              `<button type="button" class="${className}" aria-label="Go to impact slide ${
                index + 1
              }"></button>`,
          }
        : undefined,
      on: {
        init: syncPaginationAria,
        slideChange: syncPaginationAria,
      },
    });
  };

  const destroySlider = () => {
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstance = null;
    if (pagination) pagination.innerHTML = "";
  };

  const syncOnViewportChange = () => {
    if (mobileMedia.matches) {
      createSlider();
      return;
    }
    destroySlider();
  };

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener("change", syncOnViewportChange);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(syncOnViewportChange);
  }

  window.addEventListener("resize", syncOnViewportChange);
  syncOnViewportChange();
}

function initWhySlider() {
  const sliderRoot = document.querySelector("[data-why-slider]");
  const pagination = document.querySelector("[data-why-pagination]");

  if (!sliderRoot || !pagination || typeof window.Swiper !== "function") return;

  const mobileMedia = window.matchMedia("(max-width: 767.98px)");
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let swiperInstance = null;

  const syncPaginationAria = () => {
    const dots = Array.from(pagination.querySelectorAll(".tb-why-dot"));
    dots.forEach((dot) => {
      const isActive = dot.classList.contains("is-active");
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const createSlider = () => {
    if (swiperInstance || !mobileMedia.matches) return;

    swiperInstance = new window.Swiper(sliderRoot, {
      slidesPerView: 2,
      spaceBetween: 10,
      speed: reduceMotion ? 0 : 550,
      loop: true,
      allowTouchMove: true,
      watchOverflow: false,
      autoplay: reduceMotion
        ? false
        : {
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      pagination: {
        el: pagination,
        clickable: true,
        bulletClass: "tb-why-dot",
        bulletActiveClass: "is-active",
        renderBullet: (index, className) =>
          `<button type="button" class="${className}" aria-label="Go to Why TruBoard card ${
            index + 1
          }"></button>`,
      },
      on: {
        init: syncPaginationAria,
        slideChange: syncPaginationAria,
      },
    });
  };

  const destroySlider = () => {
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstance = null;
    pagination.innerHTML = "";
  };

  const syncOnViewportChange = () => {
    if (mobileMedia.matches) {
      createSlider();
      return;
    }
    destroySlider();
  };

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener("change", syncOnViewportChange);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(syncOnViewportChange);
  }

  window.addEventListener("resize", syncOnViewportChange);
  syncOnViewportChange();
}

function initIntegratedSlider() {
  const sliderRoot = document.querySelector("[data-integrated-slider]");
  const track =
    sliderRoot && sliderRoot.querySelector("[data-integrated-track]");
  const slides = track
    ? Array.from(track.querySelectorAll("[data-integrated-slide]"))
    : [];

  if (
    !sliderRoot ||
    !track ||
    slides.length < 2 ||
    typeof window.Swiper !== "function"
  ) {
    return;
  }

  const mobileMedia = window.matchMedia("(max-width: 991.98px)");
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let swiperInstance = null;

  const applySwiperStructure = () => {
    sliderRoot.classList.add("swiper");
    track.classList.add("swiper-wrapper");
    slides.forEach((slide) => {
      slide.classList.add("swiper-slide");
    });
  };

  const removeSwiperStructure = () => {
    sliderRoot.classList.remove("swiper");
    track.classList.remove("swiper-wrapper");
    slides.forEach((slide) => {
      slide.classList.remove("swiper-slide");
    });
  };

  const createSlider = () => {
    if (swiperInstance || !mobileMedia.matches) return;
    applySwiperStructure();

    swiperInstance = new window.Swiper(sliderRoot, {
      slidesPerView: 1.12,
      spaceBetween: 12,
      speed: reduceMotion ? 0 : 520,
      loop: slides.length > 1,
      watchOverflow: false,
      allowTouchMove: true,
      centeredSlides: false,
    });
  };

  const destroySlider = () => {
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstance = null;
    removeSwiperStructure();
  };

  const syncOnViewportChange = () => {
    if (mobileMedia.matches) {
      createSlider();
      return;
    }
    destroySlider();
  };

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener("change", syncOnViewportChange);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(syncOnViewportChange);
  }

  window.addEventListener("resize", syncOnViewportChange);
  syncOnViewportChange();
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

function initProblemSectionOrder() {
  const section = document.querySelector(".tb-problem");
  if (!section) return;

  const textCol = section.querySelector(".row > .col-lg-6:first-child");
  const diagramCol = section.querySelector(".row > .col-lg-6:last-child");
  const diagram = diagramCol && diagramCol.querySelector(".tb-problem-diagram");
  const issueList = textCol && textCol.querySelector(".tb-issue-list");
  const callout = textCol && textCol.querySelector(".tb-issue-callout");

  if (!textCol || !diagram || !issueList || !callout) return;

  const mobileMedia = window.matchMedia("(max-width: 991.98px)");
  const listPlaceholder = document.createComment("tb-issue-list-placeholder");
  const calloutPlaceholder = document.createComment(
    "tb-issue-callout-placeholder",
  );
  let placeholdersMounted = false;
  let isMobileOrderApplied = false;

  const applyMobileOrder = () => {
    if (isMobileOrderApplied) return;

    if (!placeholdersMounted) {
      textCol.insertBefore(listPlaceholder, issueList);
      textCol.insertBefore(calloutPlaceholder, callout);
      placeholdersMounted = true;
    }

    diagram.insertAdjacentElement("afterend", issueList);
    issueList.insertAdjacentElement("afterend", callout);
    isMobileOrderApplied = true;
  };

  const restoreDesktopOrder = () => {
    if (!isMobileOrderApplied) return;

    if (listPlaceholder.parentNode) {
      listPlaceholder.parentNode.insertBefore(issueList, listPlaceholder);
    }
    if (calloutPlaceholder.parentNode) {
      calloutPlaceholder.parentNode.insertBefore(callout, calloutPlaceholder);
    }

    isMobileOrderApplied = false;
  };

  const syncOrder = () => {
    if (mobileMedia.matches) {
      applyMobileOrder();
      return;
    }
    restoreDesktopOrder();
  };

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener("change", syncOrder);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(syncOrder);
  }

  window.addEventListener("resize", syncOrder);
  syncOrder();
}

function initTrustTabs() {
  const root = document.getElementById("trustTabs");
  const logoGrid = document.getElementById("trustLogoGrid");
  if (!root || !logoGrid) return;

  let active = 0;
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopMedia =
    window.matchMedia && window.matchMedia("(min-width: 992px)");
  let switchTimer = null;
  let enterTimer = null;

  function syncTrustedGridHeight() {
    if (!desktopMedia || !desktopMedia.matches) {
      logoGrid.classList.remove("is-height-synced");
      logoGrid.style.removeProperty("--tb-trusted-target-height");
      logoGrid.style.removeProperty("--tb-trusted-rows");
      return;
    }

    const tabsHeight = root.offsetHeight;
    if (!tabsHeight) return;

    const cardCount =
      logoGrid.children.length || trustGroups[active]?.logos?.length || 0;
    const columns = 4;
    const rows = Math.max(1, Math.ceil(cardCount / columns));

    logoGrid.style.setProperty("--tb-trusted-target-height", `${tabsHeight}px`);
    logoGrid.style.setProperty("--tb-trusted-rows", String(rows));
    logoGrid.classList.add("is-height-synced");
  }

  function renderLogos(animate = false) {
    const group = trustGroups[active];
    const markup = group.logos
      .map(
        (logo, idx) => `
          <article class="tb-trusted-logo-card" style="--tb-logo-delay:${idx * 40}ms">
            <img src="${logo.src}" alt="${logo.alt}" loading="lazy">
          </article>
        `,
      )
      .join("");

    if (!animate || reduceMotion) {
      logoGrid.classList.remove("is-switching", "is-entering");
      logoGrid.innerHTML = markup;
      syncTrustedGridHeight();
      return;
    }

    if (switchTimer) clearTimeout(switchTimer);
    if (enterTimer) clearTimeout(enterTimer);

    logoGrid.classList.remove("is-entering");
    logoGrid.classList.add("is-switching");

    switchTimer = setTimeout(() => {
      logoGrid.innerHTML = markup;
      logoGrid.classList.remove("is-switching");
      syncTrustedGridHeight();
      void logoGrid.offsetWidth;
      logoGrid.classList.add("is-entering");
      enterTimer = setTimeout(() => {
        logoGrid.classList.remove("is-entering");
      }, 440);
    }, 160);
  }

  function render(animateLogos = false) {
    root.innerHTML = trustGroups
      .map((group, idx) => {
        const isActive = idx === active;
        return `
          <button type="button" class="tb-trust-btn w-100${isActive ? " is-active" : ""}" data-trust-index="${idx}" aria-pressed="${isActive}">
            <span>${group.label}</span>${
              isActive
                ? `<span class="tb-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15" fill="none">
  <path d="M17.7071 8.07112C18.0976 7.68059 18.0976 7.04743 17.7071 6.65691L11.3431 0.292945C10.9526 -0.0975795 10.3195 -0.0975794 9.92893 0.292945C9.53841 0.683469 9.53841 1.31663 9.92893 1.70716L15.5858 7.36401L9.92893 13.0209C9.53841 13.4114 9.53841 14.0446 9.92893 14.4351C10.3195 14.8256 10.9526 14.8256 11.3431 14.4351L17.7071 8.07112ZM0 7.36401L8.74228e-08 8.36401L17 8.36401L17 7.36401L17 6.36401L-8.74228e-08 6.36401L0 7.36401Z" fill="#F39130"/>
</svg></span>`
                : ""
            }
          </button>
        `;
      })
      .join("");

    root.querySelectorAll("[data-trust-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = Number(button.getAttribute("data-trust-index"));
        if (next === active) return;
        active = next;
        render(true);
      });
    });

    renderLogos(animateLogos);
  }

  render();
  window.addEventListener("resize", syncTrustedGridHeight);
  window.addEventListener("load", syncTrustedGridHeight, { once: true });
}

function initIntegratedCardLineBalance() {
  const paragraphs = Array.from(
    document.querySelectorAll(".tb-integrated .tb-integrated-card p"),
  );
  if (paragraphs.length < 2) return;

  const desktopMedia =
    window.matchMedia && window.matchMedia("(min-width: 992px)");

  const getLineCount = (element) => {
    const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
    if (!lineHeight) return 0;
    return Math.round(element.getBoundingClientRect().height / lineHeight);
  };

  const resetWidths = () => {
    paragraphs.forEach((paragraph) => {
      paragraph.style.maxWidth = "";
    });
  };

  const syncLineCount = () => {
    resetWidths();

    if (!desktopMedia || !desktopMedia.matches) return;

    // Start from full available width, then tighten shorter paragraphs.
    paragraphs.forEach((paragraph) => {
      paragraph.style.maxWidth = `${Math.floor(
        paragraph.getBoundingClientRect().width,
      )}px`;
    });

    let lineCounts = paragraphs.map(getLineCount);
    const targetLines = Math.max(...lineCounts);
    if (targetLines <= 0) return;

    let guard = 0;
    while (guard < 120) {
      let changed = false;
      lineCounts = paragraphs.map(getLineCount);
      let allMatched = true;

      paragraphs.forEach((paragraph, idx) => {
        if (lineCounts[idx] >= targetLines) return;
        allMatched = false;
        const currentWidth =
          parseFloat(paragraph.style.maxWidth) ||
          paragraph.getBoundingClientRect().width;
        const nextWidth = Math.max(220, currentWidth - 4);
        if (nextWidth < currentWidth) {
          paragraph.style.maxWidth = `${nextWidth}px`;
          changed = true;
        }
      });

      if (allMatched || !changed) break;
      guard += 1;
    }
  };

  window.addEventListener("resize", syncLineCount);
  window.addEventListener("load", syncLineCount, { once: true });
  requestAnimationFrame(syncLineCount);
}

function initLifecycleToggles() {
  const toggles = Array.from(
    document.querySelectorAll(".tb-lifecycle-item[data-phase-index]"),
  );
  const grid = document.querySelector(".tb-lifecycle-grid");
  const heroStageImage = document.getElementById("tbHeroStageImage");
  if (!toggles.length) return;
  const LIFECYCLE_AUTO_ADVANCE_MS = 3000;
  let activeIndex = 0;
  let autoAdvanceTimer = null;

  function setActive(nextIndex) {
    activeIndex =
      ((nextIndex % toggles.length) + toggles.length) % toggles.length;

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

  function startAutoAdvance() {
    if (toggles.length < 2) return;
    if (autoAdvanceTimer) window.clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = window.setInterval(() => {
      setActive(activeIndex + 1);
    }, LIFECYCLE_AUTO_ADVANCE_MS);
  }

  toggles.forEach((toggle, idx) => {
    toggle.addEventListener("click", () => {
      setActive(idx);
      startAutoAdvance();
    });
  });

  setActive(0);
  startAutoAdvance();
}

function renderOfferingTabs() {
  const tabs = document.getElementById("offeringTabs");
  if (!tabs) return;

  tabs.innerHTML = offerings
    .map(
      (offering, idx) => `
        <button
          type="button"
          class="tb-offering-tab${idx === offeringIndex ? " is-active" : ""}"
          data-offering-index="${idx}"
          aria-pressed="${idx === offeringIndex}"
        >
          ${offering.tab}
        </button>
      `,
    )
    .join("");

  tabs.querySelectorAll("[data-offering-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.getAttribute("data-offering-index"));
      if (nextIndex === offeringIndex) return;
      offeringIndex = nextIndex;
      renderOfferings(true);
    });
  });
}

function updateOfferingImage(current, animate = false) {
  const offeringImage = document.getElementById("offeringImage");
  const imageShell = document.getElementById("offeringImageShell");
  if (!offeringImage || !current.image) return;

  const loadToken = ++offeringImageLoadToken;
  let ghostImage =
    imageShell && imageShell.querySelector(".tb-offering-image-ghost");

  if (imageShell && !ghostImage) {
    ghostImage = document.createElement("img");
    ghostImage.className = "tb-offering-image-ghost";
    ghostImage.alt = "";
    ghostImage.setAttribute("aria-hidden", "true");
    ghostImage.decoding = "async";
    imageShell.appendChild(ghostImage);
  }

  if (!animate) {
    offeringImage.src = current.image.src;
    offeringImage.alt = current.image.alt;
    if (imageShell) imageShell.classList.remove("is-switching");
    if (ghostImage) {
      ghostImage.src = "";
      ghostImage.alt = "";
    }
    offeringImage.onload = null;
    offeringImage.onerror = null;
    return;
  }

  if (!imageShell || !ghostImage) {
    offeringImage.src = current.image.src;
    offeringImage.alt = current.image.alt;
    return;
  }

  const nextSrc = current.image.src;
  const nextAlt = current.image.alt;
  if (offeringImage.getAttribute("src") === nextSrc) {
    offeringImage.alt = nextAlt;
    imageShell.classList.remove("is-switching");
    ghostImage.src = "";
    ghostImage.alt = "";
    offeringImage.onload = null;
    offeringImage.onerror = null;
    return;
  }

  const loader = new Image();

  const clearSwitchState = () => {
    if (loadToken !== offeringImageLoadToken) return;
    imageShell.classList.remove("is-switching");
    window.setTimeout(() => {
      if (loadToken !== offeringImageLoadToken) return;
      ghostImage.src = "";
      ghostImage.alt = "";
    }, OFFERING_IMAGE_FADE_MS + 40);
  };

  const commitBaseImage = () => {
    if (loadToken !== offeringImageLoadToken) return;

    const revealBase = () => {
      if (loadToken !== offeringImageLoadToken) return;
      offeringImage.onload = null;
      offeringImage.onerror = null;
      clearSwitchState();
    };

    offeringImage.onload = revealBase;
    offeringImage.onerror = revealBase;
    offeringImage.src = nextSrc;
    offeringImage.alt = nextAlt;

    if (offeringImage.complete) {
      if (typeof offeringImage.decode === "function") {
        offeringImage
          .decode()
          .catch(() => null)
          .finally(revealBase);
      } else {
        revealBase();
      }
    }
  };

  const startCrossfade = () => {
    if (loadToken !== offeringImageLoadToken) return;
    ghostImage.src = nextSrc;
    ghostImage.alt = nextAlt;

    const onFadeDone = (event) => {
      if (event && event.propertyName !== "opacity") return;
      commitBaseImage();
    };

    ghostImage.addEventListener("transitionend", onFadeDone, { once: true });
    imageShell.classList.remove("is-switching");
    void ghostImage.offsetWidth;
    requestAnimationFrame(() => {
      if (loadToken !== offeringImageLoadToken) return;
      imageShell.classList.add("is-switching");
      window.setTimeout(() => {
        if (loadToken !== offeringImageLoadToken) return;
        if (!imageShell.classList.contains("is-switching")) return;
        commitBaseImage();
      }, OFFERING_IMAGE_FADE_MS + 120);
    });
  };

  loader.onload = () => {
    if (typeof loader.decode === "function") {
      loader
        .decode()
        .catch(() => null)
        .finally(startCrossfade);
      return;
    }
    startCrossfade();
  };

  loader.onerror = () => {
    if (loadToken !== offeringImageLoadToken) return;
    offeringImage.src = nextSrc;
    offeringImage.alt = nextAlt;
    imageShell.classList.remove("is-switching");
    ghostImage.src = "";
    ghostImage.alt = "";
  };

  loader.src = nextSrc;
}

function renderOfferings(animate = false) {
  const current = offerings[offeringIndex];
  const title = document.getElementById("offeringTitle");
  const description = document.getElementById("offeringDescription");
  const capabilityGrid = document.getElementById("offeringCapabilities");
  const contentPane = document.getElementById("offeringContentPane");

  const applyOfferingContent = () => {
    if (title) title.textContent = current.title;
    if (description) description.textContent = current.description;

    if (capabilityGrid) {
      capabilityGrid.innerHTML = current.capabilities
        .map(
          (item, idx) => `
            <article class="tb-capability-card${idx === 0 ? " is-highlight" : ""}">
              <span class="tb-capability-icon" aria-hidden="true">${getCapabilityIcon(item.icon, idx)}</span>
              <p>${item.text}</p>
            </article>
          `,
        )
        .join("");
    }

    updateOfferingImage(current, animate);
    renderOfferingTabs();
  };

  if (!animate || !contentPane) {
    if (offeringTransitionTimer) {
      clearTimeout(offeringTransitionTimer);
      offeringTransitionTimer = null;
    }
    if (contentPane) contentPane.classList.remove("is-switching");
    applyOfferingContent();
    return;
  }

  const renderToken = ++offeringRenderToken;
  if (offeringTransitionTimer) {
    clearTimeout(offeringTransitionTimer);
    offeringTransitionTimer = null;
  }

  contentPane.classList.add("is-switching");

  offeringTransitionTimer = window.setTimeout(() => {
    if (renderToken !== offeringRenderToken) {
      offeringTransitionTimer = null;
      return;
    }
    applyOfferingContent();
    requestAnimationFrame(() => {
      if (renderToken !== offeringRenderToken) return;
      contentPane.classList.remove("is-switching");
    });
    offeringTransitionTimer = null;
  }, OFFERING_TRANSITION_OUT_MS);
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initActiveNavLink();
  initImpactSlider();
  initWhySlider();
  initIntegratedSlider();
  initIntegratedCardLineBalance();
  initImpactCounters();
  initProblemSectionOrder();
  initLifecycleToggles();
  initTrustTabs();
  renderOfferings();
});
