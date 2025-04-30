import React, {useEffect, useState} from 'react';
import {TextInput} from '@mantine/core';
import {AnimatePresence, motion, MotionConfig} from 'motion/react';
import {Etherium} from "@components/Layout/SvgIcons/Etherium.jsx";
import {Sepolia} from "@components/Layout/SvgIcons/Sepolia.jsx";
import {animation} from "@stores/animation.js";
import {Holesky} from "@components/Layout/SvgIcons/Holesky.jsx";
import GradientText from "@animations/involved/GradientText.jsx";
import AppearingText from "@animations/Examples/AppearingText/AppearingText.js";
import {uiStore} from "@stores/ui.js";

// Иконки сетей
const ChainIcon = ({chain,fontSize=9}) => {
    const getColor = () => {
        switch (chain) {
            case 'ethereum':
                return '#627EEA';
            case 'sepolia':
                return '#F3BA2F';
            case 'holesky':
                return '#8247E5';
            // case 'arbitrum': return '#28A0F0';
            // case 'optimism': return '#FF0420';
            default:
                return '#627EEA';
        }
    };
    return (
        <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            style={{fontSize}}            transition={{type: 'spring', stiffness: 300, damping: 50, friction: 35, mass: 10}}
        >
            {chain === 'ethereum' && <Etherium/>}
            {chain === 'sepolia' && <Sepolia/>}
            {chain === 'holesky' && <Holesky/>}
            {/*{chain === 'arbitrum' && 'A'}*/}
            {/*{chain === 'optimism' && 'O'}*/}
        </motion.div>
    );
};

// Иконка копирования
const CopyIcon = ({success}) => (
    <motion.svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{scale: success ? [1, 1.2, 1] : [1.2, 1, 1.2]}}
        transition={{duration: 0.3}}
    >
        {success ? (
            <>
                <path d="M20 6L9 17L4 12"/>
            </>
        ) : (
            <>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </>
        )}
    </motion.svg>
);

// Иконка поиска
const SearchIcon = () => (
    <motion.svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{opacity: 0.6}}
    >
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </motion.svg>
);


const NetworkSelector = ({chainOpen, setChainOpen, chains, selectedChain, setSelectedChain}) => {

    return (
        <motion.div style={{position: 'relative'}}>
            <motion.button
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.03)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    backgroundColor:  uiStore.themeIsDark  ? 'rgba(255, 255,255, 0.1)' : 'rgba(0, 0,0, 0.1) ',
                    fontSize: 'var(--mantine-font-size-xs)'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setChainOpen(!chainOpen);
                }}
                whileHover={{ backgroundColor: uiStore.themeIsDark  ? 'rgba(255, 255,255, 0.2)' : 'rgba(0, 0,0, 0.2)' }}
                whileTap={{scale: 0.97}}
            >
                <AnimatePresence>
                    <GradientText key={selectedChain + 'gradient'}>
                        <AppearingText fontSize={14} key={selectedChain + 'text'}
                                       style={{fontWeight:700}} text={chains.find(c => c.id === selectedChain)?.name}/>
                    </GradientText>
                    <ChainIcon chain={selectedChain} key={selectedChain + 'icon'}/>
                </AnimatePresence>
                {/*<motion.span*/}
                {/*    style={{fontSize: '10px'}}*/}
                {/*    animate={{rotate: chainOpen ? 180 : 0}}*/}
                {/*    transition={{duration: 1}}*/}
                {/*>*/}
                {/*    ▼*/}
                {/*</motion.span>*/}
            </motion.button>

            {/* Выпадающий список сетей */}
            <AnimatePresence>
                {chainOpen && (
                    <motion.div
                        layout
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '25px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            overflow: 'hidden',
                            width: '180px'
                        }}
                        initial={{opacity: 0, y: -10}}
                        animate={{
                            opacity: 1,
                            y: 0,
                            color: animation.theme.color,
                            background: animation.theme.background
                        }}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.2}}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {chains.map(chain => (
                            <motion.div
                                layout
                                key={chain.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedChain === chain.id ? 'rgba(0, 0, 0, 0.03)' : 'transparent'
                                }}
                                onClick={() => {
                                    setSelectedChain(chain.id);
                                    setChainOpen(false);
                                }}
                                whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                            >
                                <ChainIcon  chain={chain.id}/>
                                <span style={{fontSize: 'var(--mantine-font-size-sm)'}}>
                      {chain.name}
                    </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>)
}


const AnimatedStatus = ({status}) => {
    let color, text, icon;

    switch (status) {
        case 'pending':
            color = '#F3BA2F';
            text = 'В обработке';
            icon = (
                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </motion.svg>
            );
            break;
        case 'success':
            color = '#4CAF50';
            text = 'Успешно';
            icon = (
                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </motion.svg>
            );
            break;
        case 'error':
            color = '#F44336';
            text = 'Ошибка';
            icon = (
                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </motion.svg>
            );
            break;
        default:
            color = '#9E9E9E';
            text = 'Ожидание';
            icon = (
                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </motion.svg>
            );
    }


    return (
        <motion.div
            layout
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color,
                fontSize: 'var(--mantine-font-size-xs)'
            }}
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{type: 'spring', stiffness: 500, damping: 30}}
        >
            {status === 'pending' ? (
                <motion.div
                    animate={{rotate: 360}}
                    transition={{duration: 1.5, repeat: Infinity, ease: 'linear'}}
                    style={{display: 'flex'}}
                >
                    {icon}
                </motion.div>
            ) : (
                icon
            )}
            <span>{text}</span>
        </motion.div>
    );
};

// Компонент подсказок
const TypeHint = ({type}) => {
    let text, color;

    switch (type) {
        case 'wallet':
            text = 'Адрес кошелька используется для отправки и получения криптовалюты';
            color = 'var(--mantine-primary-color-6)';
            break;
        case 'token':
            text = 'Адрес токена представляет смарт-контракт ERC-20, ERC-721 или другого стандарта';
            color = 'var(--mantine-color-violet-6)';
            break;
        case 'contract':
            text = 'Адрес смарт-контракта содержит логику, хранение данных и управление активами';
            color = 'var(--mantine-color-teal-6)';
            break;
        default:
            text = 'Выберите тип адреса для более подробной информации';
            color = 'var(--mantine-color-gray-6)';
    }

    return (
        <motion.div
            style={{
                fontSize: 'var(--mantine-font-size-mdz)',
                color: 'var(--mantine-color-gray-6)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px'
            }}
            initial={{opacity: 0, y: -5}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -5}}
            transition={{duration: 0.2}}
        >
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </motion.svg>
            <span>{text}</span>
        </motion.div>
    );
};

const VeryAdvancedWeb3Input = () => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const [inputType, setInputType] = useState('wallet'); // wallet, token, contract
    const [copySuccess, setCopySuccess] = useState(false);
    const [selectedChain, setSelectedChain] = useState('ethereum');
    const [isENS, setIsENS] = useState(false);
    const [chainOpen, setChainOpen] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState(null);
    const [showingShortAddress, setShowingShortAddress] = useState(false);

    // Плавающий лейбл
    const floating = focused || value.length > 0;

    // Доступные блокчейн-сети
    const chains = [
        {id: 'ethereum', name: 'Ethereum'},
        {id: 'sepolia', name: 'Sepolia Testnet'},
        {id: 'holesky', name: 'Holesky Testnet'},
        // { id: 'arbitrum', name: 'Arbitrum' },
        // { id: 'optimism', name: 'Optimism' },
    ];

    // Проверка на ENS имя
    const checkIfENS = (input) => {
        return input.toLowerCase().endsWith('.eth');
    };

    // Валидация адресов разных типов
    const validateAddress = (address, type) => {
        if (!address) return null;

        // Проверка ENS имени
        if (checkIfENS(address)) {
            return address.length > 5; // Простая проверка, что ENS имя не слишком короткое
        }

        // Проверки для блокчейн адресов
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

        switch (type) {
            case 'wallet':
                return ethAddressRegex.test(address);

            case 'token':
                if (!ethAddressRegex.test(address)) return false;
                return !/^0x0+$/.test(address);

            case 'contract':
                if (!ethAddressRegex.test(address)) return false;
                return address !== '0x0000000000000000000000000000000000000000';

            default:
                return ethAddressRegex.test(address);
        }
    };

    // Проверка при изменении ввода
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value.length > 0) {
                const isENSName = checkIfENS(value);
                setIsENS(isENSName);
                setIsValid(validateAddress(value, inputType));

                // Имитация резолва ENS имени
                if (isENSName && isENSName !== isENS) {
                    setTimeout(() => {
                        setResolvedAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
                    }, 500);
                } else if (!isENSName) {
                    setResolvedAddress(null);
                }
            } else {
                setIsENS(false);
                setIsValid(null);
                setResolvedAddress(null);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [value, inputType]);

    // Текст лейбла по типу
    const getLabel = () => {
        switch (inputType) {
            case 'wallet':
                return 'Адрес кошелька';
            case 'token':
                return 'Адрес токена';
            case 'contract':
                return 'Адрес смарт-контракта';
            default:
                return 'Ethereum адрес';
        }
    };

    // Плейсхолдер по типу
    const getPlaceholder = () => {
        if (selectedChain === 'ethereum') {
            switch (inputType) {
                case 'wallet':
                    return 'vitalik.eth или 0x71C7...976F';
                case 'token':
                    return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
                // case 'contract': return '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
                case 'contract':
                    return '0xdac17f958d2ee523a2206206994597c13d831ec7';
                default:
                    return '0x0000...0000 или name.eth';
            }
        } else {
            return `${inputType.charAt(0).toUpperCase() + inputType.slice(1)} адрес в сети ${chains.find(c => c.id === selectedChain)?.name}`;
        }
    };

    // Цвет элементов в зависимости от типа и состояния
    const getColor = () => {
        if (focused) {
            switch (inputType) {
                case 'wallet':
                    return 'var(--mantine-primary-color-6)';
                case 'token':
                    return 'var(--mantine-color-violet-6)';
                case 'contract':
                    return 'var(--mantine-color-teal-6)';
            }
        }

        if (isValid === true) return 'oklch(0.87 0.294827 142.49)';
        if (isValid === false) return 'oklch(0.63 0.2577 29.23)';
    };

    // Копирование адреса
    const handleCopy = () => {
        if (value && isValid) {
            const textToCopy = resolvedAddress || value;
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    // Сокращение адреса для отображения
    const shortenAddress = (address) => {
        if (!address || address.length < 42) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Переключение между полным и сокращенным адресом
    const toggleAddressDisplay = () => {
        if (isValid && value.startsWith('0x')) {
            setShowingShortAddress(!showingShortAddress);
        }
    };

    // Получение отображаемого значения
    const getDisplayValue = () => {
        if (showingShortAddress && value.startsWith('0x') && value.length === 42) {
            return shortenAddress(value);
        }
        return value;
    };


    // Стили для инпута
    const inputStyles = {
        root: {
            position: 'relative',
            marginTop: '12px',
            marginBottom: '8px',
        },
        wrapper: {
            position: 'relative',
        },
        input: {
            height: '48px',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${
                isValid === true ? 'var(--mantine-primary-color-6)' :
                    isValid === false ? 'var(--mantine-color-red-6)' :
                        'var(--mantine-color-gray-3)'
            }`,
            borderRadius: '0',
            paddingLeft: '0',
            paddingRight: '0',
            fontSize: 'var(--mantine-font-size-md)',
            transition: 'border-color 0.2s ease',
            '&:focus': {
                boxShadow: 'none',
                outline: 'none',
            },
            '&::placeholder': {
                color: floating ? 'var(--mantine-color-gray-5)' : 'transparent',
                transition: 'color 0.15s ease',
            },
        }
    };


    // Анимации для селектора типа
    const typeIndicatorAnimation = {
        wallet: {x: 0},
        token: {x: 88},
        contract: {x: 176}
    };

    // Закрытие выпадающего списка при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chainOpen) {
                setChainOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [chainOpen]);

    return (
        <MotionConfig transition={{type: 'spring', visualDuration: 2, bounce: 0.2}}>
            <motion.div layout style={{
                position: 'relative',
                maxWidth: '500px',
                margin: '0 auto',
                padding: '24px 0'
            }}>

                {/* Шапка с селекторами */}
                <motion.div
                    layout
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                    {/* Селектор типа адреса */}
                    <motion.div layout style={{
                        display: 'flex',
                        position: 'relative',
                        borderRadius: '20px',
                        background: 'rgba(0, 0, 0, 0.03)',
                        padding: '4px',
                        width: 'fit-content'
                    }}>
                        {/* Индикатор активного типа */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                width: '88px',
                                height: '30px',
                                borderRadius: '15px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                zIndex: 0
                            }}
                            animate={{inputType}}
                            variants={typeIndicatorAnimation}
                            transition={{type: 'spring', stiffness: 300, damping: 100, mass: 1, friction: 100}}
                        />

                        {/* Кнопки типов */}
                        {['wallet', 'token', 'contract'].map(type => (
                            <motion.button
                                key={type}
                                style={{
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '15px',
                                    fontSize: 'var(--mantine-font-size-xs)',
                                    width: '88px',
                                    position: 'relative'
                                }}
                                animate={{
                                    fontWeight: inputType === type ? '600' : '400',
                                    y: inputType === type ? -1.5 : 0
                                }}
                                onClick={() => setInputType(type)}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.95}}
                                transition={{type: 'spring', stiffness: 300, damping: 100}}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </motion.button>
                        ))}
                    </motion.div>
                    <NetworkSelector
                        chainOpen={chainOpen}
                        setChainOpen={setChainOpen}
                        chains={chains}
                        selectedChain={selectedChain}
                        setSelectedChain={setSelectedChain}
                    />
                </motion.div>


                {/* Основное поле ввода */}
                <TextInput
                    placeholder={floating ? getPlaceholder() : ''}
                    value={getDisplayValue}
                    onChange={(event) => {
                        setValue(event.target.value);
                        if (showingShortAddress) setShowingShortAddress(false);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete="off"
                    spellCheck="false"
                    styles={inputStyles}
                    data-floating={floating}
                    leftSection={
                        <motion.section
                            layout
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '48px'
                            }}
                        >
                            <ChainIcon chain={selectedChain}/>
                        </motion.section>
                    }
                    rightSection={
                        value.length > 0 && (
                            <section>
                                <AnimatePresence>
                                    <motion.div
                                        style={{display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row'}}
                                        initial={{opacity: 0, scale: 0.1}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.1}}
                                    >
                                        {/* Переключение длины адреса (только для кошельков) */}
                                        {inputType === 'wallet' && value.startsWith('0x') && value.length === 42 && (
                                            <motion.button
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    padding: '4px',
                                                    color: 'inherit'
                                                }}
                                                onClick={toggleAddressDisplay}
                                                whileHover={{scale: 1.1}}
                                                whileTap={{scale: 0.9}}
                                            >
                                                <motion.svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    {showingShortAddress ? (
                                                        <>
                                                            <polyline points="7 13 12 18 17 13"/>
                                                            <polyline points="7 6 12 11 17 6"/>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <line x1="8" y1="6" x2="21" y2="6"/>
                                                            <line x1="8" y1="12" x2="21" y2="12"/>
                                                            <line x1="8" y1="18" x2="21" y2="18"/>
                                                            <line x1="3" y1="6" x2="3.01" y2="6"/>
                                                            <line x1="3" y1="12" x2="3.01" y2="12"/>
                                                            <line x1="3" y1="18" x2="3.01" y2="18"/>
                                                        </>
                                                    )}
                                                </motion.svg>
                                            </motion.button>
                                        )}
                                        {isValid === false && (
                                            <motion.div
                                                whileHover={{scale: 1.1, cursor: 'pointer'}}
                                                whileTap={{scale: 0.9}}
                                                onClick={() => setValue('')}
                                                style={{color: 'var(--mantine-color-red-6)', fontSize: '16px'}}
                                                animate={{x: [0, -4, 4, -4, 4, 0]}} transition={{duration: 0.4}}
                                            >
                                                ✗
                                            </motion.div>
                                        )}
                                        {/* Кнопка копирования */}
                                        {value && isValid && (
                                            <motion.button
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    padding: '4px',
                                                    color: copySuccess ? 'var(--mantine-color-green-6)' : 'inherit'
                                                }}
                                                onClick={handleCopy}
                                                whileHover={{scale: 1.1}}
                                                whileTap={{scale: 0.9}}
                                            >
                                                <CopyIcon success={copySuccess}/>
                                            </motion.button>
                                        )}
                                        {isValid === true && (
                                            <motion.div
                                                style={{color: 'var(--mantine-color-green-6)', fontSize: '16px'}}
                                            >
                                                ✓
                                            </motion.div>
                                        )}
                                        {/* Иконка поиска */}
                                        {/*{value && isValid && (*/}
                                        {/*    <motion.button*/}
                                        {/*        style={{*/}
                                        {/*            background: 'none',*/}
                                        {/*            border: 'none',*/}
                                        {/*            cursor: 'pointer',*/}
                                        {/*            display: 'flex',*/}
                                        {/*            padding: '4px',*/}
                                        {/*            color: 'inherit'*/}
                                        {/*        }}*/}
                                        {/*        whileHover={{scale: 1.1}}*/}
                                        {/*        whileTap={{scale: 0.9}}*/}
                                        {/*    >*/}
                                        {/*        <SearchIcon/>*/}
                                        {/*    </motion.button>*/}
                                        {/*)}*/}
                                    </motion.div>
                                </AnimatePresence>
                            </section>
                        )
                    }
                />

                {/* Плавающий лейбл */}
                <motion.label
                    layout
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                    }}
                    animate={{
                        left: floating ? '10px' : '50px',
                        color: getColor(),
                        top: floating ? '70px' : '95px',
                        fontSize: floating ? 'var(--mantine-font-size-sm)' : 'var(--mantine-font-size-md)',
                    }}
                    transition={{type: 'spring', stiffness: 500, friction: 50, damping: 100, mass: 2}}
                >
                    {getLabel()}
                </motion.label>

                {/* Контейнер для иконки сети, инпута и кнопок */}

                {/* Индикатор валидации */}
                {/*    <motion.div*/}
                {/*        style={{*/}
                {/*            height: '2px',*/}
                {/*            width: '100%',*/}
                {/*            position: 'absolute',*/}
                {/*            bottom: '0',*/}
                {/*            left: '0',*/}
                {/*            borderBottomLeftRadius: '12px',*/}
                {/*            borderBottomRightRadius: '12px',*/}
                {/*            overflow: 'hidden'*/}
                {/*        }}*/}

                {/*</motion.div>*/}


                {/* Дополнительная функциональность: Быстрые действия */}
                <AnimatePresence>
                    {isValid === true && (
                        <motion.div
                            style={{
                                marginTop: '16px',
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap'
                            }}
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                        >
                            {inputType === 'wallet' && (
                                <>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                    >
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <line x1="12" y1="1" x2="12" y2="23"></line>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                        </motion.svg>
                                        Курс токена
                                    </motion.button>
                                </>
                            )}
                            {inputType === 'wallet' && (
                                <>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        // Добавь onClick обработчик здесь
                                        // onClick={() => handleViewBalance()}
                                    >
                                        {/* Иконка Кошелька */}
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <path
                                                d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                                            <path d="M10 12h6"></path>
                                            <path d="M14 16h-6"></path>
                                        </motion.svg>
                                        Просмотр баланса
                                    </motion.button>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        // Добавь onClick обработчик здесь
                                        // onClick={() => handleViewTransactions()}
                                    >
                                        {/* Иконка Списка (Транзакций) */}
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <line x1="8" y1="6" x2="21" y2="6"></line>
                                            <line x1="8" y1="12" x2="21" y2="12"></line>
                                            <line x1="8" y1="18" x2="21" y2="18"></line>
                                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                        </motion.svg>
                                        Транзакции
                                    </motion.button>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        // Добавь onClick обработчик здесь
                                        // onClick={() => handleViewOnExplorer(address)}
                                    >
                                        {/* Иконка Внешней ссылки */}
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </motion.svg>
                                        Просмотр на Explorer
                                    </motion.button>
                                </>
                            )}

                            {inputType === 'token' && (
                                <>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        // Добавь onClick обработчик здесь
                                        // onClick={() => handleViewTokenInfo()}
                                    >
                                        {/* Иконка Информации */}
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </motion.svg>
                                        Информация о токене
                                    </motion.button>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        // Добавь onClick обработчик здесь
                                        // onClick={() => handleViewOnExplorer(tokenAddress)}
                                    >
                                        {/* Иконка Внешней ссылки */}
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </motion.svg>
                                        Просмотр на Explorer
                                    </motion.button>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        // Добавь onClick обработчик здесь
                                        // onClick={() => handleSendToken()}
                                    >
                                        {/* Иконка Отправки */}
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </motion.svg>
                                        Отправить токен
                                    </motion.button>
                                </>
                            )}
                            {inputType === 'wallet' && (
                                <>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                    >
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <line x1="12" y1="1" x2="12" y2="23"></line>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                        </motion.svg>
                                        Курс токена
                                    </motion.button>
                                </>
                            )}

                            {inputType === 'contract' && (
                                <>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                    >
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <path
                                                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                                            <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                                            <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </motion.svg>
                                        Изучить контракт
                                    </motion.button>
                                    <motion.button
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.03)',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                        whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                    >
                                        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="9" y1="3" x2="9" y2="21"></line>
                                        </motion.svg>
                                        События
                                    </motion.button>
                                </>
                            )}

                            <motion.button
                                style={{
                                    background: 'rgba(0, 0, 0, 0.03)',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '6px 12px',
                                    fontSize: 'var(--mantine-font-size-xs)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                whileHover={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                whileTap={{scale: 0.97}}
                            >
                                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"></path>
                                </motion.svg>
                                Открыть в эксплорере
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Секция с историей просмотров */}
                <motion.div style={{marginTop: '24px'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: 'var(--mantine-font-size-sm)',
                            fontWeight: '500',
                            color: 'var(--mantine-color-gray-7)'
                        }}>
                            История просмотров
                        </h3>
                        <motion.button
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: 'var(--mantine-font-size-xs)',
                                color: 'var(--mantine-primary-color-6)',
                                cursor: 'pointer',
                                padding: '0'
                            }}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Очистить
                        </motion.button>
                    </div>

                    {/* Список недавних адресов */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {[
                            {
                                type: 'wallet',
                                address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                                name: 'eth',
                                chain: 'ethereum'
                            },
                            {
                                type: 'token',
                                address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                                name: 'USDT',
                                chain: 'ethereum'
                            },
                            {
                                type: 'contract',
                                address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                                name: 'Uniswap Router',
                                chain: 'ethereum'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    cursor: 'pointer',
                                    gap: '8px'
                                }}
                                whileHover={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    scale: 1.1
                                }}
                                whileTap={{scale: 0.99}}
                                onClick={() => {
                                    setValue(item.address);
                                    setInputType(item.type);
                                    setSelectedChain(item.chain);
                                    setIsValid(true);
                                }}
                            >
                                <ChainIcon chain={item.chain}/>
                                <div style={{flex: 1}}>
                                    <div style={{
                                        fontSize: 'var(--mantine-font-size-xs)',
                                        fontWeight: '500'
                                    }}>
                                        {item.name}
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--mantine-font-size-xs)',
                                        color: 'var(--mantine-color-gray-6)',
                                        fontFamily: 'monospace'
                                    }}>
                                        {shortenAddress(item.address)}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: 'var(--mantine-font-size-xs)',
                                    color: 'var(--mantine-color-gray-6)',
                                    textTransform: 'capitalize'
                                }}>
                                    {item.type}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </MotionConfig>)
}

{/* Футер с расширенными опциями */}
{/*<div style={{*/}
{/*    marginTop: '24px',*/}
{/*    padding: '16px 0',*/}
{/*    borderTop: '1px solid var(--mantine-color-gray-2)'*/}
{/*}}>*/}
{/*    <div style={{*/}
{/*        display: 'flex',*/}
{/*        justifyContent: 'space-between'*/}
{/*    }}>*/}
{/*        <motion.button*/}
{/*            style={{*/}
{/*                background: 'none',*/}
{/*                border: 'none',*/}
{/*                fontSize: 'var(--mantine-font-size-xs)',*/}
{/*                color: 'var(--mantine-color-gray-6)',*/}
{/*                cursor: 'pointer',*/}
{/*                display: 'flex',*/}
{/*                alignItems: 'center',*/}
{/*                gap: '4px',*/}
{/*                padding: '0'*/}
{/*            }}*/}
{/*            whileHover={{ color: 'var(--mantine-color-gray-8)' }}*/}
{/*        >*/}
{/*            <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
{/*                <circle cx="12" cy="12" r="3"></circle>*/}
{/*                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>*/}
{/*            </motion.svg>*/}
{/*            Настройки*/}
{/*        </motion.button>*/}

{/*        <motion.button*/}
{/*            style={{*/}
{/*                background: 'none',*/}
{/*                border: 'none',*/}
{/*                fontSize: 'var(--mantine-font-size-xs)',*/}
{/*                color: 'var(--mantine-color-gray-6)',*/}
{/*                cursor: 'pointer',*/}
{/*                display: 'flex',*/}
{/*                alignItems: 'center',*/}
{/*                gap: '4px',*/}
{/*                padding: '0'*/}
{/*            }}*/}
{/*            whileHover={{ color: 'var(--mantine-color-gray-8)' }}*/}
{/*        >*/}
{/*            <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
{/*                <circle cx="12" cy="12" r="10"></circle>*/}
{/*                <line x1="12" y1="8" x2="12" y2="12"></line>*/}
{/*                <line x1="12" y1="16" x2="12.01" y2="16"></line>*/}
{/*            </motion.svg>*/}
{/*            Помощь*/}
{/*        </motion.button>*/}

{/*        <motion.button*/}
{/*            style={{*/}
{/*                background: 'none',*/}
{/*                border: 'none',*/}
{/*                fontSize: 'var(--mantine-font-size-xs)',*/}
{/*                color: 'var(--mantine-color-gray-6)',*/}
{/*                cursor: 'pointer',*/}
{/*                display: 'flex',*/}
{/*                alignItems: 'center',*/}
{/*                gap: '4px',*/}
{/*                padding: '0'*/}
{/*            }}*/}
{/*            whileHover={{ color: 'var(--mantine-color-gray-8)' }}*/}
{/*        >*/}
{/*            <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
{/*                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>*/}
{/*                <polyline points="15 3 21 3 21 9"></polyline>*/}
{/*                <line x1="10" y1="14" x2="21" y2="3"></line>*/}
{/*            </motion.svg>*/}
{/*            Поделиться*/}
{/*        </motion.button>*/}
{/*    </div>*/}

export default VeryAdvancedWeb3Input;
