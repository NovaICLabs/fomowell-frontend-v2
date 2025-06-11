import { useCallback, useMemo, useState } from "react";

import BigNumber from "bignumber.js";
import { isMobile } from "react-device-detect";
import { useDebounce } from "use-debounce";

import { getCkbtcCanisterId } from "@/canisters/btc_core";
import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import DepositPlus from "@/components/icons/common/deposit-plus";
import SlippageSetting from "@/components/icons/common/slippage-setting";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useCKBTCPrice } from "@/hooks/apis/coingecko";
import {
	useBtcBuy,
	useBtcCalculateBuy,
	useBtcCalculateSell,
	useBtcCoreTokenBalance,
	useBtcMemeCurrentPrice,
	useBtcMemeTokenInfo,
	useBtcSell,
} from "@/hooks/btc/core";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import { useBtcConnectedIdentity } from "@/hooks/providers/wallet/bitcoin";
import { getAvatar } from "@/lib/common/avatar";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
	parseUnits,
} from "@/lib/common/number";
import { slippageRange, validateInputNumber } from "@/lib/common/validate";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";

const percentages = [25, 50, 75, 100];
const tabs = ["Buy", "Sell"] as const;
export type TradeTab = (typeof tabs)[number];

const buyRange = [0.0001, Infinity] as const;
const sellRange = [0.1, Infinity] as const;

export default function Trade({ initialTab }: { initialTab?: TradeTab }) {
	const { id } = useTokenChainAndId();

	const { principal } = useBtcConnectedIdentity();
	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: { ICRCToken: getCkbtcCanisterId() },
		});

	// price
	const { data: btcPrice } = useCKBTCPrice();
	const { data: currentTokenPrice, refetch: refetchCurrentTokenPrice } =
		useBtcMemeCurrentPrice({ id: Number(id) });

	// tab
	const [activeTab, setActiveTab] = useState<TradeTab>(initialTab ?? "Buy");

	// meme token
	const { data: memeTokenInfo, refetch: refetchMemeTokenInfo } =
		useBtcMemeTokenInfo(Number(id));
	const { data: memeTokenBalance, refetch: refetchMemeTokenBalance } =
		useBtcCoreTokenBalance({
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
		useBtcCalculateBuy({
			amount: debouncedBuyAmountBigInt,
			id: Number(id),
			enabled: activeTab === "Buy" && debouncedBuyAmountBigInt !== undefined,
		});

	const { data: calculatedSellReceived, isFetching: isCalculatingSell } =
		useBtcCalculateSell({
			amount: debouncedSellAmountBigInt,
			id: Number(id),
			enabled: activeTab === "Sell" && debouncedSellAmountBigInt !== undefined,
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

	// buy range
	const amountValid = useMemo(() => {
		switch (activeTab) {
			case "Buy":
				return (
					BigNumber(buyAmount).isEqualTo(BigNumber(0)) ||
					(BigNumber(buyAmount).gte(BigNumber(buyRange[0])) &&
						BigNumber(buyAmount).lte(BigNumber(buyRange[1])))
				);
			case "Sell":
				return (
					BigNumber(sellAmount).isEqualTo(BigNumber(0)) ||
					(BigNumber(sellAmount).gte(BigNumber(sellRange[0])) &&
						BigNumber(sellAmount).lte(BigNumber(sellRange[1])))
				);
		}
	}, [activeTab, buyAmount, sellAmount]);

	const { mutateAsync: buy, isPending: isBuying } = useBtcBuy();
	const { mutateAsync: sell, isPending: isSelling } = useBtcSell();
	const buttonDisabled = useMemo(() => {
		return (
			!balanceEnough ||
			(activeTab === "Buy" && !debouncedBuyAmountBigInt) ||
			(activeTab === "Sell" && !debouncedSellAmountBigInt) ||
			minTokenReceived === undefined ||
			isCalculatingBuy ||
			isCalculatingSell ||
			isBuying ||
			isSelling ||
			!amountValid
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
		amountValid,
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
		try {
			switch (activeTab) {
				case "Buy":
					if (debouncedBuyAmountBigInt) {
						const { is_completed, amount_out } = await buy({
							amount: debouncedBuyAmountBigInt,
							id: BigInt(id),
							amount_out_min: minTokenReceived,
						});
						showToast(
							"success",
							`${formatNumberSmart(formatUnits(amount_out, memeTokenInfo?.decimals))} ${memeTokenInfo?.ticker.toUpperCase()} received`
						);
						// refetch meme token info
						if (is_completed) {
							void refetchMemeTokenInfo();
						}
					} else {
						throw new Error("Invalid amount");
					}
					break;
				case "Sell":
					if (debouncedSellAmountBigInt) {
						const result = await sell({
							amount: debouncedSellAmountBigInt,
							id: BigInt(id),
							amount_out_min: minTokenReceived,
						});
						showToast(
							"success",
							`${formatNumberSmart(formatUnits(result))} ${"BTC"} received`
						);
					}
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.debug("error", error);
			if (
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				error.message.indexOf("Failed to fetch") !== -1 ||
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				error.message.indexOf("response could not be found") !== -1
			) {
				// Plug error
				showToast(
					"error",
					`Network error. Please refresh the page or reconnect your wallet.`
				);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			} else if (error.message.indexOf("Slippage exceeded") !== -1) {
				showToast("error", `Slippage exceeded`);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			} else if (error.message.indexOf("is out of cycles") !== -1) {
				showToast("error", `Cycles insufficient`);
			} else {
				showToast("error", `Failed to ${activeTab.toLowerCase()} token`);
			}
		} finally {
			refetchBalance();
			void refetchCurrentTokenPrice();
			setBuyAmount("");
			setSellAmount("");
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
		refetchMemeTokenInfo,
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

		const currentTokenPriceInBTC = BigNumber(1)
			.multipliedBy(10 ** getCkbtcCanisterToken().decimals)
			.div(BigNumber(currentTokenPrice.raw));

		// Avoid division by zero or invalid calculations if price is non-positive
		if (currentTokenPriceInBTC.isLessThanOrEqualTo(0)) {
			return "0.00"; // Or handle as undefined/error
		}

		let expectedOutputBigIntNoImpact: BigNumber | undefined;
		let actualOutputUnits: BigNumber | undefined;

		try {
			if (activeTab === "Buy") {
				if (!calculatedBuyReceived?.raw || !debouncedBuyAmountBigInt) {
					return undefined; // Need calculation result and input amount
				}
				const inputAmountBTCUnits = BigNumber(debouncedBuyAmountBigInt);
				// Prevent division by zero if input amount is zero
				if (inputAmountBTCUnits.isLessThanOrEqualTo(0)) return "0.00";

				expectedOutputBigIntNoImpact = inputAmountBTCUnits.div(
					currentTokenPriceInBTC
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
					currentTokenPriceInBTC
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

	// deposit
	const { setDepositWithdrawOpen } = useDialogStore();
	return (
		<div className="rounded-[12px] bg-gray-800 px-4 py-5">
			<div className="bg-gray-710 flex h-[38px] items-center gap-2 rounded-[12px] px-2.5">
				<img
					alt={"avatar"}
					className="h-6 w-6 rounded-full"
					src={getAvatar(principal ?? "")}
				/>
				<span className="text-sm font-medium">
					{truncatePrincipal(principal ?? "")}
				</span>
				<div className="ml-auto flex items-center gap-1">
					<img
						alt={"btc-logo"}
						className="h-6 w-6"
						src={`/svgs/chains/bitcoin.svg`}
					/>
					<span className="font-medium">{coreTokenBalance?.formatted}</span>
					<DepositPlus
						className={cn("h-4 w-4 cursor-pointer", isMobile && "hidden")}
						onClick={() => {
							setDepositWithdrawOpen({
								open: true,
								type: "deposit",
							});
						}}
					/>
				</div>
			</div>
			<div className="mt-4 flex justify-between gap-2">
				{tabs.map((tab) => (
					<Button
						key={tab}
						className={cn(
							"bg-gray-710 hover:bg-gray-710/80 h-8 w-[158px] rounded-[19px] px-2.5 py-1.5 text-sm font-medium text-white",
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
					</Button>
				))}
			</div>
			<div className="mt-4 flex items-center justify-between px-2 text-end text-sm font-medium">
				<span className="font-normal text-white/60">Balance:</span>{" "}
				<div className="flex items-center">
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
								btcPrice &&
								getTokenUsdValueTotal(
									{
										amount: coreTokenBalance.raw,
									},
									btcPrice
								)
							: currentTokenPrice &&
								memeTokenBalance &&
								btcPrice &&
								getTokenUsdValueTotal(
									{
										amount: memeTokenBalance?.raw,
									},
									BigNumber(currentTokenPrice.formattedPerPayToken)
										.multipliedBy(btcPrice)
										.toNumber()
								)}
						)
					</span>
				</div>
			</div>
			<div className="relative mt-2 h-13.5 w-full">
				<Input
					placeholder="0.00"
					value={activeTab === "Buy" ? buyAmount : sellAmount}
					aria-invalid={
						(!balanceEnough || !amountValid) &&
						(activeTab === "Buy" ? buyAmount !== "" : sellAmount !== "")
					}
					className={cn(
						"dark:bg-background h-full w-full rounded-2xl border border-transparent text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:border-transparent focus-visible:ring-0"
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
				<div className="absolute top-1/2 right-2 -translate-y-1/2 text-[18px] font-bold text-white/40 uppercase">
					{activeTab === "Buy" ? "BTC" : memeTokenInfo?.ticker}
				</div>
			</div>
			<div className="mt-4 grid grid-cols-4 gap-2">
				{percentages.map((percentage) => (
					<Button
						key={percentage}
						className="bg-gray-710 hover:bg-gray-710/70 h-9 w-full flex-shrink-0 rounded-[18px] text-sm font-medium text-white"
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
						{activeTab === "Buy" ? memeTokenInfo?.ticker : "BTC"}
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
