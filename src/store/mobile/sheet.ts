import { create } from "zustand";
type MobileSheetStore = {
	infoOpen: boolean;
	setInfoOpen: (infoOpen: boolean) => void;
	tradeOpen: boolean;
	setTradeOpen: (tradeOpen: boolean) => void;
};
export const useMobileSheetStore = create<MobileSheetStore>((set) => ({
	infoOpen: false,
	setInfoOpen: (infoOpen) => {
		set({ infoOpen });
	},
	tradeOpen: false,
	setTradeOpen: (tradeOpen) => {
		set({ tradeOpen });
	},
}));
