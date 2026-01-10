// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
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

// Integrate Lenis with GSAP ScrollTrigger
// lenis.on('scroll', ScrollTrigger.update); // Not strictly necessary if raf is running, but good practice
// gsap.ticker.add((time) => {
//     lenis.raf(time * 1000); // GSAP sends time in seconds
// });
// gsap.ticker.lagSmoothing(0);

// --- Animation Setup ---

document.addEventListener("DOMContentLoaded", () => {

    // 1. Opening Animation (Cinematic Entry)
    const loaderTl = gsap.timeline();

    loaderTl
        .to(".loader-curtain", {
            scaleY: 0,
            duration: 1.5,
            ease: "power4.inOut",
            transformOrigin: "top",
            delay: 0.2
        })
        .from(".hero-img", {
            scale: 1.2,
            opacity: 0,
            duration: 2,
            ease: "power2.out"
        }, "-=1.0")
        .to(".reveal-text", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            onStart: () => {
                gsap.set(".reveal-text", { y: 100, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" });
            }
        }, "-=1.5")
        .to(".reveal-text-delay", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.8")
        .from(".reveal-header", {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5");


    // 2. Parallax Effects (Generic)
    // Targets elements with data-speed attribute
    const parallaxElements = document.querySelectorAll("[data-speed]");
    parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute("data-speed"));
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top bottom", // Start when top of element hits bottom of viewport
                end: "bottom top",
                scrub: 0 // Smooth scrubbing
            },
            y: (i, target) => {
                // Determine distance based on speed vs natural scroll
                return (1 - speed) * 100; // Simplified calculation for visual effect
            },
            ease: "none"
        });
    });

    // Hero Text specific parallax
    gsap.to(".vertical-text", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: -50,
        ease: "none"
    });


    // 3. Scroll Reveals (Unified System)

    // UP Reveal
    const revealUp = document.querySelectorAll('[data-reveal="up"]');
    revealUp.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    // LEFT/RIGHT Reveal (Titles)
    const revealRight = document.querySelectorAll('[data-reveal="right"]');
    revealRight.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: -30 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    const revealLeft = document.querySelectorAll('[data-reveal="left"]');
    revealLeft.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: 30 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    // VERTICAL Text Reveal (Message Section)
    const revealVertical = document.querySelectorAll('[data-reveal="vertical"]');
    revealVertical.forEach(el => {
        // Simple fade up for the container, or we could split text if needed. 
        // For now, let's just do a nice slow fade in.
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power2.out"
            }
        );
    });

    // STAGGER Reveal (Services)
    const staggerContainers = document.querySelectorAll('[data-reveal="stagger"]');
    staggerContainers.forEach(container => {
        const children = container.children;
        gsap.fromTo(children,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            }
        );
    });


    // 4. List Items (Staggered)
    const lists = document.querySelectorAll("ul:not(.site-header ul)"); // Exclude nav
    lists.forEach(list => {
        const items = list.querySelectorAll("li");
        if (items.length === 0) return;

        gsap.fromTo(items,
            { opacity: 0, y: 20 },
            {
                scrollTrigger: {
                    trigger: list,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    });

    // 5. Structure Mode Toggle
    const toggle = document.querySelector('.structure-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('show-structure');
        });
    }

});

// Initial Setups to avoid FOUC or awkward jumps
gsap.set(".reveal-text", { y: 50, opacity: 0 }); // Initial state for hero text
