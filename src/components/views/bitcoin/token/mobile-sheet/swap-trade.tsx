import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import SwapTrade, { type SwapTradeTab } from "../right/swap-trade";

export default function SwapTradeSheet({
	initialTab,
}: {
	initialTab?: SwapTradeTab;
}) {
	const { swapTradeOpen, setSwapTradeOpen } = useMobileSheetStore();
	return (
		<Sheet open={swapTradeOpen} onOpenChange={setSwapTradeOpen}>
			<SheetContent className="w-full" side="bottom">
				<SwapTrade initialTab={initialTab} />
			</SheetContent>
		</Sheet>
	);
}
