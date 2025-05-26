import { invoke } from "@tauri-apps/api/tauri";
import { raf } from "@react-spring/rafz";

class TauriGpuBridge {
  constructor() {
    this.isInitialized = false;
    this.bufferPool = new Map();
    this.activeAnimations = new Map();
    this.batchQueue = new Set();
    this.gpuContext = null;

    this.bufferConfig = {
      maxBuffers: 32,
      bufferSize: 1024,
      reuseThreshold: 0.7,
      compactionInterval: 10000,
    };

    this.batchConfig = {
      maxBatchSize: 16,
      batchTimeout: 2,
      priorityThreshold: 100,
    };

    this.metrics = {
      buffersInUse: 0,
      batchesProcessed: 0,
      avgBatchSize: 0,
      gpuUtilization: 0,
    };

    this.setupCompaction();
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      if (!window.__TAURI__) {
        console.warn("Tauri not available, GPU bridge disabled");
        return false;
      }

      this.gpuContext = await invoke("init_gpu_context");
      this.isInitialized = true;

      this.startBatchProcessor();
      return true;
    } catch (error) {
      console.error("GPU bridge initialization failed:", error);
      return false;
    }
  }

  async createBatchedAnimation(animationGroups) {
    if (!this.isInitialized) {
      throw new Error("GPU bridge not initialized");
    }

    const batchId = this.generateBatchId();
    const optimizedBatches = this.optimizeBatches(animationGroups);

    const gpuBatch = {
      id: batchId,
      batches: optimizedBatches,
      buffers: new Map(),
      status: "preparing",
      priority: this.calculateBatchPriority(animationGroups),
    };

    for (const batch of optimizedBatches) {
      const buffer = await this.acquireBuffer(batch.dataSize);
      await this.prepareBufferData(buffer, batch);
      gpuBatch.buffers.set(batch.id, buffer);
    }

    this.activeAnimations.set(batchId, gpuBatch);
    return this.createBatchInterface(gpuBatch);
  }

  async acquireBuffer(requiredSize) {
    const poolKey = this.getPoolKey(requiredSize);
    let availableBuffers = this.bufferPool.get(poolKey);

    if (!availableBuffers) {
      availableBuffers = [];
      this.bufferPool.set(poolKey, availableBuffers);
    }

    let buffer = availableBuffers.find((b) => !b.inUse);

    if (!buffer) {
      if (this.metrics.buffersInUse >= this.bufferConfig.maxBuffers) {
        await this.performBufferCompaction();
      }

      buffer = await this.createBuffer(requiredSize);
      availableBuffers.push(buffer);
    }

    buffer.inUse = true;
    buffer.lastUsed = performance.now();
    this.metrics.buffersInUse++;

    return buffer;
  }

  async createBuffer(size) {
    const bufferId = await invoke("create_gpu_buffer", {
      size: Math.max(size, this.bufferConfig.bufferSize),
      usage: "storage_read_write",
    });

    return {
      id: bufferId,
      size,
      inUse: false,
      lastUsed: 0,
      createdAt: performance.now(),
      data: new Float32Array(size),
    };
  }

  releaseBuffer(buffer) {
    if (!buffer || !buffer.inUse) return;

    buffer.inUse = false;
    buffer.lastUsed = performance.now();
    this.metrics.buffersInUse--;
  }

  optimizeBatches(animationGroups) {
    const batches = [];
    let currentBatch = null;
    let currentBatchSize = 0;

    const sortedGroups = animationGroups.sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return a.values.length - b.values.length;
    });

    for (const group of sortedGroups) {
      const groupSize = group.values.length;

      if (
        !currentBatch ||
        currentBatchSize + groupSize > this.batchConfig.maxBatchSize ||
        Math.abs(currentBatch.priority - (group.priority || 0)) >
          this.batchConfig.priorityThreshold
      ) {
        if (currentBatch) {
          batches.push(currentBatch);
        }

        currentBatch = {
          id: this.generateId(),
          groups: [group],
          dataSize: groupSize,
          priority: group.priority || 0,
          strategy: this.selectStrategy(group),
        };
        currentBatchSize = groupSize;
      } else {
        currentBatch.groups.push(group);
        currentBatch.dataSize += groupSize;
        currentBatchSize += groupSize;
      }
    }

    if (currentBatch) {
      batches.push(currentBatch);
    }

    return batches;
  }

  selectStrategy(group) {
    if (group.values.length > 500) return "parallel_compute";
    if (group.config?.usePhysics) return "spring_physics";
    if (group.config?.interpolation === "linear") return "linear_interpolation";
    return "default_spring";
  }

  async prepareBufferData(buffer, batch) {
    let offset = 0;
    const bufferData = buffer.data;

    for (const group of batch.groups) {
      const flatValues = this.flattenValues(group.values);
      bufferData.set(flatValues, offset);
      offset += flatValues.length;
    }

    await invoke("upload_buffer_data", {
      bufferId: buffer.id,
      data: Array.from(bufferData.slice(0, offset)),
    });
  }

  startBatchProcessor() {
    let batchTimeoutId = null;

    raf(() => {
      if (this.batchQueue.size === 0) return true;

      if (
        this.batchQueue.size >= this.batchConfig.maxBatchSize ||
        (batchTimeoutId &&
          performance.now() - batchTimeoutId > this.batchConfig.batchTimeout)
      ) {
        this.processBatch();
        batchTimeoutId = null;
      } else if (!batchTimeoutId) {
        batchTimeoutId = performance.now();
      }

      return true;
    });
  }

  async processBatch() {
    if (this.batchQueue.size === 0) return;

    const batchItems = Array.from(this.batchQueue);
    this.batchQueue.clear();

    const priorityGroups = this.groupByPriority(batchItems);

    for (const [priority, items] of priorityGroups) {
      await this.processParallelBatch(items);
    }

    this.updateBatchMetrics(batchItems.length);
  }

  async processParallelBatch(items) {
    const computePromises = items.map(async (item) => {
      try {
        const result = await this.executeGpuCompute(item);
        this.updateAnimationState(item, result);
        return result;
      } catch (error) {
        console.error("Batch item failed:", error, item);
        return null;
      }
    });

    await Promise.allSettled(computePromises);
  }

  async executeGpuCompute(item) {
    const { batch, frameData } = item;

    const computeConfig = {
      strategy: batch.strategy,
      deltaTime: frameData.deltaTime,
      workgroupSize: Math.min(256, Math.ceil(batch.dataSize / 32)),
      iterations: frameData.frameCount % 4 === 0 ? 2 : 1,
    };

    return await invoke("compute_batch_frame", {
      batchId: batch.id,
      config: computeConfig,
      frameId: frameData.frameId,
    });
  }

  updateAnimationState(item, result) {
    if (!result || !result.success) return;

    const { batch, callback } = item;
    const animation = this.activeAnimations.get(batch.parentId);

    if (animation && callback) {
      const unflattenedValues = this.unflattenValues(
        result.data,
        batch.template,
      );
      callback(unflattenedValues);
    }
  }

  createBatchInterface(gpuBatch) {
    return {
      id: gpuBatch.id,

      start: (targetValues, callback) => {
        return this.startBatchAnimation(gpuBatch, targetValues, callback);
      },

      pause: () => {
        gpuBatch.status = "paused";
      },

      resume: () => {
        gpuBatch.status = "running";
      },

      stop: () => {
        this.stopBatchAnimation(gpuBatch.id);
      },

      update: (frameData) => {
        if (gpuBatch.status === "running") {
          this.queueBatchUpdate(gpuBatch, frameData);
        }
      },

      dispose: () => {
        this.disposeBatch(gpuBatch.id);
      },
    };
  }

  startBatchAnimation(batch, targetValues, callback) {
    batch.status = "running";
    batch.callback = callback;
    batch.targetValues = targetValues;

    return new Promise((resolve) => {
      batch.onComplete = resolve;
    });
  }

  queueBatchUpdate(batch, frameData) {
    for (const [batchId, buffer] of batch.buffers) {
      this.batchQueue.add({
        batch: {
          id: batchId,
          parentId: batch.id,
          strategy: batch.batches.find((b) => b.id === batchId)?.strategy,
          dataSize: buffer.size,
          template: batch.template,
        },
        frameData,
        callback: batch.callback,
      });
    }
  }

  stopBatchAnimation(batchId) {
    const batch = this.activeAnimations.get(batchId);
    if (!batch) return;

    batch.status = "stopped";

    for (const buffer of batch.buffers.values()) {
      this.releaseBuffer(buffer);
    }
  }

  async disposeBatch(batchId) {
    const batch = this.activeAnimations.get(batchId);
    if (!batch) return;

    this.stopBatchAnimation(batchId);

    try {
      await invoke("dispose_batch", { batchId });
    } catch (error) {
      console.error("Failed to dispose batch:", error);
    }

    this.activeAnimations.delete(batchId);
  }

  setupCompaction() {
    setInterval(() => {
      this.performBufferCompaction();
    }, this.bufferConfig.compactionInterval);
  }

  async performBufferCompaction() {
    const cutoff = performance.now() - this.bufferConfig.compactionInterval;

    for (const [poolKey, buffers] of this.bufferPool) {
      const activeBuffers = buffers.filter((buffer) => {
        if (buffer.inUse) return true;

        if (buffer.lastUsed < cutoff) {
          this.disposeBuffer(buffer);
          return false;
        }

        return true;
      });

      this.bufferPool.set(poolKey, activeBuffers);
    }
  }

  async disposeBuffer(buffer) {
    try {
      await invoke("dispose_gpu_buffer", { bufferId: buffer.id });
    } catch (error) {
      console.error("Failed to dispose buffer:", error);
    }
  }

  flattenValues(values) {
    const result = [];

    if (Array.isArray(values)) {
      for (const value of values) {
        if (typeof value === "number") {
          result.push(value);
        } else if (typeof value === "object" && value !== null) {
          result.push(...this.flattenValues(Object.values(value)));
        }
      }
    } else if (typeof values === "object" && values !== null) {
      result.push(...this.flattenValues(Object.values(values)));
    } else if (typeof values === "number") {
      result.push(values);
    }

    return result;
  }

  unflattenValues(flatArray, template) {
    if (!template) return flatArray;

    const result = {};
    let index = 0;

    for (const key in template) {
      if (typeof template[key] === "number") {
        result[key] = flatArray[index++];
      } else if (typeof template[key] === "object") {
        const subSize = this.getObjectSize(template[key]);
        result[key] = this.unflattenValues(
          flatArray.slice(index, index + subSize),
          template[key],
        );
        index += subSize;
      }
    }

    return result;
  }

  getObjectSize(obj) {
    let size = 0;
    for (const value of Object.values(obj)) {
      if (typeof value === "number") {
        size++;
      } else if (typeof value === "object" && value !== null) {
        size += this.getObjectSize(value);
      }
    }
    return size;
  }

  groupByPriority(items) {
    const groups = new Map();

    for (const item of items) {
      const priority = item.batch.priority || 0;
      if (!groups.has(priority)) {
        groups.set(priority, []);
      }
      groups.get(priority).push(item);
    }

    return new Map([...groups.entries()].sort((a, b) => b[0] - a[0]));
  }

  calculateBatchPriority(groups) {
    return groups.reduce((max, group) => Math.max(max, group.priority || 0), 0);
  }

  updateBatchMetrics(batchSize) {
    this.metrics.batchesProcessed++;
    this.metrics.avgBatchSize = (this.metrics.avgBatchSize + batchSize) / 2;
  }

  getPoolKey(size) {
    return (
      Math.ceil(size / this.bufferConfig.bufferSize) *
      this.bufferConfig.bufferSize
    );
  }

  generateId() {
    return `gpu-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  generateBatchId() {
    return `batch-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  getMetrics() {
    return {
      ...this.metrics,
      bufferPoolSize: Array.from(this.bufferPool.values()).reduce(
        (sum, buffers) => sum + buffers.length,
        0,
      ),
      activeAnimations: this.activeAnimations.size,
      queuedBatches: this.batchQueue.size,
    };
  }
}

export const tauriGpuBridge = new TauriGpuBridge();
