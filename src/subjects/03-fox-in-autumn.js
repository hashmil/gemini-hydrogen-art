import {
  createRng,
  drawPaperBackground,
  fillPastelShape,
  drawStippledBlush,
  drawDryBrushRibbon,
  drawWispyStrand,
  drawCharcoalMark,
  drawPencilOutline,
  drawGouacheEye,
  organicEllipsePts,
  pointedLeafPts,
  rgba,
} from '../painter.js';

export const artwork = {
  id: '03-fox-in-autumn',
  title: 'Fox in the Brambles',
  category: 'Woodland Wildlife',
  medium: 'Colored pencil, charcoal & dry-brush gouache',
  palette: ['#d96534', '#f8efe2', '#171b20', '#6b3ea2', '#e3bf2d', '#2b6764'],
  draw(ctx, width, height, seed = 303) {
    const rng = createRng(seed);
    ctx.save();
    ctx.scale(width / 1200, height / 1200);

    drawPaperBackground(ctx, 1200, 1200, rng, '#fdfcfb');

    // --- 1. BOTANICAL AUTUMN BRAMBLES & BERRIES (behind & framing fox) ---
    const stems = [
      [[240, 960], [185, 760], [190, 520], [260, 320]],
      [[945, 975], [995, 780], [985, 560], [910, 360]],
      [[275, 980], [235, 860], [220, 740], [175, 650]],
    ];
    for (const st of stems) {
      drawWispyStrand(ctx, st[0], st[1], st[2], st[3], {
        widthStart: 3.4,
        widthEnd: 1.0,
        color: '#342c28',
        alpha: 0.78,
        rng,
      });
    }

    // Pointed mustard & deep teal leaves along stems
    const twigLeaves = [
      { cx: 202, cy: 610, rx: 28, ry: 66, rot: -0.7, col: '#e0b82d', alt: '#b88d17' },
      { cx: 222, cy: 440, rx: 25, ry: 58, rot: -0.4, col: '#2b6764', alt: '#184443' },
      { cx: 265, cy: 350, rx: 22, ry: 50, rot: 0.2, col: '#e0b82d', alt: '#bf9219' },
      { cx: 965, cy: 685, rx: 28, ry: 68, rot: 0.65, col: '#2b6764', alt: '#194543' },
      { cx: 952, cy: 505, rx: 24, ry: 56, rot: 0.45, col: '#e0b82d', alt: '#bd9018' },
      { cx: 905, cy: 390, rx: 21, ry: 48, rot: -0.25, col: '#2b6764', alt: '#17403e' },
    ];
    for (const lf of twigLeaves) {
      const pts = pointedLeafPts(lf.cx, lf.cy, lf.rx, lf.ry, lf.rot, 24, rng);
      fillPastelShape(ctx, pts, {
        baseColor: lf.col,
        altColor: lf.alt,
        highlightColor: '#f6e186',
        angle: lf.rot,
        grainDensity: 1.1,
        toothAmount: 0.48,
        edgeRoughness: 0.75,
        sharp: true,
        rng,
      });
    }

    // Purple berries clusters
    const berries = [
      [182, 665, 16],
      [162, 694, 13],
      [205, 695, 14],
      [982, 610, 17],
      [1008, 636, 14],
      [964, 642, 13],
      [238, 395, 15],
      [212, 412, 12],
    ];
    for (const [bx, by, br] of berries) {
      const bPts = organicEllipsePts(bx, by, br, br * 1.04, 0, 16, 0.06, rng);
      fillPastelShape(ctx, bPts, {
        baseColor: '#6b3ea2',
        altColor: '#4c267a',
        highlightColor: '#a882d6',
        toothAmount: 0.25,
        rng,
      });
    }

    // --- 2. FOX BODY ---
    const bodyPts = [
      [485, 595],
      [685, 600],
      [785, 765],
      [765, 995],
      [425, 995],
      [395, 815],
      [428, 660],
    ];
    fillPastelShape(ctx, bodyPts, {
      baseColor: '#d96534',
      altColor: '#b7471e',
      highlightColor: '#f0945d',
      shadowColor: '#8d2f11',
      angle: Math.PI * 0.45,
      grainDensity: 1.1,
      toothAmount: 0.4,
      edgeRoughness: 1.15,
      rng,
    });

    // Cream chest fluff
    const chestPts = [
      [495, 628],
      [620, 628],
      [648, 810],
      [562, 910],
      [468, 815],
    ];
    fillPastelShape(ctx, chestPts, {
      baseColor: '#f8efe2',
      altColor: '#e4d5c0',
      highlightColor: '#ffffff',
      angle: Math.PI * 0.5,
      grainDensity: 1.0,
      toothAmount: 0.35,
      edgeRoughness: 1.1,
      rng,
    });

    // Charcoal front paws
    for (const px of [490, 608]) {
      const legPts = [
        [px - 22, 845],
        [px + 24, 845],
        [px + 28, 992],
        [px - 26, 992],
      ];
      fillPastelShape(ctx, legPts, {
        baseColor: '#15191e',
        altColor: '#124658',
        highlightColor: '#2e5d6b',
        toothAmount: 0.2,
        rng,
      });
    }

    // --- 3. HUGE CURLING BUSHY TAIL WITH POINTED CREAM TIP ---
    const tailPts = [
      [740, 825],
      [875, 855],
      [882, 975],
      [735, 1045],
      [538, 1055],
      [352, 1018],
      [252, 875],
      [355, 842],
      [525, 905],
      [682, 918],
    ];
    fillPastelShape(ctx, tailPts, {
      baseColor: '#de6b38',
      altColor: '#b9481f',
      highlightColor: '#f49962',
      angle: 0.15,
      grainDensity: 1.15,
      toothAmount: 0.42,
      edgeRoughness: 1.15,
      rng,
    });

    // Tapered pointed cream tail tip
    const tailTipPts = [
      [368, 848],
      [448, 886],
      [432, 978],
      [348, 1002],
      [268, 932],
      [234, 854],
      [296, 848],
    ];
    fillPastelShape(ctx, tailTipPts, {
      baseColor: '#f8efe2',
      altColor: '#e5d4be',
      highlightColor: '#ffffff',
      toothAmount: 0.35,
      edgeRoughness: 0.9,
      sharp: true,
      rng,
    });
    // Tapered dry-brush fur wisps on tail tip
    drawWispyStrand(ctx, [275, 880], [248, 862], [225, 846], [206, 834], {
      widthStart: 2.6,
      widthEnd: 0.4,
      color: '#e5d4be',
      rng,
    });
    drawWispyStrand(ctx, [280, 902], [250, 882], [228, 868], [214, 860], {
      widthStart: 2.2,
      widthEnd: 0.4,
      color: '#f8efe2',
      rng,
    });

    // Dry-brush fur tufts along tail curve
    drawDryBrushRibbon(ctx, [650, 955], [530, 978], [435, 945], [345, 895], {
      widthStart: 32,
      widthEnd: 18,
      bristles: 18,
      color: '#d96534',
      highlightColor: '#f5a570',
      highlightChance: 0.42,
      dryness: 0.26,
      rng,
    });

    // --- 4. CRISP POINTED TRIANGULAR FOX EARS ---
    const leftEar = [
      [372, 365],
      [338, 240],
      [318, 138],
      [412, 198],
      [498, 258],
    ];
    const rightEar = [
      [628, 258],
      [722, 196],
      [818, 138],
      [792, 242],
      [755, 368],
    ];
    for (const ear of [leftEar, rightEar]) {
      fillPastelShape(ctx, ear, {
        baseColor: '#d96534',
        altColor: '#b4431b',
        highlightColor: '#f2955e',
        toothAmount: 0.38,
        edgeRoughness: 0.9,
        sharp: true,
        rng,
      });
    }
    fillPastelShape(
      ctx,
      [
        [340, 232],
        [318, 138],
        [406, 198],
      ],
      { baseColor: '#15191e', altColor: '#134a5d', toothAmount: 0.18, sharp: true, rng }
    );
    fillPastelShape(
      ctx,
      [
        [726, 196],
        [818, 138],
        [794, 234],
      ],
      { baseColor: '#15191e', altColor: '#134a5d', toothAmount: 0.18, sharp: true, rng }
    );
    fillPastelShape(
      ctx,
      [
        [388, 342],
        [365, 218],
        [466, 275],
      ],
      { baseColor: '#f7ead9', altColor: '#e69f8f', toothAmount: 0.35, sharp: true, rng }
    );
    fillPastelShape(
      ctx,
      [
        [660, 274],
        [765, 218],
        [738, 344],
      ],
      { baseColor: '#f7ead9', altColor: '#e69f8f', toothAmount: 0.35, sharp: true, rng }
    );

    // --- 5. WIDE STYLIZED FOX HEAD & CREAM CHEEKS ---
    const headPts = [
      [564, 245],
      [698, 270],
      [788, 385],
      [832, 488],
      [718, 578],
      [564, 628],
      [410, 578],
      [298, 488],
      [342, 382],
      [430, 270],
    ];
    fillPastelShape(ctx, headPts, {
      baseColor: '#de6a37',
      altColor: '#b9481f',
      highlightColor: '#f39860',
      angle: Math.PI * 0.42,
      grainDensity: 1.15,
      toothAmount: 0.4,
      edgeRoughness: 1.2,
      rng,
    });

    // Cream cheek ruffs
    const leftCheekPts = [
      [312, 488],
      [432, 448],
      [534, 522],
      [564, 624],
      [415, 586],
      [342, 535],
    ];
    const rightCheekPts = [
      [818, 488],
      [698, 448],
      [594, 522],
      [564, 624],
      [714, 586],
      [788, 535],
    ];
    for (const cPts of [leftCheekPts, rightCheekPts]) {
      fillPastelShape(ctx, cPts, {
        baseColor: '#f8efe2',
        altColor: '#e7d7c2',
        highlightColor: '#ffffff',
        toothAmount: 0.32,
        edgeRoughness: 1.1,
        rng,
      });
    }

    // Stippled rosy cheeks!
    drawStippledBlush(ctx, 412, 514, 52, 34, '#e06b6b', {
      intensity: 0.56,
      dotCount: 720,
      paperFlecks: 0.24,
      rng,
    });
    drawStippledBlush(ctx, 718, 514, 52, 34, '#e06b6b', {
      intensity: 0.56,
      dotCount: 720,
      paperFlecks: 0.24,
      rng,
    });

    // --- 6. EYES, CHARCOAL NOSE & WHISKERS ---
    drawGouacheEye(ctx, 468, 415, 44, 43, 0.16, -0.06, {
      irisColor: '#231e19',
      irisRadius: 0.44,
      lidShadow: '#b95932',
      rng,
    });
    drawGouacheEye(ctx, 662, 415, 44, 43, 0.16, -0.06, {
      irisColor: '#231e19',
      irisRadius: 0.44,
      lidShadow: '#b95932',
      rng,
    });

    // Soft charcoal brows
    drawCharcoalMark(ctx, [[428, 348], [468, 340], [505, 350]], {
      width: 11,
      color: '#2c1e18',
      alpha: 0.72,
      passes: 8,
      rng,
    });
    drawCharcoalMark(ctx, [[625, 350], [664, 340], [704, 348]], {
      width: 11,
      color: '#2c1e18',
      alpha: 0.72,
      passes: 8,
      rng,
    });

    // Shiny charcoal button nose
    const nosePts = organicEllipsePts(564, 542, 22, 16, 0, 18, 0.06, rng);
    fillPastelShape(ctx, nosePts, {
      baseColor: '#15181c',
      altColor: '#2a3138',
      highlightColor: '#5c6670',
      toothAmount: 0.12,
      rng,
    });
    ctx.fillStyle = rgba('#ffffff', 0.75);
    ctx.beginPath();
    ctx.ellipse(558, 536, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Small gentle smile
    drawPencilOutline(
      ctx,
      [
        [542, 574],
        [564, 584],
        [586, 574],
      ],
      { color: '#2b201c', width: 3.0, alpha: 0.75, passes: 2, rng }
    );

    // Fine whisker strokes & stray head tufts
    for (const yOff of [-10, 6, 22]) {
      drawWispyStrand(ctx, [462, 542 + yOff], [375, 535 + yOff], [305, 548 + yOff], [248, 566 + yOff], {
        widthStart: 1.8,
        widthEnd: 0.4,
        color: '#2a2320',
        alpha: 0.72,
        rng,
      });
      drawWispyStrand(ctx, [666, 542 + yOff], [755, 535 + yOff], [825, 548 + yOff], [882, 566 + yOff], {
        widthStart: 1.8,
        widthEnd: 0.4,
        color: '#2a2320',
        alpha: 0.72,
        rng,
      });
    }
    drawWispyStrand(ctx, [562, 250], [556, 222], [548, 198], [536, 182], {
      widthStart: 2.2,
      widthEnd: 0.4,
      color: '#b4431b',
      rng,
    });
    drawWispyStrand(ctx, [572, 252], [584, 224], [594, 204], [608, 192], {
      widthStart: 1.8,
      widthEnd: 0.4,
      color: '#d96534',
      rng,
    });

    ctx.restore();
  },
};
