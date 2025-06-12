import { useCallback, useMemo, useState } from "react";

import BigNumber from "bignumber.js";

import { getCkbtcCanisterId } from "@/canisters/btc_core";
import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useCKBTCPrice, useSatsPrice } from "@/hooks/apis/coingecko";
import {
	useBtcAddLiquidity,
	useBtcCoreTokenBalance,
	useBtcMemeCurrentPrice,
	useBtcMemeTokenInfo,
	useBtcPreAddLiquidity,
	useBtcPreRemoveLiquidity,
	useBtcRemoveLiquidity,
} from "@/hooks/btc/core";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import { useBtcConnectedIdentity } from "@/hooks/providers/wallet/bitcoin";
import { formatNumberSmart, getTokenUsdValueTotal } from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";

const AddLiquidity = () => {
	const { setBtcDepositWithdrawOpen } = useDialogStore();
	const { id } = useTokenChainAndId();
	const { principal } = useBtcConnectedIdentity();

	const [tokenALiquidityValue, setTokenALiquidityValue] = useState<string>("");
	const [tokenBLiquidityValue, setTokenBLiquidityValue] = useState<string>("");
	//  price
	const { data: ckBtcPrice } = useCKBTCPrice();
	const { data: satsPrice } = useSatsPrice();

	const { data: currentTokenPrice, refetch: refetchCurrentTokenPrice } =
		useBtcMemeCurrentPrice({ id: Number(id) });

	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: { ICRCToken: getCkbtcCanisterId() },
		});

	const { data: memeTokenInfo, refetch: refetchMemeTokenInfo } =
		useBtcMemeTokenInfo(Number(id));
	const { data: memeTokenBalance, refetch: refetchMemeTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: { MemeToken: BigInt(Number(id)) },
		});

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
	}, [
		refetchCoreTokenBalance,
		refetchMemeTokenBalance,
		refetchMemeTokenInfo,
		refetchCurrentTokenPrice,
	]);

	const { data: preResult } = useBtcPreAddLiquidity({
		id: BigInt(id),
		sats: tokenALiquidityValue
			? BigNumber(tokenALiquidityValue)
					.times(10 ** getCkbtcCanisterToken().decimals)
					.toString()
			: undefined,
		runes: tokenBLiquidityValue ? tokenBLiquidityValue : undefined,
	});

	const { mutateAsync: addMutate, isPending } = useBtcAddLiquidity();

	const handleAddLiquidity = async () => {
		console.debug("🚀 ~ AddLiquidity ~ preResult:", preResult);

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

	const finalTokenAValue = useMemo(() => {
		if (!preResult) {
			return tokenALiquidityValue;
		}

		return preResult.runes.toString();
	}, [preResult, tokenALiquidityValue]);

	const finalTokenBValue = useMemo(() => {
		if (!preResult) {
			return tokenBLiquidityValue;
		}

		return BigNumber(preResult.sats)
			.div(10 ** getCkbtcCanisterToken().decimals)
			.toString();
	}, [preResult, tokenBLiquidityValue]);

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
									satsPrice &&
									getTokenUsdValueTotal(
										{
											amount: memeTokenBalance?.raw,
										},
										BigNumber(currentTokenPrice.formattedPerPayToken)
											.multipliedBy(satsPrice)
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
				<div className="mt-3 flex h-[54px] w-full items-center rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
					<Input
						placeholder="0.00"
						value={finalTokenAValue}
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
				<div className="mt-3 flex h-[54px] w-full items-center rounded-2xl border border-white/10 bg-[#111111] pr-[14px]">
					<Input
						placeholder="0.00"
						value={finalTokenBValue}
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
					{preResult && ckBtcPrice
						? formatNumberSmart(
								BigNumber(finalTokenBValue)
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
						"bg-[#f7b406] text-[#111111] hover:bg-[#f7b406]/80"
				)}
				disabled={
					!tokenALiquidityValue ||
					!tokenBLiquidityValue ||
					!preResult ||
					isPending
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

const RemoveLiquidity = () => {
	const [removeLiquidityValue, setRemoveLiquidityValue] = useState<string>("");
	const { id } = useTokenChainAndId();

	// const { data: cnBtcPrice } = useCKBTCPrice();
	// const { data: satsPrice } = useSatsPrice();

	const { data: memeTokenInfo, refetch: refetchMemeTokenInfo } =
		useBtcMemeTokenInfo(Number(id));

	const { data: preRemoveResult } = useBtcPreRemoveLiquidity({
		id: BigInt(id),
		liquidity: BigInt(removeLiquidityValue || 0),
	});
	console.debug("🚀 ~ RemoveLiquidity ~ preResult:", preRemoveResult);

	const { mutateAsync: removeLiquidity, isPending: isRemovePending } =
		useBtcRemoveLiquidity();

	const reloadBalanceAndInfo = useCallback(() => {
		void refetchMemeTokenInfo();
	}, [refetchMemeTokenInfo]);

	const handleRemoveLiquidity = async () => {
		if (isRemovePending) {
			return;
		}
		if (!preRemoveResult) {
			return;
		}

		try {
			await removeLiquidity({
				id: BigInt(id),
				liquidity: BigInt(removeLiquidityValue || 0),
				nonce: BigInt(preRemoveResult?.nonce || 0),
			});
			showToast("success", "Remove liquidity successful");
			// todo refetch liquidity
			reloadBalanceAndInfo();
		} catch (error) {
			console.log("🚀 ~ handleRemoveLiquidity ~ error:", error);
		}
	};

	const onChangeInputValue = (percent: number) => {
		console.log("🚀 ~ onChangeInputValue ~ percent:", percent);
		// setRemoveLiquidityValue();
	};

	return (
		<div className="mt-[24px] flex flex-col">
			<div className="flex h-[38px] items-center justify-between rounded-xl bg-neutral-800 px-[10px]">
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
				<p className="text-lg leading-[14px] font-bold text-white/40">
					{memeTokenInfo?.ticker}
				</p>
			</div>
			<div className="mt-3 flex w-full gap-x-[9px]">
				<div
					className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
					onClick={withStopPropagation(() => {
						onChangeInputValue(0.25);
					})}
				>
					25%
				</div>
				<div
					className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
					onClick={withStopPropagation(() => {
						onChangeInputValue(0.5);
					})}
				>
					50%
				</div>
				<div
					className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
					onClick={withStopPropagation(() => {
						onChangeInputValue(0.75);
					})}
				>
					75%
				</div>
				<div
					className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[18px] bg-neutral-800 text-sm font-medium text-white"
					onClick={withStopPropagation(() => {
						onChangeInputValue(1);
					})}
				>
					100%
				</div>
			</div>
			<div className="mt-5 flex w-full justify-between">
				<p className="text-sm font-normal text-white/40">BTC Received</p>
				<p className="text-sm font-normal text-white">
					{preRemoveResult
						? formatNumberSmart(
								BigNumber(preRemoveResult?.sats || 0)
									.div(10 ** getCkbtcCanisterToken().decimals)
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
				<p className="text-sm font-normal text-white/40">
					{memeTokenInfo?.ticker} Received
				</p>
				<p className="text-sm font-normal text-white">
					{preRemoveResult
						? formatNumberSmart(
								BigNumber(preRemoveResult?.runes || 0)
									.div(10 ** 8)
									.toString(),
								{
									shortenLarge: true,
									shortZero: true,
								}
							)
						: "--"}
				</p>
			</div>
			<Button
				disabled={!removeLiquidityValue || isRemovePending}
				className={cn(
					"mt-5 h-9.5 w-full rounded-full text-lg font-semibold text-white",
					"bg-[#1e1e1e] hover:bg-[#1e1e1e]/80",
					removeLiquidityValue && "bg-[#f7b406] text-[#111111]"
				)}
				onClick={handleRemoveLiquidity}
			>
				Remove
				{isRemovePending && (
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
