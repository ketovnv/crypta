import { Globals } from "@react-spring/core";

type OKLCHFast = [number, number, number, number]; // [L, C, H, Alpha]

export class AnimationInterpolator {
  private static cache = new WeakMap<object, OKLCHFast[]>();

  static createStringInterpolator = (config: any) => {
    const {
      range: [min, max],
      output,
    } = config;
    const rangeSize = max - min;
    const colors = this.parseColors(output);
    const count = colors.length;

    const isGradient = count > 2;
    let segmentSize = 0;
    let segmentCount = 0;

    if (isGradient) {
      segmentCount = count - 1;
      segmentSize = 1 / segmentCount;
    }

    const interpolatePair = (
      color1: OKLCHFast,
      color2: OKLCHFast,
      t: number,
    ): OKLCHFast => {
      const [l1, c1, h1, a1] = color1;
      const [l2, c2, h2, a2] = color2;

      const l = l1 + (l2 - l1) * t;
      const c = c1 + (c2 - c1) * t;
      const alpha = a1 + (a2 - a1) * t;

      let h = h1;
      if (h1 !== h2) {
        let diff = h2 - h1;
        if (diff > 180) diff -= 360;
        else if (diff < -180) diff += 360;
        h = h1 + diff * t;
        if (h < 0) h += 360;
        else if (h >= 360) h -= 360;
      }

      return [l, c, h, alpha];
    };

    return (input: number) => {
      const t = Math.max(0, Math.min(1, (input - min) / rangeSize));

      if (count === 1) {
        const [l, c, h, a] = colors[0];
        return `oklch(${l} ${c} ${h} / ${a})`;
      }

      if (!isGradient) {
        const result = interpolatePair(colors[0], colors[1], t);
        return `oklch(${result[0]} ${result[1]} ${result[2]} / ${result[3]})`;
      }

      const segmentIndex = Math.min(
        Math.floor(t * segmentCount),
        segmentCount - 1,
      );

      const localT = (t - segmentIndex * segmentSize) / segmentSize;
      const result = interpolatePair(
        colors[segmentIndex],
        colors[segmentIndex + 1],
        localT,
      );

      return `oklch(${result[0]} ${result[1]} ${result[2]} / ${result[3]})`;
    };
  };

  private static parseColors(colors: string[]): OKLCHFast[] {
    const cached = this.cache.get(colors);
    if (cached) return cached;

    const parsed = colors.map((color) => {
      if (color.startsWith("oklch(")) {
        const parts = color
          .slice(6, -1)
          .split(/[ ,/]+/)
          .filter(Boolean);
        return [
          parseFloat(parts[0]), // L
          parseFloat(parts[1]), // C
          parseFloat(parts[2]), // H
          parts[3] ? parseFloat(parts[3]) : 1, // Alpha
        ];
      }
      return [0.5, 0.05, 0, 1]; // Fallback
    });

    this.cache.set(colors, parsed);
    return parsed;
  }
}
