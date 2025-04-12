import { useState } from "react";

import Liquidity from "./liquidity";
import Trade from "./trade";

const tabs = ["Trade", "Liquidity"];
export default function Bottom() {
	const [activeTab, setActiveTab] = useState(tabs[0]);
	return (
		<div className="mt-7.5 flex w-[390px] flex-shrink-0 flex-col gap-7.5 overflow-y-auto">
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

			<div className="border-gray-710 grid grid-cols-4 rounded-[12px] border">
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium">1m</span>
					<span className="text-price-positive text-xs">12%</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium">1m</span>
					<span className="text-price-positive text-xs">12%</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium">1m</span>
					<span className="text-price-positive text-xs">12%</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm font-medium">1m</span>
					<span className="text-price-positive text-xs">12%</span>
				</div>
			</div>
		</div>
	);
}
