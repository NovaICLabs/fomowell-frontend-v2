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
}>((set) => ({
	depositWithdrawOpen: {
		open: false,
		type: "deposit",
	},
	setDepositWithdrawOpen: (depositWithdrawOpen) => {
		set({ depositWithdrawOpen });
	},
}));
