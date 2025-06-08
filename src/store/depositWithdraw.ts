import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PaddingListItem = {
	btcAddress: string;
	txid: string;
	amount: number;
	status: "pending" | "success" | "fail";
	type: "deposit" | "withdraw";
};

export const useDepositWithdrawStore = create(
	persist<{
		hasPadding: boolean;
		setHasPadding: (hasPadding: boolean) => void;
		addPaddingList: (list: PaddingListItem) => void;
		paddingList: Array<PaddingListItem>;
	}>(
		(set) => ({
			hasPadding: false,
			setHasPadding: (hasPadding: boolean) => {
				set({ hasPadding });
			},
			paddingList: [],
			addPaddingList: (list: PaddingListItem) => {
				set((state) => {
					return {
						paddingList: [...state.paddingList, list],
					};
				});
			},
		}),
		{
			name: "deposit-withdraw-padding-store",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
