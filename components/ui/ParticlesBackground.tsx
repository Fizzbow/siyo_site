"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
}

export function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000, radius: 100 };
        let particleColor = "rgba(15, 23, 42, 0.1)"; // Default light mode (Slate-based)

        const updateColor = () => {
            const isDark =
                document.documentElement.classList.contains("dark") ||
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            // Light: Slate 900 at 10% opacity (matches border-strong-ish)
            // Dark: Slate 400 at 20% opacity
            particleColor = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(15, 23, 42, 0.1)";
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updateColor();
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 9000); // Adjust density

            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 2 + 0.5;

                // Distribution logic: mostly on sides
                // 0-30% width OR 70-100% width
                let x;
                const side = Math.random();
                if (side < 0.5) {
                    // Left side: 0% to 30%
                    x = Math.random() * (canvas.width * 0.3);
                } else {
                    // Right side: 70% to 100%
                    x = Math.random() * (canvas.width * 0.3) + (canvas.width * 0.7);
                }

                const y = Math.random() * canvas.height;
                const vx = (Math.random() - 0.5) * 0.2;
                const vy = (Math.random() - 0.5) * 0.2;

                particles.push({
                    x,
                    y,
                    vx,
                    vy,
                    size,
                    baseX: x,
                    baseY: y,
                    density: Math.random() * 30 + 1,
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = particleColor;

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                // Mouse interaction
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * p.density;
                const directionY = forceDirectionY * force * p.density;

                if (distance < mouse.radius) {
                    p.x -= directionX;
                    p.y -= directionY;
                } else {
                    if (p.x !== p.baseX) {
                        const dx = p.x - p.baseX;
                        p.x -= dx / 10;
                    }
                    if (p.y !== p.baseY) {
                        const dy = p.y - p.baseY;
                        p.y -= dy / 10;
                    }
                }

                // Movement
                p.x += p.vx;
                p.y += p.vy;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        // Observer for class changes on html element (for manual theme toggle)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    updateColor();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // Listener for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleThemeChange = () => updateColor();
        mediaQuery.addEventListener("change", handleThemeChange);

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        handleResize(); // Init
        drawParticles();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            mediaQuery.removeEventListener("change", handleThemeChange);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1]"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
