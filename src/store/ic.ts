import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Connector } from "@/lib/ic/connectors";

type IcIdentity = {
	principal: string | undefined;
	connected: boolean;
	setPrincipal: (principal?: string) => void;
	setConnected: (connected: boolean) => void;
};

export const useIcIdentityStore = create<IcIdentity>()((set) => ({
	principal: undefined,
	connected: false,
	setPrincipal: (principal?: string) => {
		set({ principal });
	},
	setConnected: (connected: boolean) => {
		set({ connected });
	},
}));

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
