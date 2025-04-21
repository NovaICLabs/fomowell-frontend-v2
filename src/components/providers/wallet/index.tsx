import DepositWithdrawDialog from "@/components/layout/dialog/deposit-withdraw";
import IcpConnectDialog from "@/components/layout/dialog/ic-connect";
import SlippageDialog from "@/components/layout/dialog/slippage";
import { useChainStore } from "@/store/chain";

import { BitcoinWalletProvider } from "./bitcoin/bitcoin-wallet-provider";
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	const { chain } = useChainStore();

	if (chain === "bitcoin") {
		return <BitcoinWalletProvider>{children}</BitcoinWalletProvider>;
	}

	if (chain === "icp") {
		return (
			<>
				{children}
				<DepositWithdrawDialog />
				<SlippageDialog />
				<IcpConnectDialog />
			</>
		);
	}

	return <>{children}</>;
};
