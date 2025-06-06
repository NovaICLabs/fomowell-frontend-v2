import { useMemo } from "react";

import { useLocation, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { isMobile } from "react-device-detect";

import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import WalletIcon from "@/components/icons/links-popover/linked-wallet";
import ProfileIcon from "@/components/icons/links-popover/profile";
import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";
import { useCurrentChain } from "@/hooks/common/useTokenRouter";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore } from "@/store/ic";

const MobileFooter = () => {
	const { principal: icPrincipal, connected: icConnected } =
		useIcIdentityStore();
	const { principal: btcPrincipal, connected: btcConnected } =
		useBtcIdentityStore();
	const { setIcpConnectOpen } = useDialogStore();
	const chain = useCurrentChain();

	const router = useRouter();
	const pathname = useLocation({
		select: (location) => location.pathname,
	});

	const connected = useMemo(() => {
		if (chain === "icp") {
			return icConnected;
		}
		if (chain === "bitcoin") {
			return btcConnected;
		}
		return icConnected;
	}, [chain, icConnected, btcConnected]);

	const principal = useMemo(() => {
		if (chain === "icp") {
			return icPrincipal;
		}
		if (chain === "bitcoin") {
			return btcPrincipal;
		}
		return icPrincipal;
	}, [chain, icPrincipal, btcPrincipal]);

	const isHome = pathname === "/";

	const commonPath = useMemo(() => {
		return `/mobile/${chain}`;
	}, [chain]);

	const bottomBar = useMemo(
		() => [
			{
				label: isHome ? "" : "Token",
				action: withStopPropagation(() => {
					void router.navigate({ to: "/" });
				}),
				icon: isHome ? (
					<motion.img
						alt="fomowell"
						className="w-9"
						src="/images/logo/small-fomowell.png"
						animate={{
							scale: [0.5, 1],
						}}
					/>
				) : (
					<img
						alt="fomowell"
						className="w-6.5"
						src="/svgs/mobile/footer/token.svg"
					/>
				),
			},
			{
				label: "Deposit",
				action: withStopPropagation(() => {
					if (connected) {
						void router.navigate({ to: `${commonPath}/deposit-withdraw` });
					} else {
						setIcpConnectOpen(true);
					}
				}),
				icon: (
					<DepositWithdrawIcon
						className={cn(
							"h-6.5 w-6.5",
							pathname.includes(`${commonPath}/deposit-withdraw`) &&
								"text-yellow-500"
						)}
					/>
				),
				active: pathname.includes(`${commonPath}/deposit-withdraw`),
			},
			{
				label: "Create",
				action: withStopPropagation(() => {
					if (connected) {
						void router.navigate({ to: `/${chain}/create` });
					} else {
						setIcpConnectOpen(true);
					}
				}),
				icon: <div className="h-6.5 w-6.5"></div>,
				active: pathname === `/${chain}/create`,
			},
			{
				label: "Wallet",
				action: withStopPropagation(() => {
					if (connected) {
						void router.navigate({ to: `/${chain}/wallet/${principal}` });
					} else {
						setIcpConnectOpen(true);
					}
				}),
				icon: (
					<WalletIcon
						className={cn(
							"h-6.5 w-6.5",
							pathname === `/${chain}/wallet/${principal}` && "text-yellow-500"
						)}
					/>
				),
				active: pathname === `/${chain}/wallet/${principal}`,
			},
			{
				label: "Profile",
				action: withStopPropagation(() => {
					if (connected) {
						void router.navigate({ to: `/${chain}/profile/${principal}` });
					} else {
						setIcpConnectOpen(true);
					}
				}),
				icon: (
					<ProfileIcon
						className={cn(
							"h-6.5 w-6.5",
							pathname === `/${chain}/profile/${principal}` && "text-yellow-500"
						)}
					/>
				),
				active: pathname === `/${chain}/profile/${principal}`,
			},
		],
		[
			chain,
			commonPath,
			connected,
			isHome,
			pathname,
			principal,
			router,
			setIcpConnectOpen,
		]
	);

	return (
		<div
			className={cn(
				"fixed right-0 bottom-0 left-0 grid h-[55px] grid-cols-5 items-center justify-between bg-gray-800",
				pathname.includes(`/${chain}/token`) && "hidden"
			)}
		>
			{bottomBar.map((item) => (
				<div
					key={item.label}
					className="relative flex h-full flex-col items-center justify-center gap-y-[1px]"
					onClick={item.action}
				>
					{item.label === "Create" && (
						<div className="absolute top-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full p-px">
							<div className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500"></div>
							<div
								className={cn(
									"relative flex h-full w-full items-center justify-center rounded-full bg-gray-800",
									item.active && "bg-transparent"
								)}
							>
								<Plus size={26} />
							</div>
						</div>
					)}
					{item.icon}
					<span
						className={cn(
							"text-[11px] font-medium text-white/60",
							item.active && "text-yellow-500"
						)}
					>
						{item.label}
					</span>
				</div>
			))}
		</div>
	);
};

const DesktopFooter = () => {
	return (
		<div className="bg-gray-710 fixed right-0 bottom-0 left-0 flex h-[38px] items-center justify-between px-4">
			<span className="text-xs leading-4 font-light text-white/60">
				© 2025 Fomowell
			</span>
			<div className="flex items-center gap-x-8">
				<a href="https://x.com/Fomowellcomdot" target="_blank">
					<X className="h-4 w-4 cursor-pointer" />
				</a>
				<a href="https://t.me/fomowell" target="_blank">
					<Telegram className="h-4 w-4 cursor-pointer" />
				</a>
			</div>
		</div>
	);
};

export default function Footer() {
	return isMobile ? <MobileFooter /> : <DesktopFooter />;
}
