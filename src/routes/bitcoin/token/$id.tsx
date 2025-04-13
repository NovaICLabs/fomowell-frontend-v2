import { createFileRoute } from "@tanstack/react-router";

import Bottom from "@/components/views/token/bottom";
import HeadInfo from "@/components/views/token/head-info";
import Right from "@/components/views/token/right";
import TradingView from "@/components/views/token/tradingview";
import Trending from "@/components/views/token/trending";

export const Route = createFileRoute("/bitcoin/token/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-full flex-row gap-4 pt-7.5">
			<Trending />
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<HeadInfo />
				<div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-auto">
					<TradingView />
					<Bottom />
				</div>
			</div>
			<Right />
		</div>
	);
}
