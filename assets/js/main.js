// ===== PORTFOLIO FILTERING =====
document.addEventListener("DOMContentLoaded", function () {
  // Portfolio filtering functionality
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  // Set initial state - show matchday items first
  showFilteredItems("matchday");

  // Set matchday button as active initially
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  document.querySelector('[data-filter="matchday"]').classList.add("active");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Show filtered items
      showFilteredItems(filter);
    });
  });

  // Updated JavaScript for smoother filtering without layout jumps
  function showFilteredItems(filter) {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");

      if (filter === "all" || itemCategory === filter) {
        // Item should be visible
        item.classList.remove("fade-out", "hidden");
        item.style.position = "relative";
        item.style.zIndex = "1";

        // Small delay for smooth transition
        setTimeout(() => {
          item.classList.add("fade-in");
        }, 50);
      } else {
        // Item should be hidden but maintain layout space initially
        item.classList.remove("fade-in");
        item.classList.add("fade-out");

        // After fade out completes, remove from layout
        setTimeout(() => {
          item.style.position = "absolute";
          item.style.zIndex = "-1";
          item.classList.add("hidden");
        }, 400);
      }
    });
  }

  // ===== IMAGE MODAL FUNCTIONALITY =====
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".modal-close");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentImageIndex = 0;
  let currentImages = [];

  // Open modal when gallery item is clicked
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Get currently visible items based on active filter
      const activeFilter = document
        .querySelector(".filter-btn.active")
        .getAttribute("data-filter");
      currentImages = Array.from(galleryItems).filter((item) => {
        const itemCategory = item.getAttribute("data-category");
        return activeFilter === "all" || itemCategory === activeFilter;
      });

      currentImageIndex = currentImages.indexOf(item);
      openModal(item);
    });
  });

  function openModal(item) {
    const imgSrc = item.getAttribute("data-src");
    const imgAlt = item.getAttribute("data-alt");

    modalImage.src = imgSrc;
    modalImage.alt = imgAlt;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    updateNavigationButtons();
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateNavigationButtons() {
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === currentImages.length - 1;
  }

  function showPreviousImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      openModal(currentImages[currentImageIndex]);
    }
  }

  function showNextImage() {
    if (currentImageIndex < currentImages.length - 1) {
      currentImageIndex++;
      openModal(currentImages[currentImageIndex]);
    }
  }

  // Event listeners for modal
  closeBtn.addEventListener("click", closeModal);
  prevBtn.addEventListener("click", showPreviousImage);
  nextBtn.addEventListener("click", showNextImage);

  // Close modal when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("active")) {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        showPreviousImage();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      }
    }
  });
});

// ===== OPTIMIZED SMOOTH SCROLL =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing smooth scroll...");

  // Simplified smooth scroll function for better mobile performance
  function smoothScrollTo(target, duration = 600) {
    // Reduced from 800ms
    const targetPosition = target.offsetTop - 65;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      // Simplified easing function for better performance
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // Simple ease-out

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  // Immediate setup without delay
  const allLinks = document.querySelectorAll("a[href^='#']");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (href && href !== "#") {
      console.log("Adding listener to:", href);

      link.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Clicked:", href);

        if (href === "#home") {
          // Faster scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          console.log("Scrolling to:", target);
          smoothScrollTo(target, 500); // Even faster on mobile
        }

        // Close mobile menu immediately
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false,
          });
          bsCollapse.hide();
        }
      });
    }
  });

  console.log("Smooth scroll setup complete");
});

// ===== MOBILE NAVBAR ANIMATIONS =====
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  // Ensure hamburger starts in correct state
  if (navbarToggler) {
    navbarToggler.setAttribute("aria-expanded", "false");
  }

  // Handle navbar toggle
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", function () {
      // Add stagger animation to nav items when opening
      if (navbarToggler.getAttribute("aria-expanded") === "false") {
        const navItems = document.querySelectorAll(".navbar-nav .nav-item");
        navItems.forEach((item, index) => {
          item.style.animationDelay = `${(index + 1) * 0.1}s`;
        });
      }
    });
  }

  // Close menu when nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 991) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false,
        });
        bsCollapse.hide();
      }
    });
  });

  // Handle window resize - close menu on desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 991 && navbarCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      });
      bsCollapse.hide();
    }
  });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/// ===== OPTIMIZED BACK TO TOP BUTTON =====
const backToTopButton = document.getElementById("backToTop");
let isScrolling = false;

// Optimized scroll handler with throttling
function handleScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
      isScrolling = false;
    });
    isScrolling = true;
  }
}

// Use passive event listener for better performance
window.addEventListener("scroll", handleScroll, { passive: true });

// Optimized smooth scroll with faster animation
if (backToTopButton) {
  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Faster animation - reduced from 1000ms to 600ms
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    let startTime = null;
    const duration = 600; // Reduced duration

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  });
}

// ===== CONTACT FORM =====
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Add your form submission logic here
      alert("Thank you for your message! We'll get back to you soon.");
    });
  }
});

// ===== NEWSLETTER FORM =====
document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Add your newsletter subscription logic here
      alert("Thank you for subscribing to our newsletter!");
    });
  }
});

// ===== LOADER (if enabled) =====
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.style.display = "none";
      }, 300);
    }, 300);
  }
});

// ===== NAVBAR ACTIVE LINK (FIXED) =====
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  let current = "";
  const scrollPosition = window.pageYOffset + 150; // Offset for better detection

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
