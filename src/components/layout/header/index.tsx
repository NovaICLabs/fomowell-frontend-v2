import AuthGuard from "@/components/layout/header/auth-guard";
import BitcoinWalletConnect from "@/components/layout/header/connect-button";

export const Header = () => {
	return (
		<div className="fixed top-0 right-0 left-0 z-50 flex h-18 items-center justify-end px-6">
			<AuthGuard>
				<BitcoinWalletConnect />
			</AuthGuard>
		</div>
	);
};
