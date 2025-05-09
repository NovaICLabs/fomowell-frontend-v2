import { useChainStore } from "@/store/chain";

import { BitcoinWalletProvider } from "./bitcoin/bitcoin-wallet-provider";
import { IcpWalletProvider } from "./icp";
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	const { chain } = useChainStore();

	if (chain === "bitcoin") {
		return <BitcoinWalletProvider>{children}</BitcoinWalletProvider>;
	}

	if (chain === "icp") {
		return <IcpWalletProvider>{children}</IcpWalletProvider>;
	}

	return <>{children}</>;
};
