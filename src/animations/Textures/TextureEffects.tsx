import React from 'react';

const TextureEffects = () => {
  const createNoiseSVG = (baseFreq, numOctaves, seed = 0) => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Светлые текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Светлые текстуры с эффектами</h2>

          {/* Эффект 1: Перламутровое свечение */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f0f0f0, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.6, 3)},
                               radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%),
                               linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'soft-light, overlay, screen',
              boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.1)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 5)},
                radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%),
                linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.2) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 30px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.6, 3)},
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%),
                linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 15px rgba(0,0,0,0.1)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Перламутровый эффект</h3>
            <p className="text-gray-700">Многослойная текстура с переливающимся свечением</p>
          </div>

          {/* Эффект 2: Кристаллическая структура */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(160deg, #e8e8e8, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.8, 2)},
                               repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px),
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'soft-light, overlay, screen',
              boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.08)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.4, 4)},
                repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 3px, transparent 3px, transparent 6px),
                linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.1) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 40px rgba(0,0,0,0.12), 0 15px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.8, 2)},
                repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px),
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 20px rgba(0,0,0,0.08)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Кристаллическая структура</h3>
            <p className="text-gray-700">Текстура с геометрическим узором и световыми переходами</p>
          </div>

          {/* Эффект 3: Голографический */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(170deg, #f5f5f5, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.5, 4)},
                               ${createNoiseSVG(1.2, 2, 123)},
                               radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
              backgroundBlendMode: 'soft-light, color-dodge, overlay',
              boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.1)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 6)},
                ${createNoiseSVG(0.8, 3, 123)},
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 30px rgba(0,0,0,0.15), 0 15px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.5, 4)},
                ${createNoiseSVG(1.2, 2, 123)},
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 15px rgba(0,0,0,0.1)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Голографический эффект</h3>
            <p className="text-gray-700">Текстура с эффектом голографического перелива</p>
          </div>
        </div>

        {/* Тёмные текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Тёмные текстуры с эффектами</h2>

          {/* Эффект 4: Глубокий космос */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: '#121212',
              backgroundImage: `${createNoiseSVG(0.7, 2)},
                               ${createNoiseSVG(0.3, 4, 789)},
                               radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)`,
              backgroundBlendMode: 'soft-light, screen, overlay',
              boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.4)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.4, 3)},
                ${createNoiseSVG(0.2, 5, 789)},
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 80%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 40px rgba(0,0,0,0.6), 0 15px 25px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.7, 2)},
                ${createNoiseSVG(0.3, 4, 789)},
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 20px rgba(0,0,0,0.4)';
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Глубокий космос</h3>
            <p className="text-gray-400">Многослойная текстура с эффектом глубины пространства</p>
          </div>

          {/* Эффект 5: Чёрный оникс */}
          <div 
            className="p-8 rounded-lg relative overflow-hidden transform transition-all duration-1000 hover:scale-105 cursor-pointer"
            style={{
              background: '#1a1a1a',
              backgroundImage: `${createNoiseSVG(0.6, 2)},
                               repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 15%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.3)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 4)},
                repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 20%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 30px rgba(0,0,0,0.4), 0 15px 25px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.6, 2)},
                repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 15%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 15px rgba(0,0,0,0.3)';
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Чёрный оникс</h3>
            <p className="text-gray-400">Текстура с эффектом полированного камня</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextureEffects;