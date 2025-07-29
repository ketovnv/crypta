import chroma from "chroma-js";
import { Globals } from "@react-spring/core";

export class GlobalControlOldVariant {
  static oklchColorInterpolator = (config) => {
    const { range, output, extrapolate } = config;
    const colors = output.map((c) => {
      try {
        const color = chroma(c);
        return {
          oklch: color.oklch(),
          alpha: color.alpha(),
        };
      } catch {
        return {
          oklch: [0, 0, 0],
          alpha: 1,
        };
      }
    });

    return (input) => {
      let t = (input - range[0]) / (range[1] - range[0]);

      // Обработка экстраполяции
      if (extrapolate === "clamp") {
        t = Math.max(0, Math.min(1, t));
      }

      if (colors.length === 1) {
        const [l, c, h] = colors[0].oklch;
        return chroma.oklch(l, c, h).alpha(colors[0].alpha).css();
      }

      if (colors.length === 2) {
        const [
          {
            oklch: [l1, c1, h1],
            alpha: a1,
          },
          {
            oklch: [l2, c2, h2],
            alpha: a2,
          },
        ] = colors;

        // Интерполяция компонентов
        const l = l1 + (l2 - l1) * t;
        const c = c1 + (c2 - c1) * t;
        const alpha = a1 + (a2 - a1) * t;

        // Корректировка оттенка
        let h = 0;
        if (!isNaN(h1) && !isNaN(h2)) {
          let hueDiff = h2 - h1;
          if (hueDiff > 180) hueDiff -= 360;
          if (hueDiff < -180) hueDiff += 360;
          h = h1 + hueDiff * t;
        } else if (!isNaN(h1)) {
          h = h1;
        } else if (!isNaN(h2)) {
          h = h2;
        }

        return chroma.oklch(l, c, h).alpha(alpha).css();
      }

      // Для 3+ цветов используем chroma.scale
      const scale = chroma.scale(output).mode("oklch");
      return scale(t).css("oklch");
    };
  };

  static interpolatorInit() {
    Globals.assign({
      createColorInterpolator: GlobalControlOldVariant.oklchColorInterpolator,
    });
  }
}
