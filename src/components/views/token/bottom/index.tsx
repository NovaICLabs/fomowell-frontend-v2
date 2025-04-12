import { useState } from "react";

import Comments from "./comments";
const tabs = ["Comments", "Transactions"];
export default function Bottom() {
	const [activeTab, setActiveTab] = useState(tabs[0]);
	return (
		<div className="mt-7.5 flex flex-1 flex-col gap-7.5 overflow-y-auto">
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
			{activeTab === "Comments" && <Comments />}
		</div>
	);
}
