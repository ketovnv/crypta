import {AnimatePresence, motion} from 'framer-motion'
import {QRCodeSVG} from 'qrcode.react'
import {encodeFunctionData} from 'viem'
import {useMemo} from 'react'
import {approve} from "../../../stores/approve.ts";
import {Center} from "@mantine/core";
import {observer} from "mobx-react-lite";



interface ApproveQrProps {
    tokenAddress: `0x${string}`
    spender: `0x${string}`
    amount: bigint
}

const ApproveQr = observer(({
                                tokenAddress,
                                spender,
                                amount,
                            }: ApproveQrProps) => {
    const qrValue = useMemo(() => {
        if (!tokenAddress || !spender || !amount) return ''

        const calldata = encodeFunctionData({
            abi: approve.getApproveErc20Abi,
            functionName: 'approve',
            args: [spender, amount]
        })

        if (approve.getQrType === 'walletconnect') {
            return JSON.stringify({
                method: 'eth_sendTransaction',
                params: [
                    {
                        to: tokenAddress,
                        data: calldata,
                        value: '0x0'
                    }
                ]
            })
        } else {
            return `ethereum:${tokenAddress}@11155111/approve?address=${spender}&uint256=${amount.toString()}`
        }
    }, [tokenAddress, spender, amount, approve.getQrType])

    return (
        <Center w={342} h={342} style={{margin: 'auto', marginTop: 10, marginBottom: 10, position: 'relative'}}>
            <AnimatePresence>
                <motion.div
                    layout
                    style={{
                        position: 'absolute',
                        transformOrigin: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow :'hidden'
                    }}
                    key={approve.getQrType}
                    initial={{width: 0, height: 0, background: 'oklch(0 0 0)',filter: 'blur(3px)',borderRadius: 200}}
                    animate={{
                        borderRadius:10,
                        width: 336, height: 336, background: 'oklch(1 0 0)',filter: 'blur(0px)',rotate:720
                    }}
                    exit={{width: 0, height: 0, background: 'oklch(0.1 0 0)',filter: 'blur(3px)',borderRadius: 200,rotate:-720}}
                    transition={{type: 'spring',  stiffness: 50, friction: 15, mass: 7, damping: 35}}
                    className="drop-shadow-lg"
                >
                    <QRCodeSVG
                        value={qrValue}
                        size={336}
                        bgColor="transparent"
                        fgColor="#0f172a"
                        level="Q"
                        className="rounded-xl"
                    />
                </motion.div>
            </AnimatePresence>
        </Center>
    )
})

export default ApproveQr
