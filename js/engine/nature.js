/* ============================================
   NATURE ENGINE — Spawns animated nature elements
   Floating leaves, fireflies, mist, and stream
   ============================================ */

const LEAF_EMOJIS = ['🍃', '🌿', '☘️', '🍂', '🌱'];
const MAX_LEAVES = 12;
const MAX_FIREFLIES = 18;

let natureCanvas = null;
let isInitialized = false;

/**
 * Initialize the nature effects engine.
 * Creates the canvas container and spawns all animated elements.
 */
export function initNature() {
  if (isInitialized) return;
  isInitialized = true;

  // Create the fixed canvas container
  natureCanvas = document.createElement('div');
  natureCanvas.className = 'nature-canvas';
  natureCanvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(natureCanvas);

  // Create the bottom stream bar
  const stream = document.createElement('div');
  stream.className = 'nature-stream';
  stream.setAttribute('aria-hidden', 'true');
  document.body.appendChild(stream);

  // Spawn mist layers
  spawnMist();

  // Spawn leaves with staggered timing
  for (let i = 0; i < MAX_LEAVES; i++) {
    setTimeout(() => spawnLeaf(), i * 1800);
  }

  // Spawn fireflies with staggered timing
  for (let i = 0; i < MAX_FIREFLIES; i++) {
    setTimeout(() => spawnFirefly(), i * 600);
  }

  // Add ripple effect to interactive elements
  document.addEventListener('click', handleRipple, true);

  console.log('[Nature] 🌿 Nature engine initialized');
}

/* ---- Leaf Spawner ---- */

function spawnLeaf() {
  if (!natureCanvas || !document.body.contains(natureCanvas)) return;

  const leaf = document.createElement('div');
  leaf.className = 'nature-leaf';
  leaf.textContent = LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];

  // Random horizontal position
  leaf.style.left = `${Math.random() * 100}%`;

  // Random size
  const size = 0.8 + Math.random() * 0.8;
  leaf.style.fontSize = `${size}rem`;

  // Random duration (slow, organic fall)
  const duration = 10 + Math.random() * 14; // 10s to 24s
  leaf.style.animationDuration = `${duration}s`;

  // Small random delay (keep it short so they appear quickly)
  const delay = Math.random() * 3;
  leaf.style.animationDelay = `${delay}s`;

  natureCanvas.appendChild(leaf);

  // Use animationend for reliable respawning
  leaf.addEventListener('animationend', () => {
    leaf.remove();
    spawnLeaf(); // Continuous loop
  }, { once: true });

  // Fallback timeout in case animationend doesn't fire
  setTimeout(() => {
    if (leaf.parentNode) {
      leaf.remove();
      spawnLeaf();
    }
  }, (duration + delay + 2) * 1000);
}

/* ---- Firefly Spawner ---- */

function spawnFirefly() {
  if (!natureCanvas || !document.body.contains(natureCanvas)) return;

  const firefly = document.createElement('div');
  firefly.className = 'nature-firefly';

  // Random position across the viewport
  firefly.style.left = `${10 + Math.random() * 80}%`;
  firefly.style.top = `${10 + Math.random() * 80}%`;

  // Random size (2px to 5px)
  const size = 2 + Math.random() * 3;
  firefly.style.width = `${size}px`;
  firefly.style.height = `${size}px`;

  // Random animation duration
  const duration = 4 + Math.random() * 6; // 4s to 10s
  firefly.style.animationDuration = `${duration}s`;

  // Small random delay
  const delay = Math.random() * 3;
  firefly.style.animationDelay = `${delay}s`;

  natureCanvas.appendChild(firefly);

  // Use animationend for reliable respawning
  firefly.addEventListener('animationiteration', () => {
    // Reposition on each animation cycle
    firefly.style.left = `${10 + Math.random() * 80}%`;
    firefly.style.top = `${10 + Math.random() * 80}%`;
  });

  // Fireflies use infinite animation, so just periodically refresh them
  setTimeout(() => {
    if (firefly.parentNode) {
      firefly.remove();
      spawnFirefly();
    }
  }, (duration * 3 + delay) * 1000);
}

/* ---- Mist Layers ---- */

function spawnMist() {
  if (!natureCanvas) return;

  const positions = ['nature-mist--top', 'nature-mist--mid', 'nature-mist--bottom'];

  positions.forEach(pos => {
    const mist = document.createElement('div');
    mist.className = `nature-mist ${pos}`;
    natureCanvas.appendChild(mist);
  });
}

/* ---- Ripple Effect on Click ---- */

function handleRipple(e) {
  const target = e.target.closest('.btn, .card, .stat-card, .nav-item, .chip');
  if (!target) return;

  // Add the ripple class
  target.classList.add('ripple-effect');

  // Position the ripple at click point
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  target.style.setProperty('--ripple-x', `${x}px`);
  target.style.setProperty('--ripple-y', `${y}px`);

  // Trigger animation
  target.classList.remove('rippling');
  void target.offsetWidth; // Force reflow
  target.classList.add('rippling');

  // Clean up
  setTimeout(() => {
    target.classList.remove('rippling');
  }, 600);
}
