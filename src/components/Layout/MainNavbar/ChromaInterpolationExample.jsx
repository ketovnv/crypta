import { animated, SpringValue } from "@react-spring/web";
import { useEffect, useRef } from "react"; // Убрали useState, т.к. не используется
import chroma from "chroma-js";

// Шкалы создаем вне компонента, они не меняются
const labScale = chroma.scale(["black", "white"]).mode("oklab");
const lchScale = chroma.scale(["black", "white"]).mode("oklch");

export const ChromaInterpolationExample = () => {
  // 1. Инициализируем SpringValue НАЧАЛЬНЫМ значением (например, 0)
  const springRef = useRef(new SpringValue(0));

  // 2. Запускаем анимацию с полной конфигурацией в useEffect
  useEffect(() => {
    // Проверяем, что current существует (на всякий случай)
    if (springRef.current) {
      springRef.current.start({
        from: 0, // Явно указываем начало
        to: 1, // Явно указываем конец
        loop: { reverse: true }, // Конфигурация цикла
        config: { duration: 2000 }, // Конфигурация анимации
        // onRest: () => console.log('Loop cycle done'), // Можно добавить колбэки
      });
    }

    // Функция очистки при размонтировании компонента
    return () => {
      if (springRef.current) {
        springRef.current.stop(); // Останавливаем анимацию
      }
    };
  }, []); // Пустой массив зависимостей - запускаем только при монтировании

  return (
    <div>
      <p>Using Chroma.js (OKLab):</p>
      <animated.div
        style={{
          width: 200,
          height: 100,
          borderRadius: 8,
          marginBottom: 10,
          border: "1px solid #ccc", // Добавил границу, чтобы видеть квадрат
          // 3. Используем .to() на ПРАВИЛЬНО инициализированном springRef.current
          backgroundColor: springRef.current.to((p) => {
            // const clampedP = Math.max(0, Math.min(0.82, p));
            return labScale(p).css();
          }),
        }}
      />
      <p>Using Chroma.js (OKLch):</p>
      <animated.div
        style={{
          width: 200,
          height: 100,
          borderRadius: 8,
          border: "1px solid #ccc", // Добавил границу
          background: springRef.current.to((p) => {
            const clampedP = Math.max(0, Math.min(1, p));
            const colorHex = labScale(clampedP).hex(); // Используем hex
            if (p > 0.8) {
              // Логируем все после 0.8
              // console.log(`p: ${p.toFixed(4)}, color: ${colorHex}`);
            }
            // if (clampedP > 0.9) {
            //   return "#FFFFFF";
            // }
            return colorHex;
          }),
        }}
      />
      {/* Счетчик теперь тоже должен работать */}
      <animated.p>{springRef.current.to((p) => p.toFixed(2))}</animated.p>
    </div>
  );
};
