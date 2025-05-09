import { isMobile } from "react-device-detect";

import DepositWithdrawDialog from "@/components/layout/dialog/deposit-withdraw";
import IcpConnectDialog from "@/components/layout/dialog/ic-connect";
import SlippageDialog from "@/components/layout/dialog/slippage";
import { useInitialConnect } from "@/hooks/providers/wallet/ic";
export const IcpWalletProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	useInitialConnect();
	return (
		<>
			{!isMobile && <DepositWithdrawDialog />}
			<SlippageDialog />
			<IcpConnectDialog />
			{children}
		</>
	);
};
