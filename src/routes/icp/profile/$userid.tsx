import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";

import { getICPCanisterId } from "@/canisters/icrc3";
import { CopyIcon } from "@/components/icons/common/copy";
import { EditIcon } from "@/components/icons/common/edit";
import WithdrawIcon from "@/components/icons/common/withdraw";
import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import { Button } from "@/components/ui/button";
import ProfileCreatedTokens from "@/components/views/icp/profile/create-list";
import ProfileHoldings from "@/components/views/icp/profile/holdings";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useCoreTokenBalance } from "@/hooks/ic/core";
import { getAvatar } from "@/lib/common/avatar";
import { getTokenUsdValueTotal } from "@/lib/common/number";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";

export const Route = createFileRoute("/icp/profile/$userid")({
	component: UserId,
});

function UserId() {
	const { userid } = Route.useParams();
	const [activeTab, setActiveTab] = useState("Created");
	const [principalCopied, setPrincipalCopied] = useState(false);
	const { data: coreTokenBalance } = useCoreTokenBalance({
		owner: userid,
		token: { ICRCToken: getICPCanisterId() },
	});
	const { data: icpPrice } = useICPPrice();
	const usdValue =
		coreTokenBalance && icpPrice
			? getTokenUsdValueTotal({ amount: coreTokenBalance.raw }, icpPrice)
			: "--";

	console.debug("🚀 ~ UserId ~ usdValue:", usdValue);
	const { setDepositWithdrawOpen } = useDialogStore();
	return (
		<div className="flex h-full w-full flex-1 flex-col overflow-auto pt-5">
			<div className="sticky mb-5 flex h-[162px] w-full gap-x-5">
				<div className="bg-gray-760 relative flex w-full gap-x-2 rounded-2xl p-5">
					<div className="flex items-center gap-2">
						<img
							alt="avatar"
							className="h-16 w-16 rounded-full"
							src={getAvatar(userid)}
						/>
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-1">
								<span className="text-lg font-semibold">
									{
										truncatePrincipal(
											userid
										) /* Use default truncation or adjust as needed */
									}
								</span>
								<EditIcon />
							</div>
							<div className="flex items-center text-xs text-gray-400">
								<span>ID: {truncatePrincipal(userid)}</span>
								{principalCopied ? (
									<Check
										className="ml-1 opacity-40"
										size={16}
										strokeWidth={4}
									/>
								) : (
									<CopyIcon
										className="ml-1 h-3.5 w-3.5 cursor-pointer"
										onClick={() => {
											setPrincipalCopied(true);
											copy(userid);
											setTimeout(() => {
												setPrincipalCopied(false);
											}, 2000);
										}}
									/>
								)}
							</div>
						</div>
					</div>
					<Button className="absolute top-1/2 right-5 -translate-y-1/2 rounded-full">
						<img alt="Refer to earn" src="/svgs/common/refer.svg" />
						Refer to earn
					</Button>
				</div>
				<div className="bg-gray-760 flex w-120 flex-col items-center rounded-2xl p-5">
					<div className="flex flex-col items-center">
						<div className="text-sm font-medium text-gray-400">Total Value</div>
						<div className="mt-1">
							<span className="text-3xl leading-tight font-bold">
								{coreTokenBalance?.formatted ?? "--"}
							</span>
							<span className="ml-1.5 text-xl leading-tight font-semibold text-gray-300">
								{" "}
								ICP
							</span>
						</div>
						<div className="mt-4 flex gap-4">
							<Button
								className="h-[38px] w-[103px] rounded-full bg-white text-sm font-semibold hover:bg-white/80"
								onClick={() => {
									setDepositWithdrawOpen({ open: true, type: "deposit" });
								}}
							>
								<DepositWithdrawIcon className="text-black" />
								Deposit
							</Button>
							<Button
								className="bg-gray-710 hover:bg-gray-710/80 h-[38px] w-[103px] rounded-full text-sm font-semibold text-white"
								onClick={() => {
									setDepositWithdrawOpen({ open: true, type: "withdraw" });
								}}
							>
								<WithdrawIcon />
								Withdraw
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="sticky mb-4 flex items-center gap-[30px] px-4">
				{["Holdings", "Created", "Activity"].map((tab) => {
					const isActive = activeTab === tab;
					return (
						<div
							key={tab}
							className={cn(
								"relative cursor-pointer py-2 text-sm font-semibold",
								isActive ? "text-white" : "text-white/60 hover:text-white"
							)}
							onClick={() => {
								setActiveTab(tab);
							}}
						>
							{tab}
							<div
								className={cn(
									"absolute -bottom-px left-0 h-[2px] rounded-[1px] bg-white transition-all duration-300 ease-in-out",
									isActive ? "w-full opacity-100" : "w-0 opacity-0"
								)}
								style={{
									background:
										"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
								}}
							/>
						</div>
					);
				})}
			</div>

			<div className="no-scrollbar flex-1 flex-col overflow-auto rounded-2xl pb-5">
				<div className="h-max">
					{activeTab === "Holdings" && (
						<div className="bg-gray-760 h-full rounded-2xl p-5 text-white/60">
							<ProfileHoldings />
						</div>
					)}
					{activeTab === "Created" && (
						<div className="bg-gray-760 rounded-2xl p-5 text-white/60">
							<ProfileCreatedTokens />
						</div>
					)}
					{activeTab === "Activity" && (
						<div className="bg-gray-760 rounded-2xl p-5 text-white/60">
							Activity feed goes here...
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
