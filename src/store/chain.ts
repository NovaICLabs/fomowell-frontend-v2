import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const chains = ["base", "bitcoin", "icp"] as const;
export type ChainType = (typeof chains)[number];
export const useChainStore = create(
	persist<{
		chain: ChainType;
		setChain: (chain: ChainType) => void;
	}>(
		(set) => ({
			chain: chains[0],
			setChain: (chain) => {
				set({ chain });
			},
		}),
		{
			name: "chain-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
