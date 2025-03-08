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

const renderString = (key, val, color,fontSize =16) => {
  if (logger.whatIs(val) === "Array") return val.map((item) => renderJSON(key, item))
  return (
    <Group key={val}>
      <Text style={{ color,fontSize}}>{key}</Text>
      <Text style={{ color,fontSize}}>&nbsp;:&nbsp;</Text>
      <Text style={{ color,fontSize}}>{val}</Text>
    </Group>
  );
};

const renderJSON = (label, json,fontSize =16) => {

  return (
    <div className="log-list">
      <Text style={{ color: "#a24294",fontSize: fontSize+4,fontWeight: "bold"}}>{label}</Text>
      {logger.whatIs(json) === "Object"
        ? Object.entries(json).map(([key, val]) => (
            <div key={key}>
              {logger.whatIs(val) === "Object"
                ?  renderJSON(key, val,fontSize)
                : renderString(
                    key,
                    JSON.stringify(val),
                    logger.getRandomColor(16),
                    fontSize
                  )}
            </div>
          ))
        : renderString(label, JSON.stringify(json), logger.getRandomColor(16),fontSize)}
    </div>
  );
};

export const LogJSON = ({ label, json,fontSize }) => renderJSON(label, json,fontSize);

// logger.debug(logger.whatIs(json));