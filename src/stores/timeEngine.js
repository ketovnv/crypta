// AdaptiveTimeEngine.js
// -----------------------------------------------------------------------------
// Unified timer/clock for the whole app.  Designed to be consumed by
// UnifiedAnimationEngine (unifiedAnimationEngine.js):
//   • drives rafz (frameLoop: 'manual')
//   • supports VSync *и* фиксированную частоту без rAF
//   • масштабирует время через `timeScale`
//   • собирает FPS‑метрики и динамически занижает detail‑level
//   • предоставляет хуки useTimerData / useSpringSync / useFramerMotionSync
// -----------------------------------------------------------------------------

import { makeAutoObservable, runInAction } from "mobx";
import { raf } from "@animations/unified/RafzCoordinator";

/* -------------------------------------------------------------------------- */
/*  1.  Core store                                                             */

/* -------------------------------------------------------------------------- */
class AdaptiveTimeEngine {
  // === observables ===
  elapsedTime = 0; // virtual ms (scaled by timeScale)
  fps = 0;
  frameId = 0;
  isRunning = false;
  vsync = true;
  targetFps = 60;
  timeScale = 1.0;

  // === internals ===
  _lastReal = 0; // timestamp of previous _tick (real ms)
  _rAFId = 0;
  _timerId = 0;
  _callbacks = new Map(); // id → fn(frameId, dt, elapsed)

  // fps calculation
  _frameCnt = 0;
  _lastFpsStamp = 0;
  _frameTimes = [];

  constructor() {
    console.time();
    makeAutoObservable(this, { _callbacks: false });
  }

  /* ----------------------------  public api  ---------------------------- */
  start = () => {
    if (this.isRunning) return;
    this.isRunning = true;
    this._lastReal = performance.now();
    this._lastFpsStamp = this._lastReal;
    this.vsync ? this._tickRAF() : this._tickInterval();
  };

  stop = () => {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.vsync) cancelAnimationFrame(this._rAFId);
    else clearInterval(this._timerId);
  };

  enableVSync = () => {
    if (!this.vsync) {
      this.vsync = true;
      this.restart();
    }
  };
  disableVSync = () => {
    if (this.vsync) {
      this.vsync = false;
      this.restart();
    }
  };
  setTargetFps = (fps) => {
    this.targetFps = Math.max(1, Math.min(fps, 240));
    if (!this.vsync) this.restart();
  };
  setTimeScale = (s) => {
    this.timeScale = Math.max(0, s);
  };

  registerRenderCallback = (id, fn) => {
    this._callbacks.set(id, fn);
    return () => this._callbacks.delete(id);
  };
  unregisterRenderCallback = (id) => this._callbacks.delete(id);

  /* ---------------------------  internal loop  -------------------------- */
  restart() {
    this.stop();
    this.start();
  }

  _tickRAF = () => {
    this._rAFId = requestAnimationFrame((ts) => {
      this._update(ts);
      if (this.isRunning) this._tickRAF();
    });
  };

  _tickInterval = () => {
    const interval = 1000 / this.targetFps;
    this._timerId = setInterval(
      () => this._update(performance.now()),
      interval,
    );
  };

  _update(now) {
    const realDt = now - this._lastReal;
    this._lastReal = now;

    // clamp huge jumps (tab inactive)
    const clamped = Math.min(realDt, 1000 / 15); // max 15 fps gap
    const dt = clamped * this.timeScale;

    runInAction(() => {
      this.elapsedTime += dt;
      this.frameId++;
    });

    // drive rafz manual loop so that UnifiedAnimationEngine can advance
    raf.advance(dt);

    // fire render callbacks (try/catch isolated)
    for (const fn of this._callbacks.values()) {
      try {
        fn(this.frameId, dt, this.elapsedTime);
      } catch (e) {
        console.error(e);
      }
    }

    // fps stats (realDt)
    this._frameCnt++;
    if (now - this._lastFpsStamp >= 1000) {
      runInAction(() => {
        this.fps = this._frameCnt;
      });
      this._frameCnt = 0;
      this._lastFpsStamp = now;
    }
  }
}

export const timeEngine = new AdaptiveTimeEngine();

/* -------------------------------------------------------------------------- */
/*  2.  React hooks                                                            */
/* -------------------------------------------------------------------------- */
import { useEffect, useRef, useState } from "react";

export const useTimerData = () => {
  const [, force] = useState(0);
  const dataRef = useRef({
    frameId: timeEngine.frameId,
    deltaTime: 0,
    elapsed: timeEngine.elapsedTime,
  });

  useEffect(() => {
    const id = `timer-hook-${Math.random().toString(36).slice(2)}`;
    const dispose = timeEngine.registerRenderCallback(id, (fid, dt, el) => {
      dataRef.current = { frameId: fid, deltaTime: dt, elapsed: el };
      force((s) => s + 1); // re-render component
    });
    timeEngine.start();
    return () => {
      dispose();
      if (timeEngine._callbacks.size === 0) timeEngine.stop();
    };
  }, []);

  return dataRef.current;
};

export const useSpringSync = (api, mode = "non-vsync-only") => {
  const id = useRef(
    `spring-sync-${Math.random().toString(36).slice(2)}`,
  ).current;
  useEffect(() => {
    const arr = Array.isArray(api) ? api : [api];
    const valid = arr.filter((a) => a && typeof a.update === "function");
    if (!valid.length) return;
    const disp = timeEngine.registerRenderCallback(id, () => {
      if (
        mode === "always" ||
        (mode === "non-vsync-only" && !timeEngine.vsync)
      ) {
        valid.forEach((a) => a.update());
      }
    });
    return disp;
  }, [api, mode, id]);
};

export const useFramerMotionSync = (controls, mode = "non-vsync-only") => {
  const id = useRef(`fm-sync-${Math.random().toString(36).slice(2)}`).current;
  useEffect(() => {
    if (!controls || typeof controls.update !== "function") return;
    const disp = timeEngine.registerRenderCallback(id, () => {
      if (mode === "always" || (mode === "non-vsync-only" && !timeEngine.vsync))
        controls.update();
    });
    return disp;
  }, [controls, mode, id]);
};

/* -------------------------------------------------------------------------- */
/*  3.  Auto‑start in production (optional)                                    */
/* -------------------------------------------------------------------------- */
if (process.env.NODE_ENV === "production") {
  // автозапуск таймера в релизе; в дев‑режиме можно запустить вручную
  timeEngine.start();
}
