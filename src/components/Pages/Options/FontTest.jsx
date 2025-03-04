import { loggerStore as logger } from "@stores/logger.js";
import {
  Group,
  Text,
  Box,
  SimpleGrid,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { fontFamilies } from "@styles/fontFamilies.js";
import classes from "@styles/fonts.module.css";

export const FontTest = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const brightness = isDark ? 16 : 8;
  const colorDigits = logger.getRandomColor(brightness);
  const colorEng = logger.getRandomColor(brightness);
  const colorRus = logger.getRandomColor(brightness);
  return (
    <SimpleGrid
      spacing="xl"
      verticalSpacing="lg"
      cols={2}
      justify="space-between"
    >
      {fontFamilies.map((font, index) => {
        return (
          <Stack key={font + index} className={classes.container} gap="xs">
            <Group>
              <Text className={`${classes[`font${index}`]}`}>{font}</Text>
              <Text>&nbsp;:&nbsp;</Text>
              <Text c={colorDigits} className={`${classes[`font${index}`]}`}>
                {logger.digits}
              </Text>
            </Group>
            {new Array(10).fill(0).map((_, key) => {
              const fontWeight = key * 100 + 100;

              return (
                <Stack key={key} gap="xs">
                  <Group align="center" justify="space-between">
                    <Stack align="center"  gap={0}>
                      <Text
                        c={colorRus}
                        fw={fontWeight}
                        className={`${classes[`font${index}`]}`}
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
                    <Text>{fontWeight}</Text>
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
                  </Group>
                </Stack>
              );
            })}
          </Stack>
        );
      })}
    </SimpleGrid>
  );
};
