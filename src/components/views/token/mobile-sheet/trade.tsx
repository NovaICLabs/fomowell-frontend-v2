import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import Trade, { type TradeTab } from "../right/trade";

export default function TradeSheet({ initialTab }: { initialTab?: TradeTab }) {
	const { tradeOpen, setTradeOpen } = useMobileSheetStore();
	return (
		<Sheet open={tradeOpen} onOpenChange={setTradeOpen}>
			<SheetContent className="w-full" side="bottom">
				<Trade initialTab={initialTab} />
			</SheetContent>
		</Sheet>
	);
}
