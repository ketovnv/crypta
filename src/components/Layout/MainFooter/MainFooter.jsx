import {Anchor, AppShell, Center, Group} from "@mantine/core";
import {observer} from "mobx-react-lite";
import classes from "./MainFooter.module.css";
import {motion} from "motion/react";
import {walletStore} from "@stores/wallet.js";

export const MainFooter = observer(() => {
    return (
        <AppShell.Footer className={classes.footer} px="md" align="center">
            <motion.div
                initial={{
                    opacity: 0,
                    // y: -20
                }}
                animate={{
                    opacity: 1,
                    // y: 0
                }}
                transition={{duration: 0.8, delay: 0.3}}
            >
                {walletStore.getNetwork() && (
                    <Center>
                        <Group>
                            <Anchor
                                href={
                                    walletStore.getNetwork().caipNetwork?.rpcUrls?.default
                                        .http[0]
                                }
                                target="_blank"
                            >
                                RPC
                            </Anchor>
                            <Anchor
                                href={
                                    walletStore.getNetwork().caipNetwork?.rpcUrls
                                        ?.chainDefault.http[0]
                                }
                                target="_blank"
                            >
                                RPC сети
                            </Anchor>
                            <Anchor
                                href={
                                    walletStore.getNetwork()?.caipNetwork?.blockExplorers
                                        .default.url
                                }
                                target="_blank"
                            >
                                {
                                    walletStore.getNetwork()?.caipNetwork?.blockExplorers
                                        .default.name
                                }
                            </Anchor>
                            <Anchor
                                href={
                                    walletStore.getNetwork()?.caipNetwork?.blockExplorers
                                        .default.apiUrl
                                }
                                target="_blank"
                            >
                                {
                                    walletStore.getNetwork()?.caipNetwork?.blockExplorers
                                        .default.name
                                }{" "}
                                API
                            </Anchor>
                        </Group>
                    </Center>
                )}
            </motion.div>
        </AppShell.Footer>
    );
});
