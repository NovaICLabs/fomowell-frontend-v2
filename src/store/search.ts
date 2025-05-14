import { produce } from "immer";
import { create } from "zustand";

import type { ChainType } from "./chain";

type SearchItem = {
	symbol: string;
	logo: string;
	chain: ChainType;
	id: number;
};

type SearchStore = {
	recentSearch: Record<ChainType, Array<SearchItem>>;
	addRecentSearch: (search: SearchItem) => void;
	clearRecentSearch: (chain: ChainType) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
	recentSearch: {
		base: [],
		bitcoin: [],
		icp: [],
	},
	addRecentSearch: (search) => {
		set(
			produce((state: SearchStore) => {
				const chainSearches = state.recentSearch[search.chain];
				const existingIndex = chainSearches.findIndex(
					(item) => item.chain === search.chain && item.id === search.id
				);
				const item = chainSearches[existingIndex];

				if (existingIndex >= 0 && item) {
					chainSearches.splice(existingIndex, 1);
					chainSearches.unshift(item);
				} else {
					chainSearches.unshift(search);
				}
			})
		);
	},
	clearRecentSearch: (chain: ChainType) => {
		set(
			produce((state: SearchStore) => {
				state.recentSearch[chain] = [];
			})
		);
	},
}));
