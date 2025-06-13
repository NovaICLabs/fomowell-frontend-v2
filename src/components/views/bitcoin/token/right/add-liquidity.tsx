import { useCallback, useEffect, useRef, useState } from "react";

import BigNumber from "bignumber.js";
import { useDebounce } from "use-debounce";

import {
	getChainBTCCoreCanisterId,
	getCkbtcCanisterId,
	pre_add_liquidity,
	type PreAddLiquidityArgs,
} from "@/canisters/btc_core";
import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useCKBTCPrice } from "@/hooks/apis/coingecko";
import {
	useBtcAddLiquidity,
	useBtcCoreTokenBalance,
	useBtcMemeCurrentPrice,
	useBtcMemeTokenInfo,
	// useBtcPreAddLiquidity,
} from "@/hooks/btc/core";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import { useBtcConnectedIdentity } from "@/hooks/providers/wallet/bitcoin";
import {
	formatNumberSmart,
	// formatUnits,
	getTokenUsdValueTotal,
} from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";

import type { LiquidityAddArg } from "@/canisters/btc_core/index.did.d";

const AddLiquidity = () => {
	const { setBtcDepositWithdrawOpen } = useDialogStore();
	const { id } = useTokenChainAndId();
	const { principal, connected } = useBtcConnectedIdentity();

	const [tokenALiquidityValue, setTokenALiquidityValue] = useState<string>("");
	const [debouncedTokenALiquidityValue] = useDebounce(
		tokenALiquidityValue,
		500
	);

	const [tokenBLiquidityValue, setTokenBLiquidityValue] = useState<string>("");
	const [debouncedTokenBLiquidityValue] = useDebounce(
		tokenBLiquidityValue,
		500
	);

	const [isUpdatingTokenA, setIsUpdatingTokenA] = useState(false);
	const [isUpdatingTokenB, setIsUpdatingTokenB] = useState(false);

	//  price
	const { data: ckBtcPrice } = useCKBTCPrice();
	// balance
	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: { ICRCToken: getCkbtcCanisterId() },
		});
	const { data: memeTokenBalance, refetch: refetchMemeTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: { MemeToken: BigInt(Number(id)) },
		});

	const [preResult, setPreResult] = useState<LiquidityAddArg>();

	const activeInputRef = useRef<"tokenA" | "tokenB" | null>(null);

	const getPreResult = useCallback(
		async (type: "runes" | "sats", value: string) => {
			try {
				const args: PreAddLiquidityArgs = {
					id: BigInt(id),
					runes: undefined,
					sats: undefined,
				};

				if (type === "runes" && value) {
					setIsUpdatingTokenB(true);
					args.runes = BigNumber(value)
						.times(10 ** getCkbtcCanisterToken().decimals)
						.toFixed(0)
						.toString();
				}

				if (type === "sats" && value) {
					setIsUpdatingTokenA(true);
					args.sats = BigNumber(value)
						.times(10 ** getCkbtcCanisterToken().decimals)
						.toString();
				}

				if (!args.runes && !args.sats) return;

				// console.log("🚀 ~ args:", args);

				const result = await pre_add_liquidity(
					getChainBTCCoreCanisterId().toText(),
					args
				);

				if (result) {
					setPreResult(result);
					if (type === "runes") {
						if (activeInputRef.current === "tokenA") {
							setTokenBLiquidityValue(
								BigNumber(result.sats)
									.div(10 ** getCkbtcCanisterToken().decimals)
									.toString()
							);
						}
						setIsUpdatingTokenB(false);
					} else if (type === "sats") {
						if (activeInputRef.current === "tokenB") {
							setTokenALiquidityValue(
								BigNumber(result.runes)
									.div(10 ** getCkbtcCanisterToken().decimals)
									.toString()
							);
						}
						setIsUpdatingTokenA(false);
					}
				}
			} catch (error) {
				console.error("getPreResult error:", error);
			}
		},
		[id]
	);

	useEffect(() => {
		// console.log("🚀 ~ useEffect ~ isUpdatingTokenA:", isUpdatingTokenB);

		if (
			activeInputRef.current === "tokenA" &&
			!isUpdatingTokenB &&
			debouncedTokenALiquidityValue !== ""
		) {
			void getPreResult("runes", debouncedTokenALiquidityValue);
		}
	}, [debouncedTokenALiquidityValue, getPreResult, isUpdatingTokenB]);

	useEffect(() => {
		console.log(
			"🚀 ~ useEffect ~ isUpdatingTokenA:",
			activeInputRef.current,
			isUpdatingTokenA,
			debouncedTokenBLiquidityValue
		);

		if (
			activeInputRef.current === "tokenB" &&
			!isUpdatingTokenA &&
			debouncedTokenBLiquidityValue !== ""
		) {
			void getPreResult("sats", debouncedTokenBLiquidityValue);
		}
	}, [debouncedTokenBLiquidityValue, getPreResult, isUpdatingTokenA]);

	const { data: currentTokenPrice, refetch: refetchCurrentTokenPrice } =
		useBtcMemeCurrentPrice({ id: Number(id) });

	const { data: memeTokenInfo, refetch: refetchMemeTokenInfo } =
		useBtcMemeTokenInfo(Number(id));

	const changeToken1 = (percent: number) => {
		if (!memeTokenBalance || !memeTokenBalance.formatted) return;

		setTokenALiquidityValue(
			BigNumber(memeTokenBalance.raw)
				.div(10 ** memeTokenBalance.decimals)
				.times(percent)
				.toFixed(2)
				.toString()
		);
	};

	const changeToken2 = (percent: number) => {
		if (!coreTokenBalance || !coreTokenBalance.formatted) return;

		setTokenBLiquidityValue(
			BigNumber(coreTokenBalance.raw)
				.div(10 ** coreTokenBalance.decimals)
				.times(percent)
				.toFixed(2)
				.toString()
		);
	};

	const refetchBalanceAndInfo = useCallback(() => {
		void refetchCoreTokenBalance();
		void refetchMemeTokenBalance();

		void refetchMemeTokenInfo();
		void refetchCurrentTokenPrice();
		setTokenALiquidityValue("");
		setTokenBLiquidityValue("");
	}, [
		refetchCoreTokenBalance,
		refetchMemeTokenBalance,
		refetchMemeTokenInfo,
		refetchCurrentTokenPrice,
	]);

	const { mutateAsync: addMutate, isPending } = useBtcAddLiquidity();

	const handleAddLiquidity = async () => {
		console.debug("🚀 ~ AddLiquidity ~ preResult:", preResult);
		if (!connected) {
			showToast("error", "Please connect wallet first");
			return;
		}

		if (isPending) {
			return;
		}
		if (!preResult) {
			return;
		}
		try {
			const result = await addMutate({
				id: BigInt(id),
				nonce: BigInt(preResult.nonce),
				sats: BigInt(preResult.sats),
				runes: BigInt(preResult.runes),
			});
			console.log("🚀 ~ handleAddLiquidity ~ result:", result);

			showToast("success", `Add liquidity successful`);
			// todo refetch liquidity and balance
			refetchBalanceAndInfo();
		} catch (error) {
			console.log("🚀 ~ handleAddLiquidity ~ error:", error);
		}
	};

	const tokenANotEnough =
		!memeTokenBalance ||
		BigNumber(memeTokenBalance.raw)
			.div(10 ** memeTokenBalance.decimals)
			.lt(tokenALiquidityValue);

	const tokenBNotEnough =
		!coreTokenBalance ||
		BigNumber(coreTokenBalance.raw)
			.div(10 ** coreTokenBalance.decimals)
			.lt(tokenBLiquidityValue);

	return (
		<div className="mt-[24px] flex flex-col">
			<div className="mb-6 flex w-full flex-col border-b border-[#262626] pb-6">
				<div className="flex w-full gap-x-2">
					<div className="flex h-[38px] flex-1 items-center justify-between rounded-xl bg-neutral-800 px-[10px]">
						<div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
							<img
								alt={"logo"}
								className="h-full w-full object-cover"
								src={memeTokenInfo?.logo}
							/>
						</div>
						<div className="flex items-center gap-x-1">
							<img
								alt={"logo"}
								className="h-4 w-4 object-cover"
								src={memeTokenInfo?.logo}
							/>
							<div className="justify-start font-['Albert_Sans'] text-sm leading-none font-medium text-white">
								{memeTokenBalance?.formatted}
							</div>
							<div className="justify-start font-['Albert_Sans'] text-xs leading-none font-normal text-white/60">
								($
								{currentTokenPrice &&
									memeTokenBalance &&
									ckBtcPrice &&
									getTokenUsdValueTotal(
										{
											amount: memeTokenBalance?.raw,
										},
										BigNumber(currentTokenPrice.formattedPerPayToken)
											.multipliedBy(ckBtcPrice)
											.div(10 ** getCkbtcCanisterToken().decimals)
											.toNumber()
									)}
								)
							</div>
						</div>
					</div>
					<div
						className="flex h-[38px] w-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 bg-neutral-800"
						onClick={withStopPropagation(() => {
							setBtcDepositWithdrawOpen({ type: "deposit", open: true });
						})}
					>
						<img alt="icon" src="/svgs/liquidity/add.svg" />
					</div>
				</div>
				<div className="mt-3 flex h-[54px] w-full items-center gap-x-1 rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
					<Input
						aria-invalid={connected && tokenANotEnough}
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
							setIsUpdatingTokenA(true);
						}}
						onFocus={() => {
							activeInputRef.current = "tokenA";
						}}
					/>
					<p className="text-lg leading-[14px] font-bold text-white/40">
						{memeTokenInfo?.ticker}
					</p>
				</div>
				<div className="mt-3 flex w-full gap-x-[9px]">
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken1(0.25);
						})}
					>
						25%
					</div>
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken1(0.5);
						})}
					>
						50%
					</div>
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken1(0.75);
						})}
					>
						75%
					</div>
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken1(1);
						})}
					>
						100%
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col">
				<div className="flex w-full gap-x-2">
					<div className="flex h-[38px] flex-1 items-center justify-between rounded-xl bg-neutral-800 px-[10px]">
						<div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
							<img
								alt={"btc-logo"}
								className="h-full w-full object-cover"
								src={"/svgs/chains/bitcoin.svg"}
							/>
						</div>
						<div className="flex items-center gap-x-1">
							<img
								alt={"btc-logo"}
								className="h-4 w-4 object-cover"
								src={"/svgs/chains/bitcoin.svg"}
							/>
							<div className="justify-start font-['Albert_Sans'] text-sm leading-none font-medium text-white">
								{coreTokenBalance?.formatted}
							</div>
							<div className="justify-start font-['Albert_Sans'] text-xs leading-none font-normal text-white/60">
								($
								{coreTokenBalance &&
									ckBtcPrice &&
									getTokenUsdValueTotal(
										{
											amount: coreTokenBalance.raw,
										},
										ckBtcPrice
									)}
								)
							</div>
						</div>
					</div>
					<div
						className="flex h-[38px] w-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 bg-neutral-800"
						onClick={withStopPropagation(() => {
							setBtcDepositWithdrawOpen({ type: "deposit", open: true });
						})}
					>
						<img alt="icon" src="/svgs/liquidity/add.svg" />
					</div>
				</div>
				<div className="mt-3 flex h-[54px] w-full items-center gap-x-1 rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
					<Input
						aria-invalid={connected && tokenBNotEnough}
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
							setIsUpdatingTokenB(true);
						}}
						onFocus={() => {
							activeInputRef.current = "tokenB";
						}}
					/>
					<p className="text-lg leading-[14px] font-bold text-white/40">BTC</p>
				</div>
				<div className="mt-3 flex w-full gap-x-[9px]">
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken2(0.25);
						})}
					>
						25%
					</div>
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken2(0.5);
						})}
					>
						50%
					</div>
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken2(0.75);
						})}
					>
						75%
					</div>
					<div
						className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
						onClick={withStopPropagation(() => {
							changeToken2(1);
						})}
					>
						100%
					</div>
				</div>
			</div>

			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">Total Deposit</p>
				<p className="text-sm font-normal text-white">
					$
					{preResult && ckBtcPrice
						? formatNumberSmart(
								BigNumber(tokenBLiquidityValue)
									.times(ckBtcPrice)
									.times(2)
									.toString(),
								{
									shortenLarge: true,
									shortZero: true,
								}
							)
						: "--"}
				</p>
			</div>
			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">Deposit Ratio</p>
				<p className="text-sm font-normal text-white">50.0% / 50.0%</p>
			</div>
			<Button
				className={cn(
					"mt-5 h-9.5 w-full rounded-full bg-[#1e1e1e] text-lg font-semibold text-white hover:bg-[#1e1e1e]/80",
					tokenALiquidityValue &&
						tokenBLiquidityValue &&
						preResult &&
						connected &&
						"bg-[#f7b406] text-[#111111] hover:bg-[#f7b406]/80"
				)}
				disabled={
					!connected ||
					!tokenALiquidityValue ||
					!tokenBLiquidityValue ||
					!preResult ||
					isPending ||
					tokenANotEnough ||
					tokenBNotEnough
				}
				onClick={handleAddLiquidity}
			>
				Add
				{isPending && (
					<img
						alt="loading"
						className="h-4 w-4 animate-spin"
						src="/svgs/loading.svg"
					/>
				)}
			</Button>
		</div>
	);
};

export default AddLiquidity;
