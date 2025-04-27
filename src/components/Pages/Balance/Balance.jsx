import {observer} from "mobx-react-lite";
import {Center} from "@mantine/core";
import {useEffect, useMemo} from "react";
import {animated} from "@react-spring/web";
import {motion} from "motion/react";
import {uiStore} from "@stores/ui.js";
import {walletStore} from "@stores/wallet.js";
import {useBalance} from "wagmi";
import GradientText from "@animations/involved/GradientText.jsx";
import VeryAdvancedWeb3Input from "@animations/involved/VeryAdvancedWeb3Input.jsx";


console.log(`[Balance.jsx] :`);

// Отдельный компонент для каждого chainId
function SingleBalance({chainId}) {
    const {data: balance, isLoading, error} = useBalance({
        address: walletStore.getAddressForBalance,
        chainId
    });

    const safeBalance = useMemo(() => {
        if (!balance?.formatted) return null;
        return [balance.formatted, balance.symbol];
    }, [balance?.formatted, balance?.symbol]);

    useEffect(() => {
        if (!safeBalance) return;
        const old = walletStore.getBalance?.(chainId);
        if (old?.[0] === safeBalance[0] && old?.[1] === safeBalance[1]) return;

        walletStore.addAddressBalance({chainId, balance: safeBalance});
    }, [safeBalance]);

    return null;
}

const Balance = observer(() => {
  return (
      <main className="pageWrapper">
          <animated.div className="pageCard" style={uiStore.themeStyle}>
              <VeryAdvancedWeb3Input/>
              {walletStore.getAddressForBalance && walletStore.getChains?.map(chainId => (
                  <SingleBalance key={chainId} chainId={chainId}/>
              ))}
              <motion.ul>
                  {
                      walletStore.getAddressForBalance && walletStore?.getAllBalances && Object.entries(walletStore?.getAllBalances).map(([key, [amount, symbol]]) =>
                          <li
                              key={key}>
                              {key}:
                              <GradientText style={{padding:3}}>{amount}</GradientText>
                              {symbol}
                          </li>
                      )}
              </motion.ul>
              {/*<WalletAddressInput/>*/}
              {/*<AdvancedWeb3Input/>*/}
          </animated.div>

    </main>
  );
});

export default Balance;
