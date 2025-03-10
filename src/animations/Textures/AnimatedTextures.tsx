import React, { useState } from 'react';

const AnimatedTextures = () => {
  // Функция для создания SVG шума с разными параметрами
  const createNoiseSVG = (baseFreq, numOctaves, seed = 0) => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg' filter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Светлые текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Светлые интерактивные текстуры</h2>

          {/* Жемчужный металл с анимацией */}
          <div 
            className="p-6 rounded-lg relative overflow-hidden transform transition-all duration-700 hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #e8e8e8, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.6, 4)}, 
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'overlay, soft-light',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
              transition: 'all 0.7s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.4, 5)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 12px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.6, 4)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Жемчужный металл</h3>
            <p className="text-gray-700">Интерактивная текстура с эффектом перелива</p>
          </div>

          {/* Глянцевый металл с анимацией */}
          <div 
            className="p-6 rounded-lg relative overflow-hidden transform transition-all duration-700 hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'linear-gradient(170deg, #f5f5f5, #ffffff)',
              backgroundImage: `${createNoiseSVG(0.5, 4)}, 
                               linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.7s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.3, 5)}, 
                linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 15px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.5, 4)}, 
                linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            <h3 className="text-xl font-bold mb-3">Глянцевый металл</h3>
            <p className="text-gray-700">Интерактивная текстура с эффектом полировки</p>
          </div>
        </div>

        {/* Тёмные текстуры */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Тёмные интерактивные текстуры</h2>

          {/* Бархатный чёрный с анимацией */}
          <div 
            className="p-6 rounded-lg relative overflow-hidden transform transition-all duration-700 hover:scale-[1.02] cursor-pointer"
            style={{
              background: '#1a1a1a',
              backgroundImage: `${createNoiseSVG(0.55, 2)}, 
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3)',
              transition: 'all 0.7s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.35, 3)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.55, 2)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3)';
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Бархатный чёрный</h3>
            <p className="text-gray-400">Интерактивная текстура с эффектом бархата</p>
          </div>

          {/* Угольный чёрный с анимацией */}
          <div 
            className="p-6 rounded-lg relative overflow-hidden transform transition-all duration-700 hover:scale-[1.02] cursor-pointer"
            style={{
              background: '#202020',
              backgroundImage: `${createNoiseSVG(0.45, 3)}, 
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 100%)`,
              backgroundBlendMode: 'soft-light, overlay',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
              transition: 'all 0.7s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.25, 4)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.45, 3)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 100%)`;
              e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)';
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-200">Угольный чёрный</h3>
            <p className="text-gray-400">Интерактивная текстура с глубинным эффектом</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTextures;