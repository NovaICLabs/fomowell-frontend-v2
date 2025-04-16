import { useState } from "react";

import copy from "copy-to-clipboard";
import { Check } from "lucide-react";

import { CopyIcon } from "@/components/icons/common/copy";
import { DisconnectIcon } from "@/components/icons/common/disconnect";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useCKBTCBalance } from "@/hooks/ic/tokens/ckbtc";
import { useIcWallet } from "@/hooks/providers/wallet/ic";
import { getAvatar } from "@/lib/common/avatar";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useIcIdentityStore, useIcLastConnectedWalletStore } from "@/store/ic";

import WalletOption from "../wallet-option";

import type { Connector } from "@/lib/ic/connectors";

const IcpWalletConnect: React.FC = () => {
	const [open, setOpen] = useState(false);
	const { connect, disconnect, isLoading } = useIcWallet();
	const { principal, setPrincipal, setConnected, connected } =
		useIcIdentityStore();
	const { setLastConnectedWallet } = useIcLastConnectedWalletStore();
	const handleConnectWallet = async (connector: Connector) => {
		try {
			const { principal, connected } = await connect(connector);
			if (principal) {
				setPrincipal(principal);
				setConnected(connected);
				setLastConnectedWallet(connector);
			}
			setOpen(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDisconnect = () => {
		void disconnect();
	};

	const [copied, setCopied] = useState(false);
	const { data: balance } = useCKBTCBalance();
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				{principal ? (
					<div className="flex items-center justify-center gap-x-2">
						<div className="bg-gray-750 inline-flex h-[38px] items-center justify-start rounded-full px-2 text-xs leading-4 font-medium text-white hover:bg-gray-700">
							<img
								alt="avatar"
								className="h-6 w-6 rounded-full"
								src={getAvatar(principal)}
							/>
							<span className="ml-2">{truncatePrincipal(principal)}</span>
							{copied ? (
								<Check
									className="ml-1 opacity-40"
									size={16}
									strokeWidth={"2"}
								/>
							) : (
								<CopyIcon
									className="ml-1 h-4 w-4"
									onClick={() => {
										setCopied(true);
										copy(principal);
										setTimeout(() => {
											setCopied(false);
										}, 2000);
									}}
								/>
							)}
							<div className="ml-2.5 h-6 w-px bg-white/20"></div>
							<DisconnectIcon
								className="ml-2.25 h-4 w-4"
								onClick={() => {
									handleDisconnect();
								}}
							/>
						</div>
						<div className="bg-gray-750 inline-flex h-[38px] items-center justify-start gap-0.5 rounded-full px-2 text-xs leading-4 font-medium text-white hover:bg-gray-700">
							<img
								alt="flash"
								className="h-4.5 w-4.5 rounded-full"
								src={"/svgs/coins/bitcoin.svg"}
							/>
							<span className="text-xs font-medium">
								{connected ? (balance?.formatted ?? "---") : "---"}
							</span>
						</div>
					</div>
				) : (
					<DialogTrigger asChild>
						<Button
							className="h-[38px] w-[111px] rounded-full text-xs font-bold"
							disabled={isLoading}
							onClick={() => {
								setOpen(true);
							}}
						>
							{isLoading ? "Connecting..." : "Connect Wallet"}
						</Button>
					</DialogTrigger>
				)}

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
		</>
	);
};

export default IcpWalletConnect;
