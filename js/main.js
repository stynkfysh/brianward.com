// Brian Ward Appraisal - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation Toggle
  // Supports both .nav-toggle and .menu-toggle class names for compatibility
  const navToggle = document.querySelector('.nav-toggle') || document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      // Support both 'open' and 'active' CSS class patterns
      const isOpen = nav.classList.contains('open') || nav.classList.contains('active');
      nav.classList.remove('open', 'active');
      if (!isOpen) {
        nav.classList.add('open');
      }
      // Update ARIA
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when a link is clicked
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('open', 'active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      var isClickInsideNav = nav.contains(event.target);
      var isClickOnToggle = navToggle.contains(event.target);

      if (!isClickInsideNav && !isClickOnToggle &&
          (nav.classList.contains('open') || nav.classList.contains('active'))) {
        nav.classList.remove('open', 'active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' &&
          (nav.classList.contains('open') || nav.classList.contains('active'))) {
        nav.classList.remove('open', 'active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // FAQ Accordion
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function(question) {
    question.addEventListener('click', function() {
      var answer = this.nextElementSibling;
      var toggle = this.querySelector('.faq-toggle');

      // Close other answers
      faqQuestions.forEach(function(otherQuestion) {
        if (otherQuestion !== question) {
          var otherAnswer = otherQuestion.nextElementSibling;
          var otherToggle = otherQuestion.querySelector('.faq-toggle');
          if (otherAnswer) otherAnswer.classList.remove('open');
          if (otherToggle) otherToggle.classList.remove('open');
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current answer
      var isOpen = answer && answer.classList.contains('open');
      if (answer) answer.classList.toggle('open');
      if (toggle) toggle.classList.toggle('open');
      this.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard support for FAQ
    question.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        var target = document.querySelector(href);
        target.scrollIntoView({ behavior: 'smooth' });
        target.focus();
      }
    });
  });

  // Simple form validation
  var forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      var isValid = true;
      var requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#dc3545';
        } else {
          field.style.borderColor = '';
        }
      });

      // Email validation
      var emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(function(field) {
        if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
          field.style.borderColor = '#dc3545';
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });
});
