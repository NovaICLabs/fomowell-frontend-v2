import { useState } from "react";

import { cn } from "@/lib/utils";

import AddLiquidity from "./add-liquidity";
import RemoveLiquidity from "./remove-liquidity";

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
