// Brian Ward Appraisal - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile nav toggle
    var toggle = document.querySelector('.mobile-nav-toggle');
    var navInner = document.querySelector('.top-nav-inner');
    if (toggle && navInner) {
        toggle.addEventListener('click', function() {
            navInner.classList.toggle('open');
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
        });
    }

    // FAQ accordion
    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            var item = this.closest('.faq-item');
            var wasOpen = item.classList.contains('open');
            // Close all others
            document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
                openItem.classList.remove('open');
            });
            // Toggle the clicked one
            if (!wasOpen) {
                item.classList.add('open');
            }
        });
    });
});
