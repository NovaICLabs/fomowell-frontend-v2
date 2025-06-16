import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import Liquidity from "../right/liquidity";

export default function LiquiditySheet() {
	const { liquidityOpen, setLiquidityOpen } = useMobileSheetStore();
	return (
		<Sheet open={liquidityOpen} onOpenChange={setLiquidityOpen}>
			<SheetContent className="w-full" side="bottom">
				<Liquidity />
			</SheetContent>
		</Sheet>
	);
}
