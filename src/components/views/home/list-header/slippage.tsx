import SlippageSetting from "@/components/icons/common/slippage-setting";
import { Input } from "@/components/ui/input";
import { slippageRange, validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
import { useQuickBuyStore } from "@/store/quick-buy";
import { isMobile } from "react-device-detect";

export default function Slippage() {
	const {
		amount: flashAmount,
		setAmount: setFlashAmount,
		slippage,
		setSlippage,
	} = useQuickBuyStore();
	const { setSlippageOpen } = useDialogStore();
	return (
		<div className="bg-gray-710 ml-auto flex h-[38px] items-center rounded-full px-4 text-white">
			<img alt="flash" src="/svgs/flash.svg" />
			<span
				className={cn(
					"ml-1.5 text-sm font-medium text-white",
					isMobile && "hidden"
				)}
			>
				Buy
			</span>
			<div className="ml-2 flex h-8 items-center rounded-full bg-gray-800 px-2">
				<img
					alt={"icp-logo"}
					className={cn(isMobile && "h-5 w-5")}
					src={`/svgs/chains/icp.svg`}
				/>
				<Input
					className="h-8 w-15 rounded-full border-none px-1 text-sm font-medium text-white focus-visible:ring-0 sm:w-24 dark:bg-gray-800"
					placeholder="0"
					value={flashAmount}
					onBlur={() => {
						if (flashAmount.endsWith(".")) {
							setFlashAmount(flashAmount.slice(0, -1));
						}
					}}
					onChange={(event) => {
						const value = event.target.value.trim();
						validateInputNumber({
							value,
							callback: setFlashAmount,
						});
					}}
				></Input>
			</div>
			{
				<span
					className={cn(
						"ml-4 text-sm font-medium text-white/60 capitalize",
						isMobile && "hidden"
					)}
				>
					Slippage
				</span>
			}
			<div
				className={cn(
					"relative ml-2 flex h-8 w-[63px] items-center overflow-hidden rounded-full border border-transparent bg-gray-800 pr-3 pl-2",
					Number(slippage) < slippageRange[0] ||
						(Number(slippage) > slippageRange[1] && "border-price-negative"),
					isMobile && "hidden"
				)}
			>
				<Input
					value={slippage}
					className={cn(
						"h-full w-full rounded-full border-none px-1 text-sm font-medium text-white focus-visible:ring-0 dark:bg-gray-800"
					)}
					onBlur={() => {
						if (slippage.endsWith(".")) {
							setSlippage(slippage.slice(0, -1));
						}
						if (
							slippage === "" ||
							Number(slippage) < slippageRange[0] ||
							Number(slippage) > slippageRange[1]
						) {
							setSlippage("1");
						}
					}}
					onChange={(event) => {
						const value = event.target.value.trim();
						validateInputNumber({
							value,
							decimals: 2,
							callback: setSlippage,
						});
					}}
				/>
				<span className="absolute right-2 text-sm font-medium text-white/60">
					%
				</span>
			</div>
			<SlippageSetting
				className="ml-1.5 h-4 w-4 cursor-pointer"
				onClick={() => {
					setSlippageOpen({
						open: true,
						type: "global",
					});
				}}
			/>
		</div>
	);
}
