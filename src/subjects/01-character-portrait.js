import {
  createRng,
  drawPaperBackground,
  fillPastelShape,
  fillStripedPastelShape,
  drawPainterlyTube,
  drawTaperedHairLock,
  drawStippledBlush,
  drawDryBrushRibbon,
  drawWispyStrand,
  drawCharcoalMark,
  drawPencilOutline,
  drawGouacheEye,
  organicEllipsePts,
} from '../painter.js';

export const artwork = {
  id: '01-character-portrait',
  title: 'The Moody Girl',
  category: 'Character Portrait',
  medium: 'Colored pencil, dry-brush ink & chalk pastel',
  palette: ['#0a0d11', '#14698a', '#f1c4b4', '#e3bf2d', '#6d40a4', '#df6b6a'],
  draw(ctx, width, height, seed = 101) {
    const rng = createRng(seed);
    ctx.save();
    ctx.scale(width / 1200, height / 1200);

    drawPaperBackground(ctx, 1200, 1200, rng, '#fdfcfb');

    // --- 1. CROWN & JAGGED TAPERED BACK HAIR CURTAINS ---
    // Upper crown base (tapers behind jaw/ears; bottom ends come from tapered hair locks)
    const crownBasePts = [
      [350, 215],
      [485, 130],
      [660, 125],
      [840, 200],
      [925, 395],
      [935, 690],
      [760, 740],
      [710, 680],
      [455, 685],
      [375, 760],
      [215, 720],
      [230, 395],
    ];
    fillPastelShape(ctx, crownBasePts, {
      baseColor: '#090c10',
      altColor: '#0e3c52',
      highlightColor: '#166f93',
      shadowColor: '#040608',
      angle: Math.PI * 0.51,
      grainDensity: 0.9,
      toothAmount: 0.14,
      edgeRoughness: 0.85,
      strokeAlpha: 0.34,
      rng,
    });

    // Left hair curtain: overlapping tapered locks with jagged feathered hair ends!
    const leftLocks = [
      { x0: 292, y0: 365, x1: 215, y1: 660, x2: 185, y2: 880, x3: 175, y3: 1035, w: 66 },
      { x0: 318, y0: 380, x1: 245, y1: 680, x2: 210, y2: 910, x3: 205, y3: 1110, w: 74 },
      { x0: 345, y0: 410, x1: 278, y1: 710, x2: 246, y2: 940, x3: 244, y3: 1142, w: 72 },
      { x0: 375, y0: 445, x1: 318, y1: 720, x2: 288, y2: 930, x3: 282, y3: 1098, w: 68 },
      { x0: 404, y0: 505, x1: 355, y1: 740, x2: 325, y2: 925, x3: 320, y3: 1070, w: 66 },
      { x0: 428, y0: 550, x1: 388, y1: 750, x2: 358, y2: 905, x3: 354, y3: 1030, w: 58 },
      { x0: 448, y0: 590, x1: 416, y1: 760, x2: 392, y2: 890, x3: 386, y3: 985, w: 52 },
      // Outer wisps on far left
      { x0: 268, y0: 385, x1: 192, y1: 635, x2: 162, y2: 830, x3: 148, y3: 975, w: 36 },
      { x0: 332, y0: 520, x1: 265, y1: 775, x2: 235, y2: 965, x3: 224, y3: 1126, w: 46 },
      { x0: 390, y0: 560, x1: 336, y1: 785, x2: 306, y2: 965, x3: 302, y3: 1112, w: 46 },
    ];
    for (let i = 0; i < leftLocks.length; i++) {
      const L = leftLocks[i];
      drawTaperedHairLock(ctx, [L.x0, L.y0], [L.x1, L.y1], [L.x2, L.y2], [L.x3, L.y3], {
        widthStart: L.w,
        baseColor: '#080b0e',
        altColor: '#0e475e',
        highlightColor: i % 2 === 0 ? '#156d8f' : '#2584a8',
        highlightChance: 0.45,
        tipWisps: 4,
        rng,
      });
    }

    // Right hair curtain: overlapping tapered locks with jagged feathered hair ends!
    const rightLocks = [
      { x0: 745, y0: 560, x1: 765, y1: 735, x2: 778, y2: 855, x3: 786, y3: 965, w: 54 },
      { x0: 775, y0: 510, x1: 805, y1: 710, x2: 820, y2: 865, x3: 822, y3: 1018, w: 66 },
      { x0: 806, y0: 460, x1: 842, y1: 690, x2: 860, y2: 875, x3: 858, y3: 1045, w: 72 },
      { x0: 836, y0: 410, x1: 880, y1: 670, x2: 896, y2: 865, x3: 894, y3: 1032, w: 70 },
      { x0: 864, y0: 375, x1: 912, y1: 650, x2: 932, y2: 840, x3: 928, y3: 992, w: 64 },
      { x0: 888, y0: 365, x1: 942, y1: 620, x2: 960, y2: 795, x3: 958, y3: 938, w: 50 },
      { x0: 792, y0: 530, x1: 826, y1: 730, x2: 842, y2: 890, x3: 840, y3: 1058, w: 44 },
      { x0: 852, y0: 485, x1: 898, y1: 705, x2: 915, y2: 880, x3: 914, y3: 1010, w: 46 },
    ];
    for (let i = 0; i < rightLocks.length; i++) {
      const R = rightLocks[i];
      drawTaperedHairLock(ctx, [R.x0, R.y0], [R.x1, R.y1], [R.x2, R.y2], [R.x3, R.y3], {
        widthStart: R.w,
        baseColor: '#080b0e',
        altColor: '#0e475e',
        highlightColor: i % 2 === 1 ? '#156d8f' : '#2584a8',
        highlightChance: 0.48,
        tipWisps: 4,
        rng,
      });
    }

    // --- 2. STRIPED INNER TEE & DRAPED CARDIGAN ---
    const teePts = [
      [482, 848],
      [645, 838],
      [715, 960],
      [715, 1215],
      [445, 1215],
      [440, 975],
    ];
    fillStripedPastelShape(
      ctx,
      teePts,
      [
        { color: '#faf8f4', altColor: '#e8e6e1', height: 22 },
        { color: '#7093b4', altColor: '#5c7e9f', height: 21 },
      ],
      {
        stripeAngle: -0.03,
        ribAngle: 0.02,
        stripeCurve: 4,
        ribDensity: 0.9,
        toothAmount: 0.55,
        rng,
      }
    );

    drawStippledBlush(ctx, 520, 852, 42, 18, '#faf8f4', {
      intensity: 0.72,
      dotCount: 240,
      paperFlecks: 0.2,
      rng,
    });

    // Left Cardigan Panel (anchors cleanly past y=1220 so bottom edge isn't rounded)
    const leftCardiganPts = [
      [512, 854],
      [462, 860],
      [392, 902],
      [338, 995],
      [285, 1225],
      [548, 1225],
      [530, 1020],
    ];
    fillStripedPastelShape(
      ctx,
      leftCardiganPts,
      [
        { color: '#e3bf2d', altColor: '#caa31c', height: 76 },
        { color: '#6b3ea2', altColor: '#562e88', height: 74 },
      ],
      {
        stripeAngle: -0.14,
        ribAngle: Math.PI * 0.52,
        stripeCurve: 6,
        ribDensity: 1.45,
        toothAmount: 0.62,
        rng,
      }
    );

    // Right Cardigan Panel
    const rightCardiganPts = [
      [634, 850],
      [684, 858],
      [752, 905],
      [802, 1005],
      [855, 1225],
      [632, 1225],
      [642, 1015],
    ];
    fillStripedPastelShape(
      ctx,
      rightCardiganPts,
      [
        { color: '#e3bf2d', altColor: '#c9a21b', height: 75 },
        { color: '#6b3ea2', altColor: '#542d85', height: 74 },
      ],
      {
        stripeAngle: 0.14,
        ribAngle: Math.PI * 0.48,
        stripeCurve: 6,
        ribDensity: 1.45,
        toothAmount: 0.62,
        rng,
      }
    );

    // --- 3. NECK & SHADOW ---
    const neckPts = [
      [536, 712],
      [598, 712],
      [614, 845],
      [574, 870],
      [524, 848],
    ];
    fillPastelShape(ctx, neckPts, {
      baseColor: '#efc0ae',
      altColor: '#df9d8c',
      highlightColor: '#f8dcd0',
      shadowColor: '#ce8072',
      angle: Math.PI * 0.5,
      grainDensity: 0.9,
      toothAmount: 0.35,
      rng,
    });
    drawStippledBlush(ctx, 566, 732, 34, 16, '#b8685c', {
      intensity: 0.36,
      dotCount: 280,
      paperFlecks: 0.1,
      rng,
    });

    // --- 4. EARS & CURVED GOLD HOOP EARRINGS ---
    const drawEarWithHoop = (cx, cy, rx, ry, flip, hoopOffset) => {
      const earPts = organicEllipsePts(cx, cy, rx, ry, flip * -0.18, 28, 0.05, rng);
      fillPastelShape(ctx, earPts, {
        baseColor: '#f0bfae',
        altColor: '#e29889',
        highlightColor: '#fae0d6',
        shadowColor: '#cf7468',
        angle: Math.PI * 0.4,
        grainDensity: 1.0,
        toothAmount: 0.3,
        rng,
      });
      drawStippledBlush(ctx, cx + flip * 6, cy + 2, rx * 0.52, ry * 0.5, '#d65b53', {
        intensity: 0.72,
        dotCount: 420,
        paperFlecks: 0.14,
        rng,
      });
      drawPencilOutline(
        ctx,
        [
          [cx - flip * 4, cy - ry * 0.25],
          [cx + flip * 10, cy - ry * 0.05],
          [cx + flip * 4, cy + ry * 0.28],
        ],
        { color: '#aa4842', width: 2.0, alpha: 0.55, passes: 2, rng }
      );

      const hx = cx + hoopOffset[0];
      const hy = cy + hoopOffset[1];
      drawPainterlyTube(
        ctx,
        [hx - 2, hy - 26],
        [hx - 18 * flip, hy - 8],
        [hx - 15 * flip, hy + 28],
        [hx + 6 * flip, hy + 30],
        {
          widthStart: 11,
          widthEnd: 12,
          baseColor: '#dbb222',
          altColor: '#b98b12',
          highlightColor: '#f7de6f',
          toothAmount: 0.3,
          rng,
        }
      );
      if (flip < 0) {
        drawPainterlyTube(
          ctx,
          [hx + 22, hy - 14],
          [hx + 34, hy + 4],
          [hx + 30, hy + 28],
          [hx + 16, hy + 32],
          {
            widthStart: 9,
            widthEnd: 10,
            baseColor: '#d4ab1e',
            altColor: '#b38510',
            highlightColor: '#f5dc69',
            toothAmount: 0.3,
            rng,
          }
        );
      } else {
        drawPainterlyTube(
          ctx,
          [hx - 18, hy - 8],
          [hx - 28, hy + 8],
          [hx - 24, hy + 26],
          [hx - 10, hy + 28],
          {
            widthStart: 9,
            widthEnd: 10,
            baseColor: '#d4ab1e',
            altColor: '#b38510',
            highlightColor: '#f5dc69',
            toothAmount: 0.3,
            rng,
          }
        );
      }
    };

    drawEarWithHoop(316, 558, 45, 56, -1, [12, 62]);
    drawEarWithHoop(874, 522, 36, 46, 1, [6, 54]);

    // --- 5. FACE BASE SHAPE ---
    const facePts = [
      [585, 222],
      [735, 250],
      [832, 355],
      [858, 505],
      [818, 635],
      [715, 718],
      [568, 745],
      [422, 715],
      [338, 612],
      [322, 472],
      [352, 325],
      [458, 238],
    ];
    fillPastelShape(ctx, facePts, {
      baseColor: '#f2c4b4',
      altColor: '#eab3a2',
      highlightColor: '#fbe4db',
      shadowColor: '#dc998c',
      angle: Math.PI * 0.38,
      grainDensity: 0.85,
      toothAmount: 0.38,
      edgeRoughness: 0.9,
      strokeAlpha: 0.2,
      rng,
    });

    drawStippledBlush(ctx, 412, 578, 76, 56, '#df6968', {
      intensity: 0.62,
      dotCount: 1200,
      paperFlecks: 0.24,
      rng,
    });
    drawStippledBlush(ctx, 765, 548, 72, 54, '#df6968', {
      intensity: 0.65,
      dotCount: 1200,
      paperFlecks: 0.24,
      rng,
    });

    drawStippledBlush(ctx, 735, 648, 55, 26, '#fff8f4', {
      intensity: 0.24,
      dotCount: 320,
      paperFlecks: 0.1,
      rng,
    });

    // --- 6. FACIAL FEATURES ---
    drawGouacheEye(ctx, 480, 488, 52, 50, 0.22, -0.1, {
      irisColor: '#1b241d',
      irisRadius: 0.42,
      rng,
    });
    drawGouacheEye(ctx, 718, 466, 50, 48, 0.25, -0.06, {
      irisColor: '#1b241d',
      irisRadius: 0.43,
      rng,
    });

    drawCharcoalMark(
      ctx,
      [
        [670, 354],
        [720, 350],
        [770, 355],
      ],
      { width: 22, color: '#14171a', alpha: 0.92, passes: 16, rng }
    );
    drawCharcoalMark(
      ctx,
      [
        [406, 404],
        [458, 392],
        [496, 386],
      ],
      { width: 15, color: '#16191c', alpha: 0.88, passes: 12, rng }
    );

    const nosePts = [
      [598, 488],
      [612, 489],
      [622, 535],
      [615, 552],
      [594, 552],
      [589, 534],
    ];
    fillPastelShape(ctx, nosePts, {
      baseColor: '#d96977',
      altColor: '#c35362',
      highlightColor: '#f19aa4',
      angle: Math.PI * 0.5,
      grainDensity: 1.4,
      toothAmount: 0.22,
      edgeRoughness: 0.65,
      rng,
    });
    ctx.fillStyle = '#151214';
    ctx.beginPath();
    ctx.ellipse(597, 550, 4.2, 5.5, 0.2, 0, Math.PI * 2);
    ctx.ellipse(617, 549, 4.6, 5.8, -0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = '#c44b5d';
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(570, 622);
    ctx.quadraticCurveTo(598, 605, 626, 619);
    ctx.stroke();
    ctx.restore();

    // --- 7. NATURAL TAPERED FOREHEAD SWEEPS & BANGS ---
    // Smooth dark crown parting base so lock roots blend seamlessly
    fillPastelShape(
      ctx,
      [
        [455, 178],
        [598, 128],
        [755, 168],
        [768, 222],
        [602, 198],
        [435, 228],
      ],
      {
        baseColor: '#090c10',
        altColor: '#0e4c68',
        highlightColor: '#197599',
        angle: Math.PI * 0.45,
        grainDensity: 0.9,
        toothAmount: 0.12,
        edgeRoughness: 0.85,
        rng,
      }
    );
    // Left crown sweep flowing into side locks
    drawTaperedHairLock(ctx, [595, 168], [440, 155], [305, 255], [225, 520], {
      widthStart: 122,
      baseColor: '#090c10',
      altColor: '#0e4c68',
      highlightColor: '#197599',
      highlightChance: 0.4,
      tipWisps: 5,
      rng,
    });
    drawTaperedHairLock(ctx, [595, 172], [510, 235], [405, 345], [272, 545], {
      widthStart: 88,
      baseColor: '#090c10',
      altColor: '#0e4c68',
      highlightColor: '#1b7da3',
      highlightChance: 0.42,
      tipWisps: 4,
      rng,
    });
    drawTaperedHairLock(ctx, [588, 178], [525, 260], [452, 340], [340, 442], {
      widthStart: 42,
      baseColor: '#090c10',
      altColor: '#125a79',
      highlightColor: '#2587aa',
      highlightChance: 0.45,
      tipWisps: 3,
      rng,
    });

    // Right crown sweep flowing smoothly behind right ear
    drawTaperedHairLock(ctx, [610, 162], [770, 162], [875, 258], [912, 488], {
      widthStart: 112,
      baseColor: '#090c10',
      altColor: '#125a79',
      highlightColor: '#2d8db0',
      highlightChance: 0.5,
      tipWisps: 4,
      rng,
    });
    drawTaperedHairLock(ctx, [620, 174], [755, 198], [835, 290], [872, 462], {
      widthStart: 56,
      baseColor: '#0b0f13',
      altColor: '#136b8e',
      highlightColor: '#2d8db0',
      highlightChance: 0.52,
      tipWisps: 3,
      rng,
    });

    // Delicate wispy strands across forehead & cheek
    drawWispyStrand(ctx, [602, 185], [575, 260], [525, 345], [475, 420], {
      widthStart: 2.2,
      widthEnd: 0.6,
      color: '#0d1014',
      rng,
    });
    drawWispyStrand(ctx, [606, 192], [585, 275], [545, 355], [492, 428], {
      widthStart: 1.6,
      widthEnd: 0.5,
      color: '#11161b',
      rng,
    });
    drawWispyStrand(ctx, [468, 378], [418, 435], [372, 488], [335, 526], {
      widthStart: 1.4,
      widthEnd: 0.4,
      color: '#14191e',
      rng,
    });
    drawWispyStrand(ctx, [495, 495], [420, 520], [345, 535], [278, 532], {
      widthStart: 1.0,
      widthEnd: 0.35,
      alpha: 0.65,
      color: '#15191d',
      rng,
    });

    // Top cowlick / sprout + floating stray pencil arcs
    drawWispyStrand(ctx, [604, 172], [596, 125], [585, 92], [568, 68], {
      widthStart: 4.5,
      widthEnd: 7.5,
      color: '#080b0e',
      alpha: 0.95,
      steps: 24,
      rng,
    });
    drawWispyStrand(ctx, [604, 170], [670, 80], [810, 88], [860, 210], {
      widthStart: 1.3,
      widthEnd: 0.4,
      alpha: 0.72,
      rng,
    });
    drawWispyStrand(ctx, [602, 172], [520, 95], [395, 118], [320, 200], {
      widthStart: 1.2,
      widthEnd: 0.35,
      alpha: 0.65,
      rng,
    });
    drawWispyStrand(ctx, [265, 340], [210, 420], [185, 530], [210, 620], {
      widthStart: 1.4,
      widthEnd: 0.4,
      alpha: 0.7,
      rng,
    });
    drawWispyStrand(ctx, [202, 740], [175, 860], [178, 980], [148, 1085], {
      widthStart: 1.6,
      widthEnd: 0.4,
      alpha: 0.75,
      rng,
    });
    drawWispyStrand(ctx, [915, 585], [965, 690], [998, 795], [972, 910], {
      widthStart: 1.3,
      widthEnd: 0.4,
      alpha: 0.65,
      rng,
    });

    ctx.restore();
  },
};
