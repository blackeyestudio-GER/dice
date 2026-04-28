/** Zellen-Indizes 0–8 für 3×3-Augen (wie DOM-Version) */
const DOT: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 3, 6, 2, 5, 8],
};

export type DieDrawSpec = {
  value: number;
  faceHex: string;
  markHex: string;
  useEyes: boolean;
};

export type DiceBoardDrawOptions = {
  dieScale?: number;
  pipScale?: number;
  fontScale?: number;
  fontFamily?: string;
};

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  if (h.length !== 6) return { r: 30, g: 30, b: 34 };
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawPips(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  value: number,
  markHex: string,
  pipScale = 1
) {
  const cells = DOT[value] ?? [];
  const g = size * 0.72;
  const ox = cx - g / 2;
  const oy = cy - g / 2;
  const step = g / 3;
  const pr = Math.max(2, size * 0.09 * pipScale);
  const { r, g: gg, b } = parseHex(markHex);
  ctx.fillStyle = `rgb(${r},${gg},${b})`;
  for (const idx of cells) {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const px = ox + step * col + step / 2;
    const py = oy + step * row + step / 2;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Zeichnet alle Würfel auf einem Canvas (eine Fläche, bis zu 5 pro Zeile).
 */
export function drawDiceBoard(
  ctx: CanvasRenderingContext2D,
  widthCss: number,
  heightCss: number,
  specs: DieDrawSpec[],
  options: DiceBoardDrawOptions = {}
): void {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const w = Math.max(1, Math.floor(widthCss * dpr));
  const h = Math.max(1, Math.floor(heightCss * dpr));
  const canvas = ctx.canvas;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, widthCss, heightCss);

  const n = specs.length;
  if (n === 0) return;

  const cols = Math.min(5, n);
  const rows = Math.ceil(n / cols);
  const pad = 12;
  const gap = 10;
  const cellW = (widthCss - 2 * pad - gap * (cols - 1)) / cols;
  const cellH = (heightCss - 2 * pad - gap * (rows - 1)) / rows;
  const dieScale = options.dieScale ?? 1;
  const pipScale = options.pipScale ?? 1;
  const fontScale = options.fontScale ?? 1;
  const fontFamily = options.fontFamily ?? 'system-ui, sans-serif';
  const size = Math.min(cellW, cellH) * dieScale;
  const radius = Math.max(8, size * 0.12);

  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const bx = pad + col * (cellW + gap) + (cellW - size) / 2;
    const by = pad + row * (cellH + gap) + (cellH - size) / 2;
    const spec = specs[i]!;
    const { r, g, b } = parseHex(spec.faceHex);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    roundRect(ctx, bx, by, size, size, radius);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    const cx = bx + size / 2;
    const cy = by + size / 2;
    const v = spec.value;
    if (spec.useEyes && v >= 1 && v <= 6) {
      drawPips(ctx, cx, cy, size, v, spec.markHex, pipScale);
    } else {
      const { r: mr, g: mg, b: mb } = parseHex(spec.markHex);
      ctx.fillStyle = `rgb(${mr},${mg},${mb})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.floor(size * 0.42 * fontScale)}px ${fontFamily}`;
      ctx.fillText(String(v), cx, cy + size * 0.02);
    }
  }
}

/** CSS-Höhe der Fläche aus Anzahl Würfel und Breite (quadratische Zellen) */
export function diceBoardHeightCss(widthCss: number, diceCount: number, dieScale = 1): number {
  const n = Math.max(1, diceCount);
  const cols = Math.min(5, n);
  const rows = Math.ceil(n / cols);
  const pad = 12;
  const gap = 10;
  const cellW = (widthCss - 2 * pad - gap * (cols - 1)) / cols;
  const size = cellW * dieScale;
  return pad * 2 + rows * size + (rows - 1) * gap;
}
