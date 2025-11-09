const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d');

let width, height;
const particles = [];

const spacing = 90;         // espace moyen entre particules
const jitter = 50;          // aléa sur position de base
const linkDistance = 130;   // distance max de connexion

const glowPos = { x: 0, y: 0 };
const glowRadius = 300; // rayon visible du glow

document.addEventListener("mousemove", (e) => {
  glowPos.x = e.clientX;
  glowPos.y = e.clientY;
  const glowEl = document.getElementById("background-glow");
  glowEl.style.transform = `translate(${e.clientX - glowEl.offsetWidth / 2}px, ${e.clientY - glowEl.offsetHeight / 2}px)`;
});

function resizeCanvas() {
  width = canvas.width = maskCanvas.width = window.innerWidth;
  height = canvas.height = maskCanvas.height = window.innerHeight;
  createParticles();
}

function createParticles() {
  particles.length = 0;
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      particles.push({
        baseX: x + (Math.random() - 0.5) * jitter,
        baseY: y + (Math.random() - 0.5) * jitter,
        offsetX: Math.random() * 1000,
        offsetY: Math.random() * 1000,
        size: 1 + Math.random() * 2.5,
      });
    }
  }
}

function animate(t) {
  maskCtx.clearRect(0, 0, width, height);

  // Déplacement fluide des particules
  particles.forEach(p => {
    p.x = p.baseX + Math.sin(t * 0.002 + p.offsetX) * 8;
    p.y = p.baseY + Math.cos(t * 0.002 + p.offsetY) * 8;
  });

  // Lignes entre particules proches
  const linkDistSq = linkDistance * linkDistance;
  for (let i = 0; i < particles.length; i++) {
    const pi = particles[i];

    for (let j = i + 1; j < particles.length; j++) {
      const pj = particles[j];
      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < linkDistSq) {
        const dist = Math.sqrt(distSq);
        const normalized = 1 - (dist / linkDistance);
        const opacity = 0.1 + normalized * (1.0 - 0.1);
        const lineW = 0.3 + normalized * 1.2;
        maskCtx.strokeStyle = `rgba(217, 217, 217, ${opacity})`;
        maskCtx.lineWidth = lineW;
        maskCtx.beginPath();
        maskCtx.moveTo(pi.x, pi.y);
        maskCtx.lineTo(pj.x, pj.y);
        maskCtx.stroke();
      }
    }
  }

  // Dessin des particules
  particles.forEach(p => {
    const particleOpacity = 0.5 + (p.size - 1) / 3;
    maskCtx.beginPath();
    maskCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    maskCtx.fillStyle = `rgba(217, 217, 217, ${particleOpacity})`;
    maskCtx.fill();
  });

    // Canvas principal : appliquer le masque radial pour halo
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Dessin complet des particules et lignes depuis le maskCanvas
    ctx.drawImage(maskCanvas, 0, 0);

    // Gradient radial : blanc au centre, noir à l'extérieur pour "masquer" progressivement
    const gradient = ctx.createRadialGradient(glowPos.x, glowPos.y, 0, glowPos.x, glowPos.y, glowRadius);
    gradient.addColorStop(0, 'rgba(0,0,0,0.3)');   // au centre, opaque → tout visible
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.1)');   // au centre, opaque → tout visible
    gradient.addColorStop(1, 'rgba(0,0,0,0)');   // à la limite, transparent → invisible

    // On applique le gradient comme masque
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate(0);
