// Ragged paper edges as CSS clip-path polygons. Coordinates are percentages
// of the element. `depth` is how far (in %) the tear bites into the paper.

const jitter = (depth: number) => Math.random() * depth;

function edge(steps: number, depth: number, y: number, inward: 1 | -1) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    // Mix a slow wobble with fine fibres so it reads as torn, not zigzag.
    const d = jitter(depth * 0.55) + (i % 3 === 0 ? jitter(depth * 0.45) : 0);
    pts.push([x, y + inward * d]);
  }
  return pts;
}

const fmt = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(",");

// A sheet torn along its top and bottom.
export function tornSheet(depth = 4, steps = 70) {
  const top = edge(steps, depth, 0, 1);
  const bottom = edge(steps, depth, 100, -1).reverse();
  return `polygon(${fmt([...top, ...bottom])})`;
}

// The same kind of sheet, ripped down the middle into a left and right half.
export function rippedHalves(depth = 4, steps = 70) {
  const top = edge(steps, depth, 0, 1);
  const bottom = edge(steps, depth, 100, -1);
  const seam: [number, number][] = [];
  const rows = 40;
  let x = 47 + Math.random() * 6;
  for (let i = 0; i <= rows; i++) {
    x += (Math.random() - 0.5) * 3.2;
    x = Math.min(58, Math.max(42, x));
    seam.push([x, (i / rows) * 100]);
  }
  const x0 = seam[0][0];
  const x1 = seam[seam.length - 1][0];
  const left = [
    ...top.filter(([px]) => px < x0),
    ...seam,
    ...bottom.filter(([px]) => px < x1).reverse(),
  ];
  const right = [
    ...top.filter(([px]) => px > x0),
    ...bottom.filter(([px]) => px > x1).reverse(),
    ...seam.slice().reverse(),
  ];
  return { left: `polygon(${fmt(left)})`, right: `polygon(${fmt(right)})` };
}

// A strip of tape with torn ends, stable per `seed` so SSR matches.
export function tapeClip(seed: number) {
  const r = (n: number) => {
    const s = Math.sin(seed * 999 + n * 77.7) * 10000;
    return s - Math.floor(s);
  };
  const l: string[] = [];
  const rgt: string[] = [];
  for (let i = 0; i <= 6; i++) {
    const y = (i / 6) * 100;
    l.push(`${(r(i) * 6).toFixed(1)}% ${y}%`);
    rgt.push(`${(100 - r(i + 20) * 6).toFixed(1)}% ${y}%`);
  }
  return `polygon(${[...l, ...rgt.reverse()].join(",")})`;
}
