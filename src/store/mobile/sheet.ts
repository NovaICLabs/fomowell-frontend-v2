import { create } from "zustand";
type MobileSheetStore = {
	infoOpen: boolean;
	setInfoOpen: (infoOpen: boolean) => void;
	tradeOpen: boolean;
	setTradeOpen: (tradeOpen: boolean) => void;
	swapTradeOpen: boolean;
	setSwapTradeOpen: (swapTradeOpen: boolean) => void;
	menuOpen: boolean;
	setMenuOpen: (menuOpen: boolean) => void;
};
export const useMobileSheetStore = create<MobileSheetStore>((set) => ({
	infoOpen: false,
	setInfoOpen: (infoOpen) => {
		set({ infoOpen });
	},
	menuOpen: false,
	setMenuOpen: (menuOpen) => {
		set({ menuOpen });
	},
	tradeOpen: false,
	setTradeOpen: (tradeOpen) => {
		set({ tradeOpen });
	},
	// only btc
	swapTradeOpen: false,
	setSwapTradeOpen: (swapTradeOpen) => {
		set({ swapTradeOpen });
	},
}));
