import { ChevronLeft } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore } from "@/store/ic";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import { BtcAccountInfo } from "../header/connect-button/bitcoin";
import { IcpAccountInfo } from "../header/connect-button/icp";
export default function MenuSheet() {
	const { menuOpen, setMenuOpen } = useMobileSheetStore();
	const { chain } = useChainStore();
	const { connected } = useIcIdentityStore();
	const { setHowItWorksOpen } = useDialogStore();
	return (
		<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
			<SheetContent
				className="w-[360px] pt-5 focus-visible:ring-0 focus-visible:outline-none"
				side="left"
			>
				<div className="flex flex-col justify-start">
					<div
						className={cn(
							"flex w-full items-center justify-between pl-2.5",
							connected && "mb-7.5"
						)}
					>
						<div className={cn("w-[171px]")}>
							{chain === "icp" && <IcpAccountInfo />}
							{chain === "bitcoin" && <BtcAccountInfo />}
						</div>
						<div
							className="bg-gray-760 inline-flex h-10 w-10 flex-shrink-0 rotate-180 items-center justify-center rounded-r-full text-gray-400"
							onClick={() => {
								setMenuOpen(false);
							}}
						>
							<ChevronLeft className="rotate-180" />
						</div>
					</div>
					<div
						className="border-gray-710 flex h-12 items-center border-t border-b text-sm font-medium text-white/60"
						onClick={() => {
							setHowItWorksOpen(true);
						}}
					>
						<div className="px-2.5">How it works</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
