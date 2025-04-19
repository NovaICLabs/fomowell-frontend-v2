import { useCallback, useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { useDebounce } from "use-debounce";

import { getICPCanisterId } from "@/canisters/icrc3";
import IcpLogo from "@/components/icons/logo/icp";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useICPPrice } from "@/hooks/apis/coingecko";
import {
	useBuy,
	useCalculateBuy,
	useCalculateSell,
	useCoreTokenBalance,
	useCurrentPrice,
	useMemeTokenInfo,
	useSell,
} from "@/hooks/ic/core";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
	parseUnits,
} from "@/lib/common/number";
import { validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
const percentages = [25, 50, 75, 100];
const tabs = ["Buy", "Sell"] as const;
type Tab = (typeof tabs)[number];
export default function Trade() {
	const { id } = useParams({ from: "/icp/token/$id" });
	const { principal } = useConnectedIdentity();
	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useCoreTokenBalance({
			owner: principal,
			token: { ICRCToken: getICPCanisterId() },
		});

	// price
	const { data: icpPrice } = useICPPrice();
	const { data: currentTokenPrice, refetch: refetchCurrentTokenPrice } =
		useCurrentPrice({ id: Number(id) });

	// tab
	const [activeTab, setActiveTab] = useState<Tab>("Buy");

	// meme token
	const { data: memeTokenInfo } = useMemeTokenInfo(Number(id));
	const { data: memeTokenBalance, refetch: refetchMemeTokenBalance } =
		useCoreTokenBalance({
			owner: principal,
			token: { MemeToken: BigInt(Number(id)) },
		});
	const [buyAmount, setBuyAmount] = useState<string>("");
	const [debouncedBuyAmount] = useDebounce(buyAmount, 500);

	const [sellAmount, setSellAmount] = useState<string>("");
	console.debug("🚀 ~ Trade ~ sellAmount:", sellAmount);
	const [debouncedSellAmount] = useDebounce(sellAmount, 500);
	console.debug(
		"🚀 ~ Trade ~ debouncedSellAmount:",
		Number(debouncedSellAmount)
	);
	const debouncedBuyAmountBigInt = useMemo(() => {
		if (debouncedBuyAmount === "") {
			return undefined;
		}
		return isNaN(Number(debouncedBuyAmount))
			? undefined
			: BigInt(parseUnits(debouncedBuyAmount, memeTokenInfo?.decimals));
	}, [debouncedBuyAmount, memeTokenInfo?.decimals]);
	const debouncedSellAmountBigInt = useMemo(() => {
		if (debouncedSellAmount === "") {
			return undefined;
		}
		return isNaN(Number(debouncedSellAmount))
			? undefined
			: BigInt(parseUnits(debouncedSellAmount, memeTokenInfo?.decimals));
	}, [debouncedSellAmount, memeTokenInfo?.decimals]);
	const { data: calculatedBuyReceived, isFetching: isCalculatingBuy } =
		useCalculateBuy({
			amount: debouncedBuyAmountBigInt,
			id: Number(id),
			enabled: activeTab === "Buy",
		});

	const { data: calculatedSellReceived, isFetching: isCalculatingSell } =
		useCalculateSell({
			amount: debouncedSellAmountBigInt,
			id: Number(id),
			enabled: activeTab === "Sell",
		});

	// slippage
	const [slippage, setSlippage] = useState<string>("1.5");
	const minTokenReceived = useMemo(() => {
		switch (activeTab) {
			case "Buy":
				if (isCalculatingBuy || !calculatedBuyReceived) {
					return undefined;
				}
				return BigInt(
					BigNumber(calculatedBuyReceived?.raw)
						.multipliedBy(BigNumber(100).minus(Number(slippage)).div(100))
						.toFixed(0)
				);
			case "Sell":
				if (isCalculatingSell || !calculatedSellReceived) {
					return undefined;
				}
				return BigInt(
					BigNumber(calculatedSellReceived?.raw)
						.multipliedBy(BigNumber(100).minus(Number(slippage)).div(100))
						.toFixed(0)
				);
		}
	}, [
		activeTab,
		calculatedBuyReceived,
		calculatedSellReceived,
		isCalculatingBuy,
		isCalculatingSell,
		slippage,
	]);
	// min token received
	const balanceEnough = useMemo(() => {
		if (activeTab === "Buy") {
			return (
				debouncedBuyAmountBigInt !== undefined &&
				coreTokenBalance?.raw !== undefined &&
				debouncedBuyAmountBigInt <= coreTokenBalance.raw
			);
		}

		return (
			debouncedSellAmountBigInt !== undefined &&
			memeTokenBalance?.raw !== undefined &&
			debouncedSellAmountBigInt <= memeTokenBalance.raw
		);
	}, [
		activeTab,
		coreTokenBalance,
		debouncedBuyAmountBigInt,
		debouncedSellAmountBigInt,
		memeTokenBalance,
	]);
	console.debug(
		"🚀 ~ balanceEnough ~ debouncedSellAmountBigInt:",
		debouncedSellAmountBigInt
	);
	console.debug(
		"🚀 ~ balanceEnough ~ memeTokenBalance:",
		memeTokenBalance?.raw
	);

	const { mutateAsync: buy, isPending: isBuying } = useBuy();
	const { mutateAsync: sell, isPending: isSelling } = useSell();
	const buttonDisabled = useMemo(() => {
		return (
			!balanceEnough ||
			(activeTab === "Buy" && !debouncedBuyAmountBigInt) ||
			(activeTab === "Sell" && !debouncedSellAmountBigInt) ||
			minTokenReceived === undefined ||
			isCalculatingBuy ||
			isCalculatingSell ||
			isBuying ||
			isSelling
		);
	}, [
		activeTab,
		balanceEnough,
		debouncedBuyAmountBigInt,
		debouncedSellAmountBigInt,
		isCalculatingBuy,
		isCalculatingSell,
		isBuying,
		isSelling,
		minTokenReceived,
	]);
	const refetchBalance = useCallback(() => {
		void refetchCoreTokenBalance();
		void refetchMemeTokenBalance();
	}, [refetchCoreTokenBalance, refetchMemeTokenBalance]);

	const handleConfirm = useCallback(async () => {
		if (
			isCalculatingBuy ||
			isCalculatingSell ||
			minTokenReceived === undefined ||
			slippage === ""
		) {
			return;
		}
		switch (activeTab) {
			case "Buy":
				if (debouncedBuyAmountBigInt) {
					const result = await buy({
						amount: debouncedBuyAmountBigInt,
						id: BigInt(id),
						slippage: Number(slippage),
					});
					showToast(
						"success",
						`${formatNumberSmart(formatUnits(result.toString(), memeTokenInfo?.decimals))} ${memeTokenInfo?.ticker.toUpperCase()} received`
					);
					refetchBalance();
					void refetchCurrentTokenPrice();
				} else {
					throw new Error("Invalid amount");
				}
				break;
			case "Sell":
				if (debouncedSellAmountBigInt) {
					const result = await sell({
						amount: debouncedSellAmountBigInt,
						id: BigInt(id),
						slippage: Number(slippage),
					});
					showToast(
						"success",
						`${formatNumberSmart(formatUnits(result))} ${"ICP"} received`
					);
					refetchBalance();
					void refetchCurrentTokenPrice();
				}
		}
	}, [
		isCalculatingBuy,
		isCalculatingSell,
		minTokenReceived,
		slippage,
		activeTab,
		debouncedBuyAmountBigInt,
		debouncedSellAmountBigInt,
		buy,
		id,
		memeTokenInfo?.decimals,
		memeTokenInfo?.ticker,
		refetchBalance,
		refetchCurrentTokenPrice,
		sell,
	]);
	const setPercentage = useCallback(
		(percentage: number) => {
			switch (activeTab) {
				case "Buy":
					if (coreTokenBalance) {
						setBuyAmount(
							formatUnits(
								BigNumber(coreTokenBalance.raw)
									.multipliedBy(percentage / 100)
									.toFixed(0)
							).toString()
						);
					}
					break;
				case "Sell":
					if (memeTokenBalance) {
						if (percentage === 100) {
							setSellAmount(
								formatUnits(
									memeTokenBalance.raw,
									memeTokenInfo?.decimals
								).toString()
							);
						} else {
							setSellAmount(
								formatUnits(
									BigNumber(memeTokenBalance.raw)
										.multipliedBy(percentage / 100)
										.toFixed(0)
								).toString()
							);
						}
					}
					break;
			}
		},
		[activeTab, coreTokenBalance, memeTokenBalance, memeTokenInfo?.decimals]
	);
	return (
		<div className="h-112.5 rounded-[12px] bg-gray-800 px-4 py-5">
			<div className="bg-gray-710 flex h-[38px] items-center gap-2 rounded-[12px] px-2.5">
				<IcpLogo className="h-6 w-6 rounded-full" />
				<span className="text-sm font-medium">ICP</span>
				<div className="ml-auto flex items-center gap-1">
					<span className="font-medium">{coreTokenBalance?.formatted}</span>
					<span className="text-xs text-white/60">
						($
						{coreTokenBalance && icpPrice
							? getTokenUsdValueTotal(
									{
										amount: coreTokenBalance.raw,
									},
									icpPrice
								)
							: "--"}
						)
					</span>
				</div>
			</div>
			<div className="mt-4 flex justify-between gap-2">
				{tabs.map((tab) => (
					<button
						key={tab}
						className={cn(
							"bg-gray-710 hover:bg-gray-710/80 h-[38px] w-[152px] rounded-[19px] px-2.5 py-1.5 text-sm font-medium",
							activeTab === tab &&
								(tab === "Buy"
									? "bg-price-positive hover:bg-price-positive/80"
									: "bg-price-negative hover:bg-price-negative/80")
						)}
						onClick={() => {
							setActiveTab(tab);
						}}
					>
						{tab}
					</button>
				))}
			</div>
			<div className="mt-4 text-end text-sm font-medium">
				<span className="font-normal text-white/60">Balance:</span>{" "}
				<span className="font-medium">
					{activeTab === "Buy"
						? coreTokenBalance?.formatted
						: memeTokenBalance?.formatted}
				</span>
				<span className="text-xs text-white/60">
					{" "}
					($
					{activeTab === "Buy"
						? coreTokenBalance &&
							icpPrice &&
							getTokenUsdValueTotal(
								{
									amount: coreTokenBalance.raw,
								},
								icpPrice
							)
						: currentTokenPrice &&
							memeTokenBalance &&
							icpPrice &&
							getTokenUsdValueTotal(
								{
									amount: memeTokenBalance?.raw,
								},
								BigNumber(currentTokenPrice.formattedPerPayToken)
									.multipliedBy(icpPrice)
									.toNumber()
							)}
					)
				</span>
			</div>
			<Input
				className="dark:bg-background mt-1 h-13.5 rounded-2xl border-white/10 text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:ring-0"
				placeholder="0.00"
				value={activeTab === "Buy" ? buyAmount : sellAmount}
				onBlur={() => {
					if (activeTab === "Buy") {
						setBuyAmount(
							buyAmount.endsWith(".") ? buyAmount.slice(0, -1) : buyAmount
						);
					} else {
						setSellAmount(
							sellAmount.endsWith(".") ? sellAmount.slice(0, -1) : sellAmount
						);
					}
				}}
				onChange={(event) => {
					const value = event.target.value.trim();
					validateInputNumber({
						value,
						callback: activeTab === "Buy" ? setBuyAmount : setSellAmount,
					});
				}}
			/>
			<div className="mt-4 flex gap-2">
				{percentages.map((percentage) => (
					<Button
						key={percentage}
						className="bg-gray-710 hover:bg-gray-710/70 h-9 w-[82px] flex-shrink-0 rounded-2xl text-sm font-medium text-white"
						onClick={() => {
							setPercentage(percentage);
						}}
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
					<span className="text-white">
						{activeTab === "Buy"
							? (calculatedBuyReceived?.formatted ?? "--")
							: (calculatedSellReceived?.formatted ?? "--")}
					</span>{" "}
					<span className="text-xs text-white/60 uppercase">
						{activeTab === "Buy" ? memeTokenInfo?.ticker : "ICP"}
					</span>
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
						value={slippage}
						onChange={(event) => {
							const value = event.target.value.trim();
							validateInputNumber({
								value,
								callback: setSlippage,
							});
						}}
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
			<Button
				disabled={buttonDisabled}
				className={cn(
					"mt-5 h-9.5 w-full rounded-full text-lg font-semibold text-white",
					activeTab === "Buy" && "bg-price-positive hover:bg-price-positive/80",
					activeTab === "Sell" && "bg-price-negative hover:bg-price-negative/80"
				)}
				onClick={handleConfirm}
			>
				{activeTab}{" "}
				{(isBuying || isSelling) && (
					<img
						alt="loading"
						className="h-4 w-4 animate-spin"
						src="/svgs/loading.svg"
					/>
				)}
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
