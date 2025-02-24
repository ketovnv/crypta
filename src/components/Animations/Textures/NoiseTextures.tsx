import React from 'react';

const NoiseTextures = () => {
  // Функция для создания SVG шума с разными параметрами
  const createNoiseSVG = (baseFreq, numOctaves, seed = 0) => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="container mx-auto p-8 grid grid-cols-1 gap-8">
      {/* Мягкий объемный шум */}
      <div 
        className="p-6 rounded-lg shadow-lg relative overflow-hidden"
        style={{
          background: '#ffffff',
          backgroundImage: createNoiseSVG(0.65, 3),
          backgroundBlendMode: 'soft-light',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Мягкий объемный шум</h2>
        <p className="text-gray-700">Тонкая шумовая текстура с внутренними тенями для создания эффекта объема</p>
      </div>

      {/* Грубый рельефный шум */}
      <div 
        className="p-6 rounded-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(45deg, #f0f0f0, #ffffff)',
          backgroundImage: createNoiseSVG(0.9, 4),
          backgroundBlendMode: 'multiply',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Грубый рельефный шум</h2>
        <p className="text-gray-700">Более выраженная текстура с градиентом и тенями для создания рельефного эффекта</p>
      </div>

      {/* Металлический шум */}
      <div 
        className="p-6 rounded-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #e0e0e0, #ffffff)',
          backgroundImage: `${createNoiseSVG(0.75, 2)}, linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.2) 75%)`,
          backgroundBlendMode: 'overlay',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Металлический шум</h2>
        <p className="text-gray-700">Комбинация шума и градиента для создания эффекта металлической поверхности</p>
      </div>

      {/* Глубокий текстурный шум */}
      <div 
        className="p-6 rounded-lg relative overflow-hidden"
        style={{
          background: '#ffffff',
          backgroundImage: `${createNoiseSVG(0.5, 5)}, ${createNoiseSVG(0.8, 2, 123)}`,
          backgroundBlendMode: 'multiply, soft-light',
          boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Глубокий текстурный шум</h2>
        <p className="text-gray-700">Многослойный шум с разными параметрами для создания глубокой текстуры</p>
      </div>

      {/* Бумажный шум */}
      <div 
        className="p-6 rounded-lg relative overflow-hidden"
        style={{
          background: '#ffffff',
          backgroundImage: `${createNoiseSVG(1.5, 2)}, ${createNoiseSVG(0.4, 3, 456)}`,
          backgroundBlendMode: 'soft-light, multiply',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Бумажный шум</h2>
        <p className="text-gray-700">Тонкая зернистая текстура, имитирующая поверхность бумаги</p>
      </div>
    </div>
  );
};

export default NoiseTextures;