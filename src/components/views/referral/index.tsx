import { useState } from "react";

import { ReferralContent } from "@/components/layout/dialog/referral";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
import { useChainStore } from "@/store/chain";
import { useIcIdentityStore } from "@/store/ic";

import Invitation from "./components/Invitation";
import WithdrawalTable from "./components/Withdrawal";

export type TypeReferralListItem = {
	id: number;
};

export default function ReferralPage() {
	const { identityProfile: identityProfileBTC } = useBtcIdentityStore();
	const { identityProfile: identityProfileIc } = useIcIdentityStore();

	const { chain } = useChainStore();

	const [tab, setTab] = useState<"invitation" | "withdrawal">("invitation");

	const withdrawal = [
		"Each withdrawal requires a minimum of 1 ICP to be eligible for application (if not met, it will continue to accumulate).",
		"Withdrawals usually arrive within 24 hours, and you can also query the blockchain transaction hash.",
		"All commission rewards will be accumulated once credited, and withdrawals will be deducted based on the total amount.",
	];

	const onWithdraw = () => {
		console.log("🚀 ~ onWithdraw ~ onWithdraw:", onWithdraw);
	};

	const domain = window.location.origin;

	return (
		<div className="flex h-full w-full">
			<div className="flex w-[350px] flex-shrink-0 flex-col">
				<ReferralContent
					earnedTotal={0}
					referralLink={`${domain}?chain=${chain}&ref=${chain === "icp" ? identityProfileIc?.invite_code : identityProfileBTC?.invite_code}`}
					referralsTotal={2}
					referralText={
						chain === "icp"
							? [
									"Inviting friends to log in will earn you 0.5 ICPS.",
									"First-level commission rebate: 10%",
									"Secondary commission rebate: 5%",
									"Third-level anti-bribery: 3%",
								]
							: [
									"First-level commission rebate: 10%",
									"Secondary commission rebate: 5%",
								]
					}
				/>
				<div className="mt-5 w-full rounded-xl border border-[#f7b406]/40 bg-[#111111] px-4 py-7">
					<div className="flex w-full items-center">
						<img
							alt="fomowell"
							className="mr-1 h-[18px] w-[18px]"
							src="/svgs/info.svg"
						/>
						<p className="justify-start font-['Albert_Sans'] text-base font-semibold text-white">
							Withdrawal explanation
						</p>
					</div>
					<div className="mt-3 flex flex-col gap-y-[20px]">
						{withdrawal.map((item, index) => (
							<div className="flex w-full">
								<div className="mt-[8px] mr-[6px] h-1 w-1 flex-shrink-0 rounded-full bg-white/60" />
								<p key={index} className="text-sm font-normal text-white/60">
									{item}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="ml-5 min-w-0 flex-1">
				<div className="flex h-[212px] w-full gap-x-[13px] rounded-xl border border-[#f7b406] bg-[#111111] p-3">
					<div className="flex h-[188px] flex-1 flex-col items-center justify-center rounded-xl bg-[#191919] pb-[30px]">
						<img alt="" className="w-[94px]" src="/images/gold.png" />
						<div className="flex gap-x-[80px]">
							<div className="flex flex-col gap-y-[13px]">
								<p className="text-sm font-normal text-white/50">
									Claimed Rewards:
								</p>
								<p className="flex text-base font-medium text-white">
									250{" "}
									<p className="text ml-1 uppercase">
										{chain === "icp" ? "icp" : "btc"}
									</p>
								</p>
							</div>
							<div className="flex flex-col gap-y-[13px]">
								<p className="text-sm font-normal text-white/50">Invitee:</p>
								<p className="text-base font-medium text-white">255</p>
							</div>
						</div>
					</div>
					<div className="flex h-[188px] flex-1 flex-col items-center justify-center rounded-xl bg-[#191919] pb-[30px]">
						<img alt="" className="w-[94px]" src="/images/silver.png" />
						<div className="flex gap-x-[80px]">
							<div className="flex flex-col gap-y-[13px]">
								<p className="text-sm font-normal text-white/50">
									Claimed Rewards:
								</p>
								<p className="flex text-base font-medium text-white">
									250{" "}
									<p className="text ml-1 uppercase">
										{chain === "icp" ? "icp" : "btc"}
									</p>
								</p>
							</div>
							<div className="flex flex-col gap-y-[13px]">
								<p className="text-sm font-normal text-white/50">Invitee:</p>
								<p className="text-base font-medium text-white">255</p>
							</div>
						</div>
					</div>
					<div className="flex h-[188px] flex-1 flex-col items-center justify-center rounded-xl bg-[#191919] pb-[30px]">
						<img alt="" className="w-[94px]" src="/images/copper.png" />
						<div className="flex gap-x-[80px]">
							<div className="flex flex-col gap-y-[13px]">
								<p className="text-sm font-normal text-white/50">
									Claimed Rewards:
								</p>
								<p className="flex text-base font-medium text-white">
									250{" "}
									<p className="text ml-1 uppercase">
										{chain === "icp" ? "icp" : "btc"}
									</p>
								</p>
							</div>
							<div className="flex flex-col gap-y-[13px]">
								<p className="text-sm font-normal text-white/50">Invitee:</p>
								<p className="text-base font-medium text-white">255</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-5 flex h-[188px] w-full rounded-xl border border-neutral-800 bg-[#111111]">
					<div className="flex flex-1 flex-col justify-center border-r border-neutral-800 px-5">
						<p className="text-sm leading-none font-normal text-white/50">
							My total Rewards
						</p>
						<p className="mt-2 flex text-2xl leading-none font-medium text-white">
							30{" "}
							<p className="text ml-1 uppercase">
								{chain === "icp" ? "icp" : "btc"}
							</p>
						</p>
						<p className="mt-[12px] text-sm leading-none font-normal text-white/60">
							$241.63
						</p>
					</div>
					<div className="flex flex-1 flex-col justify-center border-r border-neutral-800 px-5">
						<p className="text-sm leading-none font-normal text-white/50">
							Withdrawal completed
						</p>
						<p className="mt-2 flex text-2xl leading-none font-medium text-white">
							30{" "}
							<p className="text ml-1 uppercase">
								{chain === "icp" ? "icp" : "btc"}
							</p>
						</p>
						<p className="mt-[12px] text-sm leading-none font-normal text-white/60">
							$241.63
						</p>
					</div>
					<div className="flex flex-1 items-center justify-center border-r border-neutral-800 px-5">
						<div className="flex flex-1 flex-col">
							<p className="text-sm leading-none font-normal text-white/50">
								Can withdraw
							</p>
							<p className="mt-2 flex text-2xl leading-none font-medium text-white">
								30{" "}
								<p className="text ml-1 uppercase">
									{chain === "icp" ? "icp" : "btc"}
								</p>
							</p>
							<p className="mt-[12px] text-sm leading-none font-normal text-white/60">
								$241.63
							</p>
						</div>
						<div
							className="flex h-[38px] w-[103px] cursor-pointer items-center justify-center rounded-[21px] bg-white text-sm font-semibold text-[#111111]"
							onClick={() => {
								onWithdraw();
							}}
						>
							Withdraw
						</div>
					</div>
				</div>

				<div className="mt-[30px] flex w-full flex-col">
					<div className="flex w-full gap-x-[40px]">
						<div className="relative flex">
							<p
								className={cn(
									"cursor-pointer text-base font-semibold text-white/40 duration-300",
									tab === "invitation" && "text-white"
								)}
								onClick={() => {
									setTab("invitation");
								}}
							>
								Invitation Rebate
							</p>
							<div
								className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
									tab === "invitation"
										? "w-[66px] opacity-100"
										: "w-0 opacity-0"
								}`}
								style={{
									background:
										"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
								}}
							/>
						</div>
						<div className="relative flex">
							<p
								className={cn(
									"cursor-pointer text-base font-semibold text-white/40 duration-300",
									tab === "withdrawal" && "text-white"
								)}
								onClick={() => {
									setTab("withdrawal");
								}}
							>
								Withdrawal Record
							</p>
							<div
								className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
									tab === "withdrawal"
										? "w-[66px] opacity-100"
										: "w-0 opacity-0"
								}`}
								style={{
									background:
										"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
								}}
							/>
						</div>
					</div>

					<div className="no-scrollbar mt-4 h-[331px] flex-shrink-0 overflow-x-scroll rounded-xl bg-[#191919]">
						{tab === "invitation" && <Invitation />}
						{tab === "withdrawal" && <WithdrawalTable />}
					</div>
				</div>
			</div>
		</div>
	);
}
