export function assignColorScheme(
  cats: string[],
  scheme: string[],
): Record<string, string> {
  const colors: Record<string, string> = {};
  cats.forEach((c) => {
    const hash = Math.abs(
      [...c].reduce((p, v) => p * (v.charCodeAt(0) + 1), 1),
    );
    colors[c] = scheme[hash % scheme.length];
  });
  return colors;
}

export function generateDistinctHues(count: number): number[] {
  const GOLDEN_ANGLE = 137.508;
  return Array.from({ length: count }, (_, i) => (i * GOLDEN_ANGLE) % 360);
}

export function assignColorSchemeProcedural(cats: string[]) {
  const hues = generateDistinctHues(cats.length);
  const colors: Record<string, string> = {};

  cats.forEach((cat, index) => {
    const hue = hues[index] / 360;
    colors[cat] = hslToHex(hue, 0.7, 0.55);
  });

  return colors;
}

export function hslToHex(hue: number, saturation: number, lightness: number) {
  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function componentToHex(comp: number) {
  const hex = Math.round(comp).toString(16);

  return hex.length === 1 ? `0${hex}` : hex;
}

// https://gist.github.com/mjackson/5311256
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
