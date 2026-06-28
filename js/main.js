/* =================================================================
   MOUNTAIN STAY — MAIN JS
   Pure vanilla JavaScript. No frameworks, no build step, no backend
   calls. Handles only presentational/UX behaviour:
     1. Preloader fade-out
     2. Sticky navbar background swap on scroll
     3. Mobile nav auto-close on link click
     4. Scroll-reveal animations (IntersectionObserver)
     5. Back-to-top button visibility + click
     6. Footer current year
     7. Gallery lightbox + filter (used on gallery.html only)
     8. Contact form front-end validation (no submission backend)
   ================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     1. PRELOADER
     Hides the preloader once the page has fully loaded. Falls back
     to a short timeout so the loader never gets stuck.
  --------------------------------------------------------------- */
  function initPreloader() {
    var preloader = document.getElementById("preloader");
    if (!preloader) return;

    function hidePreloader() {
      preloader.classList.add("is-hidden");
    }

    window.addEventListener("load", hidePreloader);
    // Safety net: never let the preloader block the site for more than 1.5s
    setTimeout(hidePreloader, 1500);
  }

  /* ---------------------------------------------------------------
     2. STICKY NAVBAR — background swap on scroll
  --------------------------------------------------------------- */
  function initNavbarScroll() {
    var navbar = document.getElementById("mainNav");
    if (!navbar) return;

    var SCROLL_THRESHOLD = 60;

    function handleScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }

    // On pages with a dark/no hero (e.g. contact, rooms inner pages)
    // the navbar should default to "scrolled" styling immediately,
    // controlled by a body data attribute set in each page's <body> tag.
    if (document.body.getAttribute("data-navbar") === "solid") {
      navbar.classList.add("is-scrolled");
    } else {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
  }

  /* ---------------------------------------------------------------
     3. MOBILE NAV — auto-close the collapsed menu after a link tap
  --------------------------------------------------------------- */
  function initMobileNavClose() {
    var navMenu = document.getElementById("navMenu");
    if (!navMenu) return;

    var links = navMenu.querySelectorAll(".nav-link, .btn");

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 992 && navMenu.classList.contains("show")) {
          // Use Bootstrap's Collapse API if available, else toggle class directly
          if (window.bootstrap && window.bootstrap.Collapse) {
            var collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navMenu);
            collapseInstance.hide();
          } else {
            navMenu.classList.remove("show");
          }
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     Adds .ms-reveal to common content blocks automatically, then
     reveals them as they enter the viewport.
  --------------------------------------------------------------- */
  function initScrollReveal() {
    var revealSelectors = [
      ".ms-why-card",
      ".ms-room-card",
      ".ms-testimonial-card",
      ".ms-attraction-card",
      ".ms-facility-item",
      ".ms-gallery-item",
      ".ms-about-media",
      ".ms-section-title",
      ".ms-img-tall"
    ];

    var elements = document.querySelectorAll(revealSelectors.join(","));
    if (!elements.length) return;

    elements.forEach(function (el) {
      el.classList.add("ms-reveal");
    });

    if (!("IntersectionObserver" in window)) {
      // No IO support — just show everything immediately
      elements.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     5. BACK TO TOP BUTTON
  --------------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    function toggleVisibility() {
      if (window.scrollY > 400) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------
     6. FOOTER — CURRENT YEAR
  --------------------------------------------------------------- */
  function initFooterYear() {
    var yearSpan = document.getElementById("currentYear");
    if (!yearSpan) return;
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     7. GALLERY — CATEGORY FILTER + LIGHTBOX (gallery.html only)
     Both functions safely no-op on pages that don't include the
     relevant markup, so this file can be shared site-wide.
  --------------------------------------------------------------- */
  function initGalleryFilter() {
    var filterButtons = document.querySelectorAll("[data-gallery-filter]");
    var galleryItems = document.querySelectorAll("[data-gallery-category]");

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var targetCategory = button.getAttribute("data-gallery-filter");

        // Update active button state
        filterButtons.forEach(function (b) {
          b.classList.remove("is-active");
        });
        button.classList.add("is-active");

        // Show/hide gallery items based on category match
        galleryItems.forEach(function (item) {
          var itemCategory = item.getAttribute("data-gallery-category");
          var shouldShow = targetCategory === "all" || itemCategory === targetCategory;

          if (shouldShow) {
            item.style.display = "";
            item.classList.add("is-revealed");
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  function initLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox-trigger]");
    var lightbox = document.getElementById("msLightbox");
    if (!triggers.length || !lightbox) return;

    var labelEl = lightbox.querySelector(".ms-lightbox-label");
    var closeBtn = lightbox.querySelector(".ms-lightbox-close");
    var iconEl = lightbox.querySelector(".ms-lightbox-icon");
    var imgEl = lightbox.querySelector(".ms-lightbox-img");

    function openLightbox(label, imageUrl) {
      if (labelEl) labelEl.textContent = label;
      if (imgEl && imageUrl) {
        imgEl.src = imageUrl;
        imgEl.classList.remove("d-none");
        if (iconEl) iconEl.classList.add("d-none");
      } else {
        if (imgEl) imgEl.classList.add("d-none");
        if (iconEl) iconEl.classList.remove("d-none");
      }
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (imgEl) {
        imgEl.src = "";
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var label = trigger.getAttribute("data-label") || "assets/images/gallery.jpg";
        var imageUrl = trigger.getAttribute("data-image-url");
        openLightbox(label, imageUrl);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });

    if (iconEl) {
      // purely decorative — keeps the icon in the placeholder consistent
      iconEl.classList.add("bi", "bi-image");
    }
  }

  /* ---------------------------------------------------------------
     8. CONTACT FORM — front-end only validation
     This is a static template: there is no backend, database, or
     email service wired up. On submit we simply validate required
     fields with Bootstrap's built-in validation styles and show a
     friendly inline confirmation message. Replace this handler with
     a real form action (e.g. Formspree, an email API, etc.) when
     deploying for an actual hotel.
  --------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var successMessage = document.getElementById("contactFormSuccess");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      // No backend exists in this template — this is purely a UX
      // placeholder so the form "feels" complete for a live demo.
      form.classList.add("was-validated");
      form.reset();
      form.classList.remove("was-validated");

      if (successMessage) {
        successMessage.classList.add("is-visible");
        successMessage.setAttribute("role", "status");
        setTimeout(function () {
          successMessage.classList.remove("is-visible");
        }, 6000);
      }
    });
  }

  /* ---------------------------------------------------------------
     INIT — run everything once the DOM is ready
  --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initNavbarScroll();
    initMobileNavClose();
    initScrollReveal();
    initBackToTop();
    initFooterYear();
    initGalleryFilter();
    initLightbox();
    initContactForm();
  });
})();
