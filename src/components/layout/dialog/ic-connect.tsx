import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useIcWallet } from "@/hooks/providers/wallet/ic";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore, useIcLastConnectedWalletStore } from "@/store/ic";

import WalletOption from "../header/wallet-option";

import type { Connector } from "@/lib/ic/connectors";

export default function IcpConnectDialog() {
	const { connect, isLoading } = useIcWallet();
	const { setPrincipal, setConnected } = useIcIdentityStore();
	const { setLastConnectedWallet } = useIcLastConnectedWalletStore();
	const { icpConnectOpen, setIcpConnectOpen } = useDialogStore();
	const handleConnectWallet = async (connector: Connector) => {
		try {
			const { principal, connected } = await connect(connector);
			if (principal) {
				setPrincipal(principal);
				setConnected(connected);
				setLastConnectedWallet(connector);
			}
			setIcpConnectOpen(false);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<Dialog open={icpConnectOpen} onOpenChange={setIcpConnectOpen}>
			<DialogContent
				className={cn(
					"border-gray-755 bg-gray-755 transition-height flex w-[360px] flex-col rounded-3xl px-5 py-6 text-white duration-300",
					isLoading && "h-100"
				)}
			>
				<DialogHeader>
					<DialogTitle className="text-center text-lg font-semibold text-white">
						Connect Wallet
					</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex h-full flex-1 flex-col items-center justify-start">
						<img alt="fomowell" className="mt-10" src="/svgs/fomowell.svg" />
						<img
							alt="loading"
							className="ab my-auto h-11 w-11 animate-spin"
							src="/svgs/loading.svg"
						/>
					</div>
				) : (
					<div className="flex flex-col gap-6 py-2">
						<WalletOption
							disabled={isLoading}
							icon={<img alt="II" src="/svgs/wallet/ii.svg" />}
							name="Internet Identity"
							onClick={() => {
								void handleConnectWallet("II");
							}}
						/>
						<WalletOption
							disabled={isLoading}
							icon={<img alt="Plug" src="/svgs/wallet/plug.svg" />}
							name="Plug"
							onClick={() => {
								void handleConnectWallet("PLUG");
							}}
						/>
						<WalletOption
							disabled={isLoading}
							icon={<img alt="Oisy" src="/svgs/wallet/oisy.svg" />}
							name="Oisy"
							onClick={() => {
								void handleConnectWallet("OISY");
							}}
						/>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
