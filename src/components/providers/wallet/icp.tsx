import { isMobile } from "react-device-detect";

import IcpConnectDialog from "@/components/layout/dialog/ic-connect";
import IcDepositWithdrawDialog from "@/components/layout/dialog/ic-deposit-withdraw";
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
			{!isMobile && <IcDepositWithdrawDialog />}
			<SlippageDialog />
			<IcpConnectDialog />
			{children}
		</>
	);
};
