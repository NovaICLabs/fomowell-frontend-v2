import { create } from "zustand";
export const useDialogStore = create<{
	depositWithdrawOpen: {
		open: boolean;
		type: "deposit" | "withdraw";
	};
	setDepositWithdrawOpen: (depositWithdrawOpen: {
		open: boolean;
		type: "deposit" | "withdraw";
	}) => void;
	slippageOpen: {
		open: boolean;
		type: "global" | "single";
	};
	setSlippageOpen: (slippageOpen: {
		open: boolean;
		type: "global" | "single";
	}) => void;
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
