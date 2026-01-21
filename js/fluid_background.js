// WebGL Liquid Intelligence Background
// Powered by Three.js & GLSL
// Concept: Organic, dark, neural-network-like liquid that reacts to mouse interaction.

const initFluidBackground = () => {
    const container = document.getElementById('liquid-canvas');
    if (!container) {
        console.warn("Liquid Canvas container not found via ID 'liquid-canvas'.");
        return;
    }

    // Use existing canvas if present to prevent dupes
    if (container.querySelector('canvas')) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Antialias false for performance/grit

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    container.appendChild(renderer.domElement);

    // --- 2. Geometry & Material ---
    const geometry = new THREE.PlaneGeometry(2, 2);

    const fluidShader = {
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uColor1: { value: new THREE.Color('#050505') }, // Deep Black
            uColor2: { value: new THREE.Color('#1A1A1A') }, // Dark Gray
            uAccent: { value: new THREE.Color('#EAFF00') }  // Neon Yellow/Green
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uMouse;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uAccent;
            varying vec2 vUv;

            // Simplex 2D noise
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v){
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod(i, 289.0);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 st = vUv;
                // Correct aspect ratio
                st.x *= uResolution.x / uResolution.y;

                // Mouse influence (warping space)
                float dist = distance(st, uMouse * vec2(uResolution.x/uResolution.y, 1.0));
                float mouseForce = smoothstep(0.5, 0.0, dist) * 0.15;
                
                // Noise layers
                float n1 = snoise(st * 3.0 + uTime * 0.1 - mouseForce);
                float n2 = snoise(st * 6.0 - uTime * 0.15 + n1 * 0.5);
                float n3 = snoise(st * 12.0 + uTime * 0.05 + n2 * 0.5);

                // Fluid mix
                float fluid = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
                
                // Color mapping
                vec3 color = mix(uColor1, uColor2, smoothstep(-0.2, 0.5, fluid));
                
                // Neon veins (highlights)
                float veins = smoothstep(0.4, 0.42, fluid) - smoothstep(0.42, 0.45, fluid);
                color = mix(color, uAccent, veins * 0.3); // Subtle neon glow

                // Vignette for depth
                float vignette = smoothstep(1.5, 0.5, distance(vUv, vec2(0.5)));
                color *= vignette;

                gl_FragColor = vec4(color, 1.0);
            }
        `
    };

    const material = new THREE.ShaderMaterial({
        uniforms: fluidShader.uniforms,
        vertexShader: fluidShader.vertexShader,
        fragmentShader: fluidShader.fragmentShader
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // --- 3. Animation Loop ---
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.005; // Sluggish speed for organic feel
        fluidShader.uniforms.uTime.value = time;
        renderer.render(scene, camera);
    };
    animate();

    // --- 4. Event Listeners ---

    // Resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        fluidShader.uniforms.uResolution.value.set(width, height);
    });

    // Mouse Move (Tracking)
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = 1.0 - (e.clientY / window.innerHeight); // Flip Y for GLSL

        // Direct update for responsiveness (can add lerp in loop for smoothness)
        fluidShader.uniforms.uMouse.value.set(targetMouseX, targetMouseY);
    });
};

// Robust Initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFluidBackground);
} else {
    initFluidBackground();
}
