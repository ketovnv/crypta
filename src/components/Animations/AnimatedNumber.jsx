import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';

const AnimatedNumber = ({ endValue, startFromPrevious = false }) => {
    const countUpRef = useRef(null);
    const countUpInstanceRef = useRef(null);

    useEffect(() => {
        // Устанавливаем начальное значение всегда как 0
        const startValue = 0;

        // Создаем экземпляр CountUp только один раз
        if (!countUpInstanceRef.current) {
            countUpInstanceRef.current = new CountUp(countUpRef.current, endValue, {
                startVal: startValue,
                duration: startFromPrevious ? 0.3 : 5, // Если startFromPrevious true, длительность меньше
                separator: ' ',
                decimal: ',',
            });
        } else {
            // Сбрасываем анимацию перед запуском новой
            countUpInstanceRef.current.reset();
            countUpInstanceRef.current.startVal = startValue; // Устанавливаем стартовое значение в 0
            countUpInstanceRef.current.update(endValue); // Обновляем конечное значение
        }

        if (!countUpInstanceRef.current.error) {
            countUpInstanceRef.current.start(); // Стартуем анимацию
        } else {
            console.error(countUpInstanceRef.current.error);
        }
    }, [endValue, startFromPrevious]);

    return <span ref={countUpRef}></span>;
};

export default AnimatedNumber;
