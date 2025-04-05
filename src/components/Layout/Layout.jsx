import {AppShell, MantineProvider} from "@mantine/core";
import React, {useEffect} from "react";
import {MainNavbar} from "./MainNavbar";
import {MainHeader} from "./MainHeader";
import {MainFooter} from "./MainFooter";
import {logger} from "@/stores/logger.js";
import {AppKitObserver} from "./AppKitObserver";
import {MainContent} from "@components/Layout/MainContent/index.js";
import {AnimationObserver} from "@animations/involved/AnimationObserver.jsx";

const Layout = () => {
    useEffect(() => {
        console.log("Layout mounted");
        // logger.info("🍰", " Layout mounted");
        return () => console.log("Layout unmounted");
    }, []);
    console.log("LAYOUT");

    logger.logRandomColors("LAYOUT", "mounted", 12);
    return (
        // <ErrorBoundary>
        <MantineProvider>
            <AppShell
                header={{height: 60}}
                navbar={{
                    width: 300,
                    breakpoint: "sm",
                }}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100vw",
                    overflow: "hidden",
                }}
                padding={0}
            >
                <AnimationObserver/>
                <AppKitObserver/>
                <MainHeader/>
                <MainNavbar/>
                <MainContent/>
                <MainFooter/>
            </AppShell>
        </MantineProvider>
        // </ErrorBoundary>
    );
};

export default Layout;
