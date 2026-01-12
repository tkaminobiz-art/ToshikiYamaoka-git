// AX-2026 REBUILD: Neo-Academic Pop-Brutalism
// Main Logic

document.addEventListener("DOMContentLoaded", () => {
    console.log("AX-2026 REBUILD SYSTEM: ONLINE");

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Register
    gsap.registerPlugin(ScrollTrigger);

    // 3. Hero Animation: Entry Sequence
    initHeroAnimation();

    // 4. Interactive Elements
    initTiltCards();

    // 5. Horizontal Scroll Logic
    initHorizontalScroll();
    // 6. FAQ Accordion

});



function initTiltCards() {
    // Basic JS Tilt effect or specific hover interactions
    const cards = document.querySelectorAll(".card-brutalist");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            // Calculate tilt based on mouse position
            // Implementation can be added here or via library
            // For now, simple console log to verify
        });
    });
}

function initHorizontalScroll() {
    const section = document.querySelector("#projects");
    const container = document.querySelector(".horizontal-container");

    if (!section || !container) return;

    // Calculate total width of container content
    const getScrollAmount = () => {
        let containerWidth = container.scrollWidth;
        return -(containerWidth - window.innerWidth + 100); // Leave some buffer
    };

    const tween = gsap.to(container, {
        x: getScrollAmount,
        ease: "none",
    });

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`, // Scroll distance correlates to width
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
    });
}


function initHeroAnimation() {
    const heroTitle = document.querySelector(".hero-main-text");
    const bubbles = document.querySelectorAll(".hero-bubble");

    // Animate Title (Staggered or Reveal)
    gsap.from(heroTitle, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2
    });

    // Pop in Bubbles with elastic bounce
    gsap.from(bubbles, {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.8
    });

    // Floating/Hovering effect for bubbles
    bubbles.forEach((bubble, i) => {
        gsap.to(bubble, {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-5, 5)",
            duration: "random(2, 4)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.2 // offset start time
        });
    });
}



