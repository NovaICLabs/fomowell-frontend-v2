import { LaserEyesProvider } from "@omnisat/lasereyes";
import {
	MAINNET,
	TESTNET,
	// createConfig,
	TESTNET4,
} from "@omnisat/lasereyes-core";
import { SiwbIdentityProvider } from "ic-siwb-lasereyes-connector";
import { isMobile } from "react-device-detect";

import { getSIWBCanisterId } from "@/canisters/siwb";
import { idlFactory as siwbIdlFactory } from "@/canisters/siwb/index.did";
// import BtcConnectDialog from "@/components/layout/dialog/bitcoin-connect";
import DepositWithdrawDialog from "@/components/layout/dialog/deposit-withdraw";
import SlippageDialog from "@/components/layout/dialog/slippage";

export const BitcoinWalletProvider = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	console.log("MAINNET", MAINNET, TESTNET);

	// Testnet configuration
	// const testnetConfig = createConfig({
	// 	network: TESTNET4,
	// 	dataSources: {
	// 		mempool: {
	// 			url: "https://mempool.space/zh/testnet4/faucet",
	// 			// priority: 1,
	// 		},
	// 	},
	// });

	return (
		<LaserEyesProvider
			config={{
				network: TESTNET4,
			}}
		>
			<SiwbIdentityProvider
				canisterId={getSIWBCanisterId()}
				idlFactory={siwbIdlFactory}
				httpAgentOptions={{
					host: import.meta.env.VITE_IC_HOST,
				}}
			>
				{!isMobile && <DepositWithdrawDialog />}
				<SlippageDialog />
				{/* <BtcConnectDialog /> */}
				{children}
			</SiwbIdentityProvider>
		</LaserEyesProvider>
	);
};
