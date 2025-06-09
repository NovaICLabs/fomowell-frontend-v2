import { useLocation, useRouter } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";

import ChainSelector from "@/components/layout/header/chain-selector";
import BitcoinWalletConnect from "@/components/layout/header/connect-button/bitcoin";
import CreateToken from "@/components/layout/header/create-token";
import Links from "@/components/layout/header/links";
import Search from "@/components/layout/header/search";
import MenuSheet from "@/components/layout/mobile-sheet/menu";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import IcpWalletConnect from "./connect-button/icp";

export const Header = () => {
	const router = useRouter();
	const { chain } = useChainStore();
	const pathname = useLocation({
		select: (location) => location.pathname,
	});
	const { setMenuOpen } = useMobileSheetStore();

	return (
		<>
			{isMobile ? (
				<div
					className={cn(
						"flex h-11 items-center justify-between gap-2 px-2.5",
						pathname.includes("/icp/token") && "hidden"
					)}
				>
					<div className="flex items-center gap-2">
						<img
							alt="Menu"
							className="cursor-pointer"
							src="/svgs/common/menu.svg"
							onClick={() => {
								setMenuOpen(true);
							}}
						/>
						<ChainSelector />
						<MenuSheet />
					</div>
					{chain === "bitcoin" && <BitcoinWalletConnect />}
					{chain === "icp" && <IcpWalletConnect />}
				</div>
			) : (
				<div className="relative z-50 flex h-18 items-center justify-between">
					<img
						alt="Logo"
						className="w-40 cursor-pointer"
						src="/images/logo/fomowell.png"
						onClick={() => router.navigate({ to: "/" })}
					/>
					<div className="mr-auto ml-[30px] flex items-center gap-[30px]">
						<Links />
						<CreateToken />
					</div>
					<div className="absolute top-1/2 left-4/7 -translate-x-1/2 -translate-y-1/2">
						<Search />
					</div>
					<div className="flex items-center gap-7.5">
						<ChainSelector />
						{chain === "bitcoin" && <BitcoinWalletConnect />}
						{chain === "icp" && <IcpWalletConnect />}
					</div>
				</div>
			)}
		</>
	);
};
