import { useRouter } from "@tanstack/react-router";

import AuthGuard from "@/components/layout/header/auth-guard";
import ChainSelector from "@/components/layout/header/chain-selector";
import BitcoinWalletConnect from "@/components/layout/header/connect-button";
import CreateToken from "@/components/layout/header/create-token";
import Links from "@/components/layout/header/links";
import Search from "@/components/layout/header/search";

export const Header = () => {
	const router = useRouter();
	return (
		<div className="relative z-50 flex h-18 items-center justify-between">
			<img
				alt="Logo"
				className="cursor-pointer"
				src="/svgs/fomowell.svg"
				onClick={() => router.navigate({ to: "/" })}
			/>
			<div className="mr-auto ml-[30px] flex items-center gap-[30px]">
				<Links />
				<CreateToken />
			</div>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Search />
			</div>
			<AuthGuard>
				<div className="flex items-center gap-7.5">
					<ChainSelector />
					<BitcoinWalletConnect />
				</div>
			</AuthGuard>
		</div>
	);
};
