import { useEffect, useState } from "react";

import { useLaserEyes } from "@omnisat/lasereyes";
import {
	LEATHER,
	MAGIC_EDEN,
	OKX,
	PHANTOM,
	type ProviderType,
	UNISAT,
	WIZZ,
	XVERSE,
} from "@omnisat/lasereyes-core";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const BitcoinWalletConnect: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [connectError, setConnectError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [manually, setManually] = useState<boolean>(false);

	const p = useLaserEyes();

	const {
		prepareLogin,
		isPrepareLoginIdle,
		prepareLoginError,
		loginError,
		setLaserEyes,
		login,
		getAddress,
		getPublicKey,
		connectedBtcAddress,
		identity,
		identityPublicKey,
		identityAddress,
		clear,
	} = useSiwbIdentity();
	console.log({ identity, identityPublicKey, identityAddress });

	const handleConnectWallet = async (provider: ProviderType) => {
		try {
			setConnectError(null);
			setLoading(true);
			setManually(true);
			await setLaserEyes(p, provider);
		} catch (error_) {
			console.error("Failed to connect wallet:", error_);
			if (error_ instanceof Error) {
				setConnectError(error_.message);
			} else {
				setConnectError("Failed to connect wallet");
			}
			setLoading(false);
		}
	};

	const handleDisconnect = () => {
		clear();
	};

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	/**
	 * Preload a Siwb message on every address change.
	 */
	useEffect(() => {
		if (!isPrepareLoginIdle) return;
		const btcAddress = getAddress();
		const pubkey = getPublicKey();
		console.log({ btcAddress, pubkey, identityPublicKey, connectedBtcAddress });

		if (btcAddress) {
			console.log({
				btcAddress,
				// canisterId: process.env.
			});
			prepareLogin();
			if (connectedBtcAddress && !identity && manually) {
				void (async () => {
					try {
						const response = await login();
						if (response) {
							setManually(false);
							setOpen(false);
						}
					} catch (error) {
						console.error("Login failed:", error);
						if (error instanceof Error) {
							setConnectError(error.message);
						}
					} finally {
						setLoading(false);
					}
				})();
			}
		}
	}, [
		prepareLogin,
		isPrepareLoginIdle,
		getPublicKey,
		login,
		connectedBtcAddress,
		identity,
		manually,
		identityPublicKey,
		getAddress,
	]);

	/**
	 * Show an error toast if the prepareLogin() call fails.
	 */
	useEffect(() => {
		if (prepareLoginError) {
			setConnectError(prepareLoginError.message);
			setLoading(false);
		}
	}, [prepareLoginError]);

	/**
	 * Show an error toast if the login call fails.
	 */
	useEffect(() => {
		if (loginError) {
			setConnectError(loginError.message);
			setLoading(false);
		}
	}, [loginError]);

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					{identity ? (
						<Button
							className="h-[38px] w-[111px] rounded-full text-xs font-bold"
							onClick={handleDisconnect}
						>
							{formatAddress(identity?.getPrincipal().toText())}
						</Button>
					) : (
						<Button
							className="h-[38px] w-[111px] rounded-full text-xs font-bold"
							disabled={loading}
							onClick={() => {
								setOpen(true);
							}}
						>
							{loading ? "Connecting..." : "Connect Wallet"}
						</Button>
					)}
				</DialogTrigger>

				<DialogContent className="border-gray-800 bg-gray-900 text-white sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-white">
							Connect Bitcoin Wallet
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							Choose a wallet to connect to FOMOWELL
						</DialogDescription>
					</DialogHeader>

					{connectError && (
						<div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-3">
							<p className="text-sm text-red-300">{connectError}</p>
							{connectError.includes("not installed") && (
								<div className="mt-2 space-y-1">
									<a
										className="flex items-center text-xs text-blue-400 hover:underline"
										href="https://www.xverse.app/download"
										rel="noreferrer"
										target="_blank"
									>
										<svg
											className="mr-1 h-3 w-3"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
										</svg>
										Install Xverse Wallet
									</a>
									<a
										className="flex items-center text-xs text-blue-400 hover:underline"
										href="https://unisat.io/download"
										rel="noreferrer"
										target="_blank"
									>
										<svg
											className="mr-1 h-3 w-3"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
										</svg>
										Install UniSat Wallet
									</a>
								</div>
							)}
						</div>
					)}
					<div className="grid grid-cols-2 gap-3 py-2">
						<WalletOption
							recommended
							disabled={loading}
							name="Wizz"
							onClick={() => handleConnectWallet(WIZZ)}
						/>
						<WalletOption
							recommended
							disabled={loading}
							name="Xverse"
							onClick={() => handleConnectWallet(XVERSE)}
						/>
						<WalletOption
							disabled={loading}
							name="UniSat"
							onClick={() => handleConnectWallet(UNISAT)}
						/>
						<WalletOption
							disabled={loading}
							name="OKX"
							onClick={() => handleConnectWallet(OKX)}
						/>
						<WalletOption
							disabled={loading}
							name="Leather"
							onClick={() => handleConnectWallet(LEATHER)}
						/>
						<WalletOption
							disabled={loading}
							name="Phantom"
							onClick={() => handleConnectWallet(PHANTOM)}
						/>
						<WalletOption
							disabled={loading}
							name="Magic Eden"
							onClick={() => handleConnectWallet(MAGIC_EDEN)}
						/>
					</div>

					<div className="mt-2 flex justify-center">
						<Button
							className="rounded-full border-gray-700 text-xs text-gray-300 hover:bg-gray-800 hover:text-white"
							variant="outline"
							onClick={() => {
								setOpen(false);
							}}
						>
							Cancel
						</Button>
					</div>

					{loading && (
						<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

interface WalletOptionProps {
	name: string;
	onClick: () => void;
	recommended?: boolean;
	disabled?: boolean;
}

const WalletOption: React.FC<WalletOptionProps> = ({
	name,
	onClick,
	recommended,
	disabled,
}) => {
	return (
		<button
			className="bg-gray-850 flex flex-col items-center justify-center rounded-lg border border-gray-700 p-4 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={disabled}
			type="button"
			onClick={onClick}
		>
			<span className="text-sm font-medium text-white">{name}</span>
			{recommended && (
				<span className="mt-1 rounded bg-blue-900 px-2 py-0.5 text-xs text-blue-200">
					Recommended
				</span>
			)}
		</button>
	);
};

export default BitcoinWalletConnect;
