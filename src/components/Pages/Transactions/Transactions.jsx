// src/pages/Transactions.tsx
import { observer } from 'mobx-react-lite';
import {
    Container,
    Grid,
    Paper,
    Title,
    Table,
    Badge,
    Text,
    Group,
    Button,
    ActionIcon,
    Tooltip,
    Menu,
    Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { walletStore } from '@/stores/wallet';
import { useEffect, useState,Fragment,useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import classes             from './Transactions.module.css';

import {
    useSpring,
    useTransition,
    useTrail,
    // useKeyframes,
    useChain,
    animated,
} from '@react-spring/web'



// Вспомогательная функция для определения цвета статуса транзакции
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
const TransactionHash = ({ hash }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(hash);
    };

    return (
        <Tooltip label="Нажмите, чтобы скопировать" position="right">
            <Text
                size="sm"
                family="monospace"
                style={{ cursor: 'pointer' }}
                onClick={handleCopy}
            >
                {hash.slice(0, 6)}...{hash.slice(-4)}
            </Text>
        </Tooltip>
    );
};




const Spring = () => {
    console.clear()
    console.log("useSpring: ", useSpring)
    console.log("useTrail: ", useTrail)
    console.log("useKeyFrames: ", useKeyframes)
    console.log("useChain: ", useChain)
    console.log('animated: ', animated)

    return (
        <div>Spring!</div>
    )
}

const SpringApp = ({ children}) => {
    const [up, set] = useState(true);
    const chars = useMemo(() => children.split(''), [children]);
    const trail = useTrail(chars.length, { x: up ? 0 : 50, opacity: up ? 1 : 0});
    return (
        <div className={classes.content} onClick={() => set(a => !a)}>
            {trail.map(({ x, ...rest }, index) => (
                <animated.div style={{ ...rest, transform: x.interpolate(x => `translate3d(0,${x}px,0)`) }}>{chars[index]}</animated.div>
            ))}
        </div>
    )
}



const Transactions = observer(() => {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedTx, setSelectedTx] = useState(null);


   return( <SpringApp className="app">Spring</SpringApp>);
});

export default Transactions;

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

