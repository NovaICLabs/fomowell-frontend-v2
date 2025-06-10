import { useCallback, useEffect } from "react";

import { useLaserEyes } from "@omnisat/lasereyes";
import { useRouter } from "@tanstack/react-router";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";
import { isMobile } from "react-device-detect";

import {
	useBtcIdentityStore,
	useBtcLastConnectedWalletStore,
} from "@/store/btc";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import { createActorCreatorFromIdentity } from "./ic";

import type { Identity } from "@dfinity/agent";

export const useCheckBtcWalletConnected = () => {
	const router = useRouter();
	// mobile
	const { setMenuOpen } = useMobileSheetStore();

	const {
		connected: storeConnected,
		setConnected,
		setConnecting,
		setIdentityProfile,
		setPrincipal,
		clearToken,
		btcAddress,
	} = useBtcIdentityStore();
	const { network: lastNetwork, lastConnectedWallet } =
		useBtcLastConnectedWalletStore();
	// const { setBtcDepositWithdrawOpen } = useDialogStore();

	const {
		disconnect,
		address,
		network,
		connected,
		isInitializing,
		isConnecting,
	} = useLaserEyes();
	const { clear } = useSiwbIdentity();

	const reset = useCallback(() => {
		setConnected(false);
		setConnecting(false);
		setPrincipal(undefined);
		clearToken();
		setIdentityProfile(undefined);
		clear();
		disconnect();
	}, [
		clear,
		clearToken,
		disconnect,
		setConnected,
		setConnecting,
		setIdentityProfile,
		setPrincipal,
	]);

	const handleDisconnect = useCallback(async () => {
		reset();
		if (isMobile) {
			setMenuOpen(false);
		} else {
			await router.navigate({
				to: "/",
				replace: true,
			});
		}
	}, [reset, router, setMenuOpen]);

	useEffect(() => {
		if (!storeConnected || isInitializing || isConnecting) {
			return;
		}

		// connected
		if (connected && address === btcAddress && network === lastNetwork) {
			return;
		}

		// console.log(
		// 	"🚀 ~ useCheckBtcWalletConnected ~ isInitializing:",
		// 	isInitializing,
		// 	"=======",
		// 	isConnecting
		// );

		// console.log("🚀 ~ useEffect ~ storeConnected:", storeConnected);

		// console.log("🚀 ~ useEffect ~ connected:", connected);

		// console.log("🚀 ~ useEffect ~ network:", network);
		// console.log("🚀 ~ useEffect ~ lastNetwork:", lastNetwork);

		// console.log("🚀 ~ useEffect ~ btcAddress:", btcAddress);
		// console.log("🚀 ~ useEffect ~ address:", address);

		// connected and network changed or address changed
		if (
			(connected && network !== lastNetwork) ||
			(btcAddress && connected && address !== btcAddress)
		) {
			void handleDisconnect();
			return;
		}

		// not connected and no address
		if (!connected && !address) {
			void handleDisconnect();
			return;
		}
	}, [
		lastNetwork,
		lastConnectedWallet,
		network,
		connected,
		storeConnected,
		address,
		btcAddress,
		handleDisconnect,
		isInitializing,
		isConnecting,
	]);
};

export const useBtcConnectedIdentity = () => {
	const { identity } = useSiwbIdentity();
	const { principal, connected } = useBtcIdentityStore();
	const actorCreator = createActorCreatorFromIdentity(identity as Identity);
	if (!connected) {
		return { principal: undefined, connected, actorCreator: undefined };
	}
	return { principal, connected, actorCreator };
};
