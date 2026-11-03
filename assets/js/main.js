/**
 * HERBAL SOAP MAKING STUDIO — GLOBAL JS
 * Handles:
 * - Branded Page Loader
 * - Dark Mode (#000000) with localStorage persistence
 * - RTL / LTR with localStorage persistence
 * - Desktop Dropdown (Click-only)
 * - Mobile Menu Drawer & Home Accordion
 * - Login & Registration Modal
 * - Scroll-to-Top Button
 * - Active Nav Detection
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initDirection();
  initDesktopDropdown();
  initMobileMenu();
  initLoginModal();
  initScrollToTop();
  initActiveNav();
  initForms();
  initCatalogPagination();
});

/* --------------------------------------------------------------------------
   1. BRANDED PAGE LOADER
   -------------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('loader-hidden');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 500);
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 250);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideLoader, 250);
    });
    // Fallback in case load takes long
    setTimeout(hideLoader, 2500);
  }
}

/* --------------------------------------------------------------------------
   2. DARK MODE (#000000)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('herbal_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon(isDark);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentlyDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('herbal_theme', currentlyDark ? 'dark' : 'light');
      updateThemeIcon(currentlyDark);
    });
  });
}

function updateThemeIcon(isDark) {
  const icons = document.querySelectorAll('.theme-icon-state');
  icons.forEach(icon => {
    if (isDark) {
      // Show sun icon
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
    } else {
      // Show moon icon
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
    }
  });
}

/* --------------------------------------------------------------------------
   3. RTL / LTR DIRECTION
   -------------------------------------------------------------------------- */
function initDirection() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('herbal_direction') || 'ltr';

  document.documentElement.setAttribute('dir', storedDir);
  updateDirLabel(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('herbal_direction', newDir);
      updateDirLabel(newDir);
    });
  });
}

function updateDirLabel(dir) {
  const labels = document.querySelectorAll('.rtl-status-label');
  labels.forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* --------------------------------------------------------------------------
   4. DESKTOP DROPDOWN (CLICK ONLY — NO HOVER)
   -------------------------------------------------------------------------- */
function initDesktopDropdown() {
  const trigger = document.getElementById('home-dropdown-trigger');
  const menu = document.getElementById('home-dropdown-menu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('dropdown-open');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  function openDropdown() {
    menu.classList.add('dropdown-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    menu.classList.remove('dropdown-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  // Click outside closes
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !menu.contains(e.target)) {
      closeDropdown();
    }
  });

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });
}

/* --------------------------------------------------------------------------
   5. MOBILE DRAWER & ACCORDION
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const accordionBtn = document.getElementById('mobile-home-accordion-btn');
  const accordionContent = document.getElementById('mobile-home-accordion-content');
  const navLinks = document.querySelectorAll('.mobile-close-target');

  if (!drawer || !overlay) return;

  function setAccordionOpen(open) {
    if (open) {
      accordionContent?.classList.add('expanded');
      accordionBtn?.setAttribute('aria-expanded', 'true');
      const chevron = accordionBtn?.querySelector('.accordion-chevron');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
      accordionContent?.classList.remove('expanded');
      accordionBtn?.setAttribute('aria-expanded', 'false');
      const chevron = accordionBtn?.querySelector('.accordion-chevron');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  }

  function openDrawer() {
    drawer.classList.add('drawer-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    openBtn?.setAttribute('aria-expanded', 'true');
    // Ensure Home dropdown starts closed by default
    setAccordionOpen(false);
  }

  function closeDrawer() {
    drawer.classList.remove('drawer-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    openBtn?.setAttribute('aria-expanded', 'false');
    // Reset accordion to closed
    setAccordionOpen(false);
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Home Accordion (Click only — toggle open/close)
  accordionBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isCurrentlyExpanded = accordionContent?.classList.contains('expanded');
    setAccordionOpen(!isCurrentlyExpanded);
  });

  // Clicking ANY nav link closes the drawer immediately
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Auto-close mobile drawer & restore page scroll when resized to desktop (>= 1080px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1080) {
      if (drawer.classList.contains('drawer-open') || overlay.classList.contains('active')) {
        closeDrawer();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   6. LOGIN & REGISTRATION MODAL
   -------------------------------------------------------------------------- */
function initLoginModal() {
  const modal = document.getElementById('login-modal');
  const openBtns = document.querySelectorAll('.btn-open-login');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal) return;

  function openModal() {
    modal.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('modal-active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
      closeModal();
    }
  });

  // Modal Tab Switching
  const tabBtns = modal.querySelectorAll('.modal-tab-btn');
  const signinForm = document.getElementById('form-signin');
  const signupForm = document.getElementById('form-signup');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      if (target === 'signin') {
        signinForm?.classList.remove('hidden');
        signupForm?.classList.add('hidden');
      } else {
        signinForm?.classList.add('hidden');
        signupForm?.classList.remove('hidden');
      }
    });
  });

  // Polite non-blocking submission for modal forms
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = signinForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const orig = submitBtn.textContent;
        submitBtn.textContent = 'Signed In ✓';
        setTimeout(() => {
          submitBtn.textContent = orig;
          closeModal();
        }, 1200);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const orig = submitBtn.textContent;
        submitBtn.textContent = 'Account Created ✓';
        setTimeout(() => {
          submitBtn.textContent = orig;
          closeModal();
        }, 1200);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. SCROLL TO TOP
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. ACTIVE NAV DETECTION
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Highlight Home on Desktop & Mobile when on index.html (Home 1) or home-2.html (Home 2)
  const isHomePage = (currentPath === 'index.html' || currentPath === 'home-2.html' || currentPath === '');
  const desktopHomeTrigger = document.getElementById('home-dropdown-trigger');
  const mobileHomeBtn = document.getElementById('mobile-home-accordion-btn');

  if (isHomePage) {
    desktopHomeTrigger?.classList.add('active');
    mobileHomeBtn?.classList.add('active');
  } else {
    desktopHomeTrigger?.classList.remove('active');
    mobileHomeBtn?.classList.remove('active');
  }
}

/* --------------------------------------------------------------------------
   9. INTERACTIVE FORMS & ATELIER CONFIRMATION
   -------------------------------------------------------------------------- */
function initForms() {
  const contactForm = document.getElementById('atelier-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Inquiry...</span>`;

      setTimeout(() => {
        contactForm.innerHTML = `
          <div class="p-8 text-center bg-[#FAF7F2] dark:bg-[#121212] rounded-xl border border-[#2D5A27] dark:border-[#568744]">
            <div class="w-12 h-12 mx-auto rounded-full bg-[#EAE2D3] dark:bg-[#182A14] text-[#2D5A27] dark:text-[#8CC47E] flex items-center justify-center mb-4">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 class="font-serif text-2xl font-bold text-[#1C241B] dark:text-[#FFFFFF]">Inquiry Received</h4>
            <p class="text-sm text-[#384636] dark:text-[#D8E2D5] mt-2 max-w-md mx-auto">
              Thank you for reaching out to our apothecary studio. Our head soapmakers have received your details and will formulate your personalized reply within 24 hours.
            </p>
            <div class="mt-6">
              <a href="products.html" class="inline-block px-6 py-2.5 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#22451E] transition-colors">
                Explore Soap Catalog →
              </a>
            </div>
          </div>
        `;
      }, 700);
    });
  }

  // Footer Newsletter Forms
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (input && input.value) {
        input.value = '';
        btn.textContent = 'Subscribed ✓';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.disabled = false;
        }, 3000);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. CATALOG INTERACTIVE PAGINATION (3 Products Per Page)
   -------------------------------------------------------------------------- */
function initCatalogPagination() {
  const paginationContainer = document.getElementById('catalog-pagination');
  if (!paginationContainer) return;

  const pageButtons = paginationContainer.querySelectorAll('.pagination-btn[data-page]');
  const prevBtn = document.getElementById('pagination-prev-btn');
  const nextBtn = document.getElementById('pagination-next-btn');
  const countDisplay = document.getElementById('page-count-display');
  const headerCount = document.getElementById('catalog-header-count');
  const productCards = document.querySelectorAll('[data-product-page]');

  let currentPage = 1;
  const totalPages = pageButtons.length;

  function setPage(pageNum, shouldScroll = true) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;

    // Toggle product cards visibility based on data-product-page
    productCards.forEach(card => {
      const cardPage = parseInt(card.getAttribute('data-product-page'), 10);
      if (cardPage === currentPage) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    // Update active class on pagination buttons
    pageButtons.forEach(btn => {
      const p = parseInt(btn.getAttribute('data-page'), 10);
      if (p === currentPage) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    // Update disabled state for prev and next buttons
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;

    // Update bottom pagination display counter text
    if (countDisplay) {
      if (currentPage === 1) {
        countDisplay.textContent = '1 – 3';
      } else if (currentPage === 2) {
        countDisplay.textContent = '4 – 6';
      } else if (currentPage === 3) {
        countDisplay.textContent = '7 – 9';
      }
    }

    // Update top section counter text
    if (headerCount) {
      const start = (currentPage - 1) * 3 + 1;
      const end = Math.min(currentPage * 3, productCards.length);
      headerCount.innerHTML = 'Showing <strong class="font-bold text-[#1C241B] dark:text-[#FFFFFF]">' + start + ' – ' + end + '</strong> of ' + productCards.length + ' small batches • Naturally cured 42 days';
    }

    // Smooth scroll to top of catalog section (only when triggered by user interaction)
    if (shouldScroll) {
      const catalogSection = document.getElementById('all-bars');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Initialize page 1 display without auto-scrolling on initial page load
  setPage(1, false);

  pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.getAttribute('data-page'), 10);
      setPage(p, true);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => setPage(currentPage - 1, true));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => setPage(currentPage + 1, true));
  }

  // Handle Section 3 formulation buttons to switch to matched catalog page & smooth scroll
  const selectFormulationBtns = document.querySelectorAll('.btn-select-formulation');
  selectFormulationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPage = parseInt(btn.getAttribute('data-target-page'), 10);
      if (targetPage) {
        setPage(targetPage, true);
      }
    });
  });

  // Handle Add To Bag buttons with polite inline feedback
  const addButtons = document.querySelectorAll('.btn-add-bag');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const soapName = btn.getAttribute('data-soap') || 'Soap Bar';
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.classList.add('bg-emerald-700');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-emerald-700');
      }, 1800);
    });
  });

  // Handle Workshop Reservation buttons with polite inline feedback
  const workshopButtons = document.querySelectorAll('.btn-reserve-workshop');
  workshopButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.textContent;
      btn.textContent = 'Reserved ✓';
      btn.classList.add('bg-emerald-700');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-emerald-700');
      }, 2000);
    });
  });
}



