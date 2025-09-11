// Playmaker Group - Main JavaScript File (Refactored)
// =====================================

(function () {
  "use strict";

  // ====== Utility functions ======
  const utils = {
    debounce(func, wait = 20, immediate = false) {
      let timeout;
      return function (...args) {
        const context = this;
        const later = () => {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    throttle(func, limit = 100) {
      let lastFunc, lastRan;
      return function (...args) {
        const context = this;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(() => {
            if (Date.now() - lastRan >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    },
  };

  // Loader JavaScript
  const preloader = {
    progressInterval: null,
    progress: 0,

    init: function () {
      console.log("Initializing loader...");

      const loader = document.getElementById("loader");
      const loaderProgress = document.querySelector(".loader-progress");

      if (!loader) {
        console.error("Loader element with id 'loader' not found!");
        return;
      }

      if (!loaderProgress) {
        console.error("Loader progress element not found!");
        return;
      }

      console.log("Loader elements found, starting animation...");

      // Prevent body scroll during loading
      document.body.style.overflow = "hidden";

      // Reset progress bar
      loaderProgress.style.width = "0%";
      this.progress = 0;

      // Progress animation with more frequent updates
      this.progressInterval = setInterval(() => {
        // Gradual slow increments
        if (this.progress < 20) {
          this.progress += Math.random() * 3 + 1; // 1-4
        } else if (this.progress < 40) {
          this.progress += Math.random() * 2 + 0.5; // 0.5-2.5
        } else if (this.progress < 70) {
          this.progress += Math.random() * 1.5 + 0.3; // 0.3-1.8
        } else if (this.progress < 85) {
          this.progress += Math.random() * 1 + 0.2; // 0.2-1.2
        } else {
          this.progress += Math.random() * 0.5 + 0.1; // 0.1-0.6
        }

        // Don't let it reach 100% until page is loaded
        if (this.progress > 95) this.progress = 95;

        loaderProgress.style.width = Math.floor(this.progress) + "%";
        console.log("Progress:", Math.floor(this.progress) + "%");
      }, 150); // Faster updates

      // Hide loader when page is fully loaded
      if (document.readyState === "complete") {
        console.log("Page already loaded, hiding loader...");
        setTimeout(() => this.hideLoader(loader, loaderProgress), 1000);
      } else {
        window.addEventListener("load", () => {
          console.log("Page load event fired, hiding loader...");
          this.hideLoader(loader, loaderProgress);
        });
      }

      // Fallback - hide loader after 6 seconds
      setTimeout(() => {
        if (loader && loader.style.display !== "none") {
          console.log("Fallback timeout reached, hiding loader...");
          this.hideLoader(loader, loaderProgress);
        }
      }, 6000);
    },

    hideLoader: function (loader, loaderProgress) {
      console.log("Hiding loader...");

      // Clear the progress interval
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      const loaderPercentage = document.querySelector(".loader-percentage");
      const loaderContent = document.querySelector(".loader-content");

      // Complete the progress bar smoothly to 100%
      let finalProgress = this.progress;
      const completeInterval = setInterval(() => {
        finalProgress += 4;
        if (finalProgress >= 100) {
          finalProgress = 100;
          loaderProgress.style.width = finalProgress + "%";
          if (loaderPercentage)
            loaderPercentage.textContent = finalProgress + "%";
          clearInterval(completeInterval);

          console.log("Progress at 100%, starting manual fade sequence...");

          // Wait at 100% then start manual fade with requestAnimationFrame
          setTimeout(() => {
            console.log("Starting smooth fade manually...");

            // Manual fade using requestAnimationFrame for guaranteed smoothness
            let opacity = 1;
            const startTime = performance.now();
            const duration = 800; // 800ms fade

            function fadeStep(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Ease-out function for smooth animation
              const easeOut = 1 - Math.pow(1 - progress, 3);

              // Calculate opacity value
              opacity = 1 - easeOut;

              // Apply fade to both content and background simultaneously
              if (loaderContent) {
                loaderContent.style.opacity = opacity;
              }
              loader.style.opacity = opacity;

              if (progress < 1) {
                requestAnimationFrame(fadeStep);
              } else {
                // Animation complete
                console.log("Manual fade complete, removing loader...");
                loader.style.display = "none";
                document.body.style.overflow = "";
                document.body.classList.add("loaded");
                window.dispatchEvent(new Event("loaderHidden"));
                console.log("Loader hidden successfully");
              }
            }

            requestAnimationFrame(fadeStep);
          }, 500); // Wait at 100%
          return;
        }
        loaderProgress.style.width = finalProgress + "%";
        if (loaderPercentage)
          loaderPercentage.textContent = Math.floor(finalProgress) + "%";
      }, 40);
    },
  };
  // ====== Mobile Menu ======
  const mobileMenu = {
    isMenuOpen: false,
    toggler: null,
    collapse: null,

    init() {
      this.toggler = document.querySelector(".navbar-toggler");
      this.collapse = document.querySelector(".navbar-collapse");
      if (!this.toggler || !this.collapse) return;

      if (this.toggler.tagName.toLowerCase() === "a")
        this.toggler.setAttribute("href", "javascript:void(0)");

      this.toggler.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
      });

      const navLinks = this.collapse.querySelectorAll('.nav-link[href^="#"]');
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          const href = link.getAttribute("href");
          if (href && href !== "#" && this.isMenuOpen) {
            setTimeout(() => this.closeMenu(), 100);
          }
        });
      });

      document.addEventListener("click", (e) => {
        if (
          this.isMenuOpen &&
          !this.collapse.contains(e.target) &&
          !this.toggler.contains(e.target)
        )
          this.closeMenu();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isMenuOpen) this.closeMenu();
      });

      window.addEventListener(
        "resize",
        utils.debounce(() => {
          if (window.innerWidth > 991 && this.isMenuOpen) this.closeMenu();
        }, 250)
      );
    },

    openMenu() {
      this.isMenuOpen = true;
      this.toggler.setAttribute("aria-expanded", "true");
      this.toggler.classList.add("active");
      this.collapse.classList.add("navbar-open");
    },

    closeMenu() {
      this.isMenuOpen = false;
      this.toggler.setAttribute("aria-expanded", "false");
      this.toggler.classList.remove("active");
      this.collapse.classList.remove("navbar-open");
      document.body.classList.remove("menu-open");
    },
  };

  // ====== Smooth Scroll ======
  const smoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const href = anchor.getAttribute("href");
          if (!href || href === "#") return;
          e.preventDefault();

          const target = document.querySelector(href);
          if (target) {
            const navbar = document.querySelector(".navbar");
            const offset = navbar ? navbar.offsetHeight + 20 : 80;
            this.scrollToPosition(target.offsetTop - offset);
          }
        });
      });
    },

    scrollToPosition(position) {
      const start = window.pageYOffset;
      const distance = position - start;
      const duration = Math.abs(distance) > 1000 ? 1200 : 800;
      let startTime = null;

      const animate = (time) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const run = this.easeInOutQuad(elapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (elapsed < duration) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },

    easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
  };

  // ====== Navbar Scroll Effects ======
  const navbar = {
    init() {
      const nav = document.querySelector(".navbar");
      if (!nav) return;
      window.addEventListener(
        "scroll",
        utils.debounce(() => {
          nav.classList.toggle("scrolled", window.scrollY > 50);
        }, 10)
      );
    },
  };

  // ====== Active Nav Highlight ======
  const activeNav = {
    init() {
      const navLinks = document.querySelectorAll(
        '.navbar-nav .nav-link[href^="#"]'
      );
      const sections = document.querySelectorAll("section[id]");
      if (!navLinks.length || !sections.length) return;

      const update = utils.debounce(() => {
        const scrollY = window.scrollY + 100;
        let current = "";
        sections.forEach((s) => {
          if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight)
            current = s.id;
        });
        navLinks.forEach((link) =>
          link.classList.toggle(
            "current-section",
            link.getAttribute("href") === "#" + current
          )
        );
      }, 50);

      window.addEventListener("scroll", update);
      update();
    },
  };

  // ====== Portfolio Filtering ======
  const portfolio = {
    init() {
      const tabBtns = document.querySelectorAll(".tab-btn");
      const items = document.querySelectorAll(".portfolio-item");
      if (!tabBtns.length) return;

      tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          tabBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const filter = btn.dataset.tab;
          items.forEach((item, i) => {
            if (filter === "all" || item.dataset.category === filter) {
              item.style.display = "block";
              setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
              }, i * 50);
            } else {
              item.style.opacity = "0";
              item.style.transform = "translateY(30px)";
              setTimeout(() => {
                item.style.display = "none";
              }, 300);
            }
          });
        });
      });
    },
  };

  // ====== Scroll-triggered Animations (Intersection Observer) ======
  const scrollAnimations = {
    init() {
      const elements = document.querySelectorAll(
        ".fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down, .scale-in, .rotate-in, .progress-bar, .card-hover"
      );
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("animate");
          });
        },
        { threshold: 0.15 }
      );

      elements.forEach((el) => observer.observe(el));
    },
  };

  // ====== Back to Top ======
  const backToTop = {
    init() {
      const btn = document.getElementById("backToTop");
      if (!btn) return;

      const toggleBtn = utils.debounce(() => {
        btn.classList.toggle("show", window.scrollY > 300);
      }, 100);

      window.addEventListener("scroll", toggleBtn);

      btn.addEventListener("click", () => {
        btn.classList.add("clicked");
        smoothScroll.scrollToPosition(0);
        setTimeout(() => btn.classList.remove("clicked"), 300);
      });
    },
  };

  // ====== Contact Form ======
  const contactForm = {
    init() {
      const form = document.querySelector(".contact-form form");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const inputs = form.querySelectorAll(
          "input[required], select[required], textarea[required]"
        );
        let isValid = true;
        inputs.forEach((input) => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add("invalid");
            setTimeout(() => input.classList.remove("invalid"), 3000);
          }
        });

        if (isValid) {
          submitBtn.textContent = "Sending...";
          submitBtn.disabled = true;
          setTimeout(() => {
            submitBtn.textContent = "Message Sent!";
            submitBtn.style.background = "#10b981";
            form.reset();
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              submitBtn.style.background = "";
            }, 2000);
          }, 1500);
        }
      });
    },
  };

  // ====== Initialize everything ======
  function initialize() {
    preloader.init();
    setTimeout(() => {
      mobileMenu.init();
      smoothScroll.init();
      navbar.init();
      activeNav.init();
      portfolio.init();
      scrollAnimations.init();
      backToTop.init();
      contactForm.init();
      document.body.classList.add("loaded");
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
