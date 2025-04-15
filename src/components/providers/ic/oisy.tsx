import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	DEFAULT_SIGNER_WINDOW_FEATURES,
	type IcrcAccount,
} from "@dfinity/oisy-wallet-signer";
import { IcpWallet as OisyWallet } from "@dfinity/oisy-wallet-signer/icp-wallet";

import { isDevelopment } from "@/common/env";

interface OisyWalletContextType {
	wallet: OisyWallet | null;
	accounts: Array<IcrcAccount>;
	isConnecting: boolean;
	isConnected: boolean;
	error: string | null;
	connect: () => Promise<void>;
	disconnect: () => void;
}

const OisyWalletContext = createContext<OisyWalletContextType>({
	wallet: null,
	accounts: [],
	isConnecting: false,
	isConnected: false,
	error: null,
	connect: async () => {},
	disconnect: () => {},
});

export const useOisyWallet = () => useContext(OisyWalletContext);

interface OisyWalletProviderProps {
	children: ReactNode;
	walletUrl?: string;
}

export const OisyWalletProvider = ({
	children,
	walletUrl = !isDevelopment
		? "https://oisy.com/sign"
		: "https://staging.oisy.com/sign",
}: OisyWalletProviderProps) => {
	const [wallet, setWallet] = useState<OisyWallet | null>(null);
	const [accounts, setAccounts] = useState<Array<IcrcAccount>>([]);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const connect = async () => {
		try {
			setIsConnecting(true);
			setError(null);

			// Connect to the wallet
			const walletInstance = await OisyWallet.connect({
				url: walletUrl,
				onDisconnect: () => {
					setIsConnected(false);
					setWallet(null);
					setAccounts([]);
				},
				windowOptions: {
					width: 576,
					height: 625,
					position: "center",
					features: DEFAULT_SIGNER_WINDOW_FEATURES,
				},
			});
			// Request permissions
			const { allPermissionsGranted } =
				await walletInstance.requestPermissionsNotGranted();

			if (!allPermissionsGranted) {
				throw new Error("Not all permissions were granted");
			}

			// Get accounts
			const accountsResult = await walletInstance.accounts();

			setWallet(walletInstance);
			setAccounts(accountsResult || []);
			setIsConnected(true);
		} catch (error_) {
			console.error("Failed to connect to wallet:", error_);
			setError(
				error_ instanceof Error ? error_.message : "Failed to connect to wallet"
			);
		} finally {
			setIsConnecting(false);
		}
	};

	const disconnect = async () => {
		try {
			if (wallet) {
				await wallet.disconnect();
			}
			setWallet(null);
			setAccounts([]);
			setIsConnected(false);
		} catch (error_) {
			console.error("Failed to disconnect wallet:", error_);
		}
	};

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (wallet) {
				void wallet.disconnect();
			}
		};
	}, [wallet]);

	const value = {
		wallet,
		accounts,
		isConnecting,
		isConnected,
		error,
		connect,
		disconnect,
	};

	return (
		<OisyWalletContext.Provider value={value}>
			{children}
		</OisyWalletContext.Provider>
	);
};
