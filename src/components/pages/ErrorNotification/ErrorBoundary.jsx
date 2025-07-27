import React from "react";
import { Button, Center, Container, Text } from "@mantine/core";
import { SVGIllustration404 } from "@components/pages/ErrorNotification/SVGIllustration404.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import classes from "./ErrorBoundary.module.css";
import { logger } from "@stores/logger.js";
import { uiStore } from "@stores/ui.js";
import GradientText from "@animations/involved/GradientText.jsx";
import { GradientMaker } from "@components/classes/GradientMaker.js";
// import { gradientStore } from "@components/classes/gradient.js";

const NotFoundError = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Container className={classes.root}>
      <SVGIllustration404 className={classes.image} />
      <div className={classes.inner}>
        <Text className={classes.title}>Здесь пусто</Text>
        <Text className={classes.description}>
          {message ||
            "Такой страницы не существует. Возможно Вы ввели неправильный адрес"}
        </Text>
      </div>

      <Center>
        <Button variant="outline" onClick={() => navigate("/")} size="xl">
          Домой
        </Button>
      </Center>
    </Container>
  );
};
const DefaultError = ({ message }) => {
  return (
    <main className="pageWrapper" style={{ paddingLeft: 0, y: -200 }}>
      <motion.section
        layout
        className="pageCard"
        animate={{ ...uiStore.theme, height: 475 }}
        transition={{ duration: 3 }}
        style={{
          borderRadius: 20,
          height: 0,
          width: 700,
        }}
      >
        <motion.div
          layout
          animate={{
            height: "fit-content",
            paddingLeft: 65,
            filter: "drop-shadow(0px 0px 10px oklch(0.65 0.2236 29.65))",
          }}
          transition={{ duration: 1.5 }}
          className={classes.icon}
        >
          💥💥💥💥💥💥
        </motion.div>
        <motion.div
          layout
          animate={{
            opacity: 1,
            fontSize: logger.getFontSizeLog(message.length),
            color: uiStore.theme.accentColor,
          }}
          transition={{
            duration: 15,
            fontSize: { type: "spring", visualDuration: 5, bounce: 0.2 },
          }}
          className={classes.description}
        >
          {message}
        </motion.div>
        <motion.div
          layout
          animate={{
            filter: "drop-shadow(0px 2px 1px oklch(0.65 0.2236 29.65))",
          }}
        >
          <GradientText
            colors={GradientMaker.getRedGradient}
            style={{
              fontFamily: "Tactic Round Bld",
              textAlign: "center",
              fontWeight: 700,
              fontSize: "3em",
            }}
          >
            Что-то пошло не так...
          </GradientText>
        </motion.div>
        {/*<motion.div*/}
        {/*    layout*/}
        {/*    animate={{*/}
        {/*        height: 'fit-content',paddingLeft:65,*/}
        {/*        filter: 'drop-shadow(0px 0px 10px oklch(0.65 0.2236 29.65))'*/}
        {/*    }}*/}
        {/*    transition={{duration: 1.5}}*/}
        {/*    className={classes.icon}>*/}
        {/*    ⛔👻💥☠🛑*/}
        {/*</motion.div>*/}
      </motion.section>
    </main>
  );
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.warn("componentDidCatchError:", error);
    console.warn("componentDidCatchInfo", JSON.stringify(info));
    console.warn("componentDidCatchInfo", JSON.stringify(error));
  }

  render() {
    // return error.status === 404 ? <NotFoundError message={this.state.error.message}/> : <DefaultError message={this.state.error.message}/>
    if (this.state.hasError) {
      if (this.state.error) {
        logger.error("Error", this.state.error);
        return <DefaultError message={this.state.error.message} />;
      }
      return <div>An unexpected error occurred.</div>;
    }

    return this.props.children;
  }
}
