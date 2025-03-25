import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  radius: number;
  color: string;
  secondaryColor: string;
  vx: number;
  vy: number;
  phase: number;
}

const LavaLampBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Neon colors in OKLCH format
    const neonBlue = "oklch(75.33% 0.1346 219.54)";
    const neonPurple = "oklch(68.92% 0.1909 313.35)";
    const neonRed = "oklch(66.23% 0.2027 21.38)";
    const deepBlack = "oklch(15.91% 0 0)";

    // Create blobs with neon colors
    const blobs: Blob[] = [];
    const primaryColors = [neonBlue, neonPurple, neonRed];
    const secondaryColors = [neonPurple, neonRed, neonBlue];

    for (let i = 0; i < 8; i++) {
      const colorIndex = Math.floor(Math.random() * primaryColors.length);
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 70 + Math.random() * 100,
        color: primaryColors[colorIndex],
        secondaryColor: secondaryColors[colorIndex],
        vx: Math.random() * 0.8 - 0.4,
        vy: Math.random() * 0.8 - 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Handle window resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const render = () => {
      if (!canvas || !ctx) return;

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";

      // Fill with deep black background - using rgba to ensure opacity is 1
      ctx.fillStyle = "rgb(25, 25, 25)"; // Fallback for browsers that might not support OKLCH
      ctx.fillStyle = deepBlack;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set blend mode for the glowing effect
      ctx.globalCompositeOperation = "screen";

      // Update and draw blobs
      blobs.forEach((blob) => {
        // Move blobs
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.phase += 0.01;

        // Bounce off edges
        if (blob.x < 0 || blob.x > canvas.width) blob.vx *= -1;
        if (blob.y < 0 || blob.y > canvas.height) blob.vy *= -1;

        // Pulse size
        const pulsingRadius = blob.radius + Math.sin(blob.phase) * 20;

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          pulsingRadius,
        );

        // Create gradient with primary and secondary neon colors
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.6, blob.secondaryColor);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fade to transparent

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, pulsingRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 h-full w-full"
      style={{ backgroundColor: "rgb(25, 25, 25)" }} // Fallback background color
    />
  );
};

export default LavaLampBackground;
