import { useCallback, useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { useDebounce } from "use-debounce";

import { getICPCanisterId } from "@/canisters/icrc3";
import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import SlippageSetting from "@/components/icons/common/slippage-setting";
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
import { slippageRange, validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
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

	const [debouncedSellAmount] = useDebounce(sellAmount, 500);

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
	const [slippage, setSlippage] = useState<string>("1");
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
				buyAmount !== "" &&
				coreTokenBalance?.raw !== undefined &&
				BigNumber(buyAmount).lte(BigNumber(formatUnits(coreTokenBalance.raw)))
			);
		}

		return (
			sellAmount !== "" &&
			memeTokenBalance?.raw !== undefined &&
			BigNumber(sellAmount).lte(
				BigNumber(formatUnits(memeTokenBalance.raw, memeTokenInfo?.decimals))
			)
		);
	}, [
		activeTab,
		buyAmount,
		coreTokenBalance?.raw,
		memeTokenBalance?.raw,
		memeTokenInfo?.decimals,
		sellAmount,
	]);

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
					setBuyAmount("");
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
					setSellAmount("");
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
	const { setSlippageOpen } = useDialogStore();
	const [autoSlippage, setAutoSlippage] = useState<boolean>(false);

	const priceImpactPercent = useMemo(() => {
		if (!currentTokenPrice?.raw || !memeTokenInfo?.decimals) {
			return undefined;
		}

		const currentTokenPriceInICP = BigNumber(1)
			.multipliedBy(10 ** getICPCanisterToken().decimals)
			.div(BigNumber(currentTokenPrice.raw));

		// Avoid division by zero or invalid calculations if price is non-positive
		if (currentTokenPriceInICP.isLessThanOrEqualTo(0)) {
			return "0.00"; // Or handle as undefined/error
		}

		let expectedOutputBigIntNoImpact: BigNumber | undefined;
		let actualOutputUnits: BigNumber | undefined;

		try {
			if (activeTab === "Buy") {
				if (!calculatedBuyReceived?.raw || !debouncedBuyAmountBigInt) {
					return undefined; // Need calculation result and input amount
				}
				const inputAmountICPUnits = BigNumber(debouncedBuyAmountBigInt);
				// Prevent division by zero if input amount is zero
				if (inputAmountICPUnits.isLessThanOrEqualTo(0)) return "0.00";

				expectedOutputBigIntNoImpact = inputAmountICPUnits.div(
					currentTokenPriceInICP
				);
				actualOutputUnits = BigNumber(calculatedBuyReceived.raw);
			} else {
				// Sell
				if (!calculatedSellReceived?.raw || !debouncedSellAmountBigInt) {
					return undefined; // Need calculation result and input amount
				}
				const inputAmountMeme_Units = BigNumber(debouncedSellAmountBigInt);
				// Prevent division by zero if input amount is zero
				if (inputAmountMeme_Units.isLessThanOrEqualTo(0)) return "0.00";

				expectedOutputBigIntNoImpact = inputAmountMeme_Units.times(
					currentTokenPriceInICP
				);
				actualOutputUnits = BigNumber(calculatedSellReceived.raw);
			}

			// Ensure we have valid numbers and avoid division by zero for impact calculation
			if (
				!expectedOutputBigIntNoImpact ||
				!actualOutputUnits ||
				expectedOutputBigIntNoImpact.isLessThanOrEqualTo(0) // Use <= 0 to be safe
			) {
				return "0.00"; // If expected output is zero or less, impact is effectively 0 or N/A
			}

			// Impact = ((Expected - Actual) / Expected) * 100
			const impact = expectedOutputBigIntNoImpact
				.minus(actualOutputUnits)
				.div(expectedOutputBigIntNoImpact)
				.times(100);

			const nonNegativeImpact = BigNumber.max(0, impact);

			// Format to 2 decimal places
			return formatNumberSmart(nonNegativeImpact.toFixed(2));
		} catch (error) {
			console.error("Error calculating price impact:", error);
			return undefined; // Return undefined on calculation error
		}
	}, [
		activeTab,
		currentTokenPrice,
		calculatedBuyReceived,
		calculatedSellReceived,
		debouncedBuyAmountBigInt,
		debouncedSellAmountBigInt,
		memeTokenInfo?.decimals,
	]);
	const priceImpactPercentColor = useMemo(() => {
		if (priceImpactPercent !== undefined) {
			if (Number(priceImpactPercent) > 0) {
				if (Number(priceImpactPercent) > 10) {
					if (Number(priceImpactPercent) > 50) {
						return "text-price-negative";
					} else {
						return "text-yellow-500";
					}
				}
			}
		}
		return "text-white/60";
	}, [priceImpactPercent]);
	return (
		<div className="h-112.5 rounded-[12px] bg-gray-800 px-4 py-5">
			<div className="bg-gray-710 flex h-[38px] items-center gap-2 rounded-[12px] px-2.5">
				<img alt={"icp-logo"} src={`/svgs/chains/icp.svg`} />
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
				placeholder="0.00"
				value={activeTab === "Buy" ? buyAmount : sellAmount}
				aria-invalid={
					!balanceEnough &&
					(activeTab === "Buy" ? buyAmount !== "" : sellAmount !== "")
				}
				className={cn(
					"dark:bg-background mt-1 h-13.5 rounded-2xl border border-transparent text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
				)}
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
					<div
						className={cn(
							"bg-background relative ml-2 flex h-8 w-[63px] items-center overflow-hidden rounded-full border border-transparent pr-3 pl-2",
							Number(slippage) < slippageRange[0] ||
								(Number(slippage) > slippageRange[1] && "border-price-negative")
						)}
					>
						<Input
							value={slippage}
							className={cn(
								"dark:bg-background h-full w-full rounded-full border-none px-1 text-sm font-medium text-white focus-visible:ring-0"
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
						className="ml-2"
						onClick={() => {
							setSlippageOpen({
								open: true,
								type: "single",
								callback: (args) => {
									setSlippage(args.slippage);
									setAutoSlippage(args.autoSlippage);
								},
								autoSlippage,
								customSlippage: slippage,
							});
						}}
					/>
				</div>
				<div className="text-sm">
					<span className={cn(priceImpactPercentColor)}>
						{priceImpactPercent !== undefined
							? `-${priceImpactPercent}%`
							: "--%"}
					</span>
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
			<div className="mt-4 hidden items-center space-x-2">
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
