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

	btcDepositWithdrawOpen: {
		open: boolean;
		type: "deposit" | "withdraw";
	};
	setBtcDepositWithdrawOpen: (depositWithdrawOpen: {
		open: boolean;
		type: "deposit" | "withdraw";
	}) => void;

	slippageOpen: SlippageOpen;
	setSlippageOpen: (slippageOpen: SlippageOpen) => void;
	icpConnectOpen: boolean;
	setIcpConnectOpen: (icpConnectOpen: boolean) => void;

	btcConnectOpen: boolean;
	setBtcConnectOpen: (btcConnectOpen: boolean) => void;

	// how it works
	howItWorksOpen: boolean;
	setHowItWorksOpen: (howItWorksOpen: boolean) => void;
}>((set) => ({
	depositWithdrawOpen: {
		open: false,
		type: "deposit",
	},
	setDepositWithdrawOpen: (depositWithdrawOpen) => {
		set({ depositWithdrawOpen });
	},
	btcDepositWithdrawOpen: {
		open: false,
		type: "deposit",
	},
	setBtcDepositWithdrawOpen: (btcDepositWithdrawOpen) => {
		set({ btcDepositWithdrawOpen });
	},
	slippageOpen: {
		open: false,
		type: "global",
	},
	setSlippageOpen: (slippageOpen) => {
		set({ slippageOpen });
	},
	icpConnectOpen: false,
	setIcpConnectOpen: (icpConnectOpen) => {
		set({ icpConnectOpen });
	},
	btcConnectOpen: false,
	setBtcConnectOpen: (btcConnectOpen) => {
		set({ btcConnectOpen });
	},
	howItWorksOpen: false,
	setHowItWorksOpen: (howItWorksOpen) => {
		set({ howItWorksOpen });
	},
}));
