import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  useAnimation,
  createSpringAnimation,
  // baseAnimationSystem,
} from "./BaseAnimationSystem";
// import { timeEngine } from "../stores/timeEngine";
import { core } from "@stores/_core.js";
import { gradientStore } from "../stores/gradient";
import LoggerTest from "../components/LoggerTest.jsx";

const QuickStart = observer(() => {
  const demoRef = useRef(null);
  const boxRef = useRef(null);
  const [metrics, setMetrics] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const { start: startAnimation, stop: stopAnimation } = useAnimation({
    tension: 180,
    friction: 20,
    mass: 1,
  });

  // Инициализация системы
  useEffect(() => {
    console.log("🚀 QuickStart: Initializing animation system...");

    if (!core.isRunning) {
      core.start();
      console.log("✅ Core started 👻👻👻");
    }

    console.log("✅ BaseAnimationSystem initialized");
  }, []);

  // Обновление метрик
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        ...core.getMetrics(),
        elapsedTime: Math.floor(core.elapsedTime / 1000),
      });
    };

    const interval = setInterval(updateMetrics, 500);
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  // Простая анимация
  const runQuickDemo = async () => {
    if (!boxRef.current) return;

    setIsAnimating(true);

    try {
      await startAnimation(boxRef.current, {
        x: 200,
        y: 100,
        scale: 1.2,
        rotation: 180,
      });

      await startAnimation(boxRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      });
    } catch (error) {
      console.error("Animation failed:", error);
    }

    setIsAnimating(false);
  };

  // Анимация с градиентом
  const runGradientDemo = () => {
    if (!demoRef.current) return;

    const element = demoRef.current;
    element.style.background = gradientStore.getTheme.background;

    core
      .createSpringAnimation(element, {
        tension: 120,
        friction: 15,
      })
      .start({
        x: Math.random() * 300,
        y: Math.random() * 100,
        scale: 0.8 + Math.random() * 0.4,
      });
  };

  const theme = gradientStore.getTheme;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🚀 Quick Animation Start</h1>
        <p className="text-gray-600">Ready-to-use animation system</p>
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-green-800 font-medium">System Ready</span>
        </div>
        <div className="mt-2 text-sm text-green-700">
          TimeEngine: {core.isRunning ? "Running" : "Stopped"} • Animations:{" "}
          {metrics.activeAnimations || 0} • FPS: {metrics.fps || 0}
        </div>
      </div>

      {/* Quick Controls */}
      <div className="mb-6 space-x-3">
        <button
          onClick={runQuickDemo}
          disabled={isAnimating}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isAnimating ? "Animating..." : "Quick Demo"}
        </button>

        <button
          onClick={runGradientDemo}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Gradient Demo
        </button>

        <button
          onClick={() => core.setTimeScale(core.timeScale === 1 ? 0.5 : 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Speed: {core.timeScale}x
        </button>
      </div>

      {/* Demo Area */}
      <div className="relative w-full h-64 bg-gray-50 border-2 border-gray-200 rounded mb-6 overflow-hidden">
        <div
          ref={demoRef}
          className="absolute top-4 left-4 px-3 py-2 text-white rounded"
          style={{
            background: theme.background,
            transformOrigin: "center",
          }}
        >
          Gradient Element
        </div>

        <div
          ref={boxRef}
          className="absolute top-20 left-4 w-12 h-12 bg-blue-500 rounded shadow-lg"
          style={{ transformOrigin: "center" }}
        />

        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          Time: {metrics.elapsedTime || 0}s
        </div>
      </div>

      {/* Usage Example */}
      <div className="p-4 bg-gray-900 text-green-400 rounded text-sm">
        <pre>{`// Ready to use in your components:
import { useAnimation } from './animations/core/BaseAnimationSystem';

const { start } = useAnimation({ tension: 200, friction: 20 });
start(elementRef.current, { x: 100, y: 50, scale: 1.2 });`}</pre>
      </div>

      {/* Logger Test Section */}
      <div className="mt-1 border-t pt-8">{/*<LoggerTest />*/}</div>
    </div>
  );
});

export default QuickStart;
