import { loggerStore as logger } from "@stores/logger";
import {
  Group,
  Text,
  Box,
  SimpleGrid,
  Stack,
  useMantineColorScheme,
  Title,
} from "@mantine/core";

const renderString = (key, val, color) => {
  if (logger.whatIs(val) === "Array") return val.map((item) => renderJSON(key, item))
  return (
    <Group>
      <Title c={"white"}>{key}</Title>
      <Title c={"yellow"}>&nbsp;:&nbsp;</Title>
      <Title c={color}>{val}</Title>
    </Group>
  );
};

const renderJSON = (label, json) => {
  logger.logJSON('json',json)

  return (
    <div className="log-list">
      <h1 style={{ color: "red" }}>{label}</h1>
      {logger.whatIs(json) === "Object"
        ? Object.entries(json).map(([key, val]) => (
            <div key={key}>
              {logger.whatIs(val) === "Object"
                ?  renderJSON(key, val)
                : renderString(
                    key,
                    JSON.stringify(val),
                    logger.getRandomColor(16),
                  )}
            </div>
          ))
        : renderString(label, JSON.stringify(json), logger.getRandomColor(16))}
    </div>
  );
};

export const LogJSON = ({ label, json }) => renderJSON(label, json);

// logger.debug(logger.whatIs(json));