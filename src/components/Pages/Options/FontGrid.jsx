import { loggerStore as logger } from "@stores/logger.js";
import { uiStore as ui } from "@stores/ui.js";
import {
  Text,
  SimpleGrid,
  useMantineColorScheme,
  Stack,
    Group,
} from "@mantine/core";
import { BlackCoilTexture } from "@animations/Textures/BlackCoilTexture.js";
import {observer} from "mobx-react-lite";
import classes from "@styles/fonts.module.css";

// logger.warning("FontGridInit");

export const FontGrid = observer(() => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const brightness = isDark ? 16 : 8;
  const colorDigits = logger.getRandomColor(brightness);
  const colorEng = logger.getRandomColor(brightness);
  const colorRus = logger.getRandomColor(brightness);
  const fontWeights = [500, 800];



  return (
      <SimpleGrid
          className="sampleGrid"
        spacing="xl"
        verticalSpacing="lg"
        cols={2}
        justify="space-between"
      >
        {ui.searchFontFamilies.map((font, index) => {
          return (
            <BlackCoilTexture  key={font + index} background="#010102">
              <Stack>
                <Group>
                  <Text className={`${classes[`font${index}`]}`}>{font}</Text>
                  <Text>&nbsp;:&nbsp;</Text>
                  <Text
                    c={colorDigits}
                    className={`${classes[`font${index}`]}`}
                  >
                    {logger.digits}
                  </Text>
                </Group>
                {fontWeights.map((fontWeight, key) => {
                  //[500,800]=> {
                  // const fontWeight = key * 100 + 100;

                  return (
                    <Stack key={fontWeight} gap="xs">
                      <Stack align="center" gap={0}>
                        <Text
                          c={colorRus}
                          fw={fontWeight}
                          className={`${classes[`font${index}`]} rusFont`}
                        >
                          {logger.rusLetters.toUpperCase()}
                        </Text>
                        <Text
                          c={colorRus}
                          fw={fontWeight}
                          className={`${classes[`font${index}`]}`}
                        >
                          {logger.rusLetters}
                        </Text>
                      </Stack>
                      {/*<Text c={colorEng} fw={fontWeight} className={`${classes[`font${index}`]}`}>*/}
                      {/*  {logger.engLetters.toUpperCase()}*/}
                      {/*</Text>*/}
                      {/*<Text c={colorEng} fw={fontWeight} className={`${classes[`font${index}`]}`}>*/}
                      {/*  {logger.engLetters}*/}
                      {/*</Text>*/}
                      {/*<Text*/}
                      {/*    c={colorRus}*/}
                      {/*    fw={fontWeight}*/}
                      {/*    className={`${classes[`font${index}`]}`}*/}
                      {/*>*/}
                      {/*  {logger.rusLetters.toUpperCase()}*/}
                      {/*</Text>*/}
                      {/*<Text*/}
                      {/*    c={colorRus}*/}
                      {/*    fw={fontWeight}*/}
                      {/*    className={`${classes[`font${index}`]}`}*/}
                      {/*>*/}
                      {/*  {logger.rusLetters}*/}
                      {/*</Text>*/}
                      {/*<Text*/}
                      {/*    c={colorEng}*/}
                      {/*    fw={fontWeight}*/}
                      {/*    className={`${classes[`font${index}`]}`}*/}
                      {/*>*/}
                      {/*  {logger.engLetters.toUpperCase()}*/}
                      {/*</Text>*/}
                      {/*<Text*/}
                      {/*    c={colorEng}*/}
                      {/*    fw={fontWeight}*/}
                      {/*    className={`${classes[`font${index}`]}`}*/}
                      {/*>*/}
                      {/*  {logger.engLetters}*/}
                      {/*</Text>*/}
                    </Stack>
                  );
                })}
              </Stack>
            </BlackCoilTexture>
          );
        })}
      </SimpleGrid>

  );
});
