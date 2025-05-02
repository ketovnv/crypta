import {useQueries, useQuery} from '@tanstack/react-query'
import {observer} from "mobx-react-lite";
import {logger} from "@stores/logger.js";
import {useEffect} from "react";
import {Center} from "@mantine/core";
import {motion, useAnimate} from "motion/react";
import {uiStore} from "@stores/ui.js";
import {animated} from "@react-spring/web";
import {walletStore} from "@stores/wallet.js";
import GradientText from "@animations/involved/GradientText.jsx";
import AppearingText from "@animations/Examples/AppearingText/AppearingText.js";
import {etherStore} from "@stores/ether.js";
import {ethersAdapter} from "@/config/index.js";
import {LJ} from "@components/logger/LJ.jsx";

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

// Компонент для отображения хеша транзакции с возможностью копирования
const Transactions = observer(({}) => {

    useEffect(() => {
        etherStore.setEthPrice()
    }, []);


    // export const useEthPrice = () => {
    //     return useQuery({
    //         queryKey: ['ethPrice'],
    //         queryFn: etherStore.setEthPrice,
    //         refetchInterval: 60000, // обновление каждую минуту
    //     });
    // }


    const chains = [42161, 8453, 10, 534352, 81457]
    const address = "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511"


// Функция для получения баланса для одной цепи
    const fetchBalance = async (chainId) => {
        const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=balance&address=${address}&tag=latest&apikey=${etherStore.apiKey}`

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Ошибка API для цепи ${chainId}: ${response.status}`)
        }

        return response.json()
    }



// Хук для одной цепи
    function useBalanceQuery(chainId) {
        return useQuery({
            queryKey: ['balance', chainId],
            queryFn: () => fetchBalance(chainId),
            staleTime: 60000, // 1 минута до устаревания данных
        })
    }

// Хук для запроса балансов по всем цепям сразу
    const useAllBalances = () => {
        logger.info('useAllBalances', JSON.stringify(chains))
        return useQueries({
            queries: chains.map(chainId => ({
                queryKey: ['balance', chainId],
                queryFn: () => fetchBalance(chainId),
                staleTime: 60000,
            })),
        })
    }

// Пример использования в компоненте

    // Вариант 1: Запрос для всех цепей сразу
    const results = useAllBalances()

    // Проверка загрузки всех запросов
    const isLoading = results.some(result => result.isLoading)

    // Проверка ошибок
    const isError = results.some(result => result.isError)

    // Извлечение данных
    const balances = results.map((result, index) => ({
        chainId: chains[index],
        data: result.data,
        isLoading: result.isLoading,
        error: result.error
    }))

    const [scope, animate] = useAnimate()

    useEffect(() => {
        const controls = animate([
            [scope.current, {y: ["100%", 0]}],
            ["li", {
                scale: [0.5, 1, 0.5, 1], color: [
                    logger.getRandomColor(uiStore.themeIsDark ? 16 : 5),
                    logger.getRandomColor(uiStore.themeIsDark ? 16 : 5),
                    logger.getRandomColor(uiStore.themeIsDark ? 16 : 5),
                    logger.getRandomColor(uiStore.themeIsDark ? 16 : 5)]
            }]
        ])

        controls.speed = 0.8

        return () => controls.stop()
    }, [])
    return (
        <main
            className="pageWrapper"
        >
            <animated.section className="pageCard" style={uiStore.themeStyle}>

                <LJ json={etherStore.ethPrice}/>

                <div>
                    <h3 style={{color: logger.getRandomColor(uiStore.themeIsDark ? 16 : 5)}}>Балансы по всем цепям</h3>
                    {isLoading && <p>Загрузка данных...</p>}
                    {isError && <p>Произошла ошибка при загрузке</p>}
                    <ul ref={scope} layout>
                        {balances.map(item => (
                            <li key={item.chainId}>
                                Цепь {item.chainId}:
                                {item.isLoading ? ' загрузка...' :
                                    item.error ? ` ошибка: ${item.error.message}` :
                                        <GradientText><AppearingText style={{fontFamily:'Tactic Round Bld',paddingLeft:5}} fontSize={14} text={item.data?.result || 'н/д'}/></GradientText>}
                            </li>
                        ))}
                    </ul>
                </div>
            </animated.section>
        </main>
    )
})
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
