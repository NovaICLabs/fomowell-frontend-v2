import { useChainStore } from "@/store/chain";

import { BitcoinWalletProvider } from "./bitcoin/bitcoin-wallet-provider";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	const { chain } = useChainStore();

	if (chain === "bitcoin") {
		return <BitcoinWalletProvider>{children}</BitcoinWalletProvider>;
	}

	return <>{children}</>;
};
