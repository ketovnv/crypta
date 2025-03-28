// src/pages/Transactions.tsx
// import { walletStore } from '@/stores/wallet';


// Вспомогательная функция для определения цвета статуса транзакции
import {logger} from "@stores/logger.js";
import {Center} from "@mantine/core";
import {BlackCoilTexture} from "@animations/involved/textures/BlackCoilTexture.js";
import AppearingText from "@animations/Examples/AppearingText/AppearingText.js";
import {animation} from "@stores/animation.js";
import {motion} from "framer-motion";

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
const Transactions = ({}) => {

    return (
        <Center
            m={0}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                borderRadius: 20,
                height: 575,
                // background: "linear-gradient(#CC50CC,#AA79ff,#1050CC,#BB50CC)",
            }}
        >
            <BlackCoilTexture themeBackGround={animation.getThemeBackGround}>
                <AppearingText text="Страница находится в разработке..."/>
                <StrokeAnimation/>
            </BlackCoilTexture>
        </Center>
    )
}

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

export default Transactions;


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
