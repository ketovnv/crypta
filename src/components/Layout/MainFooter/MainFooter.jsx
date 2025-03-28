import {
  Anchor,
  AppShell,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
// import classes from "./MainFooter.module.css";
import { motion } from "motion/react";
import { walletStore } from "@stores/wallet";
import React from "react";
import { logger } from "@stores/logger.js";

export const MainFooter = observer(() => {
  const gradient =
    "linear-gradient(45deg, var(--mantine-color-pink-filled) 0%, var(--mantine-color-orange-filled) 50%, var(--mantine-color-yellow-filled) 100%)";
  return (
    <AppShell.Footer
      // className={classes.footer}
      px="md"
      align="center"
    >
      <motion.div
        initial={{
          opacity: 0,
          // y: -20
        }}
        animate={{
          opacity: 1,
          // y: 0
        }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {walletStore.getNetwork() && (
          <Center>
            <Group>
              <Anchor
                href={
                  walletStore.getNetwork().caipNetwork?.rpcUrls?.default.http[0]
                }
                target="_blank"
              >
                RPC
              </Anchor>
              <Anchor
                href={
                  walletStore.getNetwork().caipNetwork?.rpcUrls?.chainDefault
                    .http[0]
                }
                target="_blank"
              >
                RPC сети
              </Anchor>
              <Anchor
                href={
                  walletStore.getNetwork()?.caipNetwork?.blockExplorers.default
                    .url
                }
                target="_blank"
              >
                {
                  walletStore.getNetwork()?.caipNetwork?.blockExplorers.default
                    .name
                }
              </Anchor>
              <Anchor
                href={
                  walletStore.getNetwork()?.caipNetwork?.blockExplorers.default
                    .apiUrl
                }
                target="_blank"
              >
                {
                  walletStore.getNetwork()?.caipNetwork?.blockExplorers.default
                    .name
                }{" "}
                API
              </Anchor>
            </Group>
            <SimpleGrid
              cols={4}
              spacing="xs"
              verticalSpacing="xs"
              style={{ position: "absolute", top: -50, right: 25 }}
            >
              {Object.keys(logger.bounds).map((key) => {
                return (
                  ((key !== "mouseX" && key !== "mouseY") ||
                    logger.bounds.isMouseHover) && (
                    <Flex key={key} fz={10}>
                      <Paper shadow="md" px="xs" c={logger.getRandomColor()}>
                        {key}
                      </Paper>

                      <Button
                        h={15}
                        w={42}
                        fz={10}
                        shadow="xl"
                        p={1}
                        styles={{
                          root: {
                            backgroundImage: gradient,
                          },
                          inner: {
                            background: "var(--mantine-color-body)",
                          },
                          label: {
                            backgroundImage: gradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          },
                        }}
                      >
                        {Math.round(logger.bounds[key])}
                        <Box style={{ display: "inline" }}>px</Box>
                      </Button>
                    </Flex>
                  )
                );
              })}
            </SimpleGrid>
          </Center>
        )}
      </motion.div>
    </AppShell.Footer>
  );
});
