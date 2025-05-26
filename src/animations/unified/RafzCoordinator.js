// ✅ Обновлённый RafzCoordinator.js
import { raf } from "@react-spring/rafz";
import { Globals } from "@react-spring/web";
import engine from "@stores/engine";

class RafzCoordinator {
  constructor() {
    this.isActive = false;
    this.integrationEnabled = false;
    this.frameCallbacks = new Map();
    this.frameId = 0;
    this.lastTime = 0;

    this.settings = {
      useEngineIntegration: true, // Используем движок времени
      frameLoop: "demand", // 🔧 Только manual режим
      batchUpdates: true,
      throttleFrames: false,
      targetFps: 60,
    };

    this.init();
  }

  init() {
    raf.frameLoop = "demand"; // Жестко устанавливаем режим
    this.setupRafHooks();

    if (engine && this.settings.useEngineIntegration) {
      this.setupEngineIntegration();
    }

    this.overrideReactSpringGlobals();
  }

  setupRafHooks() {
    raf.onStart(() => {
      this.frameId++;
      this.runFramePhase("start");
    });

    raf.onFrame(() => {
      this.runFramePhase("frame");
    });

    raf.onFinish(() => {
      this.runFramePhase("finish");
      this.lastTime = raf.now();
    });
  }

  setupEngineIntegration() {
    this.integrationEnabled = true;

    // 🔁 Только фазовая интеграция — без дублирующего advance
    engine.registerRenderCallback("rafz-coordinator", () => {
      if (!this.isActive) {
        this.start();
      }
    });

    // Согласование времени
    const originalNow = raf.now;
    raf.now = () => {
      return engine.isRunning ? engine.elapsedTime : originalNow();
    };
  }

  overrideReactSpringGlobals() {
    const originalRAF = Globals.requestAnimationFrame;
    const originalCAF = Globals.cancelAnimationFrame;

    Globals.requestAnimationFrame = (callback) => {
      return raf(() => {
        callback(raf.now());
        return false;
      });
    };

    Globals.cancelAnimationFrame = (id) => {
      raf.cancel(id);
      if (originalCAF) originalCAF(id);
    };

    if (this.settings.batchUpdates && typeof window !== "undefined") {
      const ReactDOM =
        window.ReactDOM ||
        window.React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
          ?.ReactDOM;

      if (ReactDOM?.unstable_batchedUpdates) {
        raf.batchedUpdates = ReactDOM.unstable_batchedUpdates;
      }
    }

    this._originalRAF = originalRAF;
    this._originalCAF = originalCAF;
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
  }

  stop() {
    this.isActive = false;
  }

  register(id, callback, phase = "update") {
    const callbackId = id || `callback-${Math.random().toString(36).slice(2)}`;
    const wrappedCallback = (dt) => callback(this.frameId, dt);

    this.frameCallbacks.set(callbackId, wrappedCallback);

    switch (phase) {
      case "write":
        raf.write(wrappedCallback);
        break;
      case "start":
        raf.onStart(wrappedCallback);
        break;
      case "frame":
        raf.onFrame(wrappedCallback);
        break;
      case "finish":
        raf.onFinish(wrappedCallback);
        break;
      case "update":
      default:
        raf(wrappedCallback);
        break;
    }

    if (!this.isActive) {
      this.start();
    }

    return callbackId;
  }

  unregister(id) {
    const callback = this.frameCallbacks.get(id);
    if (callback) {
      raf.cancel(callback);
      this.frameCallbacks.delete(id);
    }
  }

  runFramePhase(phase) {
    // Можно расширить логикой фаз, если нужно
  }

  throttle(fn) {
    return raf.throttle(fn);
  }

  setTimeout(callback, ms) {
    return raf.setTimeout(callback, ms);
  }

  configure(settings = {}) {
    Object.assign(this.settings, settings);
    raf.frameLoop = "demand"; // 🧷 Жесткое правило: только manual

    if (
      settings.useEngineIntegration !== undefined &&
      settings.useEngineIntegration !== this.settings.useEngineIntegration
    ) {
      if (settings.useEngineIntegration && engine) {
        this.setupEngineIntegration();
      } else {
        this.integrationEnabled = false;
      }
    }
  }

  now() {
    return raf.now();
  }

  sync(fn) {
    raf.sync(fn);
  }

  advance(ms) {
    raf.advance(ms); // использовать только в тестах
  }
}

export const rafzCoordinator = new RafzCoordinator();
export { raf };
