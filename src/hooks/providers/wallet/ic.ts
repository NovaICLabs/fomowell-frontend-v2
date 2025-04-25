/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
	const { setConnected, setPrincipal, clearToken, setConnecting } =
		useIcIdentityStore();
	const disconnect = useCallback(async () => {
		if ((window as any).icConnector) {
			await (window as any).icConnector.disconnect();
			setLastConnectedWallet(undefined);
			setConnected(false);
			setConnecting(false);
			setPrincipal(undefined);
			clearToken();
		}
	}, [
		clearToken,
		setConnected,
		setConnecting,
		setLastConnectedWallet,
		setPrincipal,
	]);
	return disconnect;
};

export const useInitialConnect = () => {
	const [initializing, setInitializing] = useState(false);
	const [hasInitialized, setHasInitialized] = useState(false);
	const disconnect = useDisconnect();
	const {
		setConnected,
		setPrincipal,
		connectByPrincipal,
		checkLogin,
		reloadIdentityProfile,
	} = useIcIdentityStore();
	const { lastConnectedWallet } = useIcLastConnectedWalletStore();
	const lastLoginRef = useRef<Connector | undefined>();

	// Handle disconnected state
	const handleNotConnected = useCallback(async () => {
		try {
			const { principal, connected } = await connectManager.connect();
			if (!connected) {
				return;
			}

			setPrincipal(principal);
			setConnected(connected);

			// Get JWT token using random value
			await connectByPrincipal();
		} catch (error) {
			console.error("Failed to connect wallet:", error);
		}
	}, [connectByPrincipal, setConnected, setPrincipal]);

	// Handle connected state
	const handleAlreadyConnected = useCallback(async () => {
		const { principal, connected } = await connectManager.connect();
		setPrincipal(principal);
		setConnected(connected);

		const isLoggedIn = await checkLogin();
		// console.debug("Login status:", isLoggedIn);

		if (!isLoggedIn) {
			await connectByPrincipal();
		}

		await reloadIdentityProfile();
	}, [
		checkLogin,
		connectByPrincipal,
		reloadIdentityProfile,
		setConnected,
		setPrincipal,
	]);

	const call = useCallback(
		async (lastConnectedWallet: Connector) => {
			try {
				await connectManager.init(lastConnectedWallet);
				const expired = await connectManager.connector?.expired();
				if (expired) {
					await disconnect();
				} else {
					const { connected } = await connectManager.isConnected();

					if (!connected) {
						await handleNotConnected();
					} else {
						await handleAlreadyConnected();
					}
				}
			} catch (error) {
				console.error("Error during connection initialization:", error);
			} finally {
				// Mark as initialized regardless of success or failure
				setInitializing(false);
				setHasInitialized(true);
			}
		},
		[disconnect, handleAlreadyConnected, handleNotConnected]
	);

	useEffect(() => {
		if (
			hasInitialized ||
			initializing ||
			!lastConnectedWallet ||
			lastLoginRef.current === lastConnectedWallet
		) {
			return;
		}

		setInitializing(true);

		if (lastConnectedWallet) {
			lastLoginRef.current = lastConnectedWallet;
			void call(lastConnectedWallet);
		}
	}, [lastConnectedWallet, hasInitialized, initializing, call]);

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

	return useMemo(
		() => ({
			open,
			connect,
			disconnect,
			isLoading: connecting,
		}),
		[connect, disconnect, connecting]
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
