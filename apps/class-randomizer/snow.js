/* Піксельний сніг (Canvas 2D). Власна реалізація, без стороннього коду.
   const s = mount(el, {alpha:.75}); s.wake(); s.sleep(); s.destroy(); */

export function winterSeason(d = new Date()) {
  const m = d.getMonth(), day = d.getDate();
  return m === 11 || m === 0 || m === 1 || (m === 10 && day >= 25); // 25 лист. — кінець лютого
}

export function mount(el, opt = {}) {
  const alpha = opt.alpha ?? 0.75;
  const colors = opt.colors || ['255,255,255', '255,255,255', '214,200,255']; // білий і лавандовий
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const dpr = weak ? 1 : Math.min(devicePixelRatio || 1, 2);

  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  el.appendChild(cv);
  const ctx = cv.getContext('2d');

  let W = 0, H = 0, flakes = [], raf = 0, last = 0, running = false, dead = false;

  const make = (y) => {
    const s = [2, 3, 3, 4, 4, 5, 6][Math.floor(Math.random() * 7)];
    return {
      x: Math.random() * W, y: y ?? Math.random() * H,
      s, v: 18 + s * 9 + Math.random() * 30,            // більші — швидші
      ph: Math.random() * 6.28, sw: 6 + Math.random() * 14,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: alpha * (0.55 + Math.random() * 0.45)
    };
  };

  function resize() {
    W = el.clientWidth; H = el.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((W * H) / (weak ? 9000 : 5500));
    while (flakes.length < n) flakes.push(make());
    flakes.length = n;
    if (!running) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const f of flakes) {
      const x = Math.round(f.x + Math.sin(f.ph + t * 0.0012) * f.sw), y = Math.round(f.y);
      ctx.fillStyle = `rgba(${f.c},${f.a})`;
      ctx.fillRect(x - (x % 2), y - (y % 2), f.s, f.s); // квадратні «пікселі» на сітці 2px
    }
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    for (const f of flakes) { f.y += f.v * dt; if (f.y > H + 8) Object.assign(f, make(-8)); }
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (dead || running || reduce || document.hidden) { if (!running) draw(0); return; }
    running = true; last = 0; raf = requestAnimationFrame(frame);
  }
  function sleep() { running = false; cancelAnimationFrame(raf); }
  const onVis = () => (document.hidden ? sleep() : wake());

  const ro = new ResizeObserver(resize);
  ro.observe(el);
  document.addEventListener('visibilitychange', onVis);
  resize();

  function destroy() {
    dead = true; sleep(); ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    cv.remove();
  }
  return { wake, sleep, destroy };
}
