import React, {useState} from 'react';
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion';
import {animation} from "@stores/animation.js";
import {uiStore} from "@stores/ui.js";
import {gradientStore} from "@stores/gradient.js";
import chroma from "chroma-js";

const ResolutionsButtonsLayout = () => {
    const [resolution, setResolution] = useState('1280x720');
    const [fullscreen, setFullscreen] = useState(false);
    const [previousSelected, setPreviousSelected] = useState(null);

    // Доступные разрешения для выбора
    const resolutions = ['800x600', '1024x768', '1280x720', '1920x1080', '2560x1440'];

    // Функция для применения изменений
    const resizeWindow = () => {
        console.log(`Применяем разрешение: ${resolution}, полноэкранный режим: ${fullscreen}`);
    };

    // Обработчик выбора разрешения с сохранением предыдущего выбора
    const handleResolutionSelect = (res) => {
        setPreviousSelected(resolution);
        setResolution(res);
    };

    // Стили
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '1rem',
            borderRadius: '16px',
            // boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            maxWidth: '550px',
            margin: '0 auto',
        },
        sectionTitle: {
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#333',
        },
        resolutionContainer: {
            position: 'relative',
            minHeight: '75px', // Обеспечиваем достаточно места для анимации
        },
        radioRow: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '50px', // Оставляем место для выбранного элемента сверху
        },
        selectedResolutionContainer: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
        },
        fullscreenToggle: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            cursor: 'pointer',
        },
        toggleLabel: {
            marginLeft: '0.5rem',
            fontSize: '1rem'
        },
        buttonContainer: {
            width: '45%',
            height: '50px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '10px',
            cursor: 'pointer',
            scale:1,
            opacity:0.8
        }
    };

    // Анимации для радио-кнопок разрешения в ряду
    const radioVariants = {
        idle: {
            scale: 1,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
            transition: {duration: 0.25, ease: 'easeOut'}
        },
        hover: {
            scale: 1.05,
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.12)',
            transition: {duration: 0.25, ease: 'easeOut'}
        },
        tap: {
            scale: 0.95,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
            transition: {duration: 0.15, ease: 'easeOut'}
        }
    };

    // Анимации для выбранной кнопки
    const selectedVariants = {
        selected: {
            scale: 1.15,
            y: -75,
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
            transition: {duration: 0.4, ease: [0.19, 1, 0.22, 1]} // Экспоненциальная кривая для плавности
        }
    };

    // Анимация для фона кнопки
    const buttonBackgroundVariants = {
        idle: {
            scale: 1,
            opacity: 0.8,
        },
        hover: {
            scale: 1.04,
            opacity: 0.5,
            transition: {duration: 0.4}
        },
        tap: {
            scale: 0.97,
            opacity: 1,
            transition: {duration: 0.2}
        }
    };


    // Анимация для переключателя полноэкранного режима
    const toggleVariants = {
        off: {
            background: animation.theme.navBarButtonBackground,
            justifyContent: 'flex-start',
            transition: {duration: 0.3, ease: 'easeInOut'}
        },
        on: {
            background: animation.theme.background,
            justifyContent: 'flex-end',
            transition: {duration: 1, ease: 'easeInOut'}
        }
    };

    const toggleCircleVariants = {
        off: {
            x: '1%',
            background: `linear-gradient( in oklch to left, ${gradientStore.scaleGradient(animation.theme.navBarButtonText, 10)})`,
            transition:{type: 'spring', stiffness: 100, damping: 75,friction: 75,mass:2}
        },
        on: {
            x: '35%',
            background: `linear-gradient( in oklch to left, ${gradientStore.scaleGradient(animation.theme.navBarActiveButtonText, 10)})`,
            transition:{type: 'spring', stiffness: 100, damping: 75,friction: 75,mass:2}
        }
    };

    // Анимация для текста кнопки


    // Получаем градиенты в зависимости от разрешения
    const getResolutionGradient = (res) => {
        switch (res) {
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

    // Создаем функцию для генерации общего компонента кнопки разрешения
    const ResolutionButton = ({res, isSelected, position = "row", onClick}) => {
        return (
            <motion.div
                layoutId={`resolution-${res}`}
                style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid transparent' : '2px solid transparent',
                    color: isSelected ? '#fff' : '#333',
                    // fontWeight: isSelected ? '600' : '400',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: isSelected ? 10 : 1,
                }}
                variants={isSelected ? selectedVariants : radioVariants}
                initial="idle"
                animate={isSelected ? "selected" : "idle"}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onClick(res)}
                transition={{layout: {duration: 0.5, ease: "easeInOut"}}}
            >
                {/* Эффект свечения для выбранной кнопки */}
                {isSelected && (
                    <motion.div
                        layoutId={`glow-${res}`}
                        style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            zIndex: 0,
                        }}
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.1, 1],
                            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
                            transition: {
                                repeat: Infinity,
                                duration: 3,
                                ease: 'easeInOut'
                            }
                        }}
                    />
                )}

                {/* Текст разрешения */}
                <motion.span
                    layoutId={`text-${res}`}
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'block'
                    }}
                >
                    {res}
                </motion.span>

                {/* Фон для неактивных кнопок при наведении */}
                {!isSelected && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `${getResolutionGradient(res)}20`,
                            borderRadius: '10px',
                            zIndex: -1,
                            opacity: 0,
                        }}
                        whileHover={{opacity: 1}}
                        transition={{duration: 0.2}}
                    />
                )}
            </motion.div>
        );
    };

    return (
        <div style={styles.container}>
            {/* Секция выбора разрешения с layout анимацией */}
            <div>
                {/*<h3 style={styles.sectionTitle}>Разрешение</h3>*/}
                <div style={styles.resolutionContainer}>
                    <LayoutGroup id="resolutions">
                        {/* Выбранный элемент расположен сверху */}
                        <div style={styles.selectedResolutionContainer}>
                            {resolution && (
                                <ResolutionButton
                                    key={`selected-${resolution}`}
                                    res={resolution}
                                    isSelected={true}
                                    position="top"
                                    onClick={handleResolutionSelect}
                                />
                            )}
                        </div>

                        {/* Остальные элементы в ряду */}
                        <div style={styles.radioRow}>
                            <AnimatePresence>
                                {resolutions
                                    .filter(res => res !== resolution)
                                    .map((res) => (
                                        <ResolutionButton
                                            key={`row-${res}`}
                                            res={res}
                                            isSelected={false}
                                            onClick={handleResolutionSelect}
                                        />
                                    ))}
                            </AnimatePresence>
                        </div>
                    </LayoutGroup>
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
                    <motion.span
                        transition={{type:'spring', visualDuration: 3,bounce: 0.5}}
                        animate={{color: fullscreen ? animation.theme.accentColor : `oklch(${uiStore.themeIsDark ? 0.3 : 0.9} 0 0 )`,}}
                        style={styles.toggleLabel}>Полноэкранный режим
                    </motion.span>
                </div>
            </div>

            {/* Кнопка применения */}
            <motion.div
                style={styles.buttonContainer}
                whileHover={{
                    scale: 1.04,
                    opacity: 1,
                    transition: {duration: 0.4}
                }}
                whileTap={{
                    scale: 0.97,
                    opacity: 1,
                    transition: {duration: 0.2}
                }}
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
                        background: `linear-gradient( in oklch to left, ${gradientStore.scaleGradient(animation.theme.navBarButtonText, 10)})`,
                        borderRadius: '10px',
                        zIndex: 0,
                    }}
                    variants={buttonBackgroundVariants}
                    initial="idle"
                />

                 {/*Эффект свечения*/}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `linear-gradient( in oklch to left, ${gradientStore.scaleGradient(animation.theme.navBarActiveButtonText, 10)})`,
                        zIndex: 2,
                        opacity: 0,
                    }}
                    whileHover={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: 1.1,
                        transition: {
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2,
                            ease: 'easeInOut'
                        }}}
                />

                {/* Текст кнопки */}
                <motion.div
                    whileHover={{ color:'oklch(0.9 0.1151 81.53)'}}
                    whileTap={{  color: gradientStore.averageOklch(animation.theme.navBarActiveButtonText)}}
                    style={{
                        color: 'oklch(0.9 0 0)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: '600',
                        fontSize: '1rem',
                        zIndex: 3,
                    }}

                >
                    Применить
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResolutionsButtonsLayout;
