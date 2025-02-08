import React from 'react';

const StaticTextures = () => {
  // Функция для создания SVG шума с разными параметрами
  const createNoiseSVG = (baseFreq, numOctaves, seed = 0) => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Светлые текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Светлые статичные текстуры</h2>

          {/* Жемчужная поверхность */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, #f8f8f8, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.6, 3)},
                               radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.06)'
            }}
          >
            <h3 className="text-xl font-bold mb-3">Жемчужная поверхность</h3>
            <p className="text-gray-700">Нежная текстура с лёгким градиентным переходом</p>
          </div>

          {/* Тонкая матовая */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(165deg, #f5f5f5, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.8, 2)},
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.04)'
            }}
          >
            <h3 className="text-xl font-bold mb-3">Тонкая матовая</h3>
            <p className="text-gray-700">Едва заметная текстура с матовым эффектом</p>
          </div>

          {/* Лёгкий металл */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(170deg, #f0f0f0, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.7, 3)},
                               repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 1px 6px rgba(0,0,0,0.05)'
            }}
          >
            <h3 className="text-xl font-bold mb-3">Лёгкий металл</h3>
            <p className="text-gray-700">Текстура с тонким металлическим узором</p>
          </div>
        </div>

        {/* Тёмные текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Тёмные статичные текстуры</h2>

          {/* Глубокий графит */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a, #232323)',
              backgroundImage: `${createNoiseSVG(0.6, 2)},
                               radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 60%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Глубокий графит</h3>
            <p className="text-gray-400">Глубокая текстура с лёгким отливом</p>
          </div>

          {/* Тонкий уголь */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(165deg, #202020, #282828)',
              backgroundImage: `${createNoiseSVG(0.8, 2)},
                               linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.01) 100%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Тонкий уголь</h3>
            <p className="text-gray-400">Матовая текстура с мягким градиентом</p>
          </div>

          {/* Чёрный шёлк */}
          <div 
            className="p-8 rounded-lg"
            style={{
              background: 'linear-gradient(170deg, #181818, #1e1e1e)',
              backgroundImage: `${createNoiseSVG(0.7, 2)},
                               repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.01) 2px, transparent 2px, transparent 4px)`,
              backgroundBlendMode: 'soft-light, color-dodge',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Чёрный шёлк</h3>
            <p className="text-gray-400">Шелковистая текстура с деликатным узором</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticTextures;