import React, { useState } from 'react';
import { motion } from 'motion/react';

// CSS стили для компонента
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem',
        borderRadius: '1rem',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        maxWidth: '600px',
        margin: '0 auto',
    },
    themeSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        color: '#333',
    },
    switchesContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
    },
    switchItem: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    circle: {
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 1,
    },
    outerCircle: {
        position: 'absolute',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        opacity: 0.2,
        zIndex: 0,
    },
    selectedIndicator: {
        position: 'absolute',
        bottom: '-0.75rem',
        width: '0.5rem',
        height: '0.5rem',
        borderRadius: '50%',
        backgroundColor: '#333',
    },
};

// Градиенты для светлой темы
const lightThemeGradients = [
    'linear-gradient(45deg, #ff9a9e, #fad0c4)',
    'linear-gradient(45deg, #a1c4fd, #c2e9fb)',
    'linear-gradient(45deg, #d4fc79, #96e6a1)',
    'linear-gradient(45deg, #ffecd2, #fcb69f)',
    'linear-gradient(45deg, #84fab0, #8fd3f4)',
];

// Градиенты для темной темы
const darkThemeGradients = [
    'linear-gradient(45deg, #434343, #000000)',
    'linear-gradient(45deg, #4b6cb7, #182848)',
    'linear-gradient(45deg, #3a1c71, #d76d77)',
    'linear-gradient(45deg, #0f2027, #203a43)',
    'linear-gradient(45deg, #5614b0, #dbd65c)',
];

const GradientSwitches = () => {
    // Состояния для выбранных градиентов
    const [selectedLightTheme, setSelectedLightTheme] = useState(0);
    const [selectedDarkTheme, setSelectedDarkTheme] = useState(0);

    // Анимация для кружков
    const circleVariants = {
        idle: {
            scale: 1,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: { duration: 0.3 }
        },
        hover: {
            scale: 1.1,
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            transition: { duration: 0.3 }
        },
        tap: {
            scale: 0.95,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: { duration: 0.1 }
        },
        selected: {
            scale: 1.05,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 }
        }
    };

    // Анимация для индикатора выбора
    const indicatorVariants = {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    // Анимация для внешнего круга
    const outerCircleVariants = {
        idle: { scale: 0, opacity: 0 },
        hover: { scale: 1, opacity: 0.5, transition: { duration: 0.4 } },
        selected: { scale: 1, opacity: 0.5, transition: { duration: 0.4 } }
    };

    return (
        <div style={styles.container}>
            {/* Секция светлой темы */}
            <div style={styles.themeSection}>
                <h3 style={styles.title}>Светлая тема</h3>
                <div style={styles.switchesContainer}>
                    {lightThemeGradients.map((gradient, index) => (
                        <div
                            key={`light-${index}`}
                            style={styles.switchItem}
                            onClick={() => setSelectedLightTheme(index)}
                        >
                            <motion.div
                                style={{
                                    ...styles.outerCircle,
                                    background: gradient,
                                }}
                                variants={outerCircleVariants}
                                initial="idle"
                                animate={selectedLightTheme === index ? "selected" : "idle"}
                                whileHover="hover"
                            />
                            <motion.div
                                style={{
                                    ...styles.circle,
                                    background: gradient,
                                }}
                                variants={circleVariants}
                                initial="idle"
                                animate={selectedLightTheme === index ? "selected" : "idle"}
                                whileHover="hover"
                                whileTap="tap"
                            />
                            {selectedLightTheme === index && (
                                <motion.div
                                    style={styles.selectedIndicator}
                                    variants={indicatorVariants}
                                    initial="initial"
                                    animate="animate"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Секция темной темы */}
            <div style={styles.themeSection}>
                <h3 style={styles.title}>Темная тема</h3>
                <div style={styles.switchesContainer}>
                    {darkThemeGradients.map((gradient, index) => (
                        <div
                            key={`dark-${index}`}
                            style={styles.switchItem}
                            onClick={() => setSelectedDarkTheme(index)}
                        >
                            <motion.div
                                style={{
                                    ...styles.outerCircle,
                                    background: gradient,
                                }}
                                variants={outerCircleVariants}
                                initial="idle"
                                animate={selectedDarkTheme === index ? "selected" : "idle"}
                                whileHover="hover"
                            />
                            <motion.div
                                style={{
                                    ...styles.circle,
                                    background: gradient,
                                }}
                                variants={circleVariants}
                                initial="idle"
                                animate={selectedDarkTheme === index ? "selected" : "idle"}
                                whileHover="hover"
                                whileTap="tap"
                            />
                            {selectedDarkTheme === index && (
                                <motion.div
                                    style={styles.selectedIndicator}
                                    variants={indicatorVariants}
                                    initial="initial"
                                    animate="animate"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GradientSwitches;
