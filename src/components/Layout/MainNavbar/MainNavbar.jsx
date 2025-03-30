import {AppShell, Center} from "@mantine/core";
import React, {useEffect} from 'react';
import classes from "./MainNavbar.module.css";
import {Web3Inch} from "../SvgIcons/Web3Inch.jsx";
import {observer} from "mobx-react-lite";
import {uiStore} from "@stores/ui.js";
import {motion} from "motion/react";
import {AwesomeButton} from "@animations/involved/AwesomeButton";
import GradientText from "@animations/involved/GradientText";
import {router} from "@stores/router";
import {IoApertureSharp, IoFileTrayFullSharp, IoLogoReact, IoSettings, IoWallet,} from "react-icons/io5";
import {animation} from "@stores/animation.js";

export const MainNavbar = observer(() => {
    const icons = {
        Home: <IoWallet size={30}/>,
        Balance: <IoApertureSharp size={30}/>,
        Approve: <IoLogoReact size={30}/>,
        Transactions: <IoFileTrayFullSharp size={32}/>,
        Options: <IoSettings size={30}/>,
    };
    const navBarMoving = animation.getMCAnimation('NavBarMoving')
    useEffect(() => {
        navBarMoving.control.start("visible")
    }, [])


    return (
        <motion.div
            animate={navBarMoving.control}
            variants={{
                hidden: {x: 0},
                show: {x: 1}
            }}
            transition={{
                ...navBarMoving.transition, transition: {
                    staggerChildren: 0.1
                }
            }}
            style={{position: 'absolute', top: 0, left: 0, zIndex: 100}}
            initial="hidden"
        >
            <AppShell.Navbar
                // style={{ position: "absolute", top: 60, left: 0 }}
                className={classes.navbar}
                p="md"
                width={{base: 300}}
            >
                <Center>
                    <Web3Inch
                        animate={navBarMoving.control}
                        color1="yellow"
                        color2="orange"
                        isDark={uiStore.themeIsDark}
                    />
                </Center>

                {router.getPages().map(([path, route]) => {
                    const active = route.element === router.getPageElement;
                    console.log("%c 9 --> Line: 50||MainNavbar.jsx\n router: ", "color:#acf;", router);
                    console.log("%c 6 --> Line: 50||MainNavbar.jsx\n route.element: ", "color:#00f;", route.element);

                    return (
                        <AwesomeButton
                            animate={navBarMoving.control}
                            variants={navBarMoving.variants}
                            transition={{
                                ...navBarMoving.transition, transition: {
                                    staggerChildren: 0.1
                                }
                            }}
                            initial="hidden"
                            style={{
                                scale: active ? 1 : 0.95,
                                color: active ? "blue" : "white",
                                padding: 3,
                            }}
                            active={active}
                            onPress={() => router.goTo(path)}
                            whileTap={{scale: 0.95}}
                            type="instagram"
                            before={icons[route.element]}
                            buttonKey={path}
                            key={path}
                        >
                            <GradientText
                                active={active}
                                animationSpeed={active ? 20 : 3}
                                showBorder={false}
                                className="custom-class"
                            >
                                {route.title}
                            </GradientText>
                        </AwesomeButton>
                    );
                })}
            </AppShell.Navbar>
        </motion.div>
    );
});
