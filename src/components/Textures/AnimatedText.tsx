import React, { useState, useEffect } from 'react';

const AnimatedText = () => {
  // Состояние для текста с эффектом печатания
  const [typedText, setTypedText] = useState('');
  const fullText = 'Это текст с эффектом печатания...';
  const [charIndex, setCharIndex] = useState(0);

  // Эффект печатания
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(prev => prev + fullText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  return (
    <div className="container mx-auto p-8 space-y-16">
      {/* Группа 1: Простые CSS анимации */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold mb-6">Базовые анимации</h2>

        {/* Плавное появление */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Плавное появление</h3>
          <p className="animate-[fadeIn_2s_ease-in-out] text-gray-700">
            Этот текст плавно появляется на странице
          </p>
        </div>

        {/* Эффект печатания */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Эффект печатания</h3>
          <p className="text-gray-700">
            {typedText}
            <span className="animate-[blink_1s_step-end_infinite] ml-1">|</span>
          </p>
        </div>

        {/* Градиентный текст */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Градиентная анимация</h3>
          <p 
            className="text-transparent bg-clip-text text-2xl font-bold"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3490dc, #6574cd, #9561e2)',
              backgroundSize: '200% auto',
              animation: 'gradientFlow 3s linear infinite'
            }}
          >
            Текст с градиентной анимацией
          </p>
        </div>
      </section>

      {/* Группа 2: Интерактивные эффекты */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold mb-6">Интерактивные эффекты</h2>

        {/* Hover эффект с подчёркиванием */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Hover эффект</h3>
          <p className="inline-block text-gray-700 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-500 after:left-0 after:bottom-0 after:origin-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 hover:after:origin-left cursor-pointer">
            Наведите на этот текст
          </p>
        </div>

        {/* Split текст с hover эффектом */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Split эффект</h3>
          <div className="group relative inline-block cursor-pointer overflow-hidden">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              Наведите курсор
            </span>
            <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 text-blue-500 group-hover:translate-y-0">
              Наведите курсор
            </span>
          </div>
        </div>
      </section>

      {/* Группа 3: Сложные эффекты */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold mb-6">Сложные эффекты</h2>

        {/* Текст с тенью */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Анимированная тень</h3>
          <p 
            className="text-2xl font-bold transition-all duration-300 hover:tracking-wider"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              animation: 'textShadowPulse 2s infinite'
            }}
          >
            Текст с пульсирующей тенью
          </p>
        </div>

        {/* Глитч эффект */}
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Глитч эффект</h3>
          <p 
            className="relative text-2xl font-bold"
            style={{
              animation: 'glitchText 3s infinite'
            }}
          >
            <span className="relative inline-block" style={{
              animation: 'glitchOffset 3s infinite'
            }}>
              Текст с глитч-эффектом
            </span>
          </p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes textShadowPulse {
          0% { text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
          50% { text-shadow: 3px 3px 6px rgba(0,0,0,0.3); }
          100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
        }

        @keyframes glitchText {
          0%, 100% { transform: none; }
          20% { transform: skewX(-15deg); }
          40% { transform: skewX(15deg); }
          60% { transform: skewX(-10deg); }
          80% { transform: skewX(10deg); }
        }

        @keyframes glitchOffset {
          0%, 100% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(10% 0 0 0); }
          40% { clip-path: inset(0 10% 0 0); }
          60% { clip-path: inset(0 0 10% 0); }
          80% { clip-path: inset(0 0 0 10%); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedText;