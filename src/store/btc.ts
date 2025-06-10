import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
	checkLogin,
	getUserInfoByToken,
	loginOrRegisterByPrincipal,
	refreshToken,
} from "@/apis/user-login-btc";
import {
	get_generate_random,
	getChainBTCCoreCanisterId,
} from "@/canisters/btc_core";
import { createActorCreatorFromIdentity } from "@/hooks/providers/wallet/ic";

import type { UserInfo } from "@/apis/indexer";
import type { ActorCreator } from "@/lib/ic/connectors";
import type { Identity } from "@dfinity/agent";
import type { NetworkType, ProviderType } from "@omnisat/lasereyes-core";

type BtcIdentity = {
	jwt_token?: string;
	principal: string | undefined;
	identityProfile: UserInfo | undefined;
	reloadIdentityProfile: () => Promise<void>;
	connected: boolean;
	connecting: boolean;
	setConnecting: (c: boolean) => void;
	connectByPrincipal: (
		identity: Identity | undefined,
		randomValue?: string
	) => Promise<string | undefined>;
	// handleIIBug: () => Promise<boolean>;
	setPrincipal: (principal?: string) => void;
	setConnected: (connected: boolean) => void;
	refreshToken: () => Promise<string | undefined>;
	checkLogin: () => Promise<boolean>;
	clearToken: () => void;
	setIdentityProfile: (identityProfile?: UserInfo) => void;
	btcAddress: string;
	setBtcAddress: (address: string) => void;
};

export const useBtcIdentityStore = create<BtcIdentity>()(
	persist(
		(set, get) => ({
			principal: undefined,
			connected: false,
			connecting: false,
			identityProfile: undefined,
			setIdentityProfile: (identityProfile?: UserInfo) => {
				set({ identityProfile });
			},
			setConnecting: (c: boolean) => {
				set({ connecting: c });
			},
			jwt_token: "",
			clearToken: () => {
				set({ jwt_token: "" });
			},
			btcAddress: "",
			setBtcAddress(address) {
				set({ btcAddress: address });
			},
			connectByPrincipal: async (
				identity: Identity | undefined,
				randomValue?: string
			): Promise<string | undefined> => {
				const principal = get().principal;
				if (!principal) return;
				const token = get().jwt_token;

				let correct = true;
				try {
					if (token) {
						// check token
						const isValid = await get().checkLogin();
						if (isValid) {
							return token;
						} else {
							const newToken = await get().refreshToken();
							if (newToken) {
								set({ jwt_token: newToken });
								return newToken;
							}
							correct = false;
						}
					} else {
						correct = false;
					}
				} catch (error) {
					console.error("🚀 ~ error:", error);
					correct = false;
				}

				try {
					if (correct) {
						return;
					}
					set({ connecting: true });

					const r = await login2ByPrincipal(identity, principal, randomValue);

					set({ jwt_token: r, connected: true });

					await get().reloadIdentityProfile();
					return r;
				} catch (error) {
					console.error(error);
					return undefined;
				} finally {
					set({ connecting: false });
				}
			},
			reloadIdentityProfile: async (): Promise<void> => {
				const token = get().jwt_token;
				if (!token) return;
				try {
					// todo get identity profile
					const profile = await getUserInfoByToken(token);

					if (!profile) {
						set({
							identityProfile: undefined,
						});
						return;
					}
					set({
						identityProfile: profile,
					});
				} catch (error) {
					console.error(error);
				}
			},
			setPrincipal: (principal?: string) => {
				set({ principal });
			},
			setConnected: (connected: boolean) => {
				set({ connected });
			},
			refreshToken: async (): Promise<string | undefined> => {
				const token = get().jwt_token;
				if (!token) return;
				const newToken = await refreshToken(token);
				if (newToken) {
					set({ jwt_token: newToken });
					return newToken;
				}
				set({ jwt_token: "" });
				return undefined;
			},
			checkLogin: async (): Promise<boolean> => {
				const token = get().jwt_token;
				if (!token) return false;
				const isValid = await checkLogin(token);

				if (!isValid) {
					return false;
				}
				return true;
			},
		}),
		{
			name: "btc-identity-storage", // Key name in localStorage
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				jwt_token: state.jwt_token,
				principal: state.principal,
				connected: state.connected,
				btcAddress: state.btcAddress,
				identityProfile: state.identityProfile,
			}),
		}
	)
);

export type BtcConnector = ProviderType;
export type BtcNetwork = NetworkType;

export const useBtcLastConnectedWalletStore = create(
	persist<{
		network: BtcNetwork;
		setLastConnectedNetwork: (network: BtcNetwork) => void;
		lastConnectedWallet?: BtcConnector | undefined;
		setLastConnectedWallet: (lastConnectedWallet?: BtcConnector) => void;
	}>(
		(set) => ({
			network: "testnet4",
			setLastConnectedNetwork: (network: BtcNetwork) => {
				set({ network });
			},
			lastConnectedWallet: undefined,
			setLastConnectedWallet: (lastConnectedWallet?: BtcConnector) => {
				set({ lastConnectedWallet });
			},
		}),
		{
			name: "btc-last-connected-wallet-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

const login2ByPrincipal = async (
	identity: Identity | undefined,
	principal: string,
	existingRandom?: string
): Promise<string | undefined> => {
	if (!principal || !identity) return;

	let random = existingRandom;
	if (!random) {
		const actorCreator = createActorCreatorFromIdentity(identity);
		if (!actorCreator) {
			return undefined;
		}

		try {
			random = await get_generate_random(
				actorCreator as ActorCreator,
				getChainBTCCoreCanisterId().toText()
			);
			if (!random) {
				console.error("Failed to get random value");
				return undefined;
			}
		} catch (error) {
			console.error("Failed to get random value:", error);
			return undefined;
		}
	}

	try {
		const result = await loginOrRegisterByPrincipal({ principal, random });
		return result;
	} catch (error) {
		console.error("Login failed:", error);
		return undefined;
	}
};
