import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useQuickBuyStore = create(
	persist<{
		amount: string;
		setAmount: (amount: string) => void;
		autoSlippage: boolean;
		setAutoSlippage: (autoSlippage: boolean) => void;
		slippage: string;
		setSlippage: (slippage: string) => void;

		btcAmount: string;
		setBtcAmount: (amount: string) => void;
		autoBtcSlippage: boolean;
		setAutoBtcSlippage: (autoBtcSlippage: boolean) => void;
		btcSlippage: string;
		setBtcSlippage: (btcSlippage: string) => void;
	}>(
		(set) => ({
			amount: "0.5",
			setAmount: (amount) => {
				set({ amount });
			},
			autoSlippage: false,
			setAutoSlippage: (autoSlippage) => {
				set({ autoSlippage });
			},
			slippage: "0.2",
			setSlippage: (slippage) => {
				set({ slippage });
			},

			btcAmount: "0.00001",
			setBtcAmount: (btcAmount) => {
				set({ btcAmount });
			},
			autoBtcSlippage: false,
			setAutoBtcSlippage: (autoBtcSlippage) => {
				set({ autoBtcSlippage });
			},
			btcSlippage: "1",
			setBtcSlippage: (btcSlippage) => {
				set({ btcSlippage });
			},
		}),
		{
			name: "quick-buy",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
