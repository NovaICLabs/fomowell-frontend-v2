import { useRouter } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";

import ChainSelector from "@/components/layout/header/chain-selector";
import BitcoinWalletConnect from "@/components/layout/header/connect-button/bitcoin";
import CreateToken from "@/components/layout/header/create-token";
import Links from "@/components/layout/header/links";
import Search from "@/components/layout/header/search";
import { useChainStore } from "@/store/chain";

import IcpWalletConnect from "./connect-button/icp";

export const Header = () => {
	const router = useRouter();
	const { chain } = useChainStore();
	return (
		<>
			{isMobile ? (
				<div className="flex h-11 items-center justify-between gap-2 px-2.5">
					<div className="flex items-center gap-2">
						<img alt="Menu" src="/svgs/common/menu.svg" />
						<ChainSelector />
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
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
