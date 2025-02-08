import React from 'react';

const AnimatedTexturesOne = () => {
  const createNoiseSVG = (baseFreq, numOctaves, seed = 0) => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Светлые текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Светлые интерактивные текстуры</h2>

          {/* Металлический с волной света */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #e8e8e8, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.6, 4)}, 
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'overlay, soft-light',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 6)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 20px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.6, 4)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Волна света</h3>
            <p className="text-gray-700">Текстура с эффектом световой волны</p>
          </div>

          {/* Глубинный рельеф */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(160deg, #e5e5e5, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.5, 4)}, ${createNoiseSVG(0.8, 2, 123)},
                               radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
              backgroundBlendMode: 'soft-light, multiply, overlay',
              boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 6)}, ${createNoiseSVG(0.6, 3, 123)},
                radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 30px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.5, 4)}, ${createNoiseSVG(0.8, 2, 123)},
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Глубинный рельеф</h3>
            <p className="text-gray-700">Текстура с эффектом глубины</p>
          </div>
        </div>

        {/* Тёмные текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Тёмные интерактивные текстуры</h2>

          {/* Вихревой чёрный */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: '#1a1a1a',
              backgroundImage: `${createNoiseSVG(0.55, 2)}, 
                               radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.25, 4)}, 
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 20px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.55, 2)}, 
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3)';
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Вихревой чёрный</h3>
            <p className="text-gray-400">Текстура с эффектом вихревого свечения</p>
          </div>

          {/* Глубокий бархат */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: '#181818',
              backgroundImage: `${createNoiseSVG(0.6, 2)}, 
                               repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 20%)`,
              backgroundBlendMode: 'soft-light, color-dodge',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 4)}, 
                repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 25px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.6, 2)}, 
                repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 20%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)';
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Глубокий бархат</h3>
            <p className="text-gray-400">Текстура с эффектом глубокого бархата</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTextures;