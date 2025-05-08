import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { isMobile } from "react-device-detect";

import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import WalletIcon from "@/components/icons/links-popover/linked-wallet";
import ProfileIcon from "@/components/icons/links-popover/profile";
import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";
import { withStopPropagation } from "@/lib/common/react-event";
import { useIcIdentityStore } from "@/store/ic";

const MobileFooter = () => {
	const { principal } = useIcIdentityStore();
	const router = useRouter();
	const bottomBar = [
		{
			icon: (
				<img
					alt="fomowell"
					className="w-9"
					src="/images/logo/small-fomowell.png"
				/>
			),
		},
		{
			label: "Deposit",
			action: withStopPropagation(() => {
				// setDepositWithdrawOpen({
				// 	open: true,
				// 	type: "deposit",
				// });
			}),
			icon: <DepositWithdrawIcon className="h-6.5 w-6.5" />,
		},
		{
			label: "Create",
			action: withStopPropagation(() => {
				void router.navigate({ to: "/icp/create" });
			}),
			icon: <div className="h-6.5 w-6.5"></div>,
		},
		{
			label: "Wallet",
			action: withStopPropagation(() => {
				void router.navigate({ to: `/icp/wallet/${principal}` });
			}),
			icon: <WalletIcon className="h-6.5 w-6.5" />,
		},
		{
			label: "Profile",
			action: withStopPropagation(() => {
				void router.navigate({ to: `/icp/profile/${principal}` });
			}),
			icon: <ProfileIcon className="h-6.5 w-6.5" />,
		},
	];
	return (
		<div className="fixed right-0 bottom-0 left-0 grid h-[55px] grid-cols-5 items-center justify-between bg-gray-800">
			{bottomBar.map((item) => (
				<div
					key={item.label}
					className="relative flex h-full flex-col items-center justify-center gap-y-[1px]"
				>
					{item.label === "Create" && (
						<div className="absolute top-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full p-px">
							<div className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500"></div>
							<div className="relative flex h-full w-full items-center justify-center rounded-full bg-gray-800">
								<Plus size={26} />
							</div>
						</div>
					)}
					{item.icon}
					<span className="text-[11px] font-medium text-white/60">
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
