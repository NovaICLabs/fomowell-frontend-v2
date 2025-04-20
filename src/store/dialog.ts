import { create } from "zustand";
type SlippageOpen =
	| {
			open: boolean;
			type: "global";
	  }
	| {
			open: boolean;
			type: "single";
			callback?: (args: { slippage: string; autoSlippage: boolean }) => void;
			autoSlippage: boolean;
			customSlippage: string;
	  };
export const useDialogStore = create<{
	depositWithdrawOpen: {
		open: boolean;
		type: "deposit" | "withdraw";
	};
	setDepositWithdrawOpen: (depositWithdrawOpen: {
		open: boolean;
		type: "deposit" | "withdraw";
	}) => void;
	slippageOpen: SlippageOpen;
	setSlippageOpen: (slippageOpen: SlippageOpen) => void;
}>((set) => ({
	depositWithdrawOpen: {
		open: false,
		type: "deposit",
	},
	setDepositWithdrawOpen: (depositWithdrawOpen) => {
		set({ depositWithdrawOpen });
	},
	slippageOpen: {
		open: false,
		type: "global",
	},
	setSlippageOpen: (slippageOpen) => {
		set({ slippageOpen });
	},
}));
