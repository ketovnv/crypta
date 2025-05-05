// App.tsx
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import { tokenStore } from "./store/TokenStore"
import QRCode from "qrcode.react"

export const App = observer(() => {
    const [token, setToken] = useState("")
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [qr, setQr] = useState("")

    useEffect(() => {
        if (token) tokenStore.init(token)
    }, [token])

    return (
        <div className="p-4 max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-bold">TRC20 Wallet</h1>

            <input
                className="w-full p-2 border rounded"
                placeholder="Token address"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />

            <div className="text-sm text-gray-500">
                {tokenStore.name} ({tokenStore.symbol})
            </div>

            <input
                className="w-full p-2 border rounded"
                placeholder="Spender / To address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <input
                className="w-full p-2 border rounded"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <div className="flex flex-col gap-2">
                <button
                    className="bg-blue-600 text-white p-2 rounded"
                    onClick={async () => {
                        const result = await tokenStore.generateApproveQR(address, amount)
                        setQr(result)
                    }}
                >
                    Generate Approve QR
                </button>

                <button
                    className="bg-green-600 text-white p-2 rounded"
                    onClick={async () => {
                        await tokenStore.transfer(address, amount)
                        alert("Transfer done")
                    }}
                >
                    Transfer
                </button>

                <button
                    className="bg-purple-600 text-white p-2 rounded"
                    onClick={async () => {
                        await tokenStore.getBalance(address)
                        alert(`Balance: ${tokenStore.balance}`)
                    }}
                >
                    Get Balance
                </button>
            </div>

            {qr && (
                <div className="mt-4">
                    <QRCode value={qr} size={256} />
                </div>
            )}
        </div>
    )
})
