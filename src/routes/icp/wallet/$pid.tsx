import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";

import { CopyIcon } from "@/components/icons/common/copy";
import LinkedWalletIcon from "@/components/icons/links-popover/linked-wallet";
import Assets from "@/components/views/icp/wallet/assets";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useICPBalance } from "@/hooks/ic/tokens/icp";
import { getTokenUsdValueTotal } from "@/lib/common/number";
import { truncatePrincipal } from "@/lib/ic/principal";

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
			<div className="bg-gray-760 relative w-full space-y-2 rounded-2xl p-5 text-white">
				<div className="flex items-center gap-2">
					<LinkedWalletIcon className="h-5 w-5 text-gray-400" />
					<div className="flex items-center gap-1">
						<span className="text-sm font-medium text-gray-400">PID: </span>
						<div className="flex items-center">
							<span className="font-mono text-sm break-all text-gray-200">
								{truncatePrincipal(pid)}
							</span>
							{copied ? (
								<Check
									className="ml-1 opacity-40"
									size={16}
									strokeWidth={"2"}
								/>
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
						<span className="text-3xl leading-tight font-bold">
							{balance?.formatted ?? "--"}
						</span>
						<span className="ml-1.5 text-xl leading-tight font-semibold text-gray-300">
							{" "}
							ICP
						</span>
					</div>
					<div className="mt-0.5 text-sm font-medium text-gray-400">
						≈ ${usdValue}
					</div>
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
				<h2 className="mb-3 text-lg font-semibold text-white">Assets</h2>
				<Assets pid={pid} />
			</div>
		</div>
	);
}
