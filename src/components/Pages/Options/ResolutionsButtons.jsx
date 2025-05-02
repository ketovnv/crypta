import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResolutionsButtons = () => {
    const [resolution, setResolution] = useState('1280x720');
    const [fullscreen, setFullscreen] = useState(false);

    // Доступные разрешения для выбора
    const resolutions = ['800x600', '1024x768', '1280x720', '1920x1080'];

    // Функция для применения изменений
    const resizeWindow = () => {
        console.log(`Применяем разрешение: ${resolution}, полноэкранный режим: ${fullscreen}`);
    };

    // Стили
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            maxWidth: '500px',
            margin: '0 auto',
        },
        sectionTitle: {
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#333',
        },
        radioGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
        },
        fullscreenToggle: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem',
            cursor: 'pointer',
        },
        toggleLabel: {
            marginLeft: '0.75rem',
            fontSize: '1rem',
            color: '#333',
        },
        buttonContainer: {
            width: '100%',
            height: '50px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '10px',
            cursor: 'pointer',
        }
    };

    // Анимации для радио-кнопок разрешения
    const radioVariants = {
        idle: {
            scale: 1,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
            transition: { duration: 0.25, ease: 'easeOut' }
        },
        hover: {
            scale: 1.05,
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.12)',
            transition: { duration: 0.25, ease: 'easeOut' }
        },
        tap: {
            scale: 0.95,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
            transition: { duration: 0.15, ease: 'easeOut' }
        },
        selected: {
            scale: 1,
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.16)',
            y: -2,
            transition: { duration: 0.25, ease: 'easeOut' }
        }
    };

    // Анимация для фона кнопки
    const buttonBackgroundVariants = {
        idle: {
            scale: 1,
            opacity: 0.85,
        },
        hover: {
            scale: 1.07,
            opacity: 1,
            transition: { duration: 0.4 }
        },
        tap: {
            scale: 0.97,
            opacity: 1,
            transition: { duration: 0.1 }
        }
    };

    // Анимация свечения кнопки
    const glowVariants = {
        hover: {
            opacity: [0.2, 0.5, 0.2],
            scale: 1.2,
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut'
            }
        }
    };

    // Анимация для переключателя полноэкранного режима
    const toggleVariants = {
        off: {
            backgroundColor: '#E9ECEF',
            justifyContent: 'flex-start',
            transition: { duration: 0.3, ease: 'easeInOut' }
        },
        on: {
            backgroundColor: '#4C6EF5',
            justifyContent: 'flex-end',
            transition: { duration: 0.3, ease: 'easeInOut' }
        }
    };

    const toggleCircleVariants = {
        off: {
            x: '0%',
            backgroundColor: '#fff',
            transition: { duration: 0.3 }
        },
        on: {
            x: '100%',
            backgroundColor: '#fff',
            transition: { duration: 0.3 }
        }
    };

    // Анимация для текста кнопки
    const buttonTextVariants = {
        idle: {
            y: 0,
            transition: { duration: 0.2 }
        },
        hover: {
            y: -2,
            transition: { duration: 0.2 }
        },
        tap: {
            y: 1,
            transition: { duration: 0.1 }
        }
    };

    // Получаем градиенты в зависимости от разрешения
    const getResolutionGradient = (res) => {
        switch(res) {
            case '800x600':
                return 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)';
            case '1024x768':
                return 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)';
            case '1280x720':
                return 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)';
            case '1920x1080':
                return 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)';
            default:
                return 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)';
        }
    };

    return (
        <div style={styles.container}>
            {/* Секция выбора разрешения */}
            <div>
                <h3 style={styles.sectionTitle}>Разрешение</h3>
                <div style={styles.radioGroup}>
                    {resolutions.map((res) => (
                        <motion.div
                            key={res}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                border: resolution === res ? '2px solid #4C6EF5' : '2px solid transparent',
                                color: resolution === res ? '#4C6EF5' : '#333',
                                background: resolution === res ? `${getResolutionGradient(res)}20` : '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            variants={radioVariants}
                            initial="idle"
                            animate={resolution === res ? "selected" : "idle"}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setResolution(res)}
                        >
                            {/* Фоновый градиент для выбранного элемента */}
                            {resolution === res && (
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        borderRadius: '10px',
                                        zIndex: -1,
                                        opacity: 0.08,
                                        background: getResolutionGradient(res),
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Индикатор выбора с градиентом */}
                            {resolution === res && (
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        width: '6px',
                                        left: '4px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: '70%',
                                        background: getResolutionGradient(res),
                                        borderRadius: '10px',
                                    }}
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <span style={{ paddingLeft: resolution === res ? '4px' : 0 }}>{res}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Переключатель полноэкранного режима */}
            <div>
                <div
                    style={styles.fullscreenToggle}
                    onClick={() => setFullscreen(!fullscreen)}
                >
                    <motion.div
                        style={{
                            width: '48px',
                            height: '24px',
                            borderRadius: '24px',
                            padding: '2px',
                            display: 'flex',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1) inset',
                        }}
                        variants={toggleVariants}
                        animate={fullscreen ? "on" : "off"}
                    >
                        <motion.div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                            variants={toggleCircleVariants}
                            animate={fullscreen ? "on" : "off"}
                        />
                    </motion.div>

                    <span style={styles.toggleLabel}>Полноэкранный режим</span>
                </div>
            </div>

            {/* Кнопка применения */}
            <motion.div
                style={styles.buttonContainer}
                whileHover="hover"
                whileTap="tap"
                onClick={resizeWindow}
            >
                {/* Фоновая анимация */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
                        borderRadius: '10px',
                        zIndex: 0,
                    }}
                    variants={buttonBackgroundVariants}
                    initial="idle"
                />

                {/* Эффект свечения */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: 1,
                        opacity: 0,
                    }}
                    variants={glowVariants}
                />

                {/* Текст кнопки */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: '1rem',
                        zIndex: 2,
                    }}
                    variants={buttonTextVariants}
                    initial="idle"
                >
                    Применить
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResolutionsButtons;
