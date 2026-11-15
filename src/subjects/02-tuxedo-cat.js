import {
  createRng,
  drawPaperBackground,
  fillPastelShape,
  fillStripedPastelShape,
  drawPainterlyTube,
  drawStippledBlush,
  drawDryBrushRibbon,
  drawWispyStrand,
  drawCharcoalMark,
  drawPencilOutline,
  drawGouacheEye,
  organicEllipsePts,
  pointedLeafPts,
} from '../painter.js';

export const artwork = {
  id: '02-tuxedo-cat',
  title: 'Midnight Marmalade',
  category: 'Botanical Pet Portrait',
  medium: 'Dry-brush ink, colored pencil & chalk blush',
  palette: ['#0b0f14', '#166d8f', '#faf3e8', '#d96977', '#e3bf2d', '#6d40a4'],
  draw(ctx, width, height, seed = 202) {
    const rng = createRng(seed);
    ctx.save();
    ctx.scale(width / 1200, height / 1200);

    drawPaperBackground(ctx, 1200, 1200, rng, '#fdfcfb');

    // --- 1. BOTANICAL STEMS, POINTED LEAVES & TERRACOTTA POT ---
    const potStems = [
      [[875, 728], [855, 620], [818, 535], [790, 445]],
      [[885, 728], [888, 620], [885, 550], [880, 480]],
      [[895, 728], [918, 650], [935, 605], [945, 565]],
      [[385, 760], [320, 665], [275, 620], [245, 615]],
      [[395, 750], [350, 625], [322, 575], [300, 525]],
    ];
    for (const st of potStems) {
      drawWispyStrand(ctx, st[0], st[1], st[2], st[3], {
        widthStart: 4.5,
        widthEnd: 2.0,
        color: '#1b4744',
        alpha: 0.85,
        rng,
      });
    }

    const leafSpecs = [
      { cx: 880, cy: 480, rx: 46, ry: 125, rot: 0.42, col: '#2d6b66', alt: '#194946' },
      { cx: 945, cy: 565, rx: 42, ry: 112, rot: 0.85, col: '#3a7c70', alt: '#215750' },
      { cx: 790, cy: 430, rx: 38, ry: 108, rot: 0.14, col: '#245d5d', alt: '#133e40' },
      { cx: 245, cy: 615, rx: 38, ry: 102, rot: -0.58, col: '#2e6c67', alt: '#1a4946' },
      { cx: 300, cy: 525, rx: 32, ry: 95, rot: -0.26, col: '#408374', alt: '#255a51' },
    ];
    for (const lf of leafSpecs) {
      const pts = pointedLeafPts(lf.cx, lf.cy, lf.rx, lf.ry, lf.rot, 28, rng);
      fillPastelShape(ctx, pts, {
        baseColor: lf.col,
        altColor: lf.alt,
        highlightColor: '#6da894',
        angle: lf.rot + Math.PI * 0.5,
        grainDensity: 1.0,
        toothAmount: 0.45,
        edgeRoughness: 0.75,
        sharp: true,
        rng,
      });
      const vx = Math.sin(lf.rot) * lf.ry * 0.82;
      const vy = -Math.cos(lf.rot) * lf.ry * 0.82;
      drawWispyStrand(
        ctx,
        [lf.cx - vx, lf.cy - vy],
        [lf.cx - vx * 0.2, lf.cy - vy * 0.2],
        [lf.cx + vx * 0.3, lf.cy + vy * 0.3],
        [lf.cx + vx, lf.cy + vy],
        { widthStart: 2.2, widthEnd: 0.7, color: '#97c7b1', alpha: 0.65, rng }
      );
    }

    // Terracotta pot bottom right (crisp tapered ceramic pot silhouette)
    const potBodyPts = [
      [786, 768],
      [978, 768],
      [950, 1068],
      [938, 1082],
      [826, 1082],
      [814, 1068],
    ];
    fillPastelShape(ctx, potBodyPts, {
      baseColor: '#d16c49',
      altColor: '#b34f30',
      highlightColor: '#eb9a77',
      shadowColor: '#8d351d',
      angle: Math.PI * 0.52,
      grainDensity: 1.2,
      toothAmount: 0.48,
      edgeRoughness: 0.9,
      sharp: true,
      rng,
    });
    const potRimPts = [
      [766, 722],
      [998, 722],
      [992, 774],
      [772, 774],
    ];
    fillPastelShape(ctx, potRimPts, {
      baseColor: '#dd7854',
      altColor: '#bf5a39',
      highlightColor: '#f2a482',
      angle: 0.05,
      grainDensity: 1.15,
      toothAmount: 0.45,
      edgeRoughness: 0.85,
      sharp: true,
      rng,
    });

    // --- 2. PLUSH CURLED TAIL (solid fur core + dry-brush highlights) ---
    drawPainterlyTube(ctx, [365, 962], [218, 956], [168, 818], [242, 706], {
      widthStart: 56,
      widthEnd: 40,
      baseColor: '#090c10',
      altColor: '#104961',
      highlightColor: '#2587aa',
      toothAmount: 0.18,
      rng,
    });
    const tailTipPts = organicEllipsePts(248, 696, 26, 23, -0.5, 18, 0.08, rng);
    fillPastelShape(ctx, tailTipPts, {
      baseColor: '#faf3e8',
      altColor: '#e5dac9',
      highlightColor: '#ffffff',
      toothAmount: 0.3,
      edgeRoughness: 0.9,
      rng,
    });

    // --- 3. CAT BODY & TUXEDO BIB ---
    const bodyPts = [
      [425, 630],
      [675, 630],
      [765, 845],
      [742, 1110],
      [365, 1110],
      [338, 855],
    ];
    fillPastelShape(ctx, bodyPts, {
      baseColor: '#0b0e13',
      altColor: '#104961',
      highlightColor: '#1b7699',
      shadowColor: '#050709',
      angle: Math.PI * 0.48,
      grainDensity: 1.05,
      toothAmount: 0.16,
      edgeRoughness: 1.0,
      rng,
    });

    // Cream chest bib
    const bibPts = [
      [485, 675],
      [615, 675],
      [645, 895],
      [582, 1020],
      [518, 1020],
      [455, 895],
    ];
    fillPastelShape(ctx, bibPts, {
      baseColor: '#faf3e8',
      altColor: '#e6dccd',
      highlightColor: '#ffffff',
      angle: Math.PI * 0.5,
      grainDensity: 0.95,
      toothAmount: 0.35,
      edgeRoughness: 1.0,
      rng,
    });

    // Front paws
    for (const px of [465, 635]) {
      const pawPts = organicEllipsePts(px, 1085, 58, 36, 0, 22, 0.05, rng);
      fillPastelShape(ctx, pawPts, {
        baseColor: '#faf3e8',
        altColor: '#dfd3c3',
        highlightColor: '#ffffff',
        toothAmount: 0.3,
        rng,
      });
      drawPencilOutline(ctx, [[px - 16, 1072], [px - 14, 1114]], {
        color: '#6b6058',
        width: 2.2,
        alpha: 0.65,
        rng,
      });
      drawPencilOutline(ctx, [[px + 14, 1072], [px + 16, 1114]], {
        color: '#6b6058',
        width: 2.2,
        alpha: 0.65,
        rng,
      });
    }

    // --- 4. KNITTED MUSTARD & VIOLET SCARF ---
    const scarfTailPts = [
      [582, 668],
      [685, 678],
      [718, 862],
      [615, 878],
      [584, 765],
    ];
    fillStripedPastelShape(
      ctx,
      scarfTailPts,
      [
        { color: '#e3bf2d', altColor: '#c9a01a', height: 42 },
        { color: '#6b3ea2', altColor: '#542d85', height: 40 },
      ],
      { stripeAngle: 0.14, ribAngle: Math.PI * 0.52, ribDensity: 1.4, sharp: true, rng }
    );
    // Knit fringe tassels along bottom of scarf tail
    for (let f = 0; f < 6; f++) {
      const fx = 622 + f * 18;
      const fy = 876 - f * 2.6;
      drawWispyStrand(ctx, [fx, fy], [fx + 1, fy + 14], [fx + 3, fy + 26], [fx + 5, fy + 34], {
        widthStart: 3.4,
        widthEnd: 1.2,
        color: f % 2 === 0 ? '#e3bf2d' : '#6b3ea2',
        alpha: 0.9,
        rng,
      });
    }

    const scarfWrapPts = [
      [402, 595],
      [555, 620],
      [708, 592],
      [726, 688],
      [555, 712],
      [386, 685],
    ];
    fillStripedPastelShape(
      ctx,
      scarfWrapPts,
      [
        { color: '#6b3ea2', altColor: '#542d85', height: 34 },
        { color: '#e3bf2d', altColor: '#c9a01a', height: 34 },
      ],
      { stripeAngle: 0.04, stripeCurve: 8, ribAngle: Math.PI * 0.5, ribDensity: 1.5, rng }
    );

    // --- 5. POINTED CAT EARS ---
    const leftEarPts = [
      [365, 365],
      [345, 255],
      [338, 174],
      [415, 222],
      [485, 278],
    ];
    const rightEarPts = [
      [615, 278],
      [690, 220],
      [766, 172],
      [758, 258],
      [742, 368],
    ];
    for (const ear of [leftEarPts, rightEarPts]) {
      fillPastelShape(ctx, ear, {
        baseColor: '#0a0d12',
        altColor: '#135c79',
        highlightColor: '#217ea0',
        angle: Math.PI * 0.45,
        grainDensity: 1.0,
        toothAmount: 0.15,
        edgeRoughness: 0.85,
        sharp: true,
        rng,
      });
    }
    fillPastelShape(
      ctx,
      [
        [378, 338],
        [362, 222],
        [456, 290],
      ],
      { baseColor: '#e48583', altColor: '#ce6665', highlightColor: '#f6b8b6', toothAmount: 0.35, sharp: true, rng }
    );
    fillPastelShape(
      ctx,
      [
        [644, 288],
        [740, 220],
        [724, 340],
      ],
      { baseColor: '#e48583', altColor: '#ce6665', highlightColor: '#f6b8b6', toothAmount: 0.35, sharp: true, rng }
    );

    // --- 6. CAT HEAD & CREAM MUZZLE ---
    const headPts = [
      [552, 254],
      [675, 268],
      [764, 358],
      [778, 488],
      [712, 594],
      [554, 626],
      [395, 594],
      [332, 485],
      [348, 355],
      [432, 268],
    ];
    fillPastelShape(ctx, headPts, {
      baseColor: '#090c10',
      altColor: '#104e68',
      highlightColor: '#1e7b9e',
      angle: Math.PI * 0.44,
      grainDensity: 1.05,
      toothAmount: 0.16,
      edgeRoughness: 1.0,
      rng,
    });

    drawDryBrushRibbon(ctx, [368, 385], [336, 445], [342, 515], [392, 565], {
      widthStart: 20,
      widthEnd: 12,
      bristles: 16,
      color: '#0a0d12',
      highlightColor: '#2587aa',
      highlightChance: 0.58,
      rng,
    });
    drawDryBrushRibbon(ctx, [738, 385], [772, 445], [766, 515], [715, 565], {
      widthStart: 20,
      widthEnd: 12,
      bristles: 16,
      color: '#0a0d12',
      highlightColor: '#2587aa',
      highlightChance: 0.58,
      rng,
    });

    const muzzlePts = [
      [554, 388],
      [584, 465],
      [665, 502],
      [668, 578],
      [554, 616],
      [442, 578],
      [445, 502],
      [524, 465],
    ];
    fillPastelShape(ctx, muzzlePts, {
      baseColor: '#faf3e8',
      altColor: '#e9dece',
      highlightColor: '#ffffff',
      toothAmount: 0.28,
      edgeRoughness: 0.9,
      rng,
    });

    drawStippledBlush(ctx, 456, 526, 46, 36, '#e27476', {
      intensity: 0.55,
      dotCount: 680,
      paperFlecks: 0.22,
      rng,
    });
    drawStippledBlush(ctx, 650, 526, 46, 36, '#e27476', {
      intensity: 0.55,
      dotCount: 680,
      paperFlecks: 0.22,
      rng,
    });

    // --- 7. EYES, NOSE, MOUTH & WHISKERS ---
    drawGouacheEye(ctx, 464, 424, 45, 44, -0.22, -0.06, {
      irisColor: '#294024',
      irisRadius: 0.45,
      lidShadow: '#162730',
      rng,
    });
    drawGouacheEye(ctx, 644, 424, 45, 44, -0.22, -0.06, {
      irisColor: '#294024',
      irisRadius: 0.45,
      lidShadow: '#162730',
      rng,
    });

    drawCharcoalMark(ctx, [[420, 355], [464, 348], [502, 360]], {
      width: 11,
      color: '#1b7699',
      alpha: 0.52,
      passes: 9,
      rng,
    });
    drawCharcoalMark(ctx, [[606, 360], [648, 346], [688, 355]], {
      width: 11,
      color: '#1b7699',
      alpha: 0.52,
      passes: 9,
      rng,
    });

    const nosePts = [
      [534, 492],
      [574, 492],
      [564, 514],
      [554, 520],
      [544, 514],
    ];
    fillPastelShape(ctx, nosePts, {
      baseColor: '#df6b77',
      altColor: '#c34e5c',
      highlightColor: '#f7a5ae',
      toothAmount: 0.2,
      edgeRoughness: 0.6,
      rng,
    });

    ctx.save();
    ctx.strokeStyle = '#332826';
    ctx.lineWidth = 4.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(554, 520);
    ctx.lineTo(554, 540);
    ctx.moveTo(520, 548);
    ctx.quadraticCurveTo(537, 562, 554, 540);
    ctx.quadraticCurveTo(571, 562, 588, 548);
    ctx.stroke();
    ctx.restore();

    const whiskerLeft = [
      [[468, 518], [360, 495], [265, 492], [185, 505]],
      [[462, 534], [355, 532], [258, 542], [178, 565]],
      [[472, 550], [370, 568], [285, 595], [218, 628]],
    ];
    const whiskerRight = [
      [[640, 518], [748, 495], [842, 492], [925, 508]],
      [[646, 534], [755, 534], [855, 545], [938, 568]],
      [[636, 550], [738, 570], [824, 598], [892, 632]],
    ];
    for (const w of [...whiskerLeft, ...whiskerRight]) {
      drawWispyStrand(ctx, w[0], w[1], w[2], w[3], {
        widthStart: 2.1,
        widthEnd: 0.45,
        color: '#2d2927',
        alpha: 0.8,
        rng,
      });
    }
    drawWispyStrand(ctx, [362, 224], [342, 190], [326, 160], [312, 138], {
      widthStart: 2.0,
      widthEnd: 0.4,
      color: '#0e1318',
      rng,
    });
    drawWispyStrand(ctx, [742, 222], [766, 186], [782, 158], [798, 138], {
      widthStart: 2.0,
      widthEnd: 0.4,
      color: '#0e1318',
      rng,
    });

    ctx.restore();
  },
};
