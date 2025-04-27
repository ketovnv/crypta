import React, { useEffect } from "react";
import { animated, useSpringRef, useTransition } from "@react-spring/web";
import { Center } from "@mantine/core";
import { animation } from "@stores/animation.js";
import { observer } from "mobx-react-lite";
import { logger } from "@stores/logger.js";
import {uiStore} from "@stores/ui.js"; // import AnimatedNumber from "@animations/AnimatedNumber";

const pages = [
  ({ style }) => (
    <animated.div style={style}>
      {logger.returnJSON("style:", style)}
    </animated.div>
  ),
  ({ style }) => (
    <animated.div style={style}>
      {logger.returnJSON("style:", style)}
    </animated.div>
  ),
  ({ style }) => (
    <animated.div style={style}>
      {logger.returnJSON("style:", style)}
    </animated.div>
  ),
];

const colors = ["#1050CC", "#FFFF00", "#FF50CC"];

const Options = observer(() => {
  const transRef = useSpringRef();
  const transitions = useTransition(animation.optionsTransitionsTestState, {
    ref: transRef,
    config: { tension: 280, friction: 800 },
    keys: null,
    from: {
      opacity: 0,
      transform: "translate3d(100%,0,0)",
      backgroundColor: "#000000",
      // color: "#000000 !important",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
      backgroundColor: colors[animation.optionsTransitionsTestState],
      // color: "FFFF00 !important",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-50%,0,0)",
      backgroundColor: "#000000",
      // color: "#000000  !important",
    },
  });
  useEffect(() => {
    transRef.start();
  }, [animation.optionsTransitionsTestState]);
  return (
    <main className="pageWrapper">
      <animated.section className="pageCard" style={uiStore.themeStyle}>
      {transitions((style, i) => {
        const Page = pages[i];
        return <Page style={style} key={style.color} />;
      })}
      </animated.section>
    </main>)
  //     <Container size="xl">
  // {/*<Title order={2} mb="xl">Управление сетями</Title>*/}

//   <Grid>
//     {/* Текущая сеть */}
//     <Grid.Col span={12}>
//       <Paper p="md" radius="md" shadow="sm" mb="xl">
//         <Group position="apart">
//           <div>
//             {/*<Text size="sm" color="dimmed">*/}
//             {/*  🕸️Одобрение🕸️*/}
//             {/*</Text>*/}
//             {/*<Title order={3}>{walletStore.activeChain}</Title>*/}
//           </div>
//           {/*<Badge size="lg" variant="filled">*/}
//           {/*  {walletStore.isConnected ? "Подключено" : "Не подключено"}*/}
//           {/*</Badge>*/}
//         </Group>
//       </Paper>
//     </Grid.Col>

// {/*<Grid.Col span={12}>*/}
// {/*  <Paper p="md" radius="md" shadow="sm">*/}
// {/*    <Title order={3} mb="xl">*/}
// {/*      Доступные сети*/}
// {/*    </Title>*/}

//    {/*    <Grid>*/}
//           {/*{networks.map((network, index) => (*/}
//           {/*  <Grid.Col key={network.id} span={4}>*/}
//           {/*    <Paper*/}
//           {/*      p="md"*/}
//           {/*      radius="md"*/}
//           {/*      shadow="sm"*/}
//           {/*      style={{*/}
//           {/*        border:*/}
//            {/*          network.id === walletStore.selectedNetworkId*/}
//           {/*            ? "2px solid blue"*/}
//           {/*            : "1px solid transparent",*/}
//           {/*      }}*/}
//           {/*    >*/}
//           {/*      <Group position="apart" mb="md">*/}
//           {/*        <Text weight={500}>{network.name}</Text>*/}
//           {/*        {network.id === walletStore.selectedNetworkId && (*/}
//           {/*          <Badge color="blue">Активна</Badge>*/}
//           {/*        )}*/}
//           {/*      </Group>*/}
//
//           {/*      <Text size="sm" color="dimmed" mb="md">*/}
//           {/*        Chain ID: {network.id}*/}
//           {/*      </Text>*/}
//
//           {/*      <Button*/}
//           {/*        fullWidth*/}
//           {/*        variant={*/}
//           {/*          network.id === walletStore.selectedNetworkId*/}
//           {/*            ? "light"*/}
//           {/*            : "filled"*/}
//           {/*        }*/}
//           {/*        onClick={() => walletStore.switchNetwork(index)}*/}
//           {/*        disabled={*/}
//           {/*          !walletStore.isConnected ||*/}
//           {/*          network.id === walletStore.selectedNetworkId*/}
//           {/*        }*/}
//           {/*      >*/}
//           {/*        {network.id === walletStore.selectedNetworkId*/}
//           {/*          ? "Текущая сеть"*/}
//           {/*          : "Переключить"}*/}
//           {/*      </Button>*/}
//           {/*    </Paper>*/}
//           {/*  </Grid.Col>*/}
//           {/*))}*/}
// {/*        </Grid>*/}
// {/*      </Paper>*/}
// {/*    </Grid.Col>*/}
// {/*  </Grid>*/}
// {/*</Container>*/}

});

export default Options;
