import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import { InfoDetail } from "../right";
export default function InfoSheet() {
	const { infoOpen, setInfoOpen } = useMobileSheetStore();
	return (
		<Sheet open={infoOpen} onOpenChange={setInfoOpen}>
			<SheetContent className="w-full" side="bottom">
				<InfoDetail />
			</SheetContent>
		</Sheet>
	);
}
