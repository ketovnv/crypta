import React from 'react';

const DarkStaticTextures = () => {
  const createNoiseSVG = (baseFreq, numOctaves, seed = 0) => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="container mx-auto p-8 bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Тёмные статичные текстуры</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Глубокие тёмные текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-200">Глубокие текстуры</h2>

          {/* Космический чёрный */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, #111111, #151515)',
              backgroundImage: `${createNoiseSVG(0.7, 3)},
                               radial-gradient(circle at 40% 40%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 60%),
                               radial-gradient(circle at 60% 60%, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 50%)`,
              backgroundBlendMode: 'soft-light, overlay, color-dodge',
              boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.3)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Космический чёрный</h3>
            <p className="text-gray-400">Глубокая текстура с многослойным рельефом и мягкими световыми акцентами</p>
          </div>

          {/* Обсидиановый */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(165deg, #141414, #1a1a1a)',
              backgroundImage: `${createNoiseSVG(0.8, 2)},
                               linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.01) 100%)`,
              backgroundBlendMode: 'soft-light, color-dodge',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.25)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Обсидиановый</h3>
            <p className="text-gray-400">Гладкая текстура с едва заметным градиентным переливом</p>
          </div>

          {/* Глубокий малахит */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(170deg, #161616, #1d1d1d)',
              backgroundImage: `${createNoiseSVG(0.6, 4)},
                               repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.01) 2px, transparent 2px, transparent 4px)`,
              backgroundBlendMode: 'overlay, color-dodge',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Глубокий малахит</h3>
            <p className="text-gray-400">Текстура с тонким геометрическим узором и глубоким отливом</p>
          </div>
        </div>

        {/* Матовые тёмные текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-200">Матовые текстуры</h2>

          {/* Чёрный бархат */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, #131313, #181818)',
              backgroundImage: `${createNoiseSVG(0.9, 2)},
                               radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 70%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Чёрный бархат</h3>
            <p className="text-gray-400">Мягкая матовая текстура с бархатистым эффектом</p>
          </div>

          {/* Угольный */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(165deg, #171717, #1c1c1c)',
              backgroundImage: `${createNoiseSVG(1.2, 2)},
                               ${createNoiseSVG(0.4, 1, 123)}`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Угольный</h3>
            <p className="text-gray-400">Зернистая матовая текстура с двухслойным шумом</p>
          </div>

          {/* Дымчатый */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(170deg, #151515, #1b1b1b)',
              backgroundImage: `${createNoiseSVG(0.5, 3)},
                               linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.01) 100%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Дымчатый</h3>
            <p className="text-gray-400">Лёгкая текстура с эффектом дымки</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-200">Контрастные тёмные текстуры</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Металлический графит */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a, #222222)',
              backgroundImage: `${createNoiseSVG(0.7, 3)},
                               repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px),
                               radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 60%)`,
              backgroundBlendMode: 'soft-light, overlay, color-dodge',
              boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.25)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Металлический графит</h3>
            <p className="text-gray-400">Контрастная текстура с металлическим отливом и тонкой геометрией</p>
          </div>

          {/* Глянцевый оникс */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(165deg, #141414, #1d1d1d)',
              backgroundImage: `${createNoiseSVG(0.6, 2)},
                               radial-gradient(circle at 40% 40%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%),
                               linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.02) 100%)`,
              backgroundBlendMode: 'soft-light, overlay, color-dodge',
              boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.3)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Глянцевый оникс</h3>
            <p className="text-gray-400">Глянцевая текстура с многослойными световыми акцентами</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkStaticTextures;