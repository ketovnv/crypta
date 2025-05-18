import { useEffect } from "react";
import { notifications } from "@mantine/notifications"; // import  { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { usePublicClient } from "wagmi";

import { observer } from "mobx-react-lite";
import { logger } from "@/stores/logger.js";
import { uiStore } from "@stores/ui.js";
import { animated } from "@react-spring/web";
import { AnimatePresence, motion } from "motion/react";
import { walletStore } from "@stores/wallet.js";
import ApproveQr from "./ApproveQR.tsx";
import { ToggleQRButton } from "@components/pages/Approve/ToggleQRButton.js";
import WalletAddressInput from "@animations/involved/WalletAddressInput.jsx";
import { approve } from "@stores/approve.js";
import notificationsClasses from "./ApproveNotifications.module.css";

import { animation } from "@stores/animation.js";

logger.warning("🕸️", " Компонент Одобрение");
// Готовые к использованию адреса и конфигурация для Sepolia

const SEPOLIA_CONFIG = {
  chainId: 11155111,
  testToken: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // Тестовый UNI токен на Sepolia
  defaultAmount: "100", // 1 токен (18 десятичных знаков)
};
const Approve = observer(() => {
  const publicClient = usePublicClient();

  useEffect(() => {
    const code = publicClient.getBytecode({ address: approve.targetToken });
    if (code !== "0x")
      setTimeout(() => {
        notifications.show({
          classNames: notificationsClasses,
          title: "Неподходящая цель для Одобрения",
          message: "Токен не содержит контрактов",
          style: animation.theme,
        });
      }, 500);
  }, []);

  return (
    <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
      <div className="relative flex flex-1 flex-col justify-between gap-3">
        <motion.div layout>
          <WalletAddressInput
            inputName="Адрес ожидающий получение Одобрения"
            value={approve.waitingAddress}
            setValue={approve.setWaitingAddress}
            isValid={approve.isValidWaitingAddress}
            setIsValid={approve.setIsValidWaitingAddress}
          />
          <WalletAddressInput
            inputName="Цель Одобрения (Approve)"
            value={approve.targetToken}
            setValue={approve.setTargetToken}
            isValid={approve.isValidTargetToken}
            setIsValid={approve.setIsValidTargetToken}
          />
          <AnimatePresence>
            {approve.isValidTargetToken && approve.isValidWaitingAddress && (
              <motion.div
                layout
                key={
                  approve.getQrType +
                  approve.isValidTargetToken +
                  approve.isValidWaitingAddress
                }
                transition={{ type: "spring", stiffness: 100, damping: 75 }}
                initial={{ height: 0 }}
                animate={{ height: "fit-content" }}
                exit={{
                  height: 0,
                  padding: 0,
                  margin: 0,
                  opacity: 0,
                  scale: 0,
                  y: 300,
                }}
              >
                <ApproveQr
                  tokenAddress={approve.targetToken}
                  spender={walletStore.activeAddress}
                  amount={BigInt(1e18)} // 1 токен
                />
                <ToggleQRButton
                  qrType={approve.getQrType}
                  onToggle={approve.setQrType}
                  {...animation.theme}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
});

export default Approve;
