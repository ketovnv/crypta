import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextInput } from '@mantine/core';
import {animation} from "@stores/animation.js";
import {uiStore} from "@stores/ui.js";

const WalletAddressInput = ({value, setValue,isValid,setIsValid,inputName ='Название инпута!'}) => {

    const [focused, setFocused] = useState(false);
    const [animateError, setAnimateError] = useState(false);
    const floating = focused || value.length > 0;


    // Проверка валидности Ethereum адреса
    const validateEthAddress = (address) => {
        if (!address) return null;

        // Простая проверка: начинается с 0x, затем 40 шестнадцатеричных символов
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        return ethAddressRegex.test(address);
    };

    // Проверяем адрес при изменении значения
    useEffect(() => {
        if (value.length > 0) {
            const valid = validateEthAddress(value);
            setIsValid(valid);

            // Запускаем анимацию ошибки, если адрес неверный
            if (valid === false) {
                setAnimateError(true);
                const timer = setTimeout(() => setAnimateError(false), 2000);
                return () => clearTimeout(timer);
            }
        } else {
            setIsValid(null);
        }
    }, [value]);

    // Варианты анимации для лейбла
    const labelVariants = {
        default: {
            y: 0,
            scale: 1,
            color: 'var(--mantine-color-gray-5)',
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
        },
        floating: {
            y: -27,
            scale: 0.85,
            color: isValid === true ? 'var(--mantine-primary-color-6)' :
                isValid === false ? 'var(--mantine-color-red-6)' :
                    'var(--mantine-color-gray-7)',
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
        }
    };

    // Стили для инпута
    const inputStyles = {
        root: {
            position: 'relative',
            marginBottom: 0,
            marginTop: '20px',
        },
        wrapper: {
            position: 'relative',
        },
        input: {
            color:animation.theme.color,
            height: '25px',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${
                isValid === true ? animation.theme.accentColor :
                    isValid === false ? 'oklch(0.73 0.2577 29.23)' :
                        'var(--mantine-color-gray-3)'
            }`,
            borderRadius: '0',
            paddingLeft: '0',
            paddingRight: '0',
            fontSize: 'var(--mantine-font-size-sm)',
            transition: 'border-color 0.5s ease',
            '&:focus': {
                boxShadow: 'none',
                outline: 'none',
            },
            '&::placeholder': {
                color: floating ? 'var(--mantine-color-gray-5)' : 'transparent',
                transition: 'color 0.5s ease',
            },
        }
    };

    return (
        <div style={{ position: 'relative', width: '385px', margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
                <TextInput
                    height={32}
                    placeholder={floating &&"0x000...000"}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete="off"
                    spellCheck="false"
                    styles={inputStyles}
                    data-floating={floating}
                    rightSection={
                        value.length > 0 && (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isValid === true && (
                                        <motion.div
                                            style={{ color: `oklch(${uiStore.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`, fontSize: '16px' }}
                                        >
                                            ✓
                                        </motion.div>
                                    )}
                                    {isValid === false && (
                                        <motion.div
                                            style={{ cursor:'pointer',color: 'var(--mantine-color-red-6)', fontSize: '16px' }}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            animate={animateError ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                                            transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
                                            onClick={() => setValue('0x') }
                                        >
                                            ✗
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )
                    }
                />

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '14px',
                        left: '0',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 2,
                    }}
                    variants={labelVariants}
                    initial="default"
                    animate={floating ? "floating" : "default"}
                >
          <span style={{ fontWeight: floating ? '500' : '400' }}>
            {inputName}
          </span>
                    <motion.span
                        style={{
                            color: 'var(--mantine-color-red-6)',
                            marginLeft: '2px'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: floating ? 1 : 0 }}
                    >
                        *
                    </motion.span>
                </motion.div>

                {/* Анимированная линия под инпутом */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        height: '2px',
                        width: '100%',
                        background: isValid === true
                            ? 'var(--mantine-primary-color-6)'
                            : isValid === false
                                ? 'var(--mantine-color-red-6)'
                                : 'var(--mantine-color-gray-3)',
                        transformOrigin: 'left',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{
                        scaleX: focused ? 1 : 0,
                        backgroundColor: isValid === true
                            ? 'var(--mantine-primary-color-6)'
                            : isValid === false
                                ? 'var(--mantine-color-red-6)'
                                : 'var(--mantine-primary-color-6)'
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Сообщение о валидации */}
            <AnimatePresence>
                {isValid === false && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            color: 'var(--mantine-color-red-6)',
                            fontSize: 'var(--mantine-font-size-xs)',
                            marginTop: '4px'
                        }}
                    >
                        Неверный формат Ethereum адреса. Пример: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                    </motion.div>
                )}
                {isValid === true && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            color: `oklch(${uiStore.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`,
                            fontSize: 'var(--mantine-font-size-xs)',
                            marginTop: '4px'
                        }}
                    >
                        Формат адреса корректен
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletAddressInput;
