import {observer} from "mobx-react-lite";
import {logger} from "@stores/logger.js";

import {uiStore} from "@stores/ui.js";
import {animated} from "@react-spring/web";
import React, {useEffect, useRef, useState} from 'react';
import {motion, useInView, useScroll, useSpring, useTransform} from 'framer-motion';

const StrokeAnimation = () => {
    return (
        <svg width="200" height="200" viewBox="0 0 200 200">
            <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="black"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="500"
                strokeDashoffset="500"
                animate={{strokeDashoffset: 0}}
                transition={{duration: 2, ease: "easeInOut"}}
            />
        </svg>
    );
};


logger.warning("🕸️", " Компонент Транзакции");
const getStatusColor = (status) => {
    const colors = {
        'success': 'green',
        'pending': 'yellow',
        'failed': 'red',
        'approved': 'blue',
    };
    return colors[status] || 'gray';
};

const AnimatedSection = ({children, bgColor, index}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: false, amount: 0.3});

    // Варианты анимации для разных секций
    const animations = [
        { // Fade in и scale
            initial: {opacity: 0, scale: 0.8},
            animate: {opacity: 1, scale: 1},
            transition: {duration: 0.8, ease: "easeOut"}
        },
        { // Slide in from left
            initial: {opacity: 0, x: -100},
            animate: {opacity: 1, x: 0},
            transition: {duration: 0.8, ease: "easeOut"}
        },
        { // Slide in from right
            initial: {opacity: 0, x: 100},
            animate: {opacity: 1, x: 0},
            transition: {duration: 0.8, ease: "easeOut"}
        },
        { // Slide in from bottom
            initial: {opacity: 0, y: 100},
            animate: {opacity: 1, y: 0},
            transition: {duration: 0.8, ease: "easeOut"}
        }
    ];

    // Выбираем анимацию по индексу, циклически
    const animation = animations[index % animations.length];

    return (
        <motion.section
            ref={ref}
            initial={animation.initial}
            animate={isInView ? animation.animate : animation.initial}
            transition={animation.transition}
            className="min-h-screen flex items-center justify-center"
            style={{backgroundColor: bgColor, position: 'relative', zIndex: 1}}
        >
            <div className="container mx-auto px-6 py-12">
                {children}
            </div>
        </motion.section>
    );
};

// Компонент параллакс-фона
const ParallaxBackground = ({scrollY}) => {
    // Трансформации для эффекта параллакса
    const backgroundY = useTransform(scrollY, [0, 5000], [0, -500]);
    const opacity = useTransform(scrollY, [0, 1000, 2000, 3000], [1, 0.8, 0.6, 0.3]);

    // Смягчаем движение с помощью spring
    const smoothY = useSpring(backgroundY, {stiffness: 100, damping: 30});

    return (
        <motion.div
            className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden"
            style={{
                backgroundImage: 'url("/api/placeholder/1920/1080")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                y: smoothY,
                opacity
            }}
        />
    );
};

// Компонент для анимации элементов списка с задержкой
const StaggeredItems = ({items}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: false, amount: 0.2});

    const container = {
        hidden: {opacity: 0},
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: {opacity: 0, y: 20},
        show: {opacity: 1, y: 0, transition: {duration: 0.5, ease: "easeOut"}}
    };

    return (
        <motion.ul
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
            {items.map((text, i) => (
                <motion.li
                    key={i}
                    variants={item}
                    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl"
                >
                    {text}
                </motion.li>
            ))}
        </motion.ul>
    );
};

// Текстовый компонент с анимацией по символам
const AnimatedText = ({text}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: false, amount: 0.5});

    const container = {
        hidden: {opacity: 0},
        visible: (i = 1) => ({
            opacity: 1,
            transition: {staggerChildren: 0.03, delayChildren: 0.04 * i}
        })
    };

    const child = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {type: "spring", stiffness: 100, damping: 12}
        }
    };

    return (
        <motion.div
            ref={ref}
            className="text-4xl md:text-6xl font-bold overflow-hidden"
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{display: "inline-block", marginRight: char === " " ? "0.3em" : "0"}}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
};

// Компонент анимации счетчика
const CounterAnimation = ({from, to, duration = 2, delay = 0}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: false, amount: 0.5});
    const [count, setCount] = useState(from);

    useEffect(() => {
        if (!isInView) {
            setCount(from);
            return;
        }

        let startTime;
        let animationFrame;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            setCount(Math.floor(from + progress * (to - from)));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        const startAnimation = () => {
            animationFrame = requestAnimationFrame(updateCount);
        };

        const timer = setTimeout(startAnimation, delay * 1000);

        return () => {
            clearTimeout(timer);
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [from, to, duration, delay, isInView]);

    return (
        <motion.div
            ref={ref}
            initial={{opacity: 0, scale: 0.8}}
            animate={isInView ? {opacity: 1, scale: 1} : {opacity: 0, scale: 0.8}}
            transition={{duration: 0.5}}
            className="text-5xl md:text-6xl font-bold"
        >
            {count}
        </motion.div>
    );
};


// Компонент для отображения хеша транзакции с возможностью копирования
const Transactions = observer(() => {
        const {scrollY} = useScroll();
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
            // Имитация загрузки ресурсов
            const timeout = setTimeout(() => {
                setIsLoaded(true);
            }, 500);

            return () => clearTimeout(timeout);
        }, []);
//     useEffect(() => {
//         etherStore.setEthPrice()
//     }, []);
//
//
//     // export const useEthPrice = () => {
//     //     return useQuery({
//     //         queryKey: ['ethPrice'],
//     //         queryFn: etherStore.setEthPrice,
//     //         refetchInterval: 60000, // обновление каждую минуту
//     //     });
//     // }
//
//
//     const chains = [42161, 8453, 10, 534352, 81457]
//     const address = "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511"
//
//
// // Функция для получения баланса для одной цепи
//     const fetchBalance = async (chainId) => {
//         const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=balance&address=${address}&tag=latest&apikey=${etherStore.apiKey}`
//
//         const response = await fetch(url)
//         if (!response.ok) {
//             throw new Error(`Ошибка API для цепи ${chainId}: ${response.status}`)
//         }
//
//         return response.json()
//     }
//
//
//
// // Хук для одной цепи
//     function useBalanceQuery(chainId) {
//
//
// // Хук для запроса балансов по всем цепям сразу
//     const useAllBalances = () => {
//         logger.info('useAllBalances', JSON.stringify(chains))
//         return useQueries({
//             queries: chains.map(chainId => ({
//                 queryKey: ['balance', chainId],
//                 queryFn: () => fetchBalance(chainId),
//                 staleTime: 60000,
//             })),
//         })
//     }
//
// // Пример использования в компоненте
//
//     // Вариант 1: Запрос для всех цепей сразу
//     const results = useAllBalances()
//
//     // Проверка загрузки всех запросов
//     const isLoading = results.some(result => result.isLoading)
//
//     // Проверка ошибок
//     const isError = results.some(result => result.isError)
//
//     // Извлечение данных
//     const balances = results.map((result, index) => ({
//         chainId: chains[index],
//         data: result.data,
//         isLoading: result.isLoading,
//         error: result.error
//     }))
//
//     const [scope, animate] = useAnimate()
//
//     useEffect(() => {
//         const controls = animate([
//             [scope.current, {y: ["100%", 0]}],
//             ["li", {
//                 scale: [0.5, 1, 0.5, 1], color: [
//                     logger.getRandomColor(uiStore.themeIsDark ? 16 : 5),
//                     logger.getRandomColor(uiStore.themeIsDark ? 16 : 5),
//                     logger.getRandomColor(uiStore.themeIsDark ? 16 : 5),
//                     logger.getRandomColor(uiStore.themeIsDark ? 16 : 5)]
//             }]
//         ])
//
//         controls.speed = 0.8
//
//         return () => controls.stop()
//     }, [])


        return (

            // <main className='pageWrapper'>
            //     <animated.section className='pageCard' style={{...uiStore.themeStyle, height: 1000}}>

                    <div className="relative ">
                        <ParallaxBackground scrollY={scrollY}/>

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 1}}
                            className="relative z-10"
                        >
                            {/* Первая секция с заголовком */}
                            <AnimatedSection bgColor="rgba(30, 41, 59, 0.7)" index={0}>
                                <div className="text-center text-white">
                                    <AnimatedText text="Параллакс Эффект"/>
                                    <motion.p
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: 0.5, duration: 0.8}}
                                        className="mt-8 text-xl max-w-2xl mx-auto"
                                    >
                                        Современный пример скролла с профессиональными анимациями,
                                        выполненными на React с использованием Framer Motion.
                                    </motion.p>
                                </div>
                            </AnimatedSection>

                            {/* Вторая секция с карточками */}
                            <AnimatedSection bgColor="rgba(51, 65, 85, 0.7)" index={1}>
                                <div className="text-white">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Наши преимущества</h2>
                                    <StaggeredItems
                                        items={[
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">Плавные анимации</h3>
                                                <p>Все переходы и эффекты реализованы с использованием Framer Motion для
                                                    обеспечения идеальной плавности.</p>
                                            </div>,
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">Эффект параллакса</h3>
                                                <p>Фон страницы реагирует на скролл, создавая ощущение глубины и объема.</p>
                                            </div>,
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">Отзывчивый дизайн</h3>
                                                <p>Все элементы прекрасно выглядят на экранах любого размера и адаптируются
                                                    под устройство.</p>
                                            </div>
                                        ]}
                                    />
                                </div>
                            </AnimatedSection>

                            {/* Третья секция с анимацией счетчиков */}
                            <AnimatedSection bgColor="rgba(71, 85, 105, 0.7)" index={2}>
                                <div className="text-white text-center">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-12">Впечатляющие цифры</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            {value: 95, label: "% удовлетворенность"},
                                            {value: 1250, label: "проектов завершено"},
                                            {value: 24, label: "часа поддержки"}
                                        ].map((stat, i) => (
                                            <div key={i} className="relative">
                                                <CounterAnimation
                                                    from={0}
                                                    to={stat.value}
                                                    duration={2}
                                                    delay={i * 0.2}
                                                />
                                                <p className="mt-2 text-lg">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Четвертая секция с финальным призывом */}
                            <AnimatedSection bgColor="rgba(15, 23, 42, 0.7)" index={3}>
                                <div className="text-white text-center">
                                    <AnimatedText text="Свяжитесь с нами"/>
                                    <motion.p
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.7, duration: 0.8}}
                                        className="mt-8 text-xl max-w-2xl mx-auto"
                                    >
                                        Готовы создать впечатляющий проект с современными анимациями?
                                    </motion.p>
                                    <motion.button
                                        initial={{opacity: 0, scale: 0.8}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{delay: 1, duration: 0.5}}
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white font-semibold shadow-lg"
                                    >
                                        Начать проект
                                    </motion.button>
                                </div>
                            </AnimatedSection>
                        </motion.div>
                    </div>
            //     </animated.section>
            // </main>

        )
    }

)
export default Transactions;

// Transaction
// <Text
//     size="sm"
//     family="monospace"
//     style={{cursor: 'pointer'}}
//     onClick={handleCopy}
// >
//     {/*{hash.slice(0, 6)}...{hash.slice(-4)}*/}
// </Text>
// </Tooltip>

// };


// const Transactions = observer(() => {
//     const [opened, { open, close }] = useDisclosure(false);
//     const [selectedTx, setSelectedTx] = useState(null);


// });

// export default Transactions;

// Загружаем историю транзакций при монтировании
// useEffect(() => {
//     if (walletStore.isConnected) {
//         walletStore.fetchTransactionHistory();
//     }
// }, [walletStore.isConnected]);

// Открыть детали транзакции
// const handleOpenDetails = (tx) => {
//     setSelectedTx(tx);
//     open();
// };
//
// // Повторить транзакцию
// const handleRetry = async (tx) => {
//     try {
//         await walletStore.retryTransaction(tx);
//     } catch (error) {
//         console.error('Ошибка при повторении транзакции:', error);
//     }
// };
//
// if (!walletStore.isConnected) {
//     return (
//         <Container size="xl">
//             <Title order={2} mb="xl">Транзакции</Title>
//             <Paper p="xl" radius="md" shadow="sm">
//                 <Title order={3} align="center">Подключите кошелек для просмотра транзакций</Title>
//             </Paper>
//         </Container>
//     );
// }


// <Container size="xl">
//     {/*<Title order={2} mb="xl">Транзакции</Title>*/}
//
//     <Grid>
//         {/* Активные транзакции */}
//         {walletStore.pendingTransactions.size > 0 && (
//             <Grid.Col span={12}>
//                 <Paper p="md" radius="md" shadow="sm" mb="xl">
//                     <Title order={3} mb="md">Активные транзакции</Title>
//                     <Table>
//                         <thead>
//                         <tr>
//                             <th>Хеш</th>
//                             <th>Тип</th>
//                             <th>Статус</th>
//                             <th>Действия</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {Array.from(walletStore.pendingTransactions).map((hash) => (
//                             <tr key={hash}>
//                                 <td><TransactionHash hash={hash} /></td>
//                                 <td>
//                                     <Badge color="yellow">В процессе</Badge>
//                                 </td>
//                                 <td>
//                                     <Badge color="blue">Ожидает подтверждения</Badge>
//                                 </td>
//                                 <td>
//                                     <Button
//                                         size="xs"
//                                         variant="light"
//                                         onClick={() => walletStore.speedUpTransaction(hash)}
//                                     >
//                                         Ускорить
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </Table>
//                 </Paper>
//             </Grid.Col>
//         )}
//
//         {/* Настройки спонсируемых транзакций */}
//         <Grid.Col span={12}>
//             <Paper p="md" radius="md" shadow="sm" mb="xl">
//                 <Group position="apart">
//                     <div>
//                         <Title order={3} mb="xs">Спонсируемые транзакции</Title>
//                         <Text size="sm" color="dimmed">
//                             Позволяет выполнять транзакции без оплаты газа
//                         </Text>
//                     </div>
//                     <Group>
//                         <Button
//                             onClick={() => walletStore.enableSponsoredTransactions()}
//                             disabled={!walletStore.isConnected || walletStore.sponsoredTransactionsEnabled}
//                             color={walletStore.sponsoredTransactionsEnabled ? 'green' : 'blue'}
//                         >
//                             {walletStore.sponsoredTransactionsEnabled ? 'Активно' : 'Включить спонсирование'}
//                         </Button>
//                     </Group>
//                 </Group>
//             </Paper>
//         </Grid.Col>
//
//         {/* История транзакций */}
//         <Grid.Col span={12}>
//             <Paper p="md" radius="md" shadow="sm">
//                 <Title order={3} mb="md">История транзакций</Title>
//                 <Table>
//                     <thead>
//                     <tr>
//                         <th>Дата</th>
//                         <th>Тип</th>
//                         <th>Сумма</th>
//                         <th>Статус</th>
//                         <th>Хеш</th>
//                         <th>Действия</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {walletStore.transactionHistory?.map((tx) => (
//                         <tr key={tx.hash}>
//                             <td>
//                                 <Tooltip label={new Date(tx.timestamp).toLocaleString()}>
//                                     <Text size="sm">
//                                         {formatDistanceToNow(new Date(tx.timestamp), {
//                                             addSuffix: true,
//                                             locale: ru
//                                         })}
//                                     </Text>
//                                 </Tooltip>
//                             </td>
//                             <td>
//                                 <Badge>{tx.type}</Badge>
//                             </td>
//                             <td>
//                                 <Text size="sm">
//                                     {tx.value} {tx.token}
//                                 </Text>
//                             </td>
//                             <td>
//                                 <Badge color={getStatusColor(tx.status)}>
//                                     {tx.status}
//                                 </Badge>
//                             </td>
//                             <td>
//                                 <TransactionHash hash={tx.hash} />
//                             </td>
//                             <td>
//                                 <Menu shadow="md" width={200}>
//                                     <Menu.Target>
//                                         <ActionIcon>⋮</ActionIcon>
//                                     </Menu.Target>
//                                     <Menu.Dropdown>
//                                         <Menu.Item onClick={() => handleOpenDetails(tx)}>
//                                             Подробности
//                                         </Menu.Item>
//                                         {tx.status === 'failed' && (
//                                             <Menu.Item onClick={() => handleRetry(tx)}>
//                                                 Повторить
//                                             </Menu.Item>
//                                         )}
//                                         <Menu.Item
//                                             onClick={() => window.open(`${tx.explorerUrl}${tx.hash}`, '_blank')}
//                                         >
//                                             Просмотр в эксплорере
//                                         </Menu.Item>
//                                     </Menu.Dropdown>
//                                 </Menu>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </Table>
//             </Paper>
//         </Grid.Col>
//     </Grid>
//
//     {/* Модальное окно с деталями транзакции */}
//     <Modal
//         opened={opened}
//         onClose={close}
//         title="Детали транзакции"
//         size="lg"
//     >
//         {selectedTx && (
//             <Paper p="md">
//                 <Group mb="md">
//                     <Text weight={500}>Хеш:</Text>
//                     <TransactionHash hash={selectedTx.hash} />
//                 </Group>
//                 <Group mb="md">
//                     <Text weight={500}>Статус:</Text>
//                     <Badge color={getStatusColor(selectedTx.status)}>
//                         {selectedTx.status}
//                     </Badge>
//                 </Group>
//                 <Group mb="md">
//                     <Text weight={500}>Отправитель:</Text>
//                     <Text size="sm" family="monospace">{selectedTx.from}</Text>
//                 </Group>
//                 <Group mb="md">
//                     <Text weight={500}>Получатель:</Text>
//                     <Text size="sm" family="monospace">{selectedTx.to}</Text>
//                 </Group>
//                 <Group mb="md">
//                     <Text weight={500}>Значение:</Text>
//                     <Text>{selectedTx.value} {selectedTx.token}</Text>
//                 </Group>
//                 <Group mb="md">
//                     <Text weight={500}>Газ:</Text>
//                     <Text>{selectedTx.gasUsed} ({selectedTx.gasPrice} Gwei)</Text>
//                 </Group>
//                 {selectedTx.error && (
//                     <Group mb="md">
//                         <Text weight={500} color="red">Ошибка:</Text>
//                         <Text color="red">{selectedTx.error}</Text>
//                     </Group>
//                 )}
//             </Paper>
//         )}
//     </Modal>
// </Container>
//     );
// });
