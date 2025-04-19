import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/dialog";

export default function SlippageDialog() {
	const { slippageOpen, setSlippageOpen } = useDialogStore();
	return (
		<Dialog
			open={slippageOpen.open}
			onOpenChange={(open) => {
				setSlippageOpen({
					open,
					type: slippageOpen.type,
				});
			}}
		>
			<DialogContent className="bg-gray-760 h-[435px] w-[500px] rounded-3xl">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-[30px] text-base font-semibold">
							Slippage
						</div>
					</DialogTitle>
					<div className="mt-6.5 flex flex-col gap-6">
						<div className="bg-gray-740 flex h-[109px] flex-col rounded-2xl p-5"></div>
						<div className="bg-gray-740 flex h-[109px] flex-col rounded-2xl p-5"></div>
					</div>
					<div className="mt-6.5 flex w-full justify-end">
						<Button className="h-[42px] w-full rounded-full text-sm font-medium">
							Confirm
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
