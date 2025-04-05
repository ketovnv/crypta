// import AnimatedNumber      from "@components/Animations/AnimatedNumber.jsx";
// @ts-ignore
// @ts-ignore

import {AppShell, Group} from "@mantine/core";
import {observer} from "mobx-react-lite";
import classes from "./MainHeader.module.css";
import {useEventListener} from "@mantine/hooks";
import {animated, config, useTransition} from "@react-spring/web";
import {uiStore} from "@stores/ui";
import {motion} from "motion/react";
import {SpringAppName} from "@animations/involved/units/SpringAppName";
import ThemeToggle from "@components/Layout/MainHeader/ThemeToggle";
import HeaderBitcoin from "@components/Layout/SvgIcons/HeaderBitcoin";
import {walletStore} from "@stores/wallet.js";


export const MainHeader = observer(() => {
    const ref = useEventListener("click", () => uiStore.toggleNavbarOpened());

    const transitions = useTransition(!!walletStore.getAccountData(), {
        from: {opacity: 0, transform: "translateY(-20px)", scale: 0}, // Входящая (начало)
        enter: {opacity: 1, transform: "translateY(0px)", scale: 1}, // Входящая (конец)
        leave: {opacity: 0, transform: "translateY(20px)", scale: 0}, // УХОДЯЩАЯ АНИМАЦИЯ
        config: {...config.molasses}, // Настройки пружины
        keys: null,
    });

    return (<AppShell.Header
        className={classes.header}
        align="center"
    >
        <motion.div
            style={{width: '100wv'}}
            initial={{
                opacity: 0, y: -60, // background: 'rgb(255,255,255,.5)'
            }}
            animate={{
                opacity: 1, y: 0, // background: 'rgb(255,255,255,0)'
            }}

            transition={{duration: 1.5, delay: 0.3, ease: "easeInOut"}}
        >
            <Group position="apart" justify="space-between" h="100%" align="center">
                <Group ref={ref} className={classes.pressableGroup}>
                    <motion.button
                        style={{
                            background: "none", borderWidth: 0, cursor: "pointer", borderRadius: 100,
                        }}
                        initial={{scale: 0}}
                        animate={{scale: 1, transition: {duration: 3}}}
                        whileHover={{
                            scale: 1.5, transition: {duration: 3},
                        }}
                        whileTap={{scale: 0.8}}
                    >
                        <HeaderBitcoin/>
                    </motion.button>
                    <SpringAppName/>
                </Group>
                {transitions((style, item) => item ? (<animated.div style={style}>
                    <appkit-button balance="show"/>
                </animated.div>) : null,)}
                <ThemeToggle isDark={uiStore.themeIsDark} setColorScheme={uiStore.setColorScheme}/>
            </Group>

        </motion.div>
    </AppShell.Header>);
});
