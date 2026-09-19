(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var themeToggle = document.querySelector(".theme-toggle");
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");
  var backToTop = document.querySelector(".back-to-top");
  var year = document.getElementById("year");
  var roleText = document.getElementById("role-text");
  var copyEmail = document.querySelector(".copy-email");

  var savedTheme = localStorage.getItem("portfolio-theme");
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  var initialTheme = savedTheme || (prefersLight ? "light" : "dark");
  root.setAttribute("data-theme", initialTheme);

  if (year) year.textContent = String(new Date().getFullYear());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);
    });
  }

  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -45px 0px" });

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = String(Math.min(index % 4, 3) * 70) + "ms";
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-38% 0px -52% 0px", threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  function updateScrollUI() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (backToTop) backToTop.classList.toggle("visible", y > 650);
  }

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var roles = [
    "Support mindset. Builder energy.",
    "From troubleshooting to shipping.",
    "Web, desktop, QA, automation.",
    "Useful first. Fancy second."
  ];
  var roleIndex = 0;

  if (roleText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.animate([
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-5px)" }
      ], { duration: 180, fill: "forwards" }).finished.then(function () {
        roleText.textContent = roles[roleIndex];
        roleText.animate([
          { opacity: 0, transform: "translateY(5px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 220, fill: "forwards" });
      });
    }, 3000);
  }

  if (copyEmail) {
    copyEmail.addEventListener("click", function () {
      var email = copyEmail.getAttribute("data-email") || "";
      var originalText = copyEmail.textContent;
      if (!navigator.clipboard) {
        window.location.href = "mailto:" + email;
        return;
      }
      navigator.clipboard.writeText(email).then(function () {
        copyEmail.textContent = "Copied ✓";
        window.setTimeout(function () { copyEmail.textContent = originalText; }, 1600);
      }).catch(function () {
        window.location.href = "mailto:" + email;
      });
    });
  }

  var scrollProgress = document.querySelector(".scroll-progress span");
  var cursorSpotlight = document.querySelector(".cursor-spotlight");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  function updateProgress() {
    if (!scrollProgress) return;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? Math.min((window.scrollY || window.pageYOffset) / maxScroll, 1) : 0;
    scrollProgress.style.transform = "scaleX(" + progress + ")";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  if (cursorSpotlight && finePointer && !reduceMotion) {
    window.addEventListener("pointermove", function (event) {
      cursorSpotlight.style.left = event.clientX + "px";
      cursorSpotlight.style.top = event.clientY + "px";
      cursorSpotlight.style.opacity = "1";
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", function () {
      cursorSpotlight.style.opacity = "0";
    });
  }

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".project-card, .tool-card, .mini-card, .process-card, .profile-card").forEach(function (card) {
      card.classList.add("pointer-glow");
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      }, { passive: true });
    });
  }

})();
