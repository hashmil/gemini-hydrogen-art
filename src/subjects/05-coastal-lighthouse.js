import {
  createRng,
  drawPaperBackground,
  fillPastelShape,
  fillStripedPastelShape,
  drawStippledBlush,
  drawDryBrushRibbon,
  drawWispyStrand,
  drawCharcoalMark,
  drawPencilOutline,
  organicEllipsePts,
  traceSmoothClosed,
} from '../painter.js';

export const artwork = {
  id: '05-coastal-lighthouse',
  title: 'Cliffside Beacon',
  category: 'Architecture & Landscape',
  medium: 'Dry-brush gouache, charcoal & colored pencil',
  palette: ['#df5d59', '#faf4e8', '#156c8e', '#141920', '#e3bf2d', '#6b3ea2'],
  draw(ctx, width, height, seed = 505) {
    const rng = createRng(seed);
    ctx.save();
    ctx.scale(width / 1200, height / 1200);

    drawPaperBackground(ctx, 1200, 1200, rng, '#fdfcfb');

    // --- 1. SOFT STIPPLED SUN HALO IN UPPER SKY ---
    drawStippledBlush(ctx, 305, 295, 115, 115, '#f2c557', {
      intensity: 0.45,
      dotCount: 1100,
      paperFlecks: 0.25,
      rng,
    });
    const sunPts = organicEllipsePts(305, 295, 58, 58, 0, 28, 0.04, rng);
    fillPastelShape(ctx, sunPts, {
      baseColor: '#f3ca58',
      altColor: '#e59d43',
      highlightColor: '#fdf2b8',
      toothAmount: 0.35,
      edgeRoughness: 0.9,
      rng,
    });

    // --- 2. ORGANIC SEA VIGNETTE & CLIPPED DRY-BRUSH WAVES ---
    const seaPts = organicEllipsePts(600, 938, 505, 138, 0, 44, 0.025, rng);
    fillPastelShape(ctx, seaPts, {
      baseColor: '#196d8e',
      altColor: '#104963',
      highlightColor: '#67b4cc',
      angle: 0.02,
      grainDensity: 1.1,
      toothAmount: 0.45,
      edgeRoughness: 0.95,
      rng,
    });

    ctx.save();
    traceSmoothClosed(ctx, seaPts);
    ctx.clip();
    for (let i = 0; i < 12; i++) {
      const wy = 830 + i * 21 + rng.range(-5, 5);
      const wx = 120 + (i % 3) * 60;
      drawDryBrushRibbon(
        ctx,
        [wx, wy],
        [wx + 240, wy - 12],
        [wx + 520, wy + 12],
        [1080, wy - 4],
        {
          widthStart: 16,
          widthEnd: 10,
          bristles: 14,
          color: i % 2 === 0 ? '#0d3f57' : '#2587aa',
          highlightColor: '#d7eef5',
          highlightChance: 0.35,
          dryness: 0.3,
          rng,
        }
      );
    }
    ctx.restore();

    // --- 3. LIGHTHOUSE TOWER (CORAL-RED & CREAM BANDS) ---
    drawStippledBlush(ctx, 645, 315, 185, 110, '#f3d058', {
      intensity: 0.38,
      dotCount: 950,
      paperFlecks: 0.22,
      rng,
    });

    const towerPts = [
      [590, 350],
      [700, 350],
      [744, 768],
      [546, 768],
    ];
    fillStripedPastelShape(
      ctx,
      towerPts,
      [
        { color: '#df5d59', altColor: '#bf413e', height: 84 },
        { color: '#faf4e8', altColor: '#e5dbc8', height: 84 },
      ],
      {
        stripeAngle: 0,
        ribAngle: Math.PI * 0.5,
        ribDensity: 1.25,
        toothAmount: 0.52,
        sharp: true,
        rng,
      }
    );

    // Subtle shadow down right side of cylinder
    drawStippledBlush(ctx, 706, 565, 30, 190, '#3b242c', {
      intensity: 0.22,
      dotCount: 420,
      paperFlecks: 0.12,
      rng,
    });

    // Lantern Gallery Balcony
    const galleryPts = [
      [564, 332],
      [726, 332],
      [722, 356],
      [568, 356],
    ];
    fillPastelShape(ctx, galleryPts, {
      baseColor: '#141920',
      altColor: '#12495e',
      toothAmount: 0.2,
      sharp: true,
      rng,
    });

    // Glowing Mustard Lantern Room
    const lanternPts = [
      [592, 260],
      [698, 260],
      [702, 332],
      [588, 332],
    ];
    fillPastelShape(ctx, lanternPts, {
      baseColor: '#f2ca46',
      altColor: '#e59d28',
      highlightColor: '#fff9cf',
      toothAmount: 0.28,
      sharp: true,
      rng,
    });
    for (const mx of [618, 645, 672]) {
      drawPencilOutline(ctx, [[mx, 260], [mx, 332]], {
        color: '#181c22',
        width: 3.4,
        alpha: 0.85,
        rng,
      });
    }

    // Lighthouse Cupola Dome & Finial
    const roofPts = [
      [575, 260],
      [610, 212],
      [645, 192],
      [680, 212],
      [715, 260],
    ];
    fillPastelShape(ctx, roofPts, {
      baseColor: '#141920',
      altColor: '#145169',
      highlightColor: '#3d86a1',
      toothAmount: 0.2,
      sharp: true,
      rng,
    });
    drawWispyStrand(ctx, [645, 194], [645, 165], [645, 145], [645, 128], {
      widthStart: 4.0,
      widthEnd: 1.5,
      color: '#141920',
      rng,
    });

    // --- 4. KEEPER'S COTTAGE BESIDE TOWER ---
    // Tiny chimney
    fillPastelShape(
      ctx,
      [
        [388, 565],
        [416, 565],
        [416, 635],
        [388, 635],
      ],
      { baseColor: '#df5d59', altColor: '#b93f3c', toothAmount: 0.3, sharp: true, rng }
    );
    drawWispyStrand(ctx, [402, 558], [392, 520], [412, 490], [398, 455], {
      widthStart: 3.0,
      widthEnd: 0.8,
      color: '#a39d96',
      alpha: 0.55,
      rng,
    });

    const cottageWallPts = [
      [355, 648],
      [555, 648],
      [555, 775],
      [355, 775],
    ];
    fillPastelShape(ctx, cottageWallPts, {
      baseColor: '#faf4e8',
      altColor: '#e3d9c6',
      highlightColor: '#ffffff',
      toothAmount: 0.42,
      sharp: true,
      rng,
    });
    const cottageRoofPts = [
      [332, 652],
      [455, 572],
      [574, 652],
    ];
    fillPastelShape(ctx, cottageRoofPts, {
      baseColor: '#6b3ea2',
      altColor: '#4e287c',
      highlightColor: '#9c72cd',
      toothAmount: 0.35,
      sharp: true,
      rng,
    });
    fillPastelShape(
      ctx,
      [
        [395, 695],
        [442, 695],
        [442, 775],
        [395, 775],
      ],
      { baseColor: '#df5d59', altColor: '#b93f3c', toothAmount: 0.3, sharp: true, rng }
    );
    fillPastelShape(
      ctx,
      [
        [478, 690],
        [524, 690],
        [524, 738],
        [478, 738],
      ],
      { baseColor: '#f2ca46', altColor: '#d9a422', highlightColor: '#fff6be', toothAmount: 0.25, sharp: true, rng }
    );

    // --- 5. RUGGED CHARCOAL & TEAL CLIFF ---
    const cliffPts = [
      [182, 928],
      [218, 862],
      [268, 818],
      [318, 772],
      [560, 766],
      [748, 764],
      [818, 788],
      [872, 836],
      [932, 882],
      [958, 926],
      [815, 948],
      [585, 942],
      [335, 948],
    ];
    fillPastelShape(ctx, cliffPts, {
      baseColor: '#171c23',
      altColor: '#144c63',
      highlightColor: '#2c7e9c',
      angle: Math.PI * 0.35,
      grainDensity: 1.2,
      toothAmount: 0.25,
      edgeRoughness: 0.95,
      sharp: true,
      rng,
    });

    drawCharcoalMark(ctx, [[320, 770], [450, 766], [560, 766]], {
      width: 14,
      color: '#2e6b5e',
      alpha: 0.8,
      passes: 8,
      rng,
    });
    drawCharcoalMark(ctx, [[720, 764], [790, 774], [848, 804]], {
      width: 14,
      color: '#2e6b5e',
      alpha: 0.8,
      passes: 8,
      rng,
    });

    // Horizontal sea foam strokes along shoreline base
    drawDryBrushRibbon(ctx, [215, 938], [320, 948], [460, 942], [585, 946], {
      widthStart: 12,
      widthEnd: 7,
      bristles: 10,
      color: '#f2f7f9',
      highlightColor: '#ffffff',
      highlightChance: 0.6,
      dryness: 0.35,
      alpha: 0.78,
      rng,
    });
    drawDryBrushRibbon(ctx, [640, 944], [745, 948], [855, 940], [955, 926], {
      widthStart: 10,
      widthEnd: 12,
      bristles: 10,
      color: '#f2f7f9',
      highlightColor: '#ffffff',
      highlightChance: 0.6,
      dryness: 0.35,
      alpha: 0.78,
      rng,
    });

    // --- 6. SKETCHY SEAGULLS IN NEGATIVE SPACE ---
    const drawGull = (gx, gy, scale) => {
      drawWispyStrand(
        ctx,
        [gx - 38 * scale, gy + 8 * scale],
        [gx - 22 * scale, gy - 14 * scale],
        [gx - 6 * scale, gy - 12 * scale],
        [gx, gy],
        { widthStart: 1.8 * scale, widthEnd: 3.0 * scale, color: '#1b2026', rng }
      );
      drawWispyStrand(
        ctx,
        [gx, gy],
        [gx + 8 * scale, gy - 14 * scale],
        [gx + 26 * scale, gy - 16 * scale],
        [gx + 44 * scale, gy + 5 * scale],
        { widthStart: 3.0 * scale, widthEnd: 1.4 * scale, color: '#1b2026', rng }
      );
    };
    drawGull(855, 250, 1.15);
    drawGull(948, 305, 0.85);
    drawGull(808, 355, 0.72);
    drawGull(445, 215, 0.8);

    ctx.restore();
  },
};
