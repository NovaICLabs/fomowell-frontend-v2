import { useState } from "react";

import { useRouter } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";

import { getICPCanisterId } from "@/canisters/icrc3";
import { CopyIcon } from "@/components/icons/common/copy";
import { DisconnectIcon } from "@/components/icons/common/disconnect";
import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import LinkedWalletIcon from "@/components/icons/links-popover/linked-wallet";
import ProfileIcon from "@/components/icons/links-popover/profile";
import IcpLogo from "@/components/icons/logo/icp";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useCoreTokenBalance } from "@/hooks/ic/core";
import { useIcWallet } from "@/hooks/providers/wallet/ic";
import { getAvatar } from "@/lib/common/avatar";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
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

	const [openPopover, setOpenPopover] = useState(false);
	const { setDepositWithdrawOpen } = useDialogStore();
	const router = useRouter();
	const popoverLinks = [
		{
			label: "Profile",
			action: async () => {
				await router.navigate({ to: "/profile" });
			},
			icon: <ProfileIcon />,
		},
		{
			label: "Deposit",
			action: () => {
				setDepositWithdrawOpen({
					open: true,
					type: "deposit",
				});
			},
			icon: <DepositWithdrawIcon />,
		},
		{
			label: "Linked Wallet",
			action: async () => {
				await router.navigate({ to: "/linked-wallet" });
			},
			icon: <LinkedWalletIcon />,
		},
	];
	const { data: coreTokenBalance } = useCoreTokenBalance({
		owner: principal,
		token: { ICRCToken: getICPCanisterId() },
	});
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				{principal ? (
					<div className="flex items-center justify-center gap-x-2">
						<Popover open={openPopover} onOpenChange={setOpenPopover}>
							<PopoverTrigger asChild>
								<div
									className="bg-gray-750 inline-flex h-[38px] cursor-pointer items-center justify-start rounded-full px-2 text-xs leading-4 font-medium text-white hover:bg-gray-700"
									onMouseEnter={() => {
										setOpenPopover(true);
									}}
									onMouseLeave={() => {
										setOpenPopover(false);
									}}
								>
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
							</PopoverTrigger>
							<PopoverContent
								className="z-100 -mt-1 w-43 border-none border-gray-700 bg-transparent p-0 pt-1"
								onMouseEnter={() => {
									setOpenPopover(true);
								}}
								onMouseLeave={() => {
									setOpenPopover(false);
								}}
							>
								<div className="bg-gray-750 flex flex-col gap-y-2 rounded-2xl p-2.5 text-white">
									{popoverLinks.map((link) => (
										<div
											key={link.label}
											className="group flex h-10.5 cursor-pointer items-center rounded-[14px] px-2.5 hover:bg-gray-700"
											onClick={link.action}
										>
											<div className="flex h-4 items-center gap-x-2">
												{link.icon}
												<span className="text-sm leading-2 text-white/60 group-hover:text-white">
													{link.label}
												</span>
											</div>
										</div>
									))}
								</div>
							</PopoverContent>
						</Popover>

						<div
							className="bg-gray-750 inline-flex h-[38px] min-w-[80px] cursor-pointer items-center justify-start gap-0.5 gap-x-1 rounded-full px-3 text-xs leading-4 font-medium text-white hover:bg-gray-700"
							onClick={() => {
								setDepositWithdrawOpen({
									open: true,
									type: "deposit",
								});
							}}
						>
							<IcpLogo className="h-4 w-4" />
							<span className="text-center text-xs font-medium">
								{connected ? (coreTokenBalance?.formatted ?? "---") : "---"}
							</span>
						</div>
					</div>
				) : (
					<Button
						className="h-[38px] w-[111px] rounded-full text-xs font-bold"
						disabled={isLoading}
						onClick={() => {
							setOpen(true);
						}}
					>
						{isLoading ? "Connecting..." : "Connect Wallet"}
					</Button>
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
