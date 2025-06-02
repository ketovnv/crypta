import chroma from "chroma-js";
import { SpringValue } from "@react-spring/core";
import { raf } from "@react-spring/rafz";
import { observable, computed, action, runInAction } from "mobx";

class ParallelGradientSystem {
  gradients = new Map();
  isHighPerformanceMode = true;
  globalAlpha = 0.95; // для Mica/Acrylic

  // Кэш для переиспользования Bezier кривых
  bezierCache = new Map();
  // Мониторинг производительности
  performanceStats = {
    fps: 0,
    activeGradients: 0,
    cacheHitRate: 0,
  };

  constructor() {
    this.initializeHighPerformanceMode();
    this.setupPerformanceMonitoring();
  }

  initializeHighPerformanceMode() {
    // if (window.__TAURI__) {
    // Tauri-специфичные оптимизации
    this.isHighPerformanceMode = true;
    // }
  }

  // Оптимизированная генерация scale с кэшированием
  scaleGradientOptimized = (colors, number, alpha = this.globalAlpha) => {
    const cacheKey = `${colors.join("-")}-${number}-${alpha}`;

    if (this.bezierCache.has(cacheKey)) {
      return this.bezierCache.get(cacheKey);
    }

    try {
      const bezier = chroma.bezier(colors);
      const scale = bezier.scale().mode("oklch");

      // Генерируем цвета с альфой для Windows эффектов
      const colorArray = scale.colors(number).map((color) => {
        const [l, c, h] = chroma(color).oklch();
        return `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${h.toFixed(1)} / ${alpha})`;
      });

      const result = colorArray.join(", ");
      this.bezierCache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.warn("Gradient generation error:", error);
      return `oklch(0.5 0.1 0 / ${alpha}), oklch(0.7 0.1 180 / ${alpha})`;
    }
  };

  // Анимированный радиальный градиент с параллельными параметрами

  createAnimatedCircleGradient(id, initialConfig) {
    const {
      colors = ["#ff0000", "#00ff00", "#0000ff"],
      number = 64,
      angle = 50,
      angleTwo = 50,
      alpha = this.globalAlpha,
    } = initialConfig;

    const gradient = {
      id,
      colors: [...colors],
      number,
      alpha,

      // Анимируемые параметры
      angleSpring: new SpringValue(angle),
      angleTwoSpring: new SpringValue(angleTwo),
      alphaSpring: new SpringValue(alpha),

      // Анимация цветов через отдельные Springs
      colorSprings: colors.map((color, i) => {
        const [l, c, h] = chroma(color).oklch();
        return {
          l: new SpringValue(l),
          c: new SpringValue(c),
          h: new SpringValue(h),
        };
      }),

      // Cached результат
      cachedGradient: null,
      needsUpdate: true,
    };

    // Батчим все обновления через rafz
    const batchedUpdate = raf.throttle(() => {
      runInAction(() => {
        gradient.needsUpdate = true;
      });
    });

    // Подписываемся на изменения всех springs
    gradient.angleSpring.onChange = batchedUpdate;
    gradient.angleTwoSpring.onChange = batchedUpdate;
    gradient.alphaSpring.onChange = batchedUpdate;

    gradient.colorSprings.forEach((spring) => {
      spring.l.onChange = batchedUpdate;
      spring.c.onChange = batchedUpdate;
      spring.h.onChange = batchedUpdate;
    });

    this.gradients.set(id, gradient);
    return gradient;
  }

  // Анимированный линейный градиент

  createAnimatedLinearGradient(id, initialConfig) {
    const {
      colors = ["#ff0000", "#0000ff"],
      number = 32,
      angle = 45,
      alpha = this.globalAlpha,
    } = initialConfig;

    const gradient = {
      id,
      colors: [...colors],
      number,
      alpha,

      angleSpring: new SpringValue(angle),
      alphaSpring: new SpringValue(alpha),

      colorSprings: colors.map((color) => {
        const [l, c, h] = chroma(color).oklch();
        return {
          l: new SpringValue(l),
          c: new SpringValue(c),
          h: new SpringValue(h),
        };
      }),

      cachedGradient: null,
      needsUpdate: true,
    };

    const batchedUpdate = raf.throttle(() => {
      runInAction(() => {
        gradient.needsUpdate = true;
      });
    });

    gradient.angleSpring.onChange = batchedUpdate;
    gradient.alphaSpring.onChange = batchedUpdate;
    gradient.colorSprings.forEach((spring) => {
      spring.l.onChange = batchedUpdate;
      spring.c.onChange = batchedUpdate;
      spring.h.onChange = batchedUpdate;
    });

    this.gradients.set(id, gradient);
    return gradient;
  }

  // Получение актуального CSS градиента

  getCircleGradient(id) {
    const gradient = this.gradients.get(id);
    if (!gradient) return null;

    if (!gradient.needsUpdate && gradient.cachedGradient) {
      return gradient.cachedGradient;
    }

    // Собираем текущие цвета из springs
    const currentColors = gradient.colorSprings.map((spring) =>
      chroma.oklch(spring.l.get(), spring.c.get(), spring.h.get()).hex(),
    );

    const angle = gradient.angleSpring.get();
    const angleTwo = gradient.angleTwoSpring.get();
    const alpha = gradient.alphaSpring.get();

    const colorString = this.scaleGradientOptimized(
      currentColors,
      gradient.number,
      alpha,
    );

    gradient.cachedGradient = `radial-gradient(in oklch circle at ${angle.toFixed(1)}% ${angleTwo.toFixed(1)}%, ${colorString})`;
    gradient.needsUpdate = false;

    return gradient.cachedGradient;
  }

  getLinearGradient(id) {
    const gradient = this.gradients.get(id);
    if (!gradient) return null;

    if (!gradient.needsUpdate && gradient.cachedGradient) {
      return gradient.cachedGradient;
    }

    const currentColors = gradient.colorSprings.map((spring) =>
      chroma.oklch(spring.l.get(), spring.c.get(), spring.h.get()).hex(),
    );

    const angle = gradient.angleSpring.get();
    const alpha = gradient.alphaSpring.get();

    const colorString = this.scaleGradientOptimized(
      currentColors,
      gradient.number,
      alpha,
    );

    gradient.cachedGradient = `linear-gradient(${angle.toFixed(1)}deg in oklch, ${colorString})`;
    gradient.needsUpdate = false;

    return gradient.cachedGradient;
  }

  // Анимация параметров градиента

  animateGradient(id, animations) {
    const gradient = this.gradients.get(id);
    if (!gradient) return;

    const {
      angle,
      angleTwo,
      alpha,
      colors,
      config = { tension: 120, friction: 14 },
    } = animations;

    // Анимируем углы
    if (angle !== undefined) {
      gradient.angleSpring.start({ to: angle, config });
    }
    if (angleTwo !== undefined && gradient.angleTwoSpring) {
      gradient.angleTwoSpring.start({ to: angleTwo, config });
    }
    if (alpha !== undefined) {
      gradient.alphaSpring.start({ to: alpha, config });
    }

    // Анимируем цвета
    if (colors && colors.length === gradient.colorSprings.length) {
      colors.forEach((color, i) => {
        const [l, c, h] = chroma(color).oklch();
        const springs = gradient.colorSprings[i];

        springs.l.start({ to: l, config });
        springs.c.start({ to: c, config });
        springs.h.start({ to: h, config });
      });
    }
  }

  // Создание системы из 64 градиентов для максимального эффекта

  createMegaGradientSystem() {
    const gradients = [];

    for (let i = 0; i < 64; i++) {
      const hueBase = (i / 64) * 360;
      const colors = [
        chroma.oklch(0.7, 0.15, hueBase).hex(),
        chroma.oklch(0.5, 0.2, hueBase + 120).hex(),
        chroma.oklch(0.8, 0.1, hueBase + 240).hex(),
      ];

      const gradientId = `mega_${i}`;

      if (i % 2 === 0) {
        // Четные - радиальные
        this.createAnimatedCircleGradient(gradientId, {
          colors,
          number: 32,
          angle: Math.random() * 100,
          angleTwo: Math.random() * 100,
          alpha: 0.8 + Math.random() * 0.2,
        });
      } else {
        // Нечетные - линейные
        this.createAnimatedLinearGradient(gradientId, {
          colors,
          number: 24,
          angle: Math.random() * 360,
          alpha: 0.7 + Math.random() * 0.3,
        });
      }

      gradients.push(gradientId);
    }

    return gradients;
  }

  // Глобальная анимация всех градиентов

  animateAllGradients() {
    const gradientIds = Array.from(this.gradients.keys());

    gradientIds.forEach((id, index) => {
      setTimeout(() => {
        const randomColors = Array.from({ length: 3 }, () =>
          chroma
            .oklch(
              0.4 + Math.random() * 0.5,
              0.05 + Math.random() * 0.2,
              Math.random() * 360,
            )
            .hex(),
        );

        this.animateGradient(id, {
          angle: Math.random() * 360,
          angleTwo: Math.random() * 100,
          alpha: 0.6 + Math.random() * 0.4,
          colors: randomColors,
          config: {
            tension: 80 + Math.random() * 120,
            friction: 20 + Math.random() * 20,
          },
        });
      }, index * 50); // Распределяем по времени для плавности
    });
  }

  setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    let cacheHits = 0;
    let cacheRequests = 0;

    raf.onFrame(() => {
      frameCount++;
      const now = performance.now();

      if (now - lastTime >= 1000) {
        runInAction(() => {
          this.performanceStats.fps = Math.round(
            (frameCount * 1000) / (now - lastTime),
          );
          this.performanceStats.activeGradients = this.gradients.size;
          this.performanceStats.cacheHitRate =
            cacheRequests > 0
              ? ((cacheHits / cacheRequests) * 100).toFixed(1)
              : 0;
        });

        frameCount = 0;
        lastTime = now;
        cacheHits = 0;
        cacheRequests = 0;
      }
    });
  }

  // Очистка ресурсов

  dispose() {
    this.gradients.forEach((gradient) => {
      gradient.angleSpring?.stop();
      gradient.angleTwoSpring?.stop();
      gradient.alphaSpring?.stop();
      gradient.colorSprings?.forEach((spring) => {
        spring.l?.stop();
        spring.c?.stop();
        spring.h?.stop();
      });
    });

    this.gradients.clear();
    this.bezierCache.clear();
  }
}

// Использование:
const gradientSystem = new ParallelGradientSystem();

// Создаем мега-систему из 64 градиентов
const megaGradients = gradientSystem.createMegaGradientSystem();

// Запускаем глобальную анимацию
setInterval(() => {
  gradientSystem.animateAllGradients();
}, 5000);

export default ParallelGradientSystem;
