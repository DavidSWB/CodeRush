// src/background.js - use original background implementation and mask center UI area
import './background.css';

export function initBackground() {
  if (document.getElementById('backgroundCanvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'backgroundCanvas';
  canvas.style.position = 'fixed';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const javaFragments = [
    'int', 'double', 'boolean', 'char', 'String', 'long', 'float', 'short', 'byte',
    'public', 'class', 'void', 'static', 'main', 'private', 'protected',
    '(', ')', '{', '}', '[]', ';', '=',
    'int x = 0;', 'double pi = 3.14;', 'boolean flag = true;', "char letter = 'a';",
    'String name = "Java";', 'long num = 123L;', 'float val = 1.5f;',
    'public class Hello {', 'public static void main(String[] args) {',
    'System.out.println("Hello");', '}', '}',
    'return;', 'new Object();'
  ];

  const particles = [];
  const bubbles = [];
  const explosions = [];
  const particleCount = 30;
  const bubbleCount = 30;
  const neonColors = ['#ff5e5e', '#5efff7', '#fffb5e', '#c5ff5e', '#5e72ff', '#ff5ec8', '#ff6b6b', '#4ecdc4'];
  // dynamic controls (adjusted via custom event)
  let speedMultiplier = 1;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      text: javaFragments[Math.floor(Math.random() * javaFragments.length)],
      size: 12 + Math.random() * 10,
      speedX: -1 + Math.random() * 2,
      speedY: -1 - Math.random() * 1.5,
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: -1 + Math.random() * 2
    });
  }

  for (let i = 0; i < bubbleCount; i++) {
    const size = 15 + Math.random() * 35;
    bubbles.push({
      x: Math.random() * (width - size * 2) + size,
      y: height + size,
      size: size,
      speedX: -0.5 + Math.random() * 1,
      speedY: -1 - Math.random() * 1.5,
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
      pulse: 0,
      pulseSpeed: 0.01 + Math.random() * 0.03
    });
  }

  function createParticle() {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      text: javaFragments[Math.floor(Math.random() * javaFragments.length)],
      size: 12 + Math.random() * 10,
      speedX: -1 + Math.random() * 2,
      speedY: -1 - Math.random() * 1.5,
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: -1 + Math.random() * 2
    });
  }

  function createBubble() {
    const size = 15 + Math.random() * 35;
    bubbles.push({
      x: Math.random() * (width - size * 2) + size,
      y: height + size,
      size: size,
      speedX: -0.5 + Math.random() * 1,
      speedY: -1 - Math.random() * 1.5,
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
      pulse: 0,
      pulseSpeed: 0.01 + Math.random() * 0.03
    });
  }

  function drawParticles() {
    particles.forEach((particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation * Math.PI / 180);

      ctx.font = `bold ${particle.size}px 'Courier New', monospace`;
      // use each particle's original color (no global cycling)
      const fillCol = particle.color || neonColors[Math.floor(Math.random() * neonColors.length)];
      ctx.fillStyle = fillCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 10;
      ctx.shadowColor = fillCol;
      ctx.fillText(particle.text, 0, 0);

      ctx.restore();
    });
  }

  function drawBubbles() {
    bubbles.forEach((bubble) => {
      const col = bubble.color || neonColors[Math.floor(Math.random() * neonColors.length)];
      const gradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.size
      );
      gradient.addColorStop(0, `${col}cc`);
      gradient.addColorStop(1, `${col}00`);

      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size * (1 + Math.sin(bubble.pulse) * 0.1), 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowBlur = 20;
      ctx.shadowColor = col;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawExplosions() {
    explosions.forEach((explosion, index) => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        explosion.x, explosion.y, 0,
        explosion.x, explosion.y, explosion.radius
      );

      gradient.addColorStop(0, `${explosion.color}${Math.round(explosion.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${explosion.color}00`);

      ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      explosion.radius += 3;
      explosion.opacity -= 0.03;

      if (explosion.opacity <= 0) {
        explosions.splice(index, 1);
      }
    });
  }

  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.speedX * speedMultiplier;
      particle.y += particle.speedY * speedMultiplier;
      particle.rotation += particle.rotationSpeed * speedMultiplier;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;
    });
  }

  function updateBubbles() {
    bubbles.forEach((bubble, index) => {
      bubble.x += bubble.speedX * speedMultiplier;
      bubble.y += bubble.speedY * speedMultiplier;
      bubble.pulse += bubble.pulseSpeed * speedMultiplier;

      if (bubble.y < -bubble.size) {
        bubbles.splice(index, 1);
        createBubble();
      }
    });
  }

  canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    bubbles.forEach((bubble, index) => {
      const dx = mouseX - bubble.x;
      const dy = mouseY - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bubble.size * 1.2) {
        explosions.push({
          x: bubble.x,
          y: bubble.y,
          radius: bubble.size,
          opacity: 1,
          color: bubble.color
        });

        bubbles.splice(index, 1);
        createBubble();
      }
    });

    particles.forEach((particle, index) => {
      const halfSize = particle.size * 1.5;
      if (mouseX >= particle.x - halfSize && mouseX <= particle.x + halfSize &&
          mouseY >= particle.y - halfSize && mouseY <= particle.y + halfSize) {
        explosions.push({
          x: particle.x,
          y: particle.y,
          radius: particle.size,
          opacity: 1,
          color: particle.color
        });

        particles.splice(index, 1);
        createParticle();
      }
    });
  });

  let rafId = null;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(28, 28, 28, 0.1)';
    ctx.fillRect(0, 0, width, height);

  updateParticles();
    updateBubbles();

    drawParticles();
    drawBubbles();
    drawExplosions();

    // Mask the center UI area (typing panel) so background does NOT show there
    const centerEl = document.querySelector('.typing-panel') || document.querySelector('.game-board');
    if (centerEl) {
      const r = centerEl.getBoundingClientRect();
      // clear area where UI lives (with small padding)
      const pad = 8;
      ctx.clearRect(r.left - pad, r.top - pad, r.width + pad * 2, r.height + pad * 2);
    }

    rafId = requestAnimationFrame(animate);
  }

  animate();

  // allow external control via custom event to modify intensity/speed and color cycling
  function onBgUpdate(e) {
    try {
      const detail = e && e.detail ? e.detail : {};
      const timeRemaining = typeof detail.timeRemaining === 'number' ? detail.timeRemaining : 0;
      const timeLimit = typeof detail.timeLimit === 'number' && detail.timeLimit > 0 ? detail.timeLimit : 15;
      const ratio = Math.max(0, Math.min(1, timeRemaining / timeLimit));
  // more remaining time -> slower background; less remaining -> more frenetic
  speedMultiplier = 0.3 + (1 - ratio) * 2.5; // ranges ~0.3..2.8
    } catch (err) {
      // ignore
    }
  }

  window.addEventListener('coderush-bg-update', onBgUpdate);

  // store cleanup handles on element for removal later
  canvas._bg_cleanup = () => {
    window.removeEventListener('resize', resizeCanvas);
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('coderush-bg-update', onBgUpdate);
  };
}

export function removeBackground() {
  const canvas = document.getElementById('backgroundCanvas');
  if (canvas) {
    if (canvas._bg_cleanup) canvas._bg_cleanup();
    canvas.remove();
  }
}
