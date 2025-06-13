import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";

import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useCKBTCPrice } from "@/hooks/apis/coingecko";
import {
	useBtcMemeCurrentPrice,
	useBtcMemeTokenAllLiquidity,
	useBtcMemeTokenInfo,
	useBtcMemeTokenUserLiquidity,
	// useBtcPreAddLiquidity,
	useBtcPreRemoveLiquidity,
	useBtcRemoveLiquidity,
} from "@/hooks/btc/core";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import { useBtcConnectedIdentity } from "@/hooks/providers/wallet/bitcoin";
import { string2bigint } from "@/lib/common/data/bigint";
import { formatNumberSmart } from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";

const RemoveLiquidity = () => {
	const [removeLiquidityValue, setRemoveLiquidityValue] = useState<string>("");
	const { id } = useTokenChainAndId();
	const { connected } = useBtcConnectedIdentity();
	const { data: ckBtcPrice } = useCKBTCPrice();

	const { data: currentTokenPrice, refetch: refetchCurrentTokenPrice } =
		useBtcMemeCurrentPrice({ id: Number(id) });

	const { data: userLiquidity, refetch: refetchUserLiquidity } =
		useBtcMemeTokenUserLiquidity({
			id: Number(id),
		});

	console.debug("🚀 ~ RemoveLiquidity ~ userLiquidity:", userLiquidity);

	const { data: allLiquidity, refetch: refetchAllLiquidity } =
		useBtcMemeTokenAllLiquidity({ id: Number(id) });
	// console.debug("🚀 ~ RemoveLiquidity ~ allLiquidity:", allLiquidity);

	const { data: memeTokenInfo, refetch: refetchMemeTokenInfo } =
		useBtcMemeTokenInfo(Number(id));

	const { data: preRemoveResult, refetch: refetchPreRemoveResult } =
		useBtcPreRemoveLiquidity({
			id: BigInt(id),
			liquidity: string2bigint(removeLiquidityValue || ""),
		});
	// console.debug("🚀 ~ RemoveLiquidity ~ preResult:", preRemoveResult);

	const { mutateAsync: removeLiquidity, isPending: isRemovePending } =
		useBtcRemoveLiquidity();

	const reloadBalanceAndInfo = useCallback(() => {
		void refetchUserLiquidity();
		void refetchAllLiquidity();
		void refetchCurrentTokenPrice();
		void refetchMemeTokenInfo();

		setRemoveLiquidityValue("");
	}, [
		refetchAllLiquidity,
		refetchCurrentTokenPrice,
		refetchMemeTokenInfo,
		refetchUserLiquidity,
	]);

	const handleRemoveLiquidity = async () => {
		if (!connected) {
			showToast("error", "Please connect wallet first");
			return;
		}

		if (isRemovePending) {
			return;
		}
		if (!preRemoveResult) {
			showToast("error", "Pre remove liquidity failed");
			return;
		}

		try {
			const result = await removeLiquidity({
				id: BigInt(id),
				liquidity: BigInt(removeLiquidityValue || 0),
				nonce: BigInt(preRemoveResult?.nonce || 0),
			});

			console.debug("🚀 ~ handleRemoveLiquidity ~ result:", result);
			showToast("success", "Remove liquidity successful");
			// todo refetch liquidity
			reloadBalanceAndInfo();
		} catch (error) {
			console.error("🚀 ~ handleRemoveLiquidity ~ error:", error);
			showToast("error", "Remove liquidity failed");
		}
	};

	const onChangeInputValue = (percent: number) => {
		if (!userLiquidity) return;

		setRemoveLiquidityValue(
			BigNumber(userLiquidity).times(percent).toFixed(0, 1).toString()
		);
	};

	useEffect(() => {
		void refetchPreRemoveResult();
	}, [refetchPreRemoveResult, removeLiquidityValue]);

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
						{userLiquidity
							? formatNumberSmart(userLiquidity, {
									shortenLarge: true,
									shortZero: true,
								}) || "--"
							: "--"}
					</div>
					<div className="justify-start font-['Albert_Sans'] text-xs leading-none font-normal text-white/60">
						(${" "}
						{userLiquidity &&
							currentTokenPrice &&
							ckBtcPrice &&
							allLiquidity &&
							formatNumberSmart(
								BigNumber(userLiquidity)
									.times(currentTokenPrice?.raw)
									.div(allLiquidity?.k)
									.div(10 ** getCkbtcCanisterToken().decimals)
									.times(ckBtcPrice)
									.toString(),
								{
									shortenLarge: true,
									shortZero: true,
								}
							)}
						)
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
				<p className="text-sm font-normal text-white/40">sats Received</p>
				<p className="text-sm font-normal text-white">
					{preRemoveResult
						? formatNumberSmart(
								// formatUnits(

								// ),
								BigNumber(preRemoveResult?.sats || 0)
									.div(10 ** getCkbtcCanisterToken().decimals)
									.toString(),
								{
									shortenLarge: true,
									shortZero: true,
								}
							)
						: "--"}{" "}
					sats
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
			<Button
				className={cn(
					"mt-5 h-9.5 w-full rounded-full text-lg font-semibold text-white",
					"bg-[#1e1e1e] hover:bg-[#1e1e1e]/80",
					connected &&
						removeLiquidityValue &&
						preRemoveResult &&
						"bg-[#f7b406] text-[#111111] hover:bg-[#f7b406]/80"
				)}
				disabled={
					!connected ||
					!removeLiquidityValue ||
					isRemovePending ||
					!preRemoveResult
				}
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

export default RemoveLiquidity;
