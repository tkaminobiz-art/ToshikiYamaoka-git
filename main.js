document.addEventListener('DOMContentLoaded', () => {
    // Structure Toggle Logic
    const toggle = document.getElementById('structureToggle');
    const body = document.body;

    toggle.addEventListener('click', () => {
        body.classList.toggle('show-structure');
    });

    // Scroll Animation Logic
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Apply animation classes
    const animatedElements = document.querySelectorAll('.text-block, .point-section, .service-card, .message-body');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add 'visible' class style injection or inline
    // It's cleaner to handle the 'visible' state in CSS, but let's do inline modification for simplicity
    // or better, adding a style block to head if not present, but CSS file is better.
    // I will modify the JS to just add class, and I should have added .visible style in CSS.
    // Let's Inject the style for .visible since I missed it in CSS, or I can update CSS.
    // Updating CSS is cleaner, but I can do it here to avoid context switching risk.
    
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
