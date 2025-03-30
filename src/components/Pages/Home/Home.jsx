import "@reown/appkit-wallet-button/react";
import {observer} from "mobx-react-lite";
import {Accordion, Box, Button, Center, Group, Stack, Text, Title} from "@mantine/core";
import classes from "./Home.module.css";
import {Metamask} from "@components/Layout/SvgIcons/Metamask";
import {Google} from "@components/Layout/SvgIcons/Google";
import {walletStore} from "@/stores/wallet";
import {useDisconnect} from "@reown/appkit/react";
import {logger} from "@stores/logger.js";
import React from "react";
import {motion} from "motion/react";
import {animation} from "@stores/animation.js";

const Home = observer(() => {
    // const props = useSpring({
    //   opacity: isLeaving ? 0 : 1,
    //   transform: isLeaving ? "translate3d(0,-40px,0)" : "translate3d(0,0px,0)",
    //   config: { duration: isLeaving ? 500 : undefined }, // Different duration for exit
    // });
    logger.logWhiteRandom("🏩", " Компонент Home", 12);
    const {disconnect} = useDisconnect();
    // const [ref, bounds, setBounds] = useMeasure({ scroll: true });

    // logger.setBounds(bounds);
    return (
        <Center
            m={0}
            // ref={ref}
            className="pageWrapper"
        >
            <motion.div class="pageCard" animate={{background: animation.getThemeBackGround}}
                        transition={{duration: 3, ease: "easeInOut"}}>
                <Stack
                    align="flex-start"
                    justify="flex-start"
                    // layoutId="homeCardElement"
                >
                    <Group justify="space-between" align="center">
                        {walletStore.getWalletInformation()?.social === "google" && (
                            <Google/>
                        )}
                        {walletStore.getWalletInformation()?.social && (
                            <Box display="inline">
                                <Text className={classes.label}>
                                    Социальный аккаунт&nbsp;
                                    {walletStore.getWalletInformation()?.social}
                                </Text>
                                <Text className={classes.walletName}>
                                    {walletStore.getWalletInformation()?.identifier}
                                </Text>
                            </Box>
                        )}
                        {walletStore.getWalletInformation()?.name === "io.metamask" && (
                            <Metamask/>
                        )}
                        {walletStore.getWalletInformation()?.type === "injected" && (
                            <Box>
                                <Text className={classes.label}>Кошелёк</Text>
                                <Text className={classes.walletName}>
                                    `{walletStore.getWalletInformation()?.name}
                                </Text>
                            </Box>
                        )}

                        {walletStore.getAccountData() ? (
                            <Button
                                display="inline"
                                onClick={() => disconnect()}
                                variant="outline"
                                color="red"
                            >
                                Отключить
                            </Button>
                        ) : (
                            <Center w={550}>
                                <appkit-button label="Подключить кошелёк"/>
                            </Center>
                        )}
                    </Group>
                    {walletStore.getNetwork() && (
                        <Group>
                            <Text className={classes.label}>
                                {walletStore.getNetwork().caipNetwork?.nativeCurrency?.symbol}
                            </Text>
                            <appkit-network-button/>
                            {walletStore.getNetwork()?.caipNetwork.testnet && (
                                <Text className={classes.testNetwork}>Тестовая сеть</Text>
                            )}
                        </Group>
                    )}
                    {walletStore.getAccountData() && (
                        <Box>
                            <Group justify="space-between">
                                <Text className={classes.label}>Адресс</Text>
                                <Text className={classes.walletAddress}>
                                    {walletStore.getAccountData().address}
                                </Text>
                            </Group>
                            <Group justify="space-between">
                                <Text className={classes.label}>Адресс caip</Text>
                                <Text className={classes.walletAddress}>
                                    {walletStore.getAccountData().caipAddress}
                                </Text>
                            </Group>
                        </Box>
                    )}
                </Stack>
            </motion.div>

            {false && walletStore.getNetwork() && (
                <Accordion w={550} mx="auto" variant="separated">
                    <Accordion.Item value="contracts">
                        <Accordion.Control>
                            <Title order={4} className={classes.lable}>
                                Контракты
                            </Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {Object.entries(
                                walletStore.getNetwork()?.caipNetwork.contracts,
                            ).map(([key, val]) => (
                                <Box key={key}>
                                    <Group>
                                        <Text style={{fontSize: 14}} className={classes.lable}>
                                            {key + " : "}
                                        </Text>
                                        <Text
                                            style={{fontSize: 14}}
                                            className={classes.walletAddress}
                                        >
                                            {val.address}
                                        </Text>
                                        {val.blockCreated && (
                                            <Text style={{fontSize: 12}}>
                                                Номер блока:{val.blockCreated}
                                            </Text>
                                        )}
                                    </Group>
                                </Box>
                            ))}

                            <Group>
                                <Text>Assets</Text>
                                <Text>
                                    {JSON.stringify(walletStore.getNetwork().caipNetwork?.assets)}
                                </Text>
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            )}
            {/*<BalanceTracker />*/}
            {/*</AppearanceAnimation>*/}
        </Center>
    );
});
export default Home;
