import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";
import { isMobile } from "react-device-detect";

import { CopyIcon } from "@/components/icons/common/copy";
import Assets from "@/components/views/icp/wallet/assets";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useICPBalance } from "@/hooks/ic/tokens/icp";
import { getTokenUsdValueTotal } from "@/lib/common/number";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/icp/wallet/$pid")({
	component: RouteComponent,
});

function RouteComponent() {
	const { pid } = Route.useParams();
	const { data: balance } = useICPBalance(pid);
	const { data: price } = useICPPrice();

	const usdValue =
		balance && price
			? getTokenUsdValueTotal({ amount: balance.raw }, price)
			: "--";

	const [copied, setCopied] = useState(false);

	return (
		<div className="mt-5 w-full">
			<div
				className={cn(
					"bg-gray-760 relative w-full space-y-2 rounded-2xl p-5 text-white",
					isMobile && "bg-background px-2.5 pt-0"
				)}
			>
				<div className="flex items-center gap-2">
					<div className="flex items-end gap-1">
						<span className="text-sm font-medium text-gray-400">PID: </span>
						<div className="flex items-center">
							<span className="text-sm text-white/60">
								{truncatePrincipal(pid)}
							</span>
							{copied ? (
								<Check className="ml-1 opacity-40" size={16} strokeWidth={4} />
							) : (
								<CopyIcon
									className="ml-1 h-4 w-4"
									onClick={() => {
										setCopied(true);
										copy(pid);
										setTimeout(() => {
											setCopied(false);
										}, 2000);
									}}
								/>
							)}
						</div>
					</div>
				</div>

				<div>
					<div className="text-sm font-medium text-gray-400">Total Value</div>
					<div className="mt-1">
						<span className="text-2xl font-semibold">
							{balance?.formatted ?? "--"} ICP
						</span>
					</div>
					<div className="mt-0.5 text-sm text-white/60">≈ ${usdValue}</div>
				</div>

				{/* <Button className="dark:bg-gray-710 dark:hover:bg-gray-710/80 absolute top-1/2 right-7.5 h-[38px] w-[113px] -translate-y-1/2 rounded-full font-medium text-white">
					<img
						alt="Transfer"
						className="h-4 w-4"
						src="/svgs/common/transfer.svg"
					/>
					Transfer
				</Button> */}
			</div>

			<div className="mt-5">
				<h2
					className={cn(
						"mb-3 text-lg font-semibold text-white",
						isMobile && "ml-2.5"
					)}
				>
					Assets
				</h2>
				<Assets pid={pid} />
			</div>
		</div>
	);
}
