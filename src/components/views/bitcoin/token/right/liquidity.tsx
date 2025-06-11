import { useState } from "react";

import { Input } from "@/components/ui/input";
import { validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";

const AddLiquidity = () => {
	const [tokenALiquidityValue, setTokenALiquidityValue] = useState<string>("");
	const [tokenBLiquidityValue, setTokenBLiquidityValue] = useState<string>("");

	return (
		<div className="mt-[24px] flex flex-col">
			<div className="mb-6 flex w-full flex-col border-b border-[#262626] pb-6">
				<div className="flex w-full gap-x-2">
					<div className="flex h-[38px] flex-1 items-center justify-between rounded-xl bg-neutral-800 px-[10px]">
						<div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
							<img
								alt={"logo"}
								className="h-full w-full object-cover"
								src={
									"https://image-uploader.sophiamoon231.workers.dev/1747877021103-qghra6pep1k.jpg"
								}
							/>
						</div>
						<div className="flex items-center gap-x-1">
							<img
								alt={"logo"}
								className="h-4 w-4 object-cover"
								src={"/svgs/liquidity/wallet.svg"}
							/>
							<div className="justify-start font-['Albert_Sans'] text-sm leading-none font-medium text-white">
								303.66
							</div>
							<div className="justify-start font-['Albert_Sans'] text-xs leading-none font-normal text-white/60">
								($360.26)
							</div>
						</div>
					</div>
					<div className="flex h-[38px] w-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 bg-neutral-800">
						<img alt="icon" src="/svgs/liquidity/add.svg" />
					</div>
				</div>
				<div className="mt-3 flex h-[54px] w-full items-center rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
					<Input
						placeholder="0.00"
						value={tokenALiquidityValue}
						className={cn(
							"dark:bg-background h-full w-full rounded-2xl border border-transparent text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
						)}
						onBlur={() => {
							setTokenALiquidityValue(
								tokenALiquidityValue.endsWith(".")
									? tokenALiquidityValue.slice(0, -1)
									: tokenALiquidityValue
							);
						}}
						onChange={(event) => {
							const value = event.target.value.trim();
							validateInputNumber({
								value,
								callback: setTokenALiquidityValue,
							});
						}}
					/>
					<p className="text-lg leading-[14px] font-bold text-white/40">
						Kizzy
					</p>
				</div>
				<div className="mt-3 flex w-full gap-x-[9px]">
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						25%
					</div>
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						50%
					</div>
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						75%
					</div>
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						100%
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col">
				<div className="flex w-full gap-x-2">
					<div className="flex h-[38px] flex-1 items-center justify-between rounded-xl bg-neutral-800 px-[10px]">
						<div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
							<img
								alt={"logo"}
								className="h-full w-full object-cover"
								src={
									"https://image-uploader.sophiamoon231.workers.dev/1747877021103-qghra6pep1k.jpg"
								}
							/>
						</div>
						<div className="flex items-center gap-x-1">
							<img
								alt={"logo"}
								className="h-4 w-4 object-cover"
								src={"/svgs/liquidity/wallet.svg"}
							/>
							<div className="justify-start font-['Albert_Sans'] text-sm leading-none font-medium text-white">
								303.66
							</div>
							<div className="justify-start font-['Albert_Sans'] text-xs leading-none font-normal text-white/60">
								($360.26)
							</div>
						</div>
					</div>
					<div className="flex h-[38px] w-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 bg-neutral-800">
						<img alt="icon" src="/svgs/liquidity/add.svg" />
					</div>
				</div>
				<div className="mt-3 flex h-[54px] w-full items-center rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
					<Input
						placeholder="0.00"
						value={tokenBLiquidityValue}
						className={cn(
							"dark:bg-background h-full w-full rounded-2xl border border-transparent text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
						)}
						onBlur={() => {
							setTokenBLiquidityValue(
								tokenBLiquidityValue.endsWith(".")
									? tokenBLiquidityValue.slice(0, -1)
									: tokenBLiquidityValue
							);
						}}
						onChange={(event) => {
							const value = event.target.value.trim();
							validateInputNumber({
								value,
								callback: setTokenBLiquidityValue,
							});
						}}
					/>
					<p className="text-lg leading-[14px] font-bold text-white/40">
						Kizzy
					</p>
				</div>
				<div className="mt-3 flex w-full gap-x-[9px]">
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						25%
					</div>
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						50%
					</div>
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						75%
					</div>
					<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
						100%
					</div>
				</div>
			</div>

			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">Total Deposit</p>
				<p className="text-sm font-normal text-white">-</p>
			</div>
			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">Deposit Ratio</p>
				<p className="text-sm font-normal text-white">-</p>
			</div>
			<div
				className={cn(
					"mt-5 flex h-[38px] w-full cursor-not-allowed items-center justify-center rounded-3xl bg-[#1e1e1e] text-lg font-bold text-white/20",
					tokenALiquidityValue &&
						tokenBLiquidityValue &&
						"bg-[#f7b406] text-[#111111]"
				)}
			>
				Add
			</div>
		</div>
	);
};

const RemoveLiquidity = () => {
	const [removeLiquidityValue, setRemoveLiquidityValue] = useState<string>("");

	return (
		<div className="mt-[24px] flex flex-col">
			<div className="flex h-[38px] items-center justify-between rounded-xl bg-neutral-800 px-[10px]">
				<div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
					<img
						alt={"logo"}
						className="h-full w-full object-cover"
						src={
							"https://image-uploader.sophiamoon231.workers.dev/1747877021103-qghra6pep1k.jpg"
						}
					/>
				</div>
				<div className="flex items-center gap-x-1">
					<img
						alt={"logo"}
						className="h-4 w-4 object-cover"
						src={"/svgs/liquidity/wallet.svg"}
					/>
					<div className="justify-start font-['Albert_Sans'] text-sm leading-none font-medium text-white">
						303.66
					</div>
					<div className="justify-start font-['Albert_Sans'] text-xs leading-none font-normal text-white/60">
						($360.26)
					</div>
				</div>
			</div>

			<div className="mt-3 flex h-[54px] w-full items-center rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
				<Input
					placeholder="0.00"
					value={removeLiquidityValue}
					className={cn(
						"dark:bg-background h-full w-full rounded-2xl border border-transparent text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
					)}
					onBlur={() => {
						setRemoveLiquidityValue(
							removeLiquidityValue.endsWith(".")
								? removeLiquidityValue.slice(0, -1)
								: removeLiquidityValue
						);
					}}
					onChange={(event) => {
						const value = event.target.value.trim();
						validateInputNumber({
							value,
							callback: setRemoveLiquidityValue,
						});
					}}
				/>
				<p className="text-lg leading-[14px] font-bold text-white/40">Kizzy</p>
			</div>
			<div className="mt-3 flex w-full gap-x-[9px]">
				<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
					25%
				</div>
				<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
					50%
				</div>
				<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
					75%
				</div>
				<div className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white">
					100%
				</div>
			</div>
			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">BTC Received</p>
				<p className="text-sm font-normal text-white">-</p>
			</div>
			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">Deposit Ratio</p>
				<p className="text-sm font-normal text-white">-</p>
			</div>
			<div
				className={cn(
					"mt-5 flex h-[38px] w-full cursor-not-allowed items-center justify-center rounded-3xl bg-[#1e1e1e] text-lg font-bold text-white/20",
					removeLiquidityValue && "bg-[#f7b406] text-[#111111]"
				)}
			>
				Remove
			</div>
		</div>
	);
};

export default function Liquidity() {
	const [tab, setTab] = useState<"add" | "remove">("add");

	return (
		<div className="h-[595px] w-[390px] rounded-2xl bg-[#191919] px-[18px] py-[20px]">
			<div className="flex h-[38px] w-full items-center rounded-[21px] bg-[#272727] px-1">
				<div
					className={cn(
						"flex h-[30px] flex-1 cursor-pointer items-center justify-center rounded-[19px] text-base leading-[14px] font-semibold text-white/40 duration-300",
						tab === "add" && "bg-[#f7b406] text-[#111111]"
					)}
					onClick={() => {
						setTab("add");
					}}
				>
					Add
				</div>
				<div
					className={cn(
						"flex h-[30px] flex-1 cursor-pointer items-center justify-center rounded-[19px] text-base leading-[14px] font-semibold text-white/40 duration-300",
						tab === "remove" && "bg-[#f7b406] text-[#111111]"
					)}
					onClick={() => {
						setTab("remove");
					}}
				>
					Remove
				</div>
			</div>

			{tab === "add" && <AddLiquidity />}
			{tab === "remove" && <RemoveLiquidity />}
		</div>
	);
}
