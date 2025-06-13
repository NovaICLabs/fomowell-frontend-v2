import { useEffect, useMemo, useState } from "react";

import { useParams, useSearch } from "@tanstack/react-router";
import BigNumber from "bignumber.js";

// import { Button } from "@/components/ui/button";
import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
// import { showToast } from "@/components/utils/toast";
import { useCKBTCPrice } from "@/hooks/apis/coingecko";
import { useBtcSingleTokenInfo } from "@/hooks/apis/indexer_btc";
import { useBtcMemeCurrentPrice, useBtcMemeTokenInfo } from "@/hooks/btc/core";
import {
	formatNumberSmart,
	formatUnits,
	isNullOrUndefined,
} from "@/lib/common/number";
import { fromNow } from "@/lib/common/time";
import { cn } from "@/lib/utils";

import Holders from "./holders";
import Liquidity from "./liquidity";
import SwapTrade from "./swap-trade";
import Trade from "./trade";

// import { getCkbtcCanisterId } from "@/canisters/btc_core";
// import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
// import { getSwapUrlByCanisterId } from "@/lib/swap/icpex";

const tabs = ["Trade", "Liquidity"];

const isNegative = (value: number) => {
	return value < 0;
};
export const InfoDetail = () => {
	const { id } = useParams({
		from: `/bitcoin/token/$id`,
	});

	const { data: currentTokenPrice } = useBtcMemeCurrentPrice({
		id: Number(id),
	});
	const { data: memeTokenInfo } = useBtcMemeTokenInfo(Number(id));

	const liquidityBtc = useMemo(() => {
		return memeTokenInfo?.liquidity
			? formatUnits(memeTokenInfo.liquidity)
			: undefined;
	}, [memeTokenInfo]);

	const { data: ckBtcPrice } = useCKBTCPrice();

	const liquidityUSD = useMemo(() => {
		return liquidityBtc && ckBtcPrice
			? BigNumber(liquidityBtc).times(ckBtcPrice).times(2).toString()
			: undefined;
	}, [liquidityBtc, ckBtcPrice]);

	const totalSupply = useMemo(() => {
		return 21_000_000;
	}, []);

	const marketCap = useMemo(() => {
		return currentTokenPrice?.raw && totalSupply && ckBtcPrice
			? BigNumber(currentTokenPrice.raw)
					.div(10 ** getCkbtcCanisterToken().decimals)
					.times(totalSupply)
					.times(ckBtcPrice)
					.toString()
			: undefined;
	}, [currentTokenPrice, totalSupply, ckBtcPrice]);

	return (
		<div className="bg-gray-860 flex flex-col gap-5.5 rounded-[12px] px-4.5 py-5">
			<div className="flex items-center justify-between">
				<span className="text-sm text-white/40">Price</span>
				<span className="text-sm text-white">
					<span className="text-gray-280">
						{isNullOrUndefined(currentTokenPrice?.formattedPerPayToken)
							? "--"
							: formatNumberSmart(currentTokenPrice?.formattedPerPayToken, {
									shortZero: true,
								})}{" "}
						sats
					</span>
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-sm text-white/40">Market Cap:</span>
				<div className="flex items-center gap-1 text-sm text-white">
					<span className="text-white">
						{marketCap ? `$${formatNumberSmart(marketCap)}` : "0"}
					</span>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-sm text-white/40">Liquidity</span>
				<div className="flex items-center gap-1 text-sm text-white">
					<span className="text-white">
						{liquidityUSD ? `$${formatNumberSmart(liquidityUSD)}` : "$0"}
					</span>
					<div className="text-gray-280 flex items-center">
						(
						<img alt={"btc-logo"} src={"/svgs/chains/bitcoin.svg"} />
						<span className="text-gray-280">
							{liquidityBtc ? formatNumberSmart(liquidityBtc) : "0"}
						</span>
						)
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-sm text-white/40">Created at</span>
				<div className="flex items-center gap-1 text-sm text-white">
					<span className="text-white">
						{memeTokenInfo?.created_at
							? fromNow(memeTokenInfo.created_at)
							: "N/A"}{" "}
						ago
					</span>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<span className="text-sm text-white/40">Token Supply</span>
				<div className="flex items-center gap-1 text-sm text-white">
					<span className="text-white">
						{formatNumberSmart(totalSupply, {
							shortenLarge: true,
						})}
					</span>
				</div>
			</div>
		</div>
	);
};
export default function Bottom() {
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const { id } = useParams({
		from: `/bitcoin/token/$id`,
	});
	const { type } = useSearch({
		from: "/bitcoin/token/$id",
	});

	useEffect(() => {
		if (id && type === "add_liquidity") {
			setActiveTab("Liquidity");
		}
	}, [id, type]);

	useEffect(() => {
		return () => {
			setActiveTab(tabs[0]);
		};
	}, [id]);

	const { data: memeTokenInfo } = useBtcMemeTokenInfo(Number(id));

	const { data: tokenInfo } = useBtcSingleTokenInfo({ id });

	const {
		priceChangeRate5M,
		priceChangeRate1H,
		priceChangeRate6H,
		priceChangeRate24H,
	} = tokenInfo ?? {};

	const currentTabs = useMemo(() => {
		return memeTokenInfo && memeTokenInfo.completed
			? tabs
			: //  : tabs;
				tabs.filter((tab) => tab !== "Liquidity");
	}, [memeTokenInfo]);

	return (
		<div className="no-scrollbar flex w-[390px] flex-shrink-0 flex-col gap-y-[14px] overflow-auto">
			<div className="flex items-center gap-[30px]">
				{currentTabs
					// .filter((tab) => tab !== "Liquidity")
					.map((tab) => {
						const isActive = activeTab === tab;
						return (
							<div
								key={tab}
								className={cn(
									"relative cursor-pointer text-base font-semibold",
									isActive ? "text-white" : "text-white/60 hover:text-white"
									// tab === "Liquidity" && "cursor-not-allowed"
								)}
								onClick={() => {
									// if (tab === "Liquidity") {
									// 	return;
									// }
									setActiveTab(tab);
								}}
							>
								{tab}
								<div
									className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
										isActive ? "w-full opacity-100" : "w-0 opacity-0"
									}`}
									style={{
										background:
											"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
									}}
								/>
							</div>
						);
					})}
			</div>
			{activeTab === "Trade" &&
				(!memeTokenInfo ? (
					<div className="flex h-[426px] w-[390px] flex-1 flex-col items-center justify-center gap-2">
						<Skeleton className="h-[426px] w-[390px]" />
					</div>
				) : memeTokenInfo.completed ? (
					<SwapTrade />
				) : (
					<Trade />
				))}

			{/* add remove liquidity */}
			{activeTab === "Liquidity" && <Liquidity />}

			<div className="bg-gray-860 grid h-21 flex-shrink-0 grid-cols-4 overflow-hidden rounded-[12px]">
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						5m
					</span>
					<span
						className={cn(
							"text-price-positive font-medium",
							!isNullOrUndefined(priceChangeRate5M) &&
								isNegative(priceChangeRate5M)
								? "text-price-negative"
								: "text-price-positive"
						)}
					>
						{!isNullOrUndefined(priceChangeRate5M)
							? `${priceChangeRate5M}%`
							: "--"}
					</span>
				</div>
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						1h
					</span>
					<span
						className={cn(
							"text-price-positive font-medium",
							!isNullOrUndefined(priceChangeRate1H) &&
								isNegative(priceChangeRate1H)
								? "text-price-negative"
								: "text-price-positive"
						)}
					>
						{!isNullOrUndefined(priceChangeRate1H)
							? `${priceChangeRate1H}%`
							: "--"}
					</span>
				</div>
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						6h
					</span>
					<span
						className={cn(
							"text-price-positive font-medium",
							!isNullOrUndefined(priceChangeRate6H) &&
								isNegative(priceChangeRate6H)
								? "text-price-negative"
								: "text-price-positive"
						)}
					>
						{!isNullOrUndefined(priceChangeRate6H)
							? `${priceChangeRate6H}%`
							: "--"}
					</span>
				</div>
				<div className="hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3">
					<span className="text-sm leading-4 font-medium text-white/40">
						24h
					</span>
					<span
						className={cn(
							"text-price-positive font-medium",
							!isNullOrUndefined(priceChangeRate24H) &&
								isNegative(priceChangeRate24H)
								? "text-price-negative"
								: "text-price-positive"
						)}
					>
						{!isNullOrUndefined(priceChangeRate24H)
							? `${priceChangeRate24H}%`
							: "--"}
					</span>
				</div>
			</div>
			<div className="flex flex-col items-center">
				<div className="flex w-full items-center justify-between">
					<span className="text-gray-280 text-sm">bonding curve progress:</span>
					<span className="text-yellow-500">
						({formatNumberSmart((memeTokenInfo?.progress ?? 0) * 100)}%)
					</span>
				</div>
				<Progress
					className="mt-4"
					value={(memeTokenInfo?.progress ?? 0) * 100}
				/>
			</div>
			<InfoDetail />
			<Holders />
		</div>
	);
}
