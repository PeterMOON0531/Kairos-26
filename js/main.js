(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const hero = document.querySelector(".hero");

  document.documentElement.classList.add("js");

  if (hero && header && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle("on-light", !entry.isIntersecting);
      },
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "메뉴";
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "닫기" : "메뉴";
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  const tabs = Array.from(document.querySelectorAll(".day-switch [role='tab']"));
  const panels = Array.from(document.querySelectorAll(".day-panel"));

  function activate(id) {
    tabs.forEach((tab) => {
      const selected = tab.getAttribute("aria-controls") === id;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === id);
    });
  }

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reveals = document.querySelectorAll(".reveal");
  if (motion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((item) => revealObserver.observe(item));
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activate(tab.getAttribute("aria-controls"));
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const next =
        event.key === "ArrowRight"
          ? (index + 1) % tabs.length
          : (index - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(tabs[next].getAttribute("aria-controls"));
    });
  });
})();
