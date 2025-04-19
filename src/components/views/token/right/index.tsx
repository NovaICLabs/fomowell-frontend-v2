import { useMemo, useState } from "react";

import { useParams } from "@tanstack/react-router";
import BigNumber from "bignumber.js";

import IcpLogo from "@/components/icons/logo/icp";
import { Progress } from "@/components/ui/progress";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useCurrentPrice, useMemeTokenInfo } from "@/hooks/ic/core";
import {
	formatNumberSmart,
	formatUnits,
	parseUnits,
} from "@/lib/common/number";
import { fromNow } from "@/lib/common/time";

import Liquidity from "./liquidity";
import Trade from "./trade";
const tabs = ["Trade", "Liquidity"];
export default function Bottom() {
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data: currentTokenPrice } = useCurrentPrice({ id: Number(id) });
	const { data: memeTokenInfo } = useMemeTokenInfo(Number(id));

	const liquidityICP = useMemo(() => {
		return memeTokenInfo?.bc.token_reserve
			? formatUnits(memeTokenInfo.bc.token_reserve)
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
					.times(totalSupply)
					.times(icpPrice)
					.div(BigNumber(currentTokenPrice.raw))
					.toString()
			: undefined;
	}, [currentTokenPrice, totalSupply, icpPrice]);

	const bcProgress = useMemo(() => {
		const bcTotalSupply = 800_000_000;
		if (!memeTokenInfo?.bc.meme_token_reserve) {
			return undefined;
		}
		const value = BigNumber(parseUnits(totalSupply))
			.minus(BigNumber(memeTokenInfo.bc.meme_token_reserve))
			.div(BigNumber(parseUnits(bcTotalSupply)));
		if (value.gte(1)) {
			return BigNumber(1);
		}
		return value;
	}, [memeTokenInfo, totalSupply]);
	console.debug("🚀 ~ bcProgress ~ bcProgress:", bcProgress?.toNumber());
	return (
		<div className="no-scrollbar flex w-[390px] flex-shrink-0 flex-col gap-7.5 overflow-auto">
			<div className="flex items-center gap-[30px]">
				{tabs.map((tab) => {
					const isActive = activeTab === tab;
					return (
						<div
							key={tab}
							className={`relative cursor-pointer text-base font-semibold ${
								isActive ? "text-white" : "text-white/60 hover:text-white"
							}`}
							onClick={() => {
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
			{activeTab === "Trade" && <Trade />}
			{activeTab === "Liquidity" && <Liquidity />}

			<div className="bg-gray-860 grid h-21 flex-shrink-0 grid-cols-4 rounded-[12px]">
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						1m
					</span>
					<span className="text-price-positive font-medium">12%</span>
				</div>
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						5m
					</span>
					<span className="text-price-positive font-medium">12%</span>
				</div>
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						1h
					</span>
					<span className="text-price-positive font-medium">12%</span>
				</div>
				<div className="hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3">
					<span className="text-sm leading-4 font-medium text-white/40">
						24h
					</span>
					<span className="text-price-positive font-medium">12%</span>
				</div>
			</div>
			<div className="flex flex-col items-center">
				<div className="flex w-full items-center justify-between">
					<span className="text-gray-280 text-sm">bonding curve progress:</span>
					<span className="text-yellow-500">
						({formatNumberSmart(bcProgress?.times(100)?.toString() ?? "0")}%)
					</span>
				</div>
				<Progress
					className="mt-4"
					value={bcProgress?.times(100).toNumber() ?? 0}
				/>
			</div>
			<div className="bg-gray-860 flex flex-col gap-5.5 rounded-[12px] px-4.5 py-5">
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Price</span>
					<span className="text-sm text-white">
						<span className="text-gray-280">
							{currentTokenPrice?.formattedPerPayToken} ICP
						</span>
					</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Market Cap:</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">
							{marketCap ? `$${formatNumberSmart(marketCap)}` : "N/A"}
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Liquidity</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">
							{liquidityUSD ? `$${formatNumberSmart(liquidityUSD)}` : "N/A"}
						</span>
						<div className="text-gray-280 flex items-center">
							(
							<IcpLogo className="inline" />
							<span className="text-gray-280">
								{liquidityICP ? formatNumberSmart(liquidityICP) : "N/A"}
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
							{formatNumberSmart(totalSupply, true)}
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Holders</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">12k</span>
					</div>
				</div>
			</div>
		</div>
	);
}
