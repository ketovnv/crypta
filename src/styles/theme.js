import { createTheme } from '@mantine/core';
export const theme = createTheme({
    fontFamily: 'Martian Mono Nerd Font, sans-serif',
    primaryColor: 'indigo',
    scale: 1.2,
    // Кастомные цвета для светлой и тёмной темы
    colors: {
        brand: [
            '#E7F5FF', // 0: Очень светлый
            '#D0EBFF', // 1: Светлый
            '#A5D8FF', // 2
            '#74C0FC', // 3
            '#4DABF7', // 4: Основной
            '#339AF0', // 5
            '#228BE6', // 6
            '#1C7ED6', // 7
            '#1971C2', // 8: Тёмный
            '#1864AB'  // 9: Очень тёмный
        ],
        // Градации серого для тёмной темы
        dark: [
            '#C1C2C5', // 0
            '#A6A7AB', // 1
            '#909296', // 2
            '#5C5F66', // 3
            '#373A40', // 4
            '#2C2E33', // 5
            '#25262B', // 6
            '#1A1B1E', // 7
            '#141517', // 8
            '#101113', // 9
        ],
        'ocean-blue': [
            '#7AD1DD',
            '#5FCCDB',
            '#44CADC',
            '#2AC9DE',
            '#1AC2D9',
            '#11B7CD',
            '#09ADC3',
            '#0E99AC',
            '#128797',
            '#147885'],
        'bright-pink': [
            '#F0BBDD',
            '#ED9BCF',
            '#EC7CC3',
            '#ED5DB8',
            '#F13EAF',
            '#F71FA7',
            '#FF00A1',
            '#E00890',
            '#C50E82',
            '#AD1374'],
    },

    headings: {
        fontFamily: 'JetBrainsMono NF, sans-serif',
        sizes: {
            h1: {
                fontSize: '2.5rem',
                fontWeight: 700,
                lineHeight: 1.3
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 600,
                lineHeight: 1.35
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 600,
                lineHeight: 1.4
            },
        },
    },

    spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
    },

    breakpoints: {
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '74em',
        xl: '90em',
    },

    // Улучшенные тени для обеих тем
    shadows: {
        sm: 'rgba(0, 0, 0, 0.05) 0px 1px 2px, rgba(0, 0, 0, 0.05) 0px 1px 4px',
        md: 'rgba(0, 0, 0, 0.05) 0px 4px 8px, rgba(0, 0, 0, 0.05) 0px 2px 4px',
        lg: 'rgba(0, 0, 0, 0.05) 0px 8px 16px, rgba(0, 0, 0, 0.05) 0px 4px 8px',
        xl: 'rgba(0, 0, 0, 0.05) 0px 16px 32px, rgba(0, 0, 0, 0.05) 0px 8px 16px',
    },

    // Тени для тёмной темы
    darkShadows: {
        sm: 'rgba(0, 0, 0, 0.5) 0px 1px 2px, rgba(0, 0, 0, 0.3) 0px 1px 4px',
        md: 'rgba(0, 0, 0, 0.5) 0px 4px 8px, rgba(0, 0, 0, 0.3) 0px 2px 4px',
        lg: 'rgba(0, 0, 0, 0.5) 0px 8px 16px, rgba(0, 0, 0, 0.3) 0px 4px 8px',
        xl: 'rgba(0, 0, 0, 0.5) 0px 16px 32px, rgba(0, 0, 0, 0.3) 0px 8px 16px',
    },

    defaultRadius: 'md',
    radius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '2rem',
    },

    // Кастомные стили компонентов
    components: {
        Paper: {
            styles: (theme) => ({
                root: {
                    backgroundColor:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[6]
                            : theme.white,
                    transition: 'all 0.2s ease',
                }
            })
        },
        Card: {
            styles: (theme) => ({
                root: {
                    backgroundColor:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[6]
                            : theme.white,
                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[5]
                                : theme.colors.gray[0],
                    }
                }
            })
        },
        Button: {
            styles: (theme) => ({
                root: {
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow:
                            theme.colorScheme === 'dark'
                                ? theme.darkShadows.md
                                : theme.shadows.md,
                    }
                }
            })
        }
    },

    // Глобальные стили
    globalStyles: (theme) => ({
        '*, *::before, *::after': {
            boxSizing: 'border-box',
        },
        body: {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
            color:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[0]
                    : theme.black,
            lineHeight: theme.lineHeight,
        },
        a: {
            color: theme.colors.brand[6],
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    })
});