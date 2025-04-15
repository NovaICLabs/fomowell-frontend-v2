/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
	connectManager,
	type Connector,
	type WalletConnector,
} from "@/lib/ic/connectors";
import { useIcIdentityStore, useIcLastConnectedWalletStore } from "@/store/ic";

const useDisconnect = () => {
	const { setLastConnectedWallet } = useIcLastConnectedWalletStore();
	const { setConnected, setPrincipal } = useIcIdentityStore();
	const disconnect = useCallback(async () => {
		if ((window as any).icConnector) {
			await (window as any).icConnector.disconnect();
			setLastConnectedWallet(undefined);
			setConnected(false);
			setPrincipal(undefined);
		}
	}, [setConnected, setLastConnectedWallet, setPrincipal]);
	return disconnect;
};
const useInitialConnect = () => {
	const [loading, setLoading] = useState(false);
	const disconnect = useDisconnect();
	const { setConnected, setPrincipal } = useIcIdentityStore();
	const { lastConnectedWallet } = useIcLastConnectedWalletStore();
	useEffect(() => {
		async function call(lastConnectedWallet: Connector) {
			await connectManager.init(lastConnectedWallet);
			const expired = await connectManager.connector?.expired();
			if (expired) {
				void disconnect();
				setLoading(false);
				return;
			}
			const { connected, principal } = await connectManager.isConnected();

			if (!connected) {
				const { principal, connected } = await connectManager.connect();
				if (principal) {
					setPrincipal(principal);
					setConnected(connected);
				} else {
					throw new Error("Failed to connect to wallet");
				}
			} else {
				setPrincipal(principal);
				setConnected(connected);
			}
			// Initial actors
			setLoading(false);
		}
		if (lastConnectedWallet) {
			void call(lastConnectedWallet);
		}
	}, [disconnect, setConnected, setPrincipal, lastConnectedWallet]);

	return loading;
};

export function useIcWallet() {
	const connect = useCallback(
		async (connector: Connector, connectorOutside?: null | WalletConnector) => {
			await connectManager.init(connector);

			// Fix pop-up window was blocked when there is a asynchronous call before connecting the wallet
			if (connectorOutside) {
				const isSafari = /^((?!chrome|android).)*safari/i.test(
					navigator.userAgent
				);
				if (isSafari) {
					return connectorOutside.connect();
				}
				throw new Error(
					"Some unknown error happened. Please refresh the page to reconnect."
				);
			}
			return connectManager.connect();
		},
		[]
	);

	const disconnect = useDisconnect();

	const loading = useInitialConnect();

	return useMemo(
		() => ({
			open,
			connect,
			disconnect,
			loading,
		}),
		[connect, disconnect, loading]
	);
}
