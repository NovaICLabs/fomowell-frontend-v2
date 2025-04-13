import { useState } from "react";

import { Progress } from "@/components/ui/progress";

import Liquidity from "./liquidity";
import Trade from "./trade";

const tabs = ["Trade", "Liquidity"];
export default function Bottom() {
	const [activeTab, setActiveTab] = useState(tabs[0]);
	return (
		<div className="flex w-[390px] flex-shrink-0 flex-col gap-7.5 overflow-y-auto">
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

			<div className="bg-gray-860 grid h-21 grid-cols-4 overflow-hidden rounded-[12px]">
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
				<div className="border-r-gray-710 hover:bg-gray-710 flex cursor-pointer flex-col items-center justify-center gap-3 border-r">
					<span className="text-sm leading-4 font-medium text-white/40">
						24h
					</span>
					<span className="text-price-positive font-medium">12%</span>
				</div>
			</div>
			<div className="flex flex-col items-center">
				<div className="flex w-full items-center justify-between">
					<span className="text-gray-280 text-sm">bonding curve progress:</span>
					<span className="text-yellow-500">(12%)</span>
				</div>
				<Progress className="mt-4" value={12} />
			</div>
			<div className="bg-gray-860 flex flex-col gap-5.5 rounded-[12px] px-4.5 py-5">
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Price</span>
					<span className="text-sm text-white">
						20000 sats <span className="text-gray-280">($20)</span>
					</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Market Cap:</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">$50K</span>
						<div className="text-gray-280 flex items-center">
							(
							<img
								alt="bitcoin"
								className="inline"
								src="/svgs/coins/bitcoin.svg"
							/>
							<span className="text-gray-280">20</span>)
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Liquidity</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">$120.9K</span>
						<div className="text-gray-280 flex items-center">
							(
							<img
								alt="bitcoin"
								className="inline"
								src="/svgs/coins/bitcoin.svg"
							/>
							<span className="text-gray-280">20</span>)
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Created at</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">24h ago</span>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Token Supply</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">120</span>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-white/40">Holders</span>
					<div className="flex items-center gap-1 text-sm text-white">
						<span className="text-white">120</span>
					</div>
				</div>
			</div>
		</div>
	);
}
