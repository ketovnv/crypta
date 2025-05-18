import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { walletStore } from "@stores/wallet.js";
import { useBalance } from "wagmi";
import GradientText from "@animations/involved/GradientText.jsx";
import VeryAdvancedWeb3Input from "@animations/involved/VeryAdvancedWeb3Input.jsx";

// Отдельный компонент для каждого chainId
function SingleBalance({ chainId }) {
  const {
    data: balance,
    isLoading,
    error,
  } = useBalance({
    address: walletStore.getAddressForBalance,
    chainId,
  });

  const safeBalance = useMemo(() => {
    if (!balance?.formatted) return null;
    return [balance.formatted, balance.symbol];
  }, [balance?.formatted, balance?.symbol]);

  useEffect(() => {
    if (!safeBalance) return;
    const old = walletStore.getBalance?.(chainId);
    if (old?.[0] === safeBalance[0] && old?.[1] === safeBalance[1]) return;

    walletStore.addAddressBalance({ chainId, balance: safeBalance });
  }, [safeBalance]);

  return null;
}

const Balance = observer(() => {
  return (
    <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
      <div className="relative flex flex-1 flex-col justify-between gap-3">
        <VeryAdvancedWeb3Input />
        {walletStore.getAddressForBalance &&
          walletStore.getChains?.map((chainId) => (
            <SingleBalance key={chainId} chainId={chainId} />
          ))}
        <motion.div layout>
          {walletStore.getAddressForBalance &&
            walletStore?.getAllBalances &&
            Object.entries(walletStore?.getAllBalances).map(
              ([key, [amount, symbol]]) => (
                <motion.span
                  layout
                  layoutId="price"
                  animate={{ position: "relative", paddingLeft: 50 }}
                  initial={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    opacity: 1,
                  }}
                  key={key}
                >
                  {key}:
                  <GradientText style={{ padding: 3 }}>{amount}</GradientText>
                  {symbol}
                </motion.span>
              ),
            )}
        </motion.div>
        {/*<WalletAddressInput/>*/}
        {/*<AdvancedWeb3Input/>*/}
      </div>
    </div>
  );
});

export default Balance;
