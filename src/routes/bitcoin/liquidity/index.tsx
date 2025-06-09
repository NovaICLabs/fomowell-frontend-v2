import { createFileRoute } from "@tanstack/react-router";

import LiquidityPage from "@/components/views/liquidity";

export const Route = createFileRoute("/bitcoin/liquidity/")({
	component: Liquidity,
});

export default function Liquidity() {
	return (
		<div className="m-auto mt-[15px] mb-[25px] flex h-full max-h-full w-full items-start overflow-hidden rounded-[16px] bg-[#1E1E1E]">
			<LiquidityPage />
		</div>
	);
}
