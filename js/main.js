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
});
