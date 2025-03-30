import React from "react";
import { observer } from "mobx-react-lite";
import { Alert, Text } from "@mantine/core";
import { motion } from "motion/react";
import { IoAlertCircleSharp } from "react-icons/io5";
import { walletStore } from "../../../stores/wallet";
import { logger } from "../../../stores/logger";

logger.warning("🎖️ ", "Компонент QRCode");
const QRCode = observer(() => {
  if (!walletStore.getAccountData()) {
    return (
      <Alert
        icon={<IoAlertCircleSharp size={16} />}
        title="Not connected"
        color="orange"
      >
        Please connect your wallet first
      </Alert>
    );
  }

  return (
    <motion.div animate={{ x: 0 }}>
      <Text>QR</Text>
    </motion.div>
  );
});

export default QRCode;
