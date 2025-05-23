import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
	checkLogin,
	getUserInfoByToken,
	loginOrRegisterByPrincipal,
	refreshToken,
} from "@/apis/user-login";
import {
	get_generate_random,
	getChainICCoreCanisterId,
} from "@/canisters/core";

import type { UserInfo } from "@/apis/indexer";
import type { Connector } from "@/lib/ic/connectors";

type IcIdentity = {
	jwt_token?: string;
	principal: string | undefined;
	identityProfile: UserInfo | undefined;
	reloadIdentityProfile: () => Promise<void>;
	connected: boolean;
	connecting: boolean;
	setConnecting: (c: boolean) => void;
	connectByPrincipal: (randomValue?: string) => Promise<string | undefined>;
	handleIIBug: () => Promise<boolean>;
	setPrincipal: (principal?: string) => void;
	setConnected: (connected: boolean) => void;
	refreshToken: () => Promise<string | undefined>;
	checkLogin: () => Promise<boolean>;
	clearToken: () => void;
	setIdentityProfile: (identityProfile?: UserInfo) => void;
};
// check ii kun bug
const checkIIBug = async () => {
	const connector = window.icConnector;
	let isBug = false;
	try {
		if (connector?.type === "II") {
			await get_generate_random(
				connector.createActor,
				getChainICCoreCanisterId().toText()
			);
		}
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes("anonymous user is not allowed")
		) {
			isBug = true;
		}
	}
	return isBug;
};
export const useIcIdentityStore = create<IcIdentity>()(
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
			handleIIBug: async () => {
				const isBug = await checkIIBug();
				// if ii kun bug
				if (isBug) {
					await window.icConnector.disconnect();
					get().clearToken();
					get().setConnected(false);
					get().setPrincipal(undefined);
				}
				return isBug;
			},
			connectByPrincipal: async (
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

					const r = await login2ByPrincipal(principal, randomValue);

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
			name: "ic-identity-storage", // Key name in localStorage
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				jwt_token: state.jwt_token,
				principal: state.principal,
				connected: state.connected,
				identityProfile: state.identityProfile,
			}),
		}
	)
);

export const useIcLastConnectedWalletStore = create(
	persist<{
		lastConnectedWallet?: Connector | undefined;
		setLastConnectedWallet: (lastConnectedWallet?: Connector) => void;
	}>(
		(set) => ({
			lastConnectedWallet: undefined,
			setLastConnectedWallet: (lastConnectedWallet?: Connector) => {
				set({ lastConnectedWallet });
			},
		}),
		{
			name: "ic-last-connected-wallet-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

const login2ByPrincipal = async (
	principal: string,
	existingRandom?: string
): Promise<string | undefined> => {
	if (!principal) return;

	let random = existingRandom;
	if (!random) {
		const actorCreator = window.icConnector?.createActor;
		if (!actorCreator) {
			return undefined;
		}

		try {
			random = await get_generate_random(
				actorCreator,
				getChainICCoreCanisterId().toText()
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
