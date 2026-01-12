// AX-2026 PROTOCOL // SYSTEM LOGIC

gsap.registerPlugin(ScrollTrigger);

// 1. SCRAMBLE TEXT UTILS
const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789///|||&&&";
const scramble = (element, newText = null, duration = 1) => {
    const originalText = newText || element.innerText;
    let obj = { p: 0 };

    gsap.to(obj, {
        p: 1,
        duration: duration,
        ease: "none",
        onUpdate: () => {
            const progress = Math.floor(obj.p * originalText.length);
            const scrambled = originalText.split("").map((char, i) => {
                if (i < progress) return originalText[i];
                if (char === " ") return " ";
                return validChars[Math.floor(Math.random() * validChars.length)];
            }).join("");
            element.innerText = scrambled;
        },
        onComplete: () => {
            element.innerText = originalText;
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {

    // 2. COLD BOOT SEQUENCE
    const terminal = document.querySelector(".terminal-content");
    const bootScreen = document.querySelector(".boot-screen");
    const logs = [
        "> DETECTING LEGACY PROTOCOLS...",
        "> ANALYSIS: 89% CORRUPTION",
        "> INITIATING PURGE SEQUENCE...",
        "> LOADING AX-2026 KERNEL...",
        "> SYSTEM READY."
    ];

    let logIndex = 0;

    // Type out logs
    const typeLine = () => {
        if (logIndex >= logs.length) {
            // End sequence
            setTimeout(purgeSystem, 500);
            return;
        }

        const line = document.createElement("div");
        line.innerText = logs[logIndex];
        terminal.appendChild(line); // Add cursor logic if needed
        terminal.scrollTop = terminal.scrollHeight;

        logIndex++;

        // Random typing delay
        setTimeout(typeLine, 150);
    };

    const purgeSystem = () => {
        // Flash White
        gsap.to(bootScreen, {
            backgroundColor: "#FFF",
            color: "#000",
            duration: 0.05,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                // Reveal Main Site
                gsap.to(bootScreen, {
                    scaleY: 0,
                    duration: 0.4,
                    ease: "power4.inOut",
                    onComplete: () => {
                        bootScreen.style.display = "none";
                        startMainSequence();
                    }
                });
            }
        });
    };

    // START BOOT
    setTimeout(typeLine, 500);


    // 3. MAIN SITE INTERACTIONS
    const startMainSequence = () => {
        // Hero Scramble
        const title = document.querySelector(".stencil-title");
        scramble(title, "AX-2026", 1.5);

        // Subtitle Slide
        gsap.from(".stroke-title", { x: -100, opacity: 0, duration: 0.5, delay: 0.5 });

        // Stagger Data
        gsap.from(".floating-data p", {
            opacity: 0, x: 20, stagger: 0.1, delay: 1, ease: "steps(3)"
        });
    };

    // Scroll Triggers

    // PROBLEM: Stamp Slam
    ScrollTrigger.create({
        trigger: ".problem-section",
        start: "top 60%",
        onEnter: () => {
            gsap.fromTo(".rejected-stamp",
                { scale: 5, opacity: 0, rotation: 45 },
                { scale: 1, opacity: 0.9, rotation: -15, duration: 0.2, ease: "power4.in" }
            );
        }
    });

    // FILES: Folder Interaction (Parallax Hover effect is CSS, maybe add simple reveal)
    const folders = document.querySelectorAll(".file-folder");
    if (folders.length) {
        gsap.from(folders, {
            scrollTrigger: {
                trigger: ".files-section",
                start: "top 70%"
            },
            y: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: "steps(4)"
        });
    }


    // 4. PHYSICS DESTRUCTION SIMULATOR (The Chaos)
    const triggerBtn = document.getElementById("trigger-chaos");
    triggerBtn.addEventListener("click", () => {
        initPhysics();
    });

    const initPhysics = () => {
        console.log("INITIALIZING CHAOS...");

        // Disable Lenis Scroll
        // (Assuming global lenis instance if strictly needed, but changing CSS overflow is often enough)
        document.body.classList.add("physics-mode");

        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World;

        // Create engine
        const engine = Engine.create();
        const world = engine.world;

        // Set gravity (optional: increase for heavier feel)
        engine.gravity.y = 1;

        // Select all physics-enabled elements
        // Also include the trigger button itself so it falls too!
        const domElements = document.querySelectorAll('[data-physics="true"], .btn-chaos, .problem-grid, .file-folder, .system-footer, .system-sidebar');

        const bodies = [];

        domElements.forEach(el => {
            // Get current geometry
            const rect = el.getBoundingClientRect();

            // Skip elements that are already off-screen or invisible
            if (rect.width === 0 || rect.height === 0) return;

            // Create rigid body
            // Matter.js bodies are positioned at their center, so we add width/2 and height/2
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.5, // Bounciness
                    friction: 0.3,
                    density: 0.04 // Weight
                }
            );

            // Store reference to DOM node in the body
            body.render.domElement = el;

            // Add to list
            bodies.push(body);

            // Set DOM to absolute positioning to follow physics
            // MUST set initial transform to 0 to avoid double offset
            el.classList.add("physics-body");
            el.style.width = `${rect.width}px`;
            el.style.height = `${rect.height}px`;
        });

        // Add bodies to world
        Composite.add(world, bodies);

        // Add Walls (Screen boundaries)
        const wallThickness = 100;
        const width = window.innerWidth;
        const height = window.innerHeight;

        const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true });
        const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true });
        const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true });
        const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true });

        Composite.add(world, [floor, ceiling, leftWall, rightWall]);

        // Add Mouse Control (for dragging)
        const mouse = Mouse.create(document.body);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(world, mouseConstraint);

        // Allow scrolling inside specific elements? No, the whole world is a box now.
        // Sync Mouse with scroll (Matter.js assumes 0,0 is topleft, but if we scrolled down before clicking...)
        // Actually, since we set body.overflow hidden, scroll is gone. But we need to account for initial scroll offset if we weren't at top.
        // For simplicity, we might want to force scroll to top or just use ClientRects which are viewport relative.
        // rect.left/top ARE viewport relative. So standard Matter.js view is fine.

        // Start Runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Render Loop (Sync DOM to Physics)
        const updateDOM = () => {
            bodies.forEach(body => {
                const el = body.render.domElement;
                if (el) {
                    const { x, y } = body.position;
                    const angle = body.angle;

                    // We need to subtract width/2 height/2 because CSS transform origin is usually center, 
                    // BUT absolute positioning top/left puts element at x,y. 
                    // Wait, Matter body.position is CENTER.
                    // CSS absolute default 0,0 is TOP LEFT.
                    // So we translate to (body.x - width/2), (body.y - height/2).

                    const w = body.bounds.max.x - body.bounds.min.x;
                    const h = body.bounds.max.y - body.bounds.min.y;

                    el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${angle}rad)`;
                }
            });
            requestAnimationFrame(updateDOM);
        };
        updateDOM();
    };

});
