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
