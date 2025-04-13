import { animated, SpringValue } from "@react-spring/web";
import { useCallback, useEffect, useMemo, useRef } from "react"; // Добавили useMemo
import {
  converter as culoriConverter,
  formatHex,
  interpolate as culoriInterpolate,
} from "culori/fn";
import "culori/css";
import { interpolateLab as d3InterpolateLab } from "d3-interpolate";
import { logger } from "@stores/logger.js";

// --- Настройка Culori (лучше делать вне компонента или в useMemo) ---
const oklabConverter = culoriConverter("oklab");
const startColorCulori = "black";
const endColorCulori = "white";
const startOklab = oklabConverter(startColorCulori);
const endOklab = oklabConverter(endColorCulori);

// --- Настройка D3 (лучше делать вне компонента или в useMemo) ---
const startColorD3 = "black";
const endColorD3 = "white";

function FixedImperativeLoopAnimation() {
  const springRef = useRef(new SpringValue(0));
  const targetRef = useRef(1);

  // --- Создаем интерполяторы ОДИН РАЗ с useMemo ---
  const culoriInterpolator = useMemo(() => {
    if (startOklab && endOklab) {
      return culoriInterpolate([startOklab, endOklab], "oklab");
    }
    return null; // Обработка ошибки парсинга
  }, []); // Пустой массив зависимостей - создаем один раз

  const d3Interpolator = useMemo(
    () => d3InterpolateLab(startColorD3, endColorD3),
    [],
  ); // Пустой массив зависимостей

  const runAnimation = useCallback(() => {
    springRef.current.start({
      to: targetRef.current,
      config: { duration: 2000 },
      onRest: (result) => {
        if (result.finished) {
          targetRef.current = targetRef.current === 0 ? 1 : 0;
          runAnimation();
        }
      },
    });
  }, []);

  useEffect(() => {
    runAnimation();
    return () => springRef.current.stop();
  }, [runAnimation]);
  logger.logWhiteRandom("C/D", "render");
  return (
    <div>
      {/* Блок 1: Culori */}
      <p>Using Culori (Oklab):</p>
      <animated.div
        style={{
          width: 200,
          height: 100,
          borderRadius: 8,
          border: "1px solid black", // Граница для видимости
          marginBottom: 10,
          backgroundColor: culoriInterpolator // Проверяем, что интерполятор создан
            ? springRef.current.to((p) => {
                // p - прогресс 0..1
                // const clampedP = Math.max(0, Math.min(0.84, p));
                const interpolatedColorObj = culoriInterpolator(p); // ВЫЗЫВАЕМ интерполятор с p
                return formatHex(interpolatedColorObj); // Форматируем результат
              })
            : "grey", // Цвет по умолчанию, если парсинг/интерполятор не удался
        }}
      />

      {/* Блок 2: D3 */}
      <p>Using D3 (Lab):</p>
      <animated.div
        style={{
          width: 200,
          height: 100,
          borderRadius: 8,
          border: "1px solid black", // Граница для видимости
          // Вызываем интерполятор d3 внутри .to()
          background: springRef.current.to((p) => {
            // const clampedP = Math.max(0.0, Math.min(0.82, p));
            return d3Interpolator(p);
          }), // ВЫЗЫВАЕМ интерполятор с p
        }}
      />
      <animated.p>{springRef.current.to((p) => p.toFixed(2))}</animated.p>
    </div>
  );
}

export default FixedImperativeLoopAnimation;
