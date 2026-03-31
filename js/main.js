// Brian Ward Appraisal - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    var toggle = document.querySelector('.mobile-menu-toggle');
    var sidebar = document.querySelector('.sidebar-left');
    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
        });
    }
});
