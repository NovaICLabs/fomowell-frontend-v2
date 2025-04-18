/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useMemo, useState } from "react";

import { Actor, HttpAgent } from "@dfinity/agent";

import {
	connectManager,
	type Connector,
	type WalletConnector,
} from "@/lib/ic/connectors";
import { useIcIdentityStore, useIcLastConnectedWalletStore } from "@/store/ic";

import type { IDL } from "@dfinity/candid";
import type { Principal } from "@dfinity/principal";

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
	const [initializing, setInitializing] = useState(false);
	const disconnect = useDisconnect();
	const { setConnected, setPrincipal } = useIcIdentityStore();
	const { lastConnectedWallet } = useIcLastConnectedWalletStore();
	useEffect(() => {
		async function call(lastConnectedWallet: Connector) {
			await connectManager.init(lastConnectedWallet);
			const expired = await connectManager.connector?.expired();
			if (expired) {
				await disconnect();
				setInitializing(false);
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
			setInitializing(false);
		}
		if (lastConnectedWallet) {
			void call(lastConnectedWallet);
		}
	}, [disconnect, setConnected, setPrincipal, lastConnectedWallet]);
	return initializing;
};

export function useIcWallet() {
	const [connecting, setConnecting] = useState(false);
	const connect = useCallback(
		async (connector: Connector, connectorOutside?: null | WalletConnector) => {
			setConnecting(true);
			try {
				await connectManager.init(connector);
				// Fix pop-up window was blocked when there is a asynchronous call before connecting the wallet
				if (connectorOutside) {
					const isSafari = /^((?!chrome|android).)*safari/i.test(
						navigator.userAgent
					);
					if (isSafari) {
						return await connectorOutside.connect();
					}
					throw new Error(
						"Some unknown error happened. Please refresh the page to reconnect."
					);
				}
				return await connectManager.connect();
			} catch (error) {
				console.debug("🚀 ~ error:", error);
				throw error;
			} finally {
				setConnecting(false);
			}
		},
		[]
	);

	const disconnect = useDisconnect();

	const isInitializing = useInitialConnect();

	return useMemo(
		() => ({
			open,
			connect,
			disconnect,
			isLoading: connecting || isInitializing,
		}),
		[connect, disconnect, connecting, isInitializing]
	);
}

export const useConnectedIdentity = () => {
	const { principal, connected } = useIcIdentityStore();
	const actorCreator = window.icConnector?.createActor;
	if (!connected) {
		return { principal: undefined, connected, actorCreator: undefined };
	}
	return { principal, connected, actorCreator };
};

export const getAnonymousActorCreator = (fetchRootKey: boolean = false) => {
	return async <T>(args: {
		idlFactory: IDL.InterfaceFactory;
		canisterId: string | Principal;
	}) => {
		const { idlFactory, canisterId } = args;
		const agent = HttpAgent.createSync({
			host: import.meta.env.VITE_IC_HOST,
			retryTimes: 1,
			verifyQuerySignatures: false,
		});
		if (fetchRootKey) await agent.fetchRootKey();
		return Actor.createActor<T>(idlFactory, { agent, canisterId });
	};
};
