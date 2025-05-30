import { useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";
import BigNumber from "bignumber.js";

import { getICPCanisterId } from "@/canisters/icrc3";
import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/utils/toast";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useSingleTokenInfo } from "@/hooks/apis/indexer";
import { useCurrentPrice, useMemeTokenInfo } from "@/hooks/ic/core";
import {
	formatNumberSmart,
	formatUnits,
	isNullOrUndefined,
} from "@/lib/common/number";
import { fromNow } from "@/lib/common/time";
import { getSwapUrlByCanisterId } from "@/lib/swap/icpex";
import { cn } from "@/lib/utils";

import Holders from "./holders";
import Liquidity from "./liquidity";
import Trade from "./trade";
const tabs = ["Trade", "Liquidity"];

const isNegative = (value: number) => {
	return value < 0;
};
export const InfoDetail = () => {
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data: currentTokenPrice } = useCurrentPrice({ id: Number(id) });
	const { data: memeTokenInfo } = useMemeTokenInfo(Number(id));

	const liquidityICP = useMemo(() => {
		return memeTokenInfo?.liquidity
			? formatUnits(memeTokenInfo.liquidity)
			: undefined;
	}, [memeTokenInfo]);

	const { data: icpPrice } = useICPPrice();
	const liquidityUSD = useMemo(() => {
		return liquidityICP && icpPrice
			? BigNumber(liquidityICP).times(icpPrice).times(2).toString()
			: undefined;
	}, [liquidityICP, icpPrice]);

	const totalSupply = useMemo(() => {
		return 1_000_000_000;
	}, []);

	const marketCap = useMemo(() => {
		return currentTokenPrice?.raw && totalSupply && icpPrice
			? BigNumber(1)
					.times(10 ** getICPCanisterToken().decimals)
					.times(totalSupply)
					.times(icpPrice)
					.div(BigNumber(currentTokenPrice.raw))
					.toString()
			: undefined;
	}, [currentTokenPrice, totalSupply, icpPrice]);

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
						ICP
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
						<img alt={"icp-logo"} src={`/svgs/chains/icp.svg`} />
						<span className="text-gray-280">
							{liquidityICP ? formatNumberSmart(liquidityICP) : "0"}
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
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data: memeTokenInfo } = useMemeTokenInfo(Number(id));

	const { data: tokenInfo } = useSingleTokenInfo({ id });

	const {
		priceChangeRate5M,
		priceChangeRate1H,
		priceChangeRate6H,
		priceChangeRate24H,
	} = tokenInfo ?? {};
	return (
		<div className="no-scrollbar flex w-[390px] flex-shrink-0 flex-col gap-7.5 overflow-auto">
			<div className="flex items-center gap-[30px]">
				{tabs
					.filter((tab) => tab !== "Liquidity")
					.map((tab) => {
						const isActive = activeTab === tab;
						return (
							<div
								key={tab}
								className={cn(
									`relative cursor-pointer text-base font-semibold`,
									isActive ? "text-white" : "text-white/60 hover:text-white",
									tab === "Liquidity" && "cursor-not-allowed"
								)}
								onClick={() => {
									if (tab === "Liquidity") {
										return;
									}
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
					<div className="flex flex-shrink-0 flex-col items-center justify-center gap-2">
						<img
							alt="completed"
							className="w-50"
							src="/svgs/common/launched.svg"
						/>
						<Button
							className="-mt-9.5 h-9 w-88 rounded-full text-base font-bold"
							onClick={() => {
								const canister_id = memeTokenInfo.canister_id;
								if (!canister_id) {
									showToast("error", "Canister ID not found");
									return;
								}
								window.open(
									getSwapUrlByCanisterId({
										input: canister_id.toText(),
										output: getICPCanisterId().toText(),
									}),
									"_blank"
								);
							}}
						>
							Go to Dex
						</Button>
					</div>
				) : (
					<Trade />
				))}
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
