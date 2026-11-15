import {
  createRng,
  drawPaperBackground,
  fillPastelShape,
  drawStippledBlush,
  drawDryBrushRibbon,
  drawWispyStrand,
  drawPencilOutline,
  organicEllipsePts,
  traceSmoothClosed,
} from '../painter.js';

export const artwork = {
  id: '06-botanical-koi-pond',
  title: 'Lantern Pond',
  category: 'Botanical & Aquatic',
  medium: 'Dry-brush gouache, colored pencil & chalk pastel',
  palette: ['#186b8d', '#e46338', '#faf3e8', '#141920', '#2b6b66', '#df6968'],
  draw(ctx, width, height, seed = 606) {
    const rng = createRng(seed);
    ctx.save();
    ctx.scale(width / 1200, height / 1200);

    drawPaperBackground(ctx, 1200, 1200, rng, '#fdfcfb');

    // --- 1. CIRCULAR POND WATER VIGNETTE ---
    const pondPts = organicEllipsePts(600, 600, 445, 435, 0.1, 48, 0.035, rng);
    fillPastelShape(ctx, pondPts, {
      baseColor: '#75a3b6',
      altColor: '#1b6e8e',
      highlightColor: '#c9e2eb',
      shadowColor: '#0e4961',
      angle: Math.PI * 0.35,
      grainDensity: 0.95,
      toothAmount: 0.45,
      edgeRoughness: 1.25,
      rng,
    });

    // Dry-brush swirling currents
    drawDryBrushRibbon(ctx, [295, 495], [420, 315], [715, 290], [875, 445], {
      widthStart: 22,
      widthEnd: 12,
      bristles: 14,
      color: '#196c8c',
      highlightColor: '#b7dce8',
      highlightChance: 0.45,
      dryness: 0.32,
      alpha: 0.52,
      rng,
    });
    drawDryBrushRibbon(ctx, [895, 695], [760, 885], [465, 905], [305, 745], {
      widthStart: 22,
      widthEnd: 12,
      bristles: 14,
      color: '#135773',
      highlightColor: '#b7dce8',
      highlightChance: 0.45,
      dryness: 0.32,
      alpha: 0.52,
      rng,
    });

    // Sketchy pencil water ripples
    for (const [rx, ry, rr] of [
      [445, 420, 75],
      [765, 745, 84],
      [615, 595, 115],
    ]) {
      drawPencilOutline(ctx, organicEllipsePts(rx, ry, rr, rr * 0.92, 0.2, 26, 0.03, rng), {
        color: '#eff8fb',
        width: 2.0,
        alpha: 0.48,
        closed: true,
        rng,
      });
    }

    // --- 2. HELPER FOR KOI FISH ---
    const drawKoi = (pts, finPolys, spots, opts) => {
      const { baseColor, altColor, highlightColor, finColor, finAlt, eyePos, barbels } = opts;

      // Veil pectoral & forked caudal fins behind body
      for (const fPoly of finPolys) {
        fillPastelShape(ctx, fPoly, {
          baseColor: finColor,
          altColor: finAlt,
          highlightColor: '#fff9ed',
          toothAmount: 0.36,
          edgeRoughness: 0.7,
          sharp: true,
          rng,
        });
        // Delicate radiating fin rays from fin root toward outer tips
        const root = fPoly[0];
        for (let rIdx = 1; rIdx < fPoly.length - 1; rIdx++) {
          const tip = fPoly[rIdx];
          drawWispyStrand(
            ctx,
            root,
            [(root[0] + tip[0]) * 0.5, (root[1] + tip[1]) * 0.5],
            [tip[0] * 0.88 + root[0] * 0.12, tip[1] * 0.88 + root[1] * 0.12],
            tip,
            { widthStart: 1.5, widthEnd: 0.3, color: '#fff8ec', alpha: 0.55, rng }
          );
        }
      }

      // Main fish body
      fillPastelShape(ctx, pts, {
        baseColor,
        altColor,
        highlightColor,
        angle: Math.PI * 0.3,
        grainDensity: 1.1,
        toothAmount: 0.32,
        edgeRoughness: 0.9,
        rng,
      });

      // Koi spots clipped cleanly inside fish silhouette
      ctx.save();
      traceSmoothClosed(ctx, pts);
      ctx.clip();
      for (const sp of spots) {
        const sPts = organicEllipsePts(sp.x, sp.y, sp.rx, sp.ry, sp.rot, 16, 0.12, rng);
        fillPastelShape(ctx, sPts, {
          baseColor: sp.color,
          altColor: sp.alt || sp.color,
          toothAmount: 0.2,
          edgeRoughness: 0.5,
          rng,
        });
      }
      ctx.restore();

      // Tiny expressive eyes
      for (const [ex, ey] of eyePos) {
        ctx.fillStyle = '#141920';
        ctx.beginPath();
        ctx.arc(ex, ey, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex - 2, ey - 2, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Whiskered barbels
      for (const b of barbels) {
        drawWispyStrand(ctx, b[0], b[1], b[2], b[3], {
          widthStart: 2.0,
          widthEnd: 0.4,
          color: '#1b2026',
          alpha: 0.78,
          rng,
        });
      }
    };

    // KOI 1: Persimmon Orange & Charcoal
    drawKoi(
      [
        [435, 360],
        [545, 318],
        [635, 355],
        [605, 445],
        [495, 555],
        [415, 650],
        [365, 575],
        [375, 465],
      ],
      [
        // Left fanned pectoral fin
        [[462, 404], [385, 336], [306, 354], [326, 392], [358, 412], [418, 425]],
        // Right fanned pectoral fin
        [[538, 465], [625, 495], [648, 575], [608, 572], [576, 552], [520, 510]],
        // Forked veil caudal tail fin
        [[395, 608], [344, 712], [238, 762], [268, 694], [218, 682], [308, 616], [372, 575]],
      ],
      [
        { x: 525, y: 375, rx: 32, ry: 22, rot: 0.4, color: '#141920', alt: '#114459' },
        { x: 455, y: 495, rx: 24, ry: 18, rot: -0.5, color: '#141920', alt: '#114459' },
        { x: 575, y: 392, rx: 22, ry: 15, rot: 0.2, color: '#faf3e8', alt: '#e6dccd' },
      ],
      {
        baseColor: '#e46338',
        altColor: '#c4451d',
        highlightColor: '#f7a169',
        finColor: '#e9c846',
        finAlt: '#c9a11e',
        eyePos: [
          [556, 336],
          [608, 378],
        ],
        barbels: [
          [[605, 338], [635, 320], [658, 308], [678, 308]],
          [[622, 356], [655, 354], [682, 358], [698, 368]],
        ],
      }
    );

    // KOI 2: Cream & Indigo/Violet
    drawKoi(
      [
        [745, 835],
        [635, 875],
        [548, 838],
        [578, 748],
        [688, 638],
        [765, 545],
        [818, 618],
        [808, 730],
      ],
      [
        [[718, 788], [795, 855], [872, 835], [852, 796], [822, 778], [762, 765]],
        [[644, 725], [556, 695], [534, 615], [574, 618], [608, 638], [660, 682]],
        [[788, 582], [842, 478], [948, 430], [918, 498], [968, 512], [878, 578], [812, 618]],
      ],
      [
        { x: 662, y: 818, rx: 32, ry: 22, rot: 0.4, color: '#17698b', alt: '#0f475f' },
        { x: 735, y: 698, rx: 26, ry: 18, rot: -0.5, color: '#6b3ea2', alt: '#4b2678' },
        { x: 608, y: 798, rx: 20, ry: 14, rot: 0.2, color: '#e46338', alt: '#c4451d' },
      ],
      {
        baseColor: '#faf3e8',
        altColor: '#dfd3c1',
        highlightColor: '#ffffff',
        finColor: '#8baac6',
        finAlt: '#5f82a3',
        eyePos: [
          [626, 858],
          [574, 816],
        ],
        barbels: [
          [[578, 856], [548, 874], [524, 886], [504, 886]],
          [[560, 838], [528, 840], [500, 836], [484, 826]],
        ],
      }
    );

    // --- 3. NOTCHED LILY PADS ---
    const drawLilyPad = (cx, cy, r, notchAngle, col, alt) => {
      const pts = [];
      const n = 26;
      for (let i = 0; i < n; i++) {
        const a = notchAngle + 0.35 + (i / (n - 1)) * (Math.PI * 2 - 0.7);
        const wobble = 1 + 0.04 * Math.sin(a * 4);
        pts.push([cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble]);
      }
      pts.push([cx + Math.cos(notchAngle) * r * 0.12, cy + Math.sin(notchAngle) * r * 0.12]);
      fillPastelShape(ctx, pts, {
        baseColor: col,
        altColor: alt,
        highlightColor: '#7eb8a3',
        toothAmount: 0.4,
        edgeRoughness: 0.85,
        rng,
      });
      for (let v = 0; v < 5; v++) {
        const va = notchAngle + 0.8 + v * 0.95;
        drawWispyStrand(
          ctx,
          [cx, cy],
          [cx + Math.cos(va) * r * 0.35, cy + Math.sin(va) * r * 0.35],
          [cx + Math.cos(va) * r * 0.65, cy + Math.sin(va) * r * 0.65],
          [cx + Math.cos(va) * r * 0.82, cy + Math.sin(va) * r * 0.82],
          { widthStart: 1.6, widthEnd: 0.4, color: '#a8d5c2', alpha: 0.6, rng }
        );
      }
    };

    drawLilyPad(275, 330, 88, 0.6, '#2b6b66', '#194744');
    drawLilyPad(915, 865, 96, 3.8, '#2b6b66', '#194744');
    drawLilyPad(945, 330, 72, 2.5, '#3b7d70', '#21574e');
    drawLilyPad(265, 875, 76, 5.4, '#3b7d70', '#21574e');

    // --- 4. CORAL & CREAM LOTUS BLOOMS ---
    const drawLotus = (lx, ly, scale) => {
      drawStippledBlush(ctx, lx, ly, 65 * scale, 52 * scale, '#df6968', {
        intensity: 0.35,
        dotCount: 420,
        paperFlecks: 0.2,
        rng,
      });
      const petals = [
        { dx: -36, dy: 6, rx: 22, ry: 44, rot: -0.68, col: '#df6968', alt: '#bf4c4e' },
        { dx: 36, dy: 6, rx: 22, ry: 44, rot: 0.68, col: '#df6968', alt: '#bf4c4e' },
        { dx: -19, dy: -4, rx: 21, ry: 48, rot: -0.3, col: '#ec8b88', alt: '#cc605f' },
        { dx: 19, dy: -4, rx: 21, ry: 48, rot: 0.3, col: '#ec8b88', alt: '#cc605f' },
        { dx: 0, dy: -10, rx: 22, ry: 52, rot: 0, col: '#f7baba', alt: '#e07b7c' },
      ];
      for (const p of petals) {
        const pts = organicEllipsePts(
          lx + p.dx * scale,
          ly + p.dy * scale,
          p.rx * scale,
          p.ry * scale,
          p.rot,
          18,
          0.06,
          rng
        );
        fillPastelShape(ctx, pts, {
          baseColor: p.col,
          altColor: p.alt,
          highlightColor: '#fff0ef',
          toothAmount: 0.28,
          edgeRoughness: 0.75,
          rng,
        });
      }
      const centerPts = organicEllipsePts(lx, ly + 8 * scale, 16 * scale, 11 * scale, 0, 14, 0.06, rng);
      fillPastelShape(ctx, centerPts, {
        baseColor: '#e3bf2d',
        altColor: '#c99f18',
        highlightColor: '#fae37b',
        toothAmount: 0.2,
        rng,
      });
    };

    drawLotus(295, 295, 1.05);
    drawLotus(898, 845, 1.1);

    ctx.restore();
  },
};
