
//import {walletStore}
//observer   При монтировании компонента запускаем получение балансов
//  useEffect(() => {
//      if (walletStore.isConnected) {
//          walletStore.fetchBalances();
//      }
//  }, [walletStore.isConnected]);


{/* Статистика кошелька */
}
{/*{walletStore.isConnected&&(*/
}
//<>
{/*<Grid.Col span={6}>*/
}
{/*    <Paper p="md" radius="md" shadow="md">*/
}
{/*        <Title order={3} mb="md">Балансы</Title>*/
}
{/*        <Group spacing="xl">*/
}
{/*            {Array.from(walletStore.balances.entries()).map(([key, balance]) => (*/
}
{/*                <RingProgress*/
}
{/*                    key={key}*/
}
{/*                    size={120}*/
}
{/*                    roundCaps*/
}
{/*                    thickness={8}*/
}
{/*                    sections={[{value: 100, color: 'blue'}]}*/
}
{/*                    label={*/
}
{/*                        <Text size="xs" align="center">*/
}
{/*                            {balance.symbol}*/
}
{/*                            <br />*/
}
{/*                            {parseFloat(balance.balance).toFixed(4)}*/
}
{/*                        </Text>*/
}
{/*                    }*/
}
{/*                />*/
}
{/*            ))}*/
}
{/*        </Group>*/
}
{/*    </Paper>*/
}
{/*</Grid.Col>*/
}

{/*<Grid.Col span={6}>*/
}
{/*    <Paper p="md" radius="md" shadow="sm">*/
}
{/*        <Title order={3} mb="md">Последние события</Title>*/
}
{/*        {walletStore.events.slice(-5).map((event, index) => (*/
}
{/*            <Text key={index} size="sm" mb="xs">*/
}
{/*                {event}*/
}
{/*            </Text>*/
}
{/*        ))}*/
}
{/*    </Paper>*/
}
{/*</Grid.Col>*/