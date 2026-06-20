document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Light/Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check local storage or system preference
  const currentTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      
      let theme = 'light';
      if (document.documentElement.classList.contains('dark')) {
        theme = 'dark';
      }
      localStorage.setItem('theme', theme);
    });
  }

  // ==========================================
  // 2. Sticky Glassmorphic Header on Scroll
  // ==========================================
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on init

  // ==========================================
  // 3. Mobile Hamburger Menu Toggle
  // ==========================================
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 4. Auto-Set Active Navigation Link
  // ==========================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== 'index.html') {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && href === 'index.html') {
      link.classList.add('active');
    } else if (currentPath.includes('index.html') && href === 'index.html') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // 5. 80G Tax Exemption Calculator (Donate Page)
  // ==========================================
  const donationRange = document.getElementById('donation-range');
  const donationInput = document.getElementById('donation-input');
  
  const calcTaxSaving = document.getElementById('calc-tax-saving');
  const calcNetCost = document.getElementById('calc-net-cost');
  const calcImpact = document.getElementById('calc-impact');
  
  const tierCards = document.querySelectorAll('.tier-card');

  const updateCalculatorValues = (amount) => {
    amount = parseFloat(amount) || 0;
    
    // 50% Tax deduction under section 80G
    const taxSaving = amount * 0.50;
    const netCost = amount - taxSaving;
    
    // Impact calculation text
    let impactText = "Supports community upliftment projects.";
    if (amount >= 10000) {
      const children = Math.floor(amount / 5000);
      impactText = `Sponsors basic healthcare and educational kits for ${children} children for a whole year.`;
    } else if (amount >= 5000) {
      const families = Math.floor(amount / 2500);
      impactText = `Provides comprehensive monthly ration and hygiene kits for ${families} underprivileged families.`;
    } else if (amount >= 2000) {
      const students = Math.floor(amount / 1000);
      impactText = `Sponsors primary educational learning materials for ${students} young learners.`;
    } else if (amount >= 1000) {
      const kits = Math.floor(amount / 500);
      impactText = `Distributes sanitary hygiene kits to ${kits} girls in rural communities.`;
    } else if (amount > 0) {
      const meals = Math.floor(amount / 100);
      impactText = `Feeds ${meals} fresh and nutritious hot meals to needy individuals.`;
    } else {
      impactText = "Please enter an amount to see the impact of your support.";
    }

    // Format currency display
    if (calcTaxSaving) calcTaxSaving.textContent = `₹${taxSaving.toLocaleString('en-IN')}`;
    if (calcNetCost) calcNetCost.textContent = `₹${netCost.toLocaleString('en-IN')}`;
    if (calcImpact) calcImpact.textContent = impactText;
  };

  // Synchronize Range Slider with Input field
  if (donationRange && donationInput) {
    donationRange.addEventListener('input', (e) => {
      const value = e.target.value;
      donationInput.value = value;
      updateCalculatorValues(value);
      
      // Unselect tier cards since slider is used
      tierCards.forEach(c => c.classList.remove('selected'));
    });

    donationInput.addEventListener('input', (e) => {
      const value = e.target.value;
      donationRange.value = Math.min(value, 50000); // Caps slider visually at 50,000
      updateCalculatorValues(value);
      
      // Unselect tier cards
      tierCards.forEach(c => c.classList.remove('selected'));
    });
  }

  // Handle tier card clicks
  if (tierCards.length > 0) {
    tierCards.forEach(card => {
      card.addEventListener('click', () => {
        tierCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const amount = card.getAttribute('data-amount');
        if (donationInput && donationRange) {
          donationInput.value = amount;
          donationRange.value = Math.min(amount, 50000);
          updateCalculatorValues(amount);
        }
      });
    });
  }

  // Initialize calculator on load
  if (donationInput) {
    updateCalculatorValues(donationInput.value);
  }

  // ==========================================
  // 6. Form Submission Simulation & Toast Feedback
  // ==========================================
  const showToast = (message) => {
    // Create toast element dynamically if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.innerHTML = `
        <div class="toast-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="toast-text" id="toast-text"></div>
      `;
      document.body.appendChild(toast);
    }
    
    const toastText = document.getElementById('toast-text');
    toastText.textContent = message;
    
    // Animation trigger
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };

  // Volunteer Registration Form Handler
  const volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Gather data
      const name = document.getElementById('v-name').value;
      
      // Simulate API submit
      showToast(`Thank you, ${name}! Your volunteer application was submitted successfully.`);
      volunteerForm.reset();
    });
  }

  // Newsletter Form Handler
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        showToast(`Subscribed successfully! Thank you for staying updated.`);
        emailInput.value = '';
      }
    });
  });

  // Contact Form Handler (on volunteer page if any, or in main forms)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('c-name').value;
      showToast(`Thank you, ${name}! We've received your query and will get back shortly.`);
      contactForm.reset();
    });
  }

  // Donation Payment Mode Simulator
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('don-name').value || 'Generous Donor';
      const amount = donationInput ? donationInput.value : 'donation';
      showToast(`Initiating donation process of ₹${parseFloat(amount).toLocaleString('en-IN')} for ${name}. Thank you!`);
      paymentForm.reset();
    });
  }

  // ==========================================
  // 7. Dynamic Project Tabs (Projects Page)
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and panels
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active to current button
        btn.classList.add('active');
        
        // Add active to corresponding tab panel
        const targetTab = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
});
