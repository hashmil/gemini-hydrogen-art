// Pure procedural painterly & colored-pencil drawing engine (zero dependencies)

export function createRng(seed = 1337) {
  let s = seed >>> 0;
  const next = () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (a, b) => a + (b - a) * next(),
    int: (a, b) => Math.floor(a + (b - a + 1) * next()),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    gauss: () => {
      const u = Math.max(1e-7, next());
      const v = next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
  };
}

function hash2(ix, iy, seed = 0) {
  let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function noise2D(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export function fbm(x, y, octaves = 3, seed = 0) {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq, seed + i * 97);
    norm += amp;
    amp *= 0.5;
    freq *= 2.02;
  }
  return val / norm;
}

export function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function mixHex(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

export function cubicPt(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return [
    mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
    mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
  ];
}

export function cubicTangent(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const dx =
    3 * mt * mt * (p1[0] - p0[0]) +
    6 * mt * t * (p2[0] - p1[0]) +
    3 * t * t * (p3[0] - p2[0]);
  const dy =
    3 * mt * mt * (p1[1] - p0[1]) +
    6 * mt * t * (p2[1] - p1[1]) +
    3 * t * t * (p3[1] - p2[1]);
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

export function organicEllipsePts(cx, cy, rx, ry, rot = 0, n = 44, wobble = 0.03, rng) {
  const pts = [];
  const phase1 = rng ? rng.range(0, Math.PI * 2) : 0.7;
  const phase2 = rng ? rng.range(0, Math.PI * 2) : 2.1;
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w =
      1 +
      wobble * Math.sin(a * 3 + phase1) +
      wobble * 0.55 * Math.cos(a * 5 + phase2) +
      (rng ? rng.range(-wobble * 0.35, wobble * 0.35) : 0);
    const lx = Math.cos(a) * rx * w;
    const ly = Math.sin(a) * ry * w;
    pts.push([cx + lx * cosR - ly * sinR, cy + lx * sinR + ly * cosR]);
  }
  return pts;
}

export function pointedLeafPts(cx, cy, rx, ry, rot = 0, n = 28, rng) {
  const pts = [];
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);
  const bend = rng ? rng.range(-0.18, 0.18) : 0.06;
  const half = Math.max(8, Math.floor(n / 2));
  // Right edge: base (+ry) -> tip (-ry)
  for (let i = 0; i <= half; i++) {
    const u = i / half; // 0 = base, 1 = tip
    const w = Math.sin(u * Math.PI) * Math.pow(1 - u * 0.65, 0.45);
    const lx = w * rx + bend * rx * Math.sin(u * Math.PI);
    const ly = ry * (1 - 2 * u);
    pts.push([cx + lx * cosR - ly * sinR, cy + lx * sinR + ly * cosR]);
  }
  // Left edge: tip (-ry) -> base (+ry)
  for (let i = half - 1; i >= 1; i--) {
    const u = i / half;
    const w = Math.sin(u * Math.PI) * Math.pow(1 - u * 0.65, 0.45);
    const lx = -w * rx + bend * rx * Math.sin(u * Math.PI);
    const ly = ry * (1 - 2 * u);
    pts.push([cx + lx * cosR - ly * sinR, cy + lx * sinR + ly * cosR]);
  }
  return pts;
}

export function sampleSmoothClosed(pts, stepsPerSeg = 8) {
  const n = pts.length;
  if (n < 3) return pts;
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];
    const p0 = [(prev[0] + curr[0]) * 0.5, (prev[1] + curr[1]) * 0.5];
    const p2 = [(curr[0] + next[0]) * 0.5, (curr[1] + next[1]) * 0.5];
    for (let s = 0; s < stepsPerSeg; s++) {
      const t = s / stepsPerSeg;
      const mt = 1 - t;
      out.push([
        mt * mt * p0[0] + 2 * mt * t * curr[0] + t * t * p2[0],
        mt * mt * p0[1] + 2 * mt * t * curr[1] + t * t * p2[1],
      ]);
    }
  }
  return out;
}

export function traceSharpClosed(ctx, pts) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.closePath();
}

export function traceSmoothClosed(ctx, pts) {
  if (!pts.length) return;
  const n = pts.length;
  ctx.beginPath();
  const startX = (pts[n - 1][0] + pts[0][0]) * 0.5;
  const startY = (pts[n - 1][1] + pts[0][1]) * 0.5;
  ctx.moveTo(startX, startY);
  for (let i = 0; i < n; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % n];
    const midX = (curr[0] + next[0]) * 0.5;
    const midY = (curr[1] + next[1]) * 0.5;
    ctx.quadraticCurveTo(curr[0], curr[1], midX, midY);
  }
  ctx.closePath();
}

export function traceSmoothOpen(ctx, pts) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  if (pts.length === 2) {
    ctx.lineTo(pts[1][0], pts[1][1]);
    return;
  }
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i][0] + pts[i + 1][0]) * 0.5;
    const midY = (pts[i][1] + pts[i + 1][1]) * 0.5;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], midX, midY);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last[0], last[1]);
}

export function getBounds(pts) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

export function drawPaperBackground(ctx, w, h, rng, bgHex = '#fcfbfa') {
  ctx.save();
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, w, h);

  // Subtle warm paper tooth wash
  const speckCount = Math.round((w * h) / 420);
  for (let i = 0; i < speckCount; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, h);
    const r = rng.range(0.4, 1.3);
    ctx.fillStyle = rng.chance(0.5) ? 'rgba(215,205,192,0.09)' : 'rgba(255,255,255,0.22)';
    ctx.fillRect(x, y, r, r);
  }
  ctx.restore();
}

/**
 * Fills a closed organic or architectural shape with colored-pencil / dry-gouache texture:
 * - Soft pigment base
 * - Directional fibrous crayon strokes inside clip
 * - Paper-tooth micro-speckles so white paper peeks through
 * - Chalky broken contour edge strictly following the actual shape boundary
 */
export function fillPastelShape(ctx, pts, opts = {}) {
  const {
    baseColor = '#f1c4b4',
    altColor = null,
    highlightColor = '#fff6f0',
    shadowColor = null,
    paperColor = '#fcfbfa',
    angle = Math.PI * 0.45,
    grainDensity = 1.0,
    toothAmount = 0.45,
    edgeRoughness = 1.0,
    strokeAlpha = 0.24,
    sharp = false,
    rng = createRng(42),
  } = opts;

  const trace = () => (sharp ? traceSharpClosed(ctx, pts) : traceSmoothClosed(ctx, pts));
  const edgePts = sharp ? pts : sampleSmoothClosed(pts, 6);
  const b = getBounds(edgePts);
  const cx = (b.minX + b.maxX) * 0.5;
  const cy = (b.minY + b.maxY) * 0.5;
  const diag = Math.hypot(b.w, b.h);

  ctx.save();

  // 1. Base fill
  trace();
  ctx.fillStyle = baseColor;
  ctx.fill();

  // Clip all interior texture strictly inside shape
  ctx.clip();

  // 2. Subtle tonal variation wash
  if (altColor) {
    const g = ctx.createLinearGradient(
      cx - Math.cos(angle) * b.w * 0.5,
      cy - Math.sin(angle) * b.h * 0.5,
      cx + Math.cos(angle) * b.w * 0.5,
      cy + Math.sin(angle) * b.h * 0.5
    );
    g.addColorStop(0, rgba(altColor, 0.25));
    g.addColorStop(0.55, rgba(baseColor, 0));
    g.addColorStop(1, rgba(shadowColor || altColor, 0.22));
    ctx.fillStyle = g;
    ctx.fillRect(b.minX - 10, b.minY - 10, b.w + 20, b.h + 20);
  }

  // 3. Directional colored-pencil / pastel strokes
  const area = Math.max(400, b.w * b.h);
  const strokeCount = Math.min(2600, Math.round((area / 45) * grainDensity));

  for (let i = 0; i < strokeCount; i++) {
    const px = rng.range(b.minX - 10, b.maxX + 10);
    const py = rng.range(b.minY - 10, b.maxY + 10);
    const len = rng.range(10, Math.min(85, diag * 0.28));
    const jitterAngle = angle + rng.range(-0.14, 0.14);
    const dx = Math.cos(jitterAngle) * len * 0.5;
    const dy = Math.sin(jitterAngle) * len * 0.5;

    const toneRoll = rng.next();
    let col = baseColor;
    let alpha = strokeAlpha;
    if (toneRoll < 0.28 && highlightColor) {
      col = highlightColor;
      alpha = strokeAlpha * 0.72;
    } else if (toneRoll < 0.58 && altColor) {
      col = altColor;
      alpha = strokeAlpha * 0.85;
    } else if (toneRoll > 0.86 && shadowColor) {
      col = shadowColor;
      alpha = strokeAlpha * 0.7;
    }

    ctx.strokeStyle = rgba(col, rng.range(alpha * 0.4, alpha));
    ctx.lineWidth = rng.range(0.7, 2.3);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px - dx, py - dy);
    ctx.quadraticCurveTo(
      px + rng.range(-2.5, 2.5),
      py + rng.range(-2.5, 2.5),
      px + dx,
      py + dy
    );
    ctx.stroke();
  }

  // 4. Paper tooth speckles (white/cream pores showing through pigment)
  if (toothAmount > 0) {
    const speckTotal = Math.min(3400, Math.round((area / 28) * toothAmount));
    for (let i = 0; i < speckTotal; i++) {
      const x = rng.range(b.minX, b.maxX);
      const y = rng.range(b.minY, b.maxY);
      const n = fbm(x * 0.045, y * 0.045, 2, 11);
      if (n > 0.42 || rng.chance(0.35)) {
        const w = rng.range(0.7, 2.1);
        const h = rng.range(0.6, 1.8);
        ctx.fillStyle = rgba(paperColor, rng.range(0.14, 0.55));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + rng.range(-0.4, 0.4));
        ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
        ctx.restore();
      }
    }
  }

  // 5. Chalky interior rim tooth near border
  if (edgeRoughness > 0) {
    trace();
    ctx.strokeStyle = rgba(paperColor, 0.42);
    ctx.lineWidth = edgeRoughness * 2.2;
    ctx.setLineDash([2, 3, 1, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();

  // 6. Outer dry-pencil edge grain ticks strictly along the real rendered curve
  if (edgeRoughness > 0) {
    ctx.save();
    for (let i = 0; i < edgePts.length; i++) {
      const p = edgePts[i];
      const q = edgePts[(i + 1) % edgePts.length];
      const segLen = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const steps = Math.max(1, Math.round(segLen / 3.5));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const x = p[0] + (q[0] - p[0]) * t + rng.range(-1.1, 1.1) * edgeRoughness;
        const y = p[1] + (q[1] - p[1]) * t + rng.range(-1.1, 1.1) * edgeRoughness;
        const r = rng.range(0.55, 1.45) * edgeRoughness;
        ctx.fillStyle = rgba(
          rng.chance(0.72) ? baseColor : altColor || baseColor,
          rng.range(0.28, 0.72)
        );
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

/**
 * Fills a garment/object with textured horizontal or angled bands + vertical crayon rib lines
 */
export function fillStripedPastelShape(ctx, pts, stripes, opts = {}) {
  const {
    stripeAngle = 0,
    ribAngle = Math.PI * 0.5,
    stripeCurve = 0,
    paperColor = '#fcfbfa',
    ribDensity = 1.35,
    toothAmount = 0.55,
    sharp = false,
    rng = createRng(99),
  } = opts;

  const trace = () => (sharp ? traceSharpClosed(ctx, pts) : traceSmoothClosed(ctx, pts));
  const edgePts = sharp ? pts : sampleSmoothClosed(pts, 6);
  const b = getBounds(edgePts);
  const cx = (b.minX + b.maxX) * 0.5;
  const cy = (b.minY + b.maxY) * 0.5;

  ctx.save();
  trace();
  ctx.fillStyle = stripes[0].color;
  ctx.fill();
  ctx.clip();

  // Draw overlapping dry-edge bands
  let yCursor = b.minY - 30;
  let idx = 0;
  while (yCursor < b.maxY + 40) {
    const band = stripes[idx % stripes.length];
    const bh = band.height || 50;
    const col = band.color;
    const alt = band.altColor || col;

    const bandPts = [];
    const steps = 16;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = b.minX - 40 + (b.w + 80) * t;
      const curveOffset = Math.sin(t * Math.PI) * stripeCurve;
      bandPts.push([x, yCursor + curveOffset + rng.range(-2.2, 2.2)]);
    }
    for (let s = steps; s >= 0; s--) {
      const t = s / steps;
      const x = b.minX - 40 + (b.w + 80) * t;
      const curveOffset = Math.sin(t * Math.PI) * stripeCurve;
      bandPts.push([x, yCursor + bh + curveOffset + rng.range(-2.2, 2.2)]);
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(stripeAngle);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.moveTo(bandPts[0][0], bandPts[0][1]);
    for (let k = 1; k < bandPts.length; k++) {
      ctx.lineTo(bandPts[k][0], bandPts[k][1]);
    }
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();

    // Ribbed crayon strokes across this band
    ctx.clip();
    const ribCount = Math.round(((b.w * bh) / 26) * ribDensity);
    for (let r = 0; r < ribCount; r++) {
      const rx = rng.range(b.minX - 20, b.maxX + 20);
      const ry = rng.range(yCursor - 8, yCursor + bh + 8);
      const len = rng.range(12, bh * 0.95);
      const a = ribAngle + rng.range(-0.08, 0.08);
      const dx = Math.cos(a) * len * 0.5;
      const dy = Math.sin(a) * len * 0.5;
      const c = rng.chance(0.45) ? alt : rng.chance(0.28) ? paperColor : col;
      ctx.strokeStyle = rgba(c, rng.range(0.18, 0.52));
      ctx.lineWidth = rng.range(0.8, 2.4);
      ctx.beginPath();
      ctx.moveTo(rx - dx, ry - dy);
      ctx.lineTo(rx + dx, ry + dy);
      ctx.stroke();
    }
    ctx.restore();

    yCursor += bh;
    idx++;
  }

  // Paper tooth speckles over whole garment
  const area = b.w * b.h;
  const specks = Math.min(3500, Math.round((area / 32) * toothAmount));
  for (let i = 0; i < specks; i++) {
    const x = rng.range(b.minX, b.maxX);
    const y = rng.range(b.minY, b.maxY);
    ctx.fillStyle = rgba(paperColor, rng.range(0.12, 0.48));
    ctx.fillRect(x, y, rng.range(0.8, 2.1), rng.range(0.8, 2.4));
  }

  ctx.restore();

  // Chalky outer edge strictly along real boundary
  ctx.save();
  for (let i = 0; i < edgePts.length; i++) {
    const p = edgePts[i];
    const q = edgePts[(i + 1) % edgePts.length];
    const steps = Math.max(1, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 4));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const x = p[0] + (q[0] - p[0]) * t + rng.range(-1.1, 1.1);
      const y = p[1] + (q[1] - p[1]) * t + rng.range(-1.1, 1.1);
      ctx.fillStyle = rgba(paperColor, rng.range(0.15, 0.42));
      ctx.beginPath();
      ctx.arc(x, y, rng.range(0.6, 1.4), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Solid-core painterly curved tube (for cat tails, teapot handles, mug handles)
 * Builds an organic closed polygon along the Bezier curve, fills with pastel texture,
 * and overlays dry-brush bristle highlights so it never looks like hollow parallel wires.
 */
export function drawPainterlyTube(ctx, p0, p1, p2, p3, opts = {}) {
  const {
    widthStart = 28,
    widthEnd = 22,
    baseColor = '#145875',
    altColor = '#0c3a4f',
    highlightColor = '#3f97b8',
    toothAmount = 0.35,
    rng = createRng(601),
  } = opts;

  const steps = 18;
  const leftPts = [];
  const rightPts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = cubicPt(p0, p1, p2, p3, t);
    const tang = cubicTangent(p0, p1, p2, p3, t);
    const norm = [-tang[1], tang[0]];
    const r = (widthStart + (widthEnd - widthStart) * t) * 0.5;
    leftPts.push([c[0] + norm[0] * r, c[1] + norm[1] * r]);
    rightPts.unshift([c[0] - norm[0] * r, c[1] - norm[1] * r]);
  }
  const poly = [...leftPts, ...rightPts];
  fillPastelShape(ctx, poly, {
    baseColor,
    altColor,
    highlightColor,
    toothAmount,
    edgeRoughness: 0.9,
    rng,
  });
  drawDryBrushRibbon(ctx, p0, p1, p2, p3, {
    widthStart: widthStart * 0.72,
    widthEnd: widthEnd * 0.72,
    bristles: 14,
    color: altColor,
    highlightColor,
    highlightChance: 0.48,
    dryness: 0.32,
    alpha: 0.65,
    rng,
  });
}

/**
 * Tapered pointed hair lock / fur tuft (wide at root, sharp feathered tip at end)
 * Eliminates rounded mitten ends on hair curtains and bangs.
 */
export function drawTaperedHairLock(ctx, p0, p1, p2, p3, opts = {}) {
  const {
    widthStart = 54,
    baseColor = '#080b0e',
    altColor = '#0f4e68',
    highlightColor = '#1c7ca0',
    highlightChance = 0.42,
    tipWisps = 3,
    rng = createRng(707),
  } = opts;

  const steps = 16;
  const leftPts = [];
  const rightPts = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const c = cubicPt(p0, p1, p2, p3, t);
    const tang = cubicTangent(p0, p1, p2, p3, t);
    const norm = [-tang[1], tang[0]];
    const r = widthStart * 0.5 * Math.pow(1 - t, 0.82);
    leftPts.push([c[0] + norm[0] * r, c[1] + norm[1] * r]);
    rightPts.unshift([c[0] - norm[0] * r, c[1] - norm[1] * r]);
  }
  // Sharp pointed tip vertex at p3
  const poly = [...leftPts, p3, ...rightPts];

  fillPastelShape(ctx, poly, {
    baseColor,
    altColor,
    highlightColor,
    angle: Math.atan2(p3[1] - p0[1], p3[0] - p0[0]),
    grainDensity: 0.85,
    toothAmount: 0.12,
    edgeRoughness: 0.55,
    sharp: true,
    rng,
  });

  // Tapered dry-brush teal/black bristles along lock
  drawDryBrushRibbon(ctx, p0, p1, p2, p3, {
    widthStart: widthStart * 0.82,
    widthEnd: 2,
    bristles: 16,
    color: baseColor,
    highlightColor,
    highlightChance,
    dryness: 0.34,
    alpha: 0.88,
    rng,
  });

  // Feathered wispy split hairs extending past the pointed tip
  const endTang = cubicTangent(p0, p1, p2, p3, 0.96);
  for (let w = 0; w < tipWisps; w++) {
    const spread = rng.range(-0.28, 0.28);
    const len = rng.range(18, 46);
    const dx = endTang[0] * Math.cos(spread) - endTang[1] * Math.sin(spread);
    const dy = endTang[0] * Math.sin(spread) + endTang[1] * Math.cos(spread);
    const startPt = [p3[0] - endTang[0] * rng.range(8, 28), p3[1] - endTang[1] * rng.range(8, 28)];
    const endPt = [p3[0] + dx * len, p3[1] + dy * len];
    drawWispyStrand(
      ctx,
      startPt,
      [(startPt[0] + endPt[0]) * 0.5 + rng.range(-5, 5), (startPt[1] + endPt[1]) * 0.5],
      [endPt[0] - dx * len * 0.25, endPt[1] - dy * len * 0.25],
      endPt,
      {
        widthStart: rng.range(1.6, 2.8),
        widthEnd: 0.3,
        color: rng.chance(0.35) ? highlightColor : baseColor,
        alpha: rng.range(0.65, 0.92),
        rng,
      }
    );
  }
}

/**
 * Soft chalk/airbrush stippled blush (cheeks, ears, glowing clouds, fruit ripeness)
 */
export function drawStippledBlush(ctx, cx, cy, rx, ry, color, opts = {}) {
  const {
    intensity = 0.45,
    dotCount = 950,
    paperColor = '#fff7f3',
    paperFlecks = 0.25,
    rng = createRng(77),
  } = opts;

  ctx.save();

  // Very soft underlying radial tint
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
  grad.addColorStop(0, rgba(color, intensity * 0.55));
  grad.addColorStop(0.6, rgba(color, intensity * 0.22));
  grad.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stippled chalk grains
  for (let i = 0; i < dotCount; i++) {
    const ang = rng.range(0, Math.PI * 2);
    const dist = Math.abs(rng.gauss()) * 0.48;
    if (dist > 1.05) continue;
    const x = cx + Math.cos(ang) * rx * dist;
    const y = cy + Math.sin(ang) * ry * dist;
    const falloff = Math.max(0, 1 - dist);
    const isFleck = rng.chance(paperFlecks);
    ctx.fillStyle = rgba(
      isFleck ? paperColor : color,
      rng.range(0.08, intensity * 0.85) * (0.35 + falloff * 0.65)
    );
    const r = rng.range(0.6, 2.1);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Multi-bristle dry-brush ribbon along a cubic Bezier curve
 * Creates tapered ink/teal hair locks, fur tufts, painted waves, or leaves
 */
export function drawDryBrushRibbon(ctx, p0, p1, p2, p3, opts = {}) {
  const {
    widthStart = 28,
    widthEnd = 10,
    bristles = 26,
    color = '#0b0e12',
    highlightColor = '#126483',
    highlightChance = 0.28,
    dryness = 0.22,
    alpha = 0.88,
    rng = createRng(303),
  } = opts;

  ctx.save();
  ctx.lineCap = 'round';

  for (let b = 0; b < bristles; b++) {
    const u = bristles === 1 ? 0 : (b / (bristles - 1)) * 2 - 1; // -1..1
    const isHighlight = highlightColor && rng.chance(highlightChance);
    const col = isHighlight ? highlightColor : color;
    const steps = 22;

    let drawing = true;
    let prevPt = null;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const center = cubicPt(p0, p1, p2, p3, t);
      const tang = cubicTangent(p0, p1, p2, p3, t);
      const norm = [-tang[1], tang[0]];
      const w = widthStart + (widthEnd - widthStart) * t;
      const spread = u * w * 0.5 + rng.range(-1.4, 1.4) * (1 + t * 0.9);
      const pt = [center[0] + norm[0] * spread, center[1] + norm[1] * spread];

      // Dry-brush breakups especially near ends
      const gapChance = dryness * (0.3 + t * 0.95) * (0.4 + Math.abs(u) * 0.8);
      if (s > 1 && rng.chance(gapChance)) {
        drawing = false;
      } else if (!drawing && rng.chance(0.55)) {
        drawing = true;
      }

      if (drawing && prevPt) {
        const taper = 1 - t * 0.55;
        ctx.strokeStyle = rgba(col, alpha * rng.range(0.55, 1.0) * (1 - t * 0.18));
        ctx.lineWidth = Math.max(0.5, (w / bristles) * rng.range(1.1, 2.2) * taper);
        ctx.beginPath();
        ctx.moveTo(prevPt[0], prevPt[1]);
        ctx.lineTo(pt[0], pt[1]);
        ctx.stroke();
      }
      prevPt = pt;
    }
  }
  ctx.restore();
}

/**
 * Ultra-fine wispy ink/pencil line (stray hairs, whiskers, steam, botanical stems)
 */
export function drawWispyStrand(ctx, p0, p1, p2, p3, opts = {}) {
  const {
    widthStart = 1.4,
    widthEnd = 0.35,
    color = '#121518',
    alpha = 0.85,
    steps = 28,
    jitter = 0.4,
    rng = createRng(55),
  } = opts;

  ctx.save();
  ctx.lineCap = 'round';
  let prev = p0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const pt = cubicPt(p0, p1, p2, p3, t);
    pt[0] += rng.range(-jitter, jitter);
    pt[1] += rng.range(-jitter, jitter);
    ctx.strokeStyle = rgba(color, alpha * (1 - t * 0.35));
    ctx.lineWidth = Math.max(0.25, widthStart + (widthEnd - widthStart) * t);
    ctx.beginPath();
    ctx.moveTo(prev[0], prev[1]);
    ctx.lineTo(pt[0], pt[1]);
    ctx.stroke();
    prev = pt;
  }
  ctx.restore();
}

/**
 * Rough charcoal / crayon mark (eyebrows, rocky cliffs, dark accents)
 */
export function drawCharcoalMark(ctx, pts, opts = {}) {
  const {
    width = 16,
    color = '#14171a',
    alpha = 0.9,
    passes = 14,
    rng = createRng(19),
  } = opts;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let p = 0; p < passes; p++) {
    const offX = rng.range(-width * 0.25, width * 0.25);
    const offY = rng.range(-width * 0.28, width * 0.28);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i][0] + offX + rng.range(-2.2, 2.2);
      const y = pts[i][1] + offY + rng.range(-2.2, 2.2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(color, rng.range(alpha * 0.22, alpha * 0.58));
    ctx.lineWidth = rng.range(width * 0.22, width * 0.58);
    ctx.stroke();
  }

  // Grainy edge crumbles
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    for (let k = 0; k < 22; k++) {
      const t = rng.next();
      const x = a[0] + (b[0] - a[0]) * t + rng.range(-width * 0.5, width * 0.5);
      const y = a[1] + (b[1] - a[1]) * t + rng.range(-width * 0.5, width * 0.5);
      ctx.fillStyle = rgba(color, rng.range(0.15, 0.72));
      ctx.beginPath();
      ctx.arc(x, y, rng.range(0.5, 2.0), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Multi-pass sketchy pencil outline
 */
export function drawPencilOutline(ctx, pts, opts = {}) {
  const {
    color = '#2b2421',
    width = 1.6,
    alpha = 0.55,
    passes = 2,
    closed = false,
    rng = createRng(88),
  } = opts;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let p = 0; p < passes; p++) {
    const jPts = pts.map(([x, y]) => [x + rng.range(-1.3, 1.3), y + rng.range(-1.3, 1.3)]);
    if (closed) traceSmoothClosed(ctx, jPts);
    else traceSmoothOpen(ctx, jPts);
    ctx.strokeStyle = rgba(color, alpha * rng.range(0.6, 1.0));
    ctx.lineWidth = width * rng.range(0.7, 1.15);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Expressive storybook eye with irregular sclera, warm upper rim, textured iris & crisp catchlight
 */
export function drawGouacheEye(ctx, cx, cy, rx, ry, lookX = 0, lookY = 0, opts = {}) {
  const {
    irisColor = '#1c241e',
    irisRadius = 0.42,
    lidShadow = '#cfa092',
    rng = createRng(404),
  } = opts;

  // Sclera
  const scleraPts = organicEllipsePts(cx, cy, rx, ry, 0, 26, 0.03, rng);
  ctx.save();
  traceSmoothClosed(ctx, scleraPts);
  ctx.fillStyle = '#fcfbf9';
  ctx.fill();
  ctx.clip();

  // Soft warm inner shadow along top edge of eyeball
  const topGrad = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry * 0.25);
  topGrad.addColorStop(0, rgba(lidShadow, 0.45));
  topGrad.addColorStop(1, rgba(lidShadow, 0));
  ctx.fillStyle = topGrad;
  ctx.fillRect(cx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * 1.4);

  // Iris + pupil
  const ix = cx + lookX * rx * 0.36;
  const iy = cy + lookY * ry * 0.36;
  const ir = Math.min(rx, ry) * irisRadius;
  const irisPts = organicEllipsePts(ix, iy, ir, ir * 1.03, 0, 20, 0.035, rng);
  traceSmoothClosed(ctx, irisPts);
  ctx.fillStyle = irisColor;
  ctx.fill();

  // Subtle iris ring grain
  ctx.strokeStyle = rgba('#0b0e0d', 0.4);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner pupil
  ctx.fillStyle = '#090b0a';
  ctx.beginPath();
  ctx.arc(ix + lookX * 1.5, iy + lookY * 1.5, ir * 0.56, 0, Math.PI * 2);
  ctx.fill();

  // Crisp off-center catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ix - ir * 0.28, iy - ir * 0.32, Math.max(2.2, ir * 0.22), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Subtle organic upper lash/eyelid line
  ctx.save();
  ctx.strokeStyle = rgba('#3b2824', 0.55);
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 1, rx * 1.01, ry * 0.99, 0, Math.PI * 1.12, Math.PI * 1.88);
  ctx.stroke();
  ctx.restore();
}
