import {
  createRng,
  drawPaperBackground,
  fillPastelShape,
  fillStripedPastelShape,
  drawPainterlyTube,
  drawStippledBlush,
  drawWispyStrand,
  drawPencilOutline,
  organicEllipsePts,
  pointedLeafPts,
  traceSmoothClosed,
} from '../painter.js';

export const artwork = {
  id: '04-still-life-teatime',
  title: 'Quiet Morning Table',
  category: 'Editorial Still Life',
  medium: 'Colored pencil, chalk pastel & ink lines',
  palette: ['#186b8d', '#e3bf2d', '#6b3ea2', '#e86f34', '#7093b4', '#f6efe4'],
  draw(ctx, width, height, seed = 404) {
    const rng = createRng(seed);
    ctx.save();
    ctx.scale(width / 1200, height / 1200);

    drawPaperBackground(ctx, 1200, 1200, rng, '#fdfcfb');

    // --- 1. STRIPED LINEN TABLE RUNNER ---
    const clothPts = [
      [145, 760],
      [1055, 750],
      [1120, 1045],
      [85, 1055],
    ];
    fillStripedPastelShape(
      ctx,
      clothPts,
      [
        { color: '#f3ece0', altColor: '#e3d8c6', height: 68 },
        { color: '#6b3ea2', altColor: '#573087', height: 22 },
        { color: '#f3ece0', altColor: '#e3d8c6', height: 42 },
        { color: '#e3bf2d', altColor: '#c9a01a', height: 26 },
      ],
      {
        stripeAngle: -0.015,
        ribAngle: 0.03,
        ribDensity: 1.0,
        toothAmount: 0.55,
        rng,
      }
    );

    drawStippledBlush(ctx, 430, 845, 195, 42, '#4a3d52', {
      intensity: 0.28,
      dotCount: 700,
      paperFlecks: 0.15,
      rng,
    });
    drawStippledBlush(ctx, 795, 865, 130, 34, '#4a3d52', {
      intensity: 0.25,
      dotCount: 480,
      paperFlecks: 0.15,
      rng,
    });
    drawStippledBlush(ctx, 610, 945, 145, 34, '#4a3d52', {
      intensity: 0.25,
      dotCount: 480,
      paperFlecks: 0.15,
      rng,
    });

    // --- 2. SMALL CERAMIC BUD VASE & BOTANICAL STEMS (to left/behind teapot) ---
    drawWispyStrand(ctx, [238, 560], [218, 430], [200, 305], [190, 200], {
      widthStart: 3.4,
      widthEnd: 1.0,
      color: '#2e2724',
      alpha: 0.82,
      rng,
    });
    drawWispyStrand(ctx, [245, 560], [285, 445], [335, 345], [385, 255], {
      widthStart: 2.8,
      widthEnd: 0.9,
      color: '#2e2724',
      alpha: 0.78,
      rng,
    });
    const branchLeaves = [
      { cx: 205, cy: 325, rx: 22, ry: 52, rot: -0.45, col: '#2b6b66', alt: '#194744' },
      { cx: 192, cy: 222, rx: 19, ry: 44, rot: -0.15, col: '#e3bf2d', alt: '#c2981b' },
      { cx: 328, cy: 365, rx: 21, ry: 48, rot: 0.55, col: '#2b6b66', alt: '#194744' },
      { cx: 376, cy: 278, rx: 18, ry: 42, rot: 0.42, col: '#e3bf2d', alt: '#c2981b' },
    ];
    for (const lf of branchLeaves) {
      const pts = pointedLeafPts(lf.cx, lf.cy, lf.rx, lf.ry, lf.rot, 24, rng);
      fillPastelShape(ctx, pts, {
        baseColor: lf.col,
        altColor: lf.alt,
        highlightColor: '#f6e188',
        toothAmount: 0.45,
        edgeRoughness: 0.75,
        sharp: true,
        rng,
      });
    }

    // Small stoneware bud vase tucked left of teapot
    const vasePts = [
      [212, 558],
      [268, 558],
      [292, 650],
      [280, 745],
      [198, 745],
      [188, 650],
    ];
    fillPastelShape(ctx, vasePts, {
      baseColor: '#d97654',
      altColor: '#b34f32',
      highlightColor: '#f0a684',
      toothAmount: 0.38,
      rng,
    });

    // --- 3. COZY TEAL-COBALT TEAPOT ---
    // Solid glazed teapot handle
    drawPainterlyTube(ctx, [298, 560], [182, 548], [178, 745], [308, 755], {
      widthStart: 25,
      widthEnd: 24,
      baseColor: '#145875',
      altColor: '#0c3a4f',
      highlightColor: '#4da3c2',
      toothAmount: 0.35,
      rng,
    });

    // Teapot Spout
    const spoutPts = [
      [535, 625],
      [632, 572],
      [664, 504],
      [702, 514],
      [655, 635],
      [548, 718],
    ];
    fillPastelShape(ctx, spoutPts, {
      baseColor: '#176788',
      altColor: '#0e4761',
      highlightColor: '#52a7c4',
      toothAmount: 0.4,
      rng,
    });

    // Teapot Belly
    const potPts = organicEllipsePts(432, 675, 165, 148, -0.02, 36, 0.03, rng);
    fillPastelShape(ctx, potPts, {
      baseColor: '#186b8d',
      altColor: '#0f4964',
      highlightColor: '#66b5ce',
      shadowColor: '#092f42',
      angle: Math.PI * 0.42,
      grainDensity: 1.15,
      toothAmount: 0.42,
      edgeRoughness: 0.95,
      rng,
    });

    // Mustard stripe clipped cleanly inside teapot belly so it wraps edge-to-edge
    ctx.save();
    traceSmoothClosed(ctx, potPts);
    ctx.clip();
    const bandPts = [];
    for (let s = 0; s <= 12; s++) {
      const t = s / 12;
      bandPts.push([250 + 365 * t, 656 + Math.sin(t * Math.PI) * 24]);
    }
    for (let s = 12; s >= 0; s--) {
      const t = s / 12;
      bandPts.push([250 + 365 * t, 710 + Math.sin(t * Math.PI) * 24]);
    }
    fillPastelShape(ctx, bandPts, {
      baseColor: '#e3bf2d',
      altColor: '#c79f1a',
      highlightColor: '#f7de74',
      toothAmount: 0.4,
      edgeRoughness: 0.6,
      sharp: true,
      rng,
    });
    ctx.restore();

    drawStippledBlush(ctx, 368, 608, 48, 32, '#8ed2e5', {
      intensity: 0.42,
      dotCount: 380,
      paperFlecks: 0.12,
      rng,
    });

    const lidPts = organicEllipsePts(432, 530, 82, 26, 0, 24, 0.04, rng);
    fillPastelShape(ctx, lidPts, {
      baseColor: '#1f799c',
      altColor: '#114d68',
      highlightColor: '#76c2d8',
      toothAmount: 0.35,
      rng,
    });
    const knobPts = organicEllipsePts(432, 495, 24, 20, 0, 18, 0.05, rng);
    fillPastelShape(ctx, knobPts, {
      baseColor: '#e3bf2d',
      altColor: '#c19617',
      highlightColor: '#fae37b',
      toothAmount: 0.3,
      rng,
    });

    // --- 4. STRIPED PORCELAIN MUG & STEAM ---
    drawPainterlyTube(ctx, [860, 688], [944, 684], [940, 796], [855, 796], {
      widthStart: 20,
      widthEnd: 19,
      baseColor: '#7093b4',
      altColor: '#4f7091',
      highlightColor: '#b5cde2',
      toothAmount: 0.35,
      rng,
    });

    const mugPts = [
      [718, 648],
      [872, 648],
      [860, 848],
      [730, 848],
    ];
    fillStripedPastelShape(
      ctx,
      mugPts,
      [
        { color: '#faf7f1', altColor: '#e6dfd3', height: 24 },
        { color: '#7093b4', altColor: '#567899', height: 23 },
      ],
      { stripeCurve: 5, ribDensity: 1.0, toothAmount: 0.48, sharp: false, rng }
    );

    // Cream porcelain lip + coffee recessed inside
    const rimOuter = organicEllipsePts(795, 650, 72, 16, 0, 24, 0.025, rng);
    fillPastelShape(ctx, rimOuter, {
      baseColor: '#faf7f1',
      altColor: '#dfd7ca',
      highlightColor: '#ffffff',
      toothAmount: 0.25,
      edgeRoughness: 0.7,
      rng,
    });
    const coffeePts = organicEllipsePts(795, 651, 58, 11, 0, 22, 0.025, rng);
    fillPastelShape(ctx, coffeePts, {
      baseColor: '#4a2b1d',
      altColor: '#2d180f',
      highlightColor: '#7b4f3a',
      toothAmount: 0.2,
      edgeRoughness: 0.5,
      rng,
    });

    drawWispyStrand(ctx, [778, 610], [748, 530], [805, 455], [765, 375], {
      widthStart: 3.5,
      widthEnd: 0.8,
      color: '#9c9690',
      alpha: 0.55,
      rng,
    });
    drawWispyStrand(ctx, [815, 595], [848, 520], [795, 440], [835, 355], {
      widthStart: 3.2,
      widthEnd: 0.7,
      color: '#a8a29c',
      alpha: 0.48,
      rng,
    });

    // --- 5. CERAMIC PLATE & BERRY LEMON TART SLICE ---
    const platePts = organicEllipsePts(605, 918, 148, 46, 0.02, 32, 0.03, rng);
    fillPastelShape(ctx, platePts, {
      baseColor: '#faf7f1',
      altColor: '#dcd4c8',
      highlightColor: '#ffffff',
      toothAmount: 0.35,
      edgeRoughness: 0.85,
      rng,
    });
    drawPencilOutline(ctx, organicEllipsePts(605, 918, 125, 35, 0.02, 28, 0.02, rng), {
      color: '#7093b4',
      width: 2.2,
      alpha: 0.6,
      closed: true,
      rng,
    });

    const cakePts = [
      [524, 888],
      [682, 868],
      [682, 918],
      [524, 926],
    ];
    fillPastelShape(ctx, cakePts, {
      baseColor: '#efca6e',
      altColor: '#d9a73b',
      highlightColor: '#fae4a4',
      toothAmount: 0.45,
      sharp: true,
      rng,
    });
    const icingPts = [
      [520, 888],
      [626, 822],
      [684, 868],
      [524, 892],
    ];
    fillPastelShape(ctx, icingPts, {
      baseColor: '#6d40a4',
      altColor: '#522b83',
      highlightColor: '#a27ad2',
      toothAmount: 0.38,
      sharp: true,
      rng,
    });
    const berryPts = organicEllipsePts(622, 820, 18, 16, 0.1, 18, 0.06, rng);
    fillPastelShape(ctx, berryPts, {
      baseColor: '#df5962',
      altColor: '#b83944',
      highlightColor: '#f69aa0',
      toothAmount: 0.25,
      rng,
    });

    // --- 6. TWO RIPE PERSIMMONS / MANDARINS ---
    const drawFruit = (fx, fy, fr) => {
      const fPts = organicEllipsePts(fx, fy, fr, fr * 0.9, 0.06, 26, 0.04, rng);
      fillPastelShape(ctx, fPts, {
        baseColor: '#e86f34',
        altColor: '#c94c1b',
        highlightColor: '#f9a76c',
        toothAmount: 0.36,
        edgeRoughness: 0.9,
        rng,
      });
      drawStippledBlush(ctx, fx - fr * 0.2, fy - fr * 0.12, fr * 0.52, fr * 0.45, '#d94842', {
        intensity: 0.48,
        dotCount: 420,
        paperFlecks: 0.18,
        rng,
      });
      drawPencilOutline(
        ctx,
        [
          [fx - 12, fy - fr * 0.72],
          [fx, fy - fr * 0.65],
          [fx + 14, fy - fr * 0.74],
        ],
        { color: '#2b5944', width: 3.5, alpha: 0.85, rng }
      );
      drawWispyStrand(ctx, [fx, fy - fr * 0.68], [fx + 3, fy - fr * 0.92], [fx + 8, fy - 1.05 * fr], [fx + 14, fy - 1.12 * fr], {
        widthStart: 3.0,
        widthEnd: 1.2,
        color: '#3a2b22',
        rng,
      });
    };

    drawFruit(318, 905, 58);
    drawFruit(895, 920, 50);

    ctx.restore();
  },
};
