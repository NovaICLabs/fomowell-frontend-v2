import { useEffect, useState } from "react";

import { useLaserEyes } from "@omnisat/lasereyes";
import {
	OKX,
	PHANTOM,
	type ProviderType,
	UNISAT,
} from "@omnisat/lasereyes-core";
import copy from "copy-to-clipboard";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";
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
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";

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
	const principal = identity?.getPrincipal().toText();
	const [copied, setCopied] = useState(false);
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				{principal ? (
					<div className="flex items-center justify-center gap-x-2">
						<div className="bg-gray-750 inline-flex h-[38px] items-center justify-start rounded-full px-2 text-xs leading-4 font-medium text-white hover:bg-gray-700">
							<img
								alt="avatar"
								className="h-6 w-6 rounded-full"
								src={`https://api.dicebear.com/9.x/identicon/svg?seed=${principal}`}
							/>
							<span className="ml-2">{truncatePrincipal(principal)}</span>
							{copied ? (
								<Check className="ml-1 opacity-40" size={16} />
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
								onClick={handleDisconnect}
							/>
						</div>
						<div className="bg-gray-750 inline-flex h-[38px] items-center justify-start gap-0.5 rounded-full px-2 text-xs leading-4 font-medium text-white hover:bg-gray-700">
							<img
								alt="flash"
								className="h-4.5 w-4.5 rounded-full"
								src={"/svgs/coins/bitcoin.svg"}
							/>
							<span className="text-xs font-medium">0.01366000</span>
						</div>
					</div>
				) : (
					<DialogTrigger asChild>
						<Button
							className="h-[38px] w-[111px] rounded-full text-xs font-bold"
							disabled={loading}
							onClick={() => {
								setOpen(true);
							}}
						>
							{loading ? "Connecting..." : "Connect Wallet"}
						</Button>
					</DialogTrigger>
				)}

				<DialogContent
					className={cn(
						"border-gray-755 bg-gray-755 transition-height flex w-[360px] flex-col rounded-3xl px-5 py-6 text-white duration-300",
						loading && "h-100"
					)}
				>
					<DialogHeader>
						<DialogTitle className="text-center text-lg font-semibold text-white">
							Connect Wallet
						</DialogTitle>
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

					{loading ? (
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
								disabled={loading}
								icon={<img alt="Unisat" src="/svgs/wallet/unisat.svg" />}
								name="UniSat"
								onClick={() => handleConnectWallet(UNISAT)}
							/>
							<WalletOption
								disabled={loading}
								icon={<img alt="OKX" src="/svgs/wallet/okx.svg" />}
								name="OKX"
								onClick={() => handleConnectWallet(OKX)}
							/>
							<WalletOption
								disabled={loading}
								icon={<img alt="Phantom" src="/svgs/wallet/phantom.svg" />}
								name="Phantom"
								onClick={() => handleConnectWallet(PHANTOM)}
							/>

							<WalletOption
								disabled={loading}
								icon={<img alt="Plug" src="/svgs/wallet/plug.svg" />}
								name="Plug"
								onClick={() => {}}
							/>
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
	icon?: React.ReactNode;
}

const WalletOption: React.FC<WalletOptionProps> = ({
	name,
	onClick,
	recommended,
	disabled,
	icon,
}) => {
	return (
		<button
			className="bg-gray-750 flex h-[43px] items-center justify-between rounded-full border border-white/10 p-4 px-4 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
			<div className="flex h-7 w-7 items-center justify-center rounded-full">
				{icon}
			</div>
		</button>
	);
};

export default BitcoinWalletConnect;
