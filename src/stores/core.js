import { makeAutoObservable, runInAction, reaction } from "mobx";
import { Controller } from "@react-spring/web";
import { raf } from "@react-spring/rafz";
import seedrandom from "seedrandom";
import { useEffect, useRef, useState } from "react";
import { logger } from "./logger.js";

class Core {
  constructor() {
    makeAutoObservable(this);
  }

  createController(
    name,
    initialValues,
    options = { config: this.configManager.getConfig("gentle") },
  ) {
    const controller = new Controller({
      ...initialValues,
      ...options,
    });

    // this.controllers.set(name, api);

    const api = {
      controller,
      name,
      springs: controller.springs,

      to: (values, customConfig) => {
        logger.info(
          "start from",
          JSON.stringify(controller.springs.background),
        );
        logger.info("start to", JSON.stringify(values.background));
        // this.activeAnimations.add(name);
        return controller.start({
          ...values,
          config: customConfig || options.config,
          onRest: () => {
            // this.activeAnimations.delete(name);
            logger.success("animation", "completed", 30);
            options.onComplete?.();
          },
        });
      },

      start: (values, customConfig) => {
        // this.activeAnimations.add(name);
        return controller.start({
          ...values,
          config: customConfig?.config || options.config,
          onRest: () => {
            // this.activeAnimations.delete(name);
            customConfig?.onComplete?.() || options.onComplete?.();
          },
        });
      },

      sequence: async (steps) => {
        for (const step of steps) {
          await controller.start(step);
          if (step.delay) {
            await new Promise((resolve) => setTimeout(resolve, step.delay));
          }
        }
      },

      parallel: async (animations) => {
        return Promise.all(animations.map((anim) => controller.start(anim)));
      },

      set: (values) => controller.set(values),
      get: () => controller.get(),
      stop: () => controller.stop(),
      pause: () => controller.pause(),
      resume: () => controller.resume(),

      dispose: () => {
        controller.stop();
        this.controllers.delete(name);
        this.activeAnimations.delete(name);
      },
    };
    // this.controllers.set(name, api);
    return api;
  }

  // ===== Создание SpringValue =====
  // createSpringValue(initialValue, config = {}) {
  //   const preset = config.preset || "gentle";
  //   const springConfig = this.configManager.getConfig(preset, config);
  //
  //   const springValue = new SpringValue(initialValue, springConfig);
  //   const id = `spring-${Math.random().toString(36).slice(2)}`;
  //
  //   this.springs.set(id, springValue);
  //
  //   return {
  //     id,
  //     springValue,
  //     get: () => springValue.get(),
  //     set: (value) => springValue.start(value),
  //     start: (value, config) => springValue.start(value, config),
  //     stop: () => springValue.stop(),
  //     onChange: (callback) => springValue.start({ onChange: callback }),
  //     dispose: () => {
  //       springValue.stop();
  //       this.springs.delete(id);
  //     },
  //   };
  // }
}

export const core = new Core();
