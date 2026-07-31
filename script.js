(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav-links");
  var navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  var sections = Array.from(document.querySelectorAll("main section[id]"));
  var progress = document.getElementById("progress");
  var backToTop = document.getElementById("back-to-top");
  var colorModeButtons = Array.from(document.querySelectorAll("[data-color-choice]"));
  var colorModeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function resolveColorMode(preference) {
    return preference === "auto"
      ? (colorModeMedia.matches ? "dark" : "light")
      : preference;
  }

  function updateThemeColor() {
    if (!themeColorMeta) return;
    var backgroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg")
      .trim();
    if (backgroundColor) themeColorMeta.setAttribute("content", backgroundColor);
  }

  function applyColorPreference(preference, persist) {
    if (!["light", "dark", "auto"].includes(preference)) preference = "auto";
    document.documentElement.dataset.colorPreference = preference;
    document.documentElement.dataset.colorMode = resolveColorMode(preference);
    colorModeButtons.forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.colorChoice === preference)
      );
    });
    updateThemeColor();

    if (persist) {
      try {
        localStorage.setItem("homepage-color-mode", preference);
      } catch (error) {
        // The selected mode still applies for this page view.
      }
    }
  }

  var initialColorPreference =
    document.documentElement.dataset.colorPreference || "auto";
  applyColorPreference(initialColorPreference, false);

  colorModeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyColorPreference(button.dataset.colorChoice, true);
    });
  });

  function handleSystemColorChange() {
    if (document.documentElement.dataset.colorPreference === "auto") {
      applyColorPreference("auto", false);
    }
  }

  if (typeof colorModeMedia.addEventListener === "function") {
    colorModeMedia.addEventListener("change", handleSystemColorChange);
  } else if (typeof colorModeMedia.addListener === "function") {
    colorModeMedia.addListener(handleSystemColorChange);
  }

  function closeMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("in-view");
    });
  }

  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var activeId = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === activeId);
          });
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var ticking = false;
  function updateScrollUI() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    if (progress) {
      progress.style.width = Math.max(0, Math.min(100, percent)) + "%";
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 420);
    }

    ticking = false;
  }

  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
