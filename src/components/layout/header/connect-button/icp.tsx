import { useCallback, useEffect, useState } from "react";

import { useRouter } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";
import { isMobile } from "react-device-detect";

import { getICPCanisterId } from "@/canisters/icrc3";
import { CopyIcon } from "@/components/icons/common/copy";
import { DisconnectIcon } from "@/components/icons/common/disconnect";
import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import WalletIcon from "@/components/icons/links-popover/linked-wallet";
import ProfileIcon from "@/components/icons/links-popover/profile";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoreTokenBalance } from "@/hooks/ic/core";
import { useIcWallet } from "@/hooks/providers/wallet/ic";
import { getAvatar } from "@/lib/common/avatar";
import { withStopPropagation } from "@/lib/common/react-event";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore, useIcLastConnectedWalletStore } from "@/store/ic";
import { useMobileSheetStore } from "@/store/mobile/sheet";
export const IcpAccountInfo = () => {
	const { disconnect } = useIcWallet();
	const { principal, identityProfile, connected } = useIcIdentityStore();
	const router = useRouter();
	// mobile
	const { setMenuOpen } = useMobileSheetStore();

	const handleDisconnect = useCallback(async () => {
		void disconnect();
		if (isMobile) {
			setMenuOpen(false);
		} else {
			await router.navigate({
				to: "/",
				replace: true,
			});
		}
	}, [disconnect, router, setMenuOpen]);

	const { lastConnectedWallet } = useIcLastConnectedWalletStore();

	// plug Change account and lock disconnect
	useEffect(() => {
		if (!lastConnectedWallet || !connected) return;

		if (window.ic && window.ic.plug) {
			if (window.ic.plug.onExternalDisconnect) {
				window.ic.plug.onExternalDisconnect(() => {
					if (lastConnectedWallet && lastConnectedWallet === "PLUG") {
						// Do not use useUserLogout, logout will exec window.ic.plug.onExternalDisconnect, and case a Loop execution
						void handleDisconnect();
					}
				});
			}

			if (window.ic.plug.onLockStateChange)
				window.ic.plug.onLockStateChange((isLocked) => {
					if (lastConnectedWallet && lastConnectedWallet === "PLUG") {
						if (isLocked) {
							void handleDisconnect();
						}
					}
				});

			// Handle auto-lock after idle timeout
			if (window.ic.plug.onIdleDisconnect) {
				window.ic.plug.onIdleDisconnect(() => {
					if (lastConnectedWallet && lastConnectedWallet === "PLUG") {
						void handleDisconnect();
					}
				});
			}
		}
		// setIdentityProfile
	}, [lastConnectedWallet, disconnect, connected, handleDisconnect]);

	const [copied, setCopied] = useState(false);

	const [openPopover, setOpenPopover] = useState(false);
	const { setDepositWithdrawOpen } = useDialogStore();
	const popoverLinks = [
		{
			label: "Profile",
			action: withStopPropagation(() => {
				void router.navigate({ to: `/icp/profile/${principal}` });
			}),
			icon: <ProfileIcon />,
		},
		{
			label: "Deposit",
			action: withStopPropagation(() => {
				setDepositWithdrawOpen({
					open: true,
					type: "deposit",
				});
			}),
			icon: <DepositWithdrawIcon />,
		},
		{
			label: "Linked Wallet",
			action: withStopPropagation(() => {
				void router.navigate({ to: `/icp/wallet/${principal}` });
			}),
			icon: <WalletIcon />,
		},
	];

	if (!principal) return null;
	return (
		<Popover open={openPopover} onOpenChange={setOpenPopover}>
			<PopoverTrigger
				asChild
				onClick={() => {
					void router.navigate({ to: `/icp/profile/${principal}` });
				}}
			>
				<div
					className="bg-gray-750 inline-flex h-[38px] cursor-pointer items-center justify-start rounded-full px-2 text-xs leading-4 font-medium text-white hover:bg-gray-700"
					onMouseEnter={() => {
						if (!isMobile) {
							setOpenPopover(true);
						}
					}}
					onMouseLeave={() => {
						if (!isMobile) {
							setOpenPopover(false);
						}
					}}
				>
					{identityProfile ? (
						<div
							className="h-6 w-6 rounded-full"
							style={{
								backgroundImage: `url(${identityProfile?.avatar ?? getAvatar(principal)})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						></div>
					) : (
						<Skeleton className="h-6 w-6 rounded-full" />
					)}

					<span className="ml-2">{truncatePrincipal(principal)}</span>
					{copied ? (
						<Check className="ml-1 opacity-40" size={16} strokeWidth={4} />
					) : (
						<CopyIcon
							className="ml-1 h-4 w-4"
							onClick={withStopPropagation(() => {
								setCopied(true);
								copy(principal);
								setTimeout(() => {
									setCopied(false);
								}, 2000);
							})}
						/>
					)}
					<div className="ml-2.5 h-6 w-px bg-white/20"></div>
					<DisconnectIcon
						className="ml-2.25 h-4 w-4"
						onClick={async (event: React.MouseEvent) => {
							event.stopPropagation();
							await handleDisconnect();
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
	);
};
const IcpWalletConnect: React.FC = () => {
	const { setIcpConnectOpen } = useDialogStore();
	const { isLoading } = useIcWallet();
	const { principal, connected, connecting } = useIcIdentityStore();
	const { setDepositWithdrawOpen } = useDialogStore();
	const { data: coreTokenBalance } = useCoreTokenBalance({
		owner: principal,
		token: { ICRCToken: getICPCanisterId() },
	});
	const router = useRouter();
	return (
		<>
			{principal ? (
				<div className="flex items-center justify-center gap-x-2">
					{!isMobile && <IcpAccountInfo />}

					<div
						className={cn(
							"bg-gray-750 inline-flex h-[38px] min-w-[80px] cursor-pointer items-center justify-start gap-0.5 gap-x-1 rounded-full px-3 text-xs leading-4 font-medium text-white hover:bg-gray-700",
							isMobile && "h-7"
						)}
						onClick={() => {
							if (isMobile) {
								void router.navigate({
									to: `/icp/profile/${principal}`,
									replace: true,
								});
							} else {
								setDepositWithdrawOpen({
									open: true,
									type: "deposit",
								});
							}
						}}
					>
						<img alt={"icp-logo"} src={`/svgs/chains/icp.svg`} />
						<span className="text-center text-xs font-medium">
							{connected ? (coreTokenBalance?.formatted ?? "---") : "---"}
						</span>
					</div>
				</div>
			) : isMobile ? (
				<WalletIcon
					className="h-6 w-6 text-yellow-500"
					onClick={() => {
						setIcpConnectOpen(true);
					}}
				/>
			) : (
				<Button
					className="h-[38px] w-[111px] rounded-full text-xs font-bold"
					disabled={isLoading || connecting}
					onClick={() => {
						setIcpConnectOpen(true);
					}}
				>
					{isLoading || connecting ? "Connecting..." : "Connect Wallet"}
				</Button>
			)}
		</>
	);
};

export default IcpWalletConnect;
