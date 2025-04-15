import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { exampleImage } from "@/lib/common/img";
const percentages = [25, 50, 75, 100];
export default function Trade() {
	return (
		<div className="h-112.5 rounded-[12px] bg-gray-800 px-4 py-5">
			<div className="bg-gray-710 flex h-[38px] items-center gap-2 rounded-[12px] px-2.5">
				<img alt="logo" className="h-6 w-6 rounded-full" src={exampleImage} />
				<span className="text-sm font-medium">Kitty</span>
				<div className="ml-auto flex items-center gap-1">
					<span className="font-medium">3,346,894.6500</span>
					<span className="text-xs text-white/60">($10)</span>
				</div>
			</div>
			<div className="mt-4 flex justify-between gap-2">
				<button className="bg-gray-710 hover:bg-gray-710/80 h-[38px] w-[152px] rounded-[19px] px-2.5 py-1.5 text-sm font-medium">
					Buy
				</button>
				<button className="bg-price-negative hover:bg-price-negative/80 h-[38px] w-[152px] rounded-[19px] px-2.5 py-1.5 text-sm font-medium">
					Sell
				</button>
			</div>
			<Input
				className="dark:bg-background mt-4 h-13.5 rounded-2xl border-white/10 text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:ring-0"
				placeholder="0.00"
			/>
			<div className="mt-4 flex gap-2">
				{percentages.map((percentage) => (
					<Button
						key={percentage}
						className="bg-gray-710 hover:bg-gray-710/70 h-9 w-[82px] flex-shrink-0 rounded-2xl text-sm font-medium text-white"
					>
						{percentage}%
					</Button>
				))}
			</div>
			<div className="mt-5 flex justify-between gap-2">
				<div className="text-sm leading-[18px] font-normal text-white/40">
					Max Tokens Received
				</div>
				<div className="text-sm font-medium">
					<span className="text-white">0.00</span>{" "}
					<span className="text-xs text-white/60 uppercase">Kitty</span>
				</div>
			</div>
			<div className="mt-5 flex items-center justify-between">
				<div className="flex items-center gap-1">
					<span className="text-sm leading-[18px] font-normal text-white/40">
						Slippage
					</span>
					<Input
						className="dark:bg-background ml-2 h-8 w-15 rounded-2xl border-white/10 text-sm font-semibold placeholder:text-sm placeholder:font-semibold placeholder:text-white/40 focus-visible:ring-0"
						placeholder="1.5%"
					/>
					<img
						alt="settings"
						className="h-4 w-4 cursor-pointer"
						src={"/svgs/slippage-setting.svg"}
					/>
				</div>
				<div className="text-sm">
					<span className="text-white">0.00%</span>
				</div>
			</div>
			<Button className="bg-price-positive hover:bg-price-positive/80 mt-5 h-9.5 w-full rounded-full text-lg font-semibold text-white">
				Buy
			</Button>
			<div className="mt-4 flex items-center space-x-2">
				<Checkbox id="post-x" />
				<label
					className="cursor-pointer text-xs leading-none font-medium text-white/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					htmlFor="post-x"
				>
					Post on X
				</label>
			</div>
		</div>
	);
}
