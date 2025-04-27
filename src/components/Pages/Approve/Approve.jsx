import {useEffect} from 'react'
// import  { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import {usePublicClient,} from 'wagmi'
import {Stack} from '@mantine/core'

import {observer} from "mobx-react-lite";
import {logger} from "@/stores/logger.js";
import AppearingText from "@animations/Examples/AppearingText/AppearingText.js";
import {uiStore} from "@stores/ui.js";
import {animated} from "@react-spring/web";
import {walletStore} from "@stores/wallet.js";
import GradientText from "@animations/involved/GradientText.jsx";
import ApproveQr from "./ApproveQR.tsx";
import {ToggleQRButton} from "@components/pages/Approve/ToggleQRButton.js";
import WalletAddressInput from "@animations/involved/WalletAddressInput.jsx";
import {approve} from "@stores/approve.js";

logger.warning("🕸️", " Компонент Одобрение");
// Готовые к использованию адреса и конфигурация для Sepolia

const SEPOLIA_CONFIG = {
    chainId: 11155111,
    testToken: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // Тестовый UNI токен на Sepolia
    defaultAmount: '100' // 1 токен (18 десятичных знаков)
}
const Approve = observer(() => {
//     const [txStatus, setTxStatus] = useState(null)
//     const [amount, setAmount] = useState(SEPOLIA_CONFIG.defaultAmount)
//
//     // Используем адрес тестового токена из конфигурации
    const tokenAddress = '0x993a0f3653887078215914BAdCF039263293adD9'
//     // const a = '0xdA5aBff0bCAc5fdb29593030c9dEca4DAA6bfBB4'

//
//
//
// logger.logJSON('simulate',data)

    const publicClient = usePublicClient()


    useEffect(() => {

        const code = publicClient.getBytecode({address: tokenAddress})
        console.log('Is contract?', code !== '0x') // true — норм
    }, []);


    return (
        <main
            className="pageWrapper"
        >

            <animated.section layout className="pageCard" style={{...uiStore.themeStyle, maxWidth: 700}}>
                <Stack>
                    <GradientText>
                        <AppearingText text="Аддрес ожидающий получение Одобрения"/>
                    </GradientText>
                    <WalletAddressInput
                        value={approve.waitingAddress}
                        setValue={approve.setWaitingAddress}
                        isValid={approve.isValidWaitingAddress}
                        setIsValid={approve.setIsValidWaitingAddress}
                    />
                    <GradientText>
                        <AppearingText text="Цель Одобрения (Approve)"/>
                    </GradientText>
                    <WalletAddressInput
                        value={approve.targetToken}
                        setValue={approve.setTargetToken}
                        isValid={approve.isValidTargetToken}
                        setIsValid={approve.setIsValidTargetToken}
                    />

                    <GradientText><AppearingText text={approve.waitingAddress}/></GradientText>
                    <div/>
                    <GradientText><AppearingText text={approve.qrType}/></GradientText>
                    <div/>
                    <ToggleQRButton
                        qrType={approve.getQrType}
                        onToggle={approve.setQrType}
                    />
                    <ApproveQr
                        tokenAddress={tokenAddress}
                        spender={walletStore.activeAddress}
                        amount={BigInt(1e18)} // 1 токен
                    />
                </Stack>
                {/*<LJ json={watch} fontSize={8}/>*/}

            </animated.section>
        </main>
    );
});



export default Approve;
