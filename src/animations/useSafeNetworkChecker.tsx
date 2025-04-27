//
// import { useEffect } from 'react'
// import {  useAppKitNetwork, useAppKitAccount } from '@reown/appkit/react-core'
//
// export function useSafeNetworkChecker(expectedChainId: number = 11155111) {
//     const { chain } = useAppKitNetwork()
//     const { address, isConnected } = useAccount()
//
//     useEffect(() => {
//         const checkNetwork = async () => {
//             if (!window.ethereum) {
//                 console.error('%c[ERROR] No Ethereum provider found.', 'color: red;')
//                 return
//             }
//
//             console.log('%c[INFO] Wallet Address:', 'color: green;', address)
//             console.log('%c[INFO] Connected to Chain:', 'color: blue;', chain?.id)
//
//             if (!isConnected) {
//                 console.error('%c[ERROR] Wallet not connected.', 'color: red;')
//                 return
//             }
//
//             if (chain?.id !== expectedChainId) {
//                 console.warn('%c[WARN] Wrong chain! Trying to switch...', 'color: orange;')
//
//                 try {
//                     await window.ethereum.request({
//                         method: 'wallet_switchEthereumChain',
//                         params: [{ chainId: '0xaa36a7' }] // 11155111 в hex
//                     })
//                     console.log('%c[SUCCESS] Switched to Sepolia!', 'color: green;')
//                 } catch (error) {
//                     console.error('%c[ERROR] Failed to switch network:', 'color: red;', error)
//                 }
//             }
//         }
//
//         checkNetwork()
//     }, [chain, address, isConnected, expectedChainId])
// }
