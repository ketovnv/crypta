import chroma from 'chroma-js'
import { Globals } from '@react-spring/core'

const oklchColorInterpolator = (config) => {
  const { range, output, extrapolate } = config
  
  return (input) => {
    // Конвертируем цвета в OKLCH
    const colors = output.map(color => {
      try {
        return chroma(color).oklch()
      } catch {
        // Fallback для невалидных цветов
        return chroma('#000000').oklch()
      }
    })
    
    // Интерполируем в OKLCH пространстве
    const progress = (input - range[0]) / (range[1] - range[0])
    const clampedProgress = Math.max(0, Math.min(1, progress))
    
    if (colors.length === 2) {
      // Простая интерполяция между двумя цветами
      const [l1, c1, h1] = colors[0]
      const [l2, c2, h2] = colors[1]
      
      // Особая обработка hue для кратчайшего пути
      let hueDiff = h2 - h1
      if (hueDiff > 180) hueDiff -= 360
      if (hueDiff < -180) hueDiff += 360
      
      const interpolatedL = l1 + (l2 - l1) * clampedProgress
      const interpolatedC = c1 + (c2 - c1) * clampedProgress  
      const interpolatedH = h1 + hueDiff * clampedProgress
      
      return chroma.oklch(interpolatedL, interpolatedC, interpolatedH).hex()
    } else {
      // Множественные цвета - используем chroma.scale
      const scale = chroma.scale(output).mode('oklch')
      return scale(clampedProgress).hex()
    }
  }
}

// Применяем глобально
Globals.assign({
  createColorInterpolator: oklchColorInterpolator
})





javascript// Теперь градиенты будут интерполироваться через OKLCH!
const gradientSpring = useSpring({
  from: { 
    gradient: 'linear-gradient(45deg, oklch(0.7 0.15 0), oklch(0.8 0.1 120))' 
  },
  to: { 
    gradient: 'linear-gradient(45deg, oklch(0.5 0.2 240), oklch(0.9 0.05 300))' 
  }
})

// Или через ваш MobX подход
class GradientController {
  gradientSpring = new SpringValue(
    'linear-gradient(45deg, oklch(0.7 0.15 0), oklch(0.8 0.1 120))'
  )
  
  animateToNewGradient(newGradient) {
    this.gradientSpring.start({
      to: newGradient,
      config: { tension: 120, friction: 14 }
    })
  }
}



mport { Globals } from '@react-spring/core'
import { raf } from '@react-spring/rafz'

// rafz ИСПОЛЬЗУЕТ тот RAF, который задан в Globals
const customRaf = (callback) => {
  const startTime = performance.now()
  return requestAnimationFrame((timestamp) => {
    // Ваша кастомная логика
    const deltaTime = timestamp - startTime
    callback(timestamp, { deltaTime, startTime })
  })
}

// Устанавливаем кастомный RAF в Globals
Globals.assign({
  requestAnimationFrame: customRaf
})

// rafz автоматически будет использовать ваш кастомный RAF
const throttledUpdate = raf.throttle((data) => {
  console.log('Throttled update with custom RAF timing:', data)
})


const gameRaf = (callback) => {
  let lastTime = 0
  
  const frame = (currentTime) => {
    const deltaTime = currentTime - lastTime
    const fps = 1000 / deltaTime
    
    // Пропускаем кадр если FPS слишком низкий
    if (fps < 30 && deltaTime > 33.33) {
      requestAnimationFrame(frame)
      return
    }
    
    lastTime = currentTime
    callback(currentTime, { deltaTime, fps })
  }
  
  return requestAnimationFrame(frame)
}

// Устанавливаем в Globals
Globals.assign({
  requestAnimationFrame: gameRaf
})

// rafz использует наш gameRaf под капотом
class AdvancedAnimationManager {
  constructor() {
    this.activeAnimations = new Set()
    this.stats = { frameCount: 0, avgFps: 60 }
  }
  
  // Throttled обновления через rafz (но с нашим кастомным RAF)
  updateStats = raf.throttle(({ fps, deltaTime }) => {
    this.stats.frameCount++
    this.stats.avgFps = (this.stats.avgFps + fps) / 2
  })
  
  // Batch обновления анимаций
  updateAnimations = raf.throttle(() => {
    for (const animation of this.activeAnimations) {
      animation.tick()
    }
  })
  
  start() {
    // rafz.onFrame использует наш gameRaf
    raf.onFrame((timestamp, timing) => {
      this.updateStats(timing)
      this.updateAnimations()
    })
  }
}


javascriptimport chroma from 'chroma-js'
import { Globals } from '@react-spring/core'
import { raf } from '@react-spring/rafz'

// 1. Настраиваем OKLCH интерполятор
Globals.assign({
  createColorInterpolator: oklchColorInterpolator,
  
  // 2. Кастомный RAF для плавности цветовых переходов
  requestAnimationFrame: (callback) => {
    return requestAnimationFrame((timestamp) => {
      // Дополнительная логика для цветовых анимаций
      callback(timestamp)
    })
  }
})

// 3. MobX контроллер с rafz оптимизациями
class ColorAnimationController {
 colors = new Map()
  
  constructor() {
    // rafz автоматически использует наш кастомный RAF
    this.batchColorUpdates = raf.throttle(this.updateColors)
  }
  
  .bound
  updateColors() {
    // Batch обновления всех цветов за один кадр
    for (const [key, spring] of this.colors) {
      const currentColor = spring.get()
      // Обновляем только если цвет изменился
      if (this.hasColorChanged(key, currentColor)) {
        this.setColor(key, currentColor)
      }
    }
  }
  
  createColorSpring(key, fromColor, toColor) {
    const spring = new SpringValue(fromColor)
    
    spring.start({
      to: toColor,
      onChange: () => {
        // Throttled обновления через rafz + кастомный RAF
        this.batchColorUpdates()
      }
    })
    
    this.colors.set(key, spring)
    return spring
  }
}

// 1. Кастомный интерполятор для анимации отдельных цветов
const oklchColorInterpolator = (config) => {
  // Ваша логика интерполяции OKLCH
  return (input) => {
    // ... интерполяция в OKLCH пространстве
  }
}

Globals.assign({
  createColorInterpolator: oklchColorInterpolator
})

// 2. Используем CSS "in oklch" для финального градиента
class AdvancedGradientController {
  gradientColors = []
  gradientAngle = 45
  
  // Анимируем отдельные цвета через React Spring
  animateColor(index, newColor) {
    const spring = new SpringValue(this.gradientColors[index])
    spring.start({
      to: newColor,
      onChange: (value) => {
        runInAction(() => {
          this.gradientColors[index] = value.get()
        })
      }
    })
  }
  
  // Генерируем CSS градиент с "in oklch"
  @computed
  get cssGradient() {
    const colors = this.gradientColors.join(', ')
    return `linear-gradient(in oklch ${this.gradientAngle}deg, ${colors})`
  }
}
