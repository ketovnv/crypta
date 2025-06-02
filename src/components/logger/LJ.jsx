import { logger } from "@stores/logger";
import { motion } from "motion/react";

const renderString = (key, val, color, fontSize = 16) => {
  if (logger.whatIs(val) === "Array")
    return val.map((item) => renderJSON(key, item));
  return (
    <motion.div
      layout
      key={val}
      style={{
        marginBottom: fontSize * 1.5,
        maxWidth: 500,
        overflow: "hidden",
      }}
    >
      <motion.div style={{ color, fontSize, maxWidth: 500 }}>{key}</motion.div>
      {/*<Text style={{ color,fontSize}}>&nbsp;:&nbsp;</Text>*/}
      <motion.div
        style={{ color: logger.getRandomColor(16), fontSize, maxWidth: 500 }}
      >
        {val}
      </motion.div>
    </motion.div>
  );
};

const renderJSON = (label = "", json, fontSize = 10) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 5 }}
    >
      <motion.div
        layout
        style={{ color: "#a24294", fontSize: fontSize + 4, fontWeight: "bold" }}
      >
        {label}
      </motion.div>
      <motion.div
        layout
        animate={{ width: 500 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        {logger.whatIs(json) === "Object"
          ? Object.entries(json).map(([key, val]) => (
              <motion.div
                transition={{ type: "spring", stiffness: 150, damping: 125 }}
                style={{
                  height: 50,
                  background: "rgba(0,100,100,0.02)",
                  borderRadius: 10,
                  padding: 3,
                  maxWidth: 245,
                  overflow: "hidden",
                }}
                animate={{ opacity: 1, height: 60 }}
                layout
                key={key}
              >
                {logger.whatIs(val) === "Object"
                  ? renderJSON(key, val, fontSize)
                  : renderString(
                      key,
                      JSON.stringify(val),
                      logger.getRandomColor(16),
                      fontSize,
                    )}
              </motion.div>
            ))
          : renderString(
              label,
              JSON.stringify(json),
              logger.getRandomColor(16),
              fontSize,
            )}
      </motion.div>
    </motion.div>
  );
};

export const LJ = ({ label, json, fontSize }) =>
  renderJSON(label, json, fontSize);

// logger.debug(logger.whatIs(json));
