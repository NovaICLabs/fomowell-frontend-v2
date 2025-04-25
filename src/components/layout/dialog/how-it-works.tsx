import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/dialog";
const Circle = () => {
	return (
		<div className="h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500"></div>
	);
};
export default function HowItWorksDialog() {
	const { howItWorksOpen, setHowItWorksOpen } = useDialogStore();
	return (
		<Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
			<DialogContent className="bg-gray-760 w-[501px] rounded-3xl">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-[30px]">How it works</div>
					</DialogTitle>
					<div className="mt-2 flex flex-1 flex-col">
						<p className="leading-6 font-normal text-white">
							Fomowell prevents rugs by making sure that all created tokens are
							safe. Each coin on pump is a fair-launch with no team allocation.
						</p>
						<div className="mt-4 flex flex-col items-start gap-[10px] pb-6 text-white/40">
							<div className="flex items-center gap-[10px]">
								<Circle /> <span>Step 1: Pick a coin that you like.</span>
							</div>
							<div className="flex items-center gap-[10px]">
								<Circle />{" "}
								<span>Step 2: Buy the coin on the bonding curve.</span>
							</div>
							<div className="flex items-center gap-[10px]">
								<Circle />{" "}
								<span>
									Step 3: Sell at any time to lock in your profits or losses.
								</span>
							</div>
							<div className="flex items-center gap-[10px]">
								<Circle />{" "}
								<span>
									Step 4: When enough people buy on the bonding curve, the pool
									reaches a 500 ICP reserve (8 billion meme token was sold out).
								</span>
							</div>
							<div className="flex items-center gap-[10px]">
								<Circle />{" "}
								<span>
									Step 5: 500 ICP and 2 billion meme token will be mirgrated to
									ICPEX and LP will be locked.
								</span>
							</div>
						</div>
						<img
							alt="how-it-works"
							className="absolute right-5 -bottom-6"
							src="/svgs/common/how-it-works-bg.svg"
						/>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
