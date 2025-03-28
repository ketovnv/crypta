import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {motion} from 'motion/react' ;
import { IoAlertCircleSharp } from "react-icons/io5";
import { walletStore } from "../../../stores/wallet";
import { logger } from "../../../stores/logger";

logger.warning("🎖️ ", "Компонент Токен");
const ApproveOperations = observer(() => {
  const [spenderAddress, setSpenderAddress] = useState("");
  const [approveAmount, setApproveAmount] = useState("");

  const handleApprove = async () => {
    if (!spenderAddress || !approveAmount) {
      return;
    }
  };

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
    motion.div style = {{ width: 100 %}>


</motion.div>

});

export default ApproveOperations;
