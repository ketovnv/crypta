import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import type { AppKitNetwork } from "@reown/appkit/networks";
import { mainnet, sepolia,holesky } from "@reown/appkit/networks";


export const projectId =
  //projectId from https://cloud.reown.com
  "81fbff8584aa79a5251128f0d3ee3544";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: 'AppKit React',
  description: 'AppKit React Wagmi',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
}

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [sepolia, mainnet, holesky] as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

//Set up the Wagmi Adapter (Config)
export const ethersAdapter = new EthersAdapter()
export const wagmiAdapter = new WagmiAdapter({projectId,
  networks,
});
