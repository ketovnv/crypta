# 🚀 Animation System - Quick Start

Ready-to-use animation system built on your existing `timeEngine` with React Spring integration.

## ⚡ Super Quick Start (30 seconds)

```jsx
import { QuickStart } from './animations';

function App() {
  return <QuickStart />;
}
```

Done! You have a working animation demo.

## 🎯 Basic Usage

### 1. Simple Animation

```jsx
import { useQuickAnimation } from './animations';

function MyComponent() {
  const { animate } = useQuickAnimation();
  const elementRef = useRef(null);

  const handleClick = () => {
    animate(elementRef.current, {
      x: 200,
      y: 100,
      scale: 1.2,
      rotation: 45
    });
  };

  return <div ref={elementRef} onClick={handleClick}>Click me!</div>;
}
```

### 2. With Gradients (your existing gradientStore)

```jsx
import { animateWithGradient } from './animations';

const animateBox = () => {
  animateWithGradient(elementRef.current, {
    x: 100,
    scale: 1.5
  });
};
```

### 3. Direct API

```jsx
import animations from './animations';

// Start the system
animations.init();

// Animate any element
animations.animate(element, { x: 100, y: 50 });

// Spring animation
animations.spring(element, { scale: 1.2 }, { tension: 300 });

// CSS animation
animations.css(element, { opacity: 0.5 }, { duration: 1000 });
```

## 🎛️ Controls

```jsx
import { timeEngine, setAnimationSpeed } from './animations';

// Speed control
setAnimationSpeed(0.5); // Slow motion
setAnimationSpeed(2);   // Double speed

// VSync toggle
timeEngine.enableVSync();
timeEngine.disableVSync();
```

## 📊 Presets

```jsx
import { ANIMATION_PRESETS, useAnimation } from './animations';

const { animate } = useAnimation(ANIMATION_PRESETS.BOUNCE);
const { animate: smoothAnimate } = useAnimation(ANIMATION_PRESETS.SMOOTH);
const { animate: elasticAnimate } = useAnimation(ANIMATION_PRESETS.ELASTIC);
```

Available presets: `BOUNCE`, `SMOOTH`, `SLOW`, `ELASTIC`, `STIFF`

## 🔧 Configuration

```jsx
import { initAnimationSystem } from './animations';

initAnimationSystem({
  autoStart: true,    // Start automatically
  targetFps: 60,      // Target FPS
  vsync: true,        // Use VSync
  timeScale: 1        // Animation speed multiplier
});
```

## 📱 React Components

### QuickStart Demo
```jsx
import { QuickStart } from './animations';
<QuickStart />
```

### Full Demo
```jsx
import { SimpleAnimationDemo } from './animations';
<SimpleAnimationDemo />
```

## 🎨 Integration with Your Stores

Works automatically with:
- ✅ `timeEngine` - your existing time system
- ✅ `gradientStore` - automatic gradient application
- ✅ `MobX` - reactive updates
- ✅ `React Spring` - seamless integration

## 📈 Performance Monitoring

```jsx
import { getAnimationMetrics } from './animations';

const metrics = getAnimationMetrics();
console.log(metrics.fps);              // Current FPS
console.log(metrics.activeAnimations); // Active count
console.log(metrics.elapsedTime);      // Total time
```

## 🚨 Emergency Controls

```jsx
import { pauseAllAnimations, stopAnimationEngine } from './animations';

// Stop everything
pauseAllAnimations();

// Stop the engine
stopAnimationEngine();
```

## 🔮 Advanced Features (Coming Later)

- GPU acceleration via Tauri
- RAF coordination
- Batch processing
- Performance adaptive throttling

## 📝 Examples

### Animate on Mount
```jsx
function Component() {
  const ref = useRef(null);
  const { animate } = useQuickAnimation();

  useEffect(() => {
    animate(ref.current, { opacity: 1, y: 0 });
  }, []);

  return <div ref={ref} style={{ opacity: 0, transform: 'translateY(20px)' }} />;
}
```

### Chain Animations
```jsx
const runChain = async () => {
  await animate(element, { x: 100 });
  await animate(element, { y: 100 });
  await animate(element, { x: 0, y: 0 });
};
```

### Performance Monitoring
```jsx
useEffect(() => {
  const interval = setInterval(() => {
    const metrics = getAnimationMetrics();
    if (metrics.fps < 30) {
      console.warn('Low FPS detected:', metrics.fps);
    }
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

That's it! Your animation system is ready to use. 🎉