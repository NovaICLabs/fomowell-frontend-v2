import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useQuickBuyStore = create(
	persist<{
		amount: string;
		setAmount: (amount: string) => void;
		slippage: string;
		setSlippage: (slippage: string) => void;
	}>(
		(set) => ({
			amount: "0.001",
			setAmount: (amount) => {
				set({ amount });
			},
			slippage: "0.2",
			setSlippage: (slippage) => {
				set({ slippage });
			},
		}),
		{
			name: "quick-buy",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
