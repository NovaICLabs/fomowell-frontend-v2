import { LaserEyesProvider, MAINNET } from "@omnisat/lasereyes";
import { SiwbIdentityProvider } from "ic-siwb-lasereyes-connector";

import { getSIWBCanisterId } from "@/canisters/siwb";
import { idlFactory as siwbIdlFactory } from "@/canisters/siwb/index.did";

export const BitcoinWalletProvider = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	return (
		<LaserEyesProvider config={{ network: MAINNET }}>
			<SiwbIdentityProvider
				canisterId={getSIWBCanisterId()}
				idlFactory={siwbIdlFactory}
				httpAgentOptions={{
					host: import.meta.env.VITE_IC_HOST,
				}}
			>
				{children}
			</SiwbIdentityProvider>
		</LaserEyesProvider>
	);
};
