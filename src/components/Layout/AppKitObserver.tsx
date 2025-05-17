// import { test, expect } from 'bun:test'
import '@mantine/notifications/styles.css'
import {observer} from 'mobx-react-lite'
import {
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useWalletInfo
} from '@reown/appkit/react'
import {useEffect, useMemo} from 'react'
import {eventsStore} from '../../stores/events'
import {animation} from '../../stores/animation'
import {walletStore} from '../../stores/wallet.ts'
import {approve} from '../../stores/approve.ts'
import {Notifications, notifications} from '@mantine/notifications'
import {logger} from 'stores/logger.js' // @ts-ignore
import classes from './AppKitObserver.module.css'
import {uiStore} from '../../stores/ui'
import {runInAction} from 'mobx'

export const AppKitObserver = observer(() => {
  // useEffect(() => {
  // logger.debug('🎃init🎃', 'AppKitObserver📺📺', 10)
  // }, [])

  const account = useAppKitAccount()
  // const wagmiAccount = useAccount()
  const state = useAppKitState()
  const network = useAppKitNetwork()
  const event = useAppKitEvents()
  const {
    // themeMode,
    // themeVariables,
    setThemeMode,
    setThemeVariables
  } =
      useAppKitTheme()
  const {walletInfo} = useWalletInfo()

  const stableAccount = useMemo(() => JSON.stringify(account), [account])
  const stableNetwork = useMemo(() => JSON.stringify(network), [network])
  const stableWalletInfo = useMemo(() => JSON.stringify(walletInfo), [walletInfo])


  // expect(account.isConnected===true)

  useEffect(() => {
    if (account.isConnected) {
      const current = JSON.stringify(walletStore.accountData)
      if (current !== stableAccount) {
        walletStore.setAccountData(account)
        // @ts-ignore
        approve.setWaitingAddress(account?.address)

      }
    }
  }, [stableAccount])

  useEffect(() => {
    uiStore.setAppkitMethods(
        {
          setThemeMode,
          setThemeVariables
        })
  }, [])

  useEffect(() => {
    const {title, message} = eventsStore.addEvent(event)
    logger.success(title,message)
    if (Object.keys(event.reportedErrors).length > 0) {
      logger.logJSON('☠️reportedErrors☠️', {...event.reportedErrors})
      for (const key in event.reportedErrors) {
        logger.error(event.reportedErrors[key]);
      }
    }

    if (!title && !message) return

    setTimeout(() => {
      notifications.show({
        classNames: classes,
        title,
        message: JSON.stringify(message),
        style: animation.theme
      })
    }, 500)
  }, [event])

  useEffect(() => {

    eventsStore.setCurrentState(state)
  }, [state])

  useEffect(() => {
    runInAction(() => {
      // walletStore.setWagmiAccountData(wagmiAccount)
      walletStore.setWalletInformation(walletInfo)
    })
  }, [
    // wagmiAccount,
    stableWalletInfo])

  useEffect(() => {
    const current = JSON.stringify(walletStore.network)

    if (current !== stableNetwork) {
      // logger.logRandomColors('caipNetworkId',JSON.stringify(network?.caipNetworkId))
      // logger.logJSON('caipNetwork',network?.caipNetwork)
      // logger.logJSON('blockExplorers',network?.caipNetwork?.blockExplorers)
      // logger.logJSON('contracts',network?.caipNetwork?.contracts)
      // logger.logJSON('network', network)
      walletStore.setNetwork(network)
      //@ts-ignore
      approve.setChainId(network?.id)
    }
  }, [stableNetwork])

  return <Notifications position='bottom-right'/>
})
