import { useEffect, useState } from "react";

import { Dialog } from "@radix-ui/react-dialog";

import {
	getIcUserRewardLeaderboard,
	getIcUserRewardStats,
	getIcUserRewardWithdraw,
} from "@/apis/reward";
import {
	getBtcUserRewardLeaderboard,
	getBtcUserRewardStats,
	getBtcUserRewardWithdraw,
	type RewardLeaderboard,
	type RewardStats,
} from "@/apis/reward-btc";
import { ReferralContent } from "@/components/layout/dialog/referral";
import { DialogContent } from "@/components/ui/dialog";
import { showToast } from "@/components/utils/toast";
import { useICPPrice, useSatsPrice } from "@/hooks/apis/coingecko";
import { formatNumberSmart } from "@/lib/common/number";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
import { useChainStore } from "@/store/chain";
import { useIcIdentityStore } from "@/store/ic";

import Invitation from "./components/Invitation";
import WithdrawalTable from "./components/Withdrawal";

export type TypeReferralListItem = {
	id: number;
};

const PriceRewardsIcp = ({ data }: { data: string }) => {
	const { data: icpPrice } = useICPPrice();
	return (
		<>
			{!data || !icpPrice
				? "--"
				: formatNumberSmart(Number(data) * icpPrice, {
						shortZero: true,
					})}
		</>
	);
};
const PriceRewardsSats = ({ data }: { data: string }) => {
	const { data: satsPrice } = useSatsPrice();
	return (
		<>
			{!data || !satsPrice
				? "--"
				: "$" +
					formatNumberSmart(Number(data) * satsPrice, {
						shortZero: true,
					})}
		</>
	);
};

export default function ReferralPage() {
	const { identityProfile: identityProfileBTC, jwt_token: btcJwtToken } =
		useBtcIdentityStore();
	const { identityProfile: identityProfileIc, jwt_token: icJwtToken } =
		useIcIdentityStore();

	const { chain } = useChainStore();

	const [tab, setTab] = useState<"invitation" | "withdrawal">("invitation");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const withdrawal = [
		"Each withdrawal requires a minimum of 1 ICP to be eligible for application (if not met, it will continue to accumulate).",
		"Withdrawals usually arrive within 24 hours, and you can also query the blockchain transaction hash.",
		"All commission rewards will be accumulated once credited, and withdrawals will be deducted based on the total amount.",
	];

	const onWithdraw = () => {
		setLoading(true);
		if (chain === "icp" && icJwtToken) {
			void getIcUserRewardWithdraw(icJwtToken)
				.then(() => {
					showToast("success", "Withdrawal successfully");
					setOpen(false);
				})
				.finally(() => {
					setLoading(false);
				});
		}

		if (chain === "bitcoin" && btcJwtToken) {
			void getBtcUserRewardWithdraw(btcJwtToken)
				.then(() => {
					showToast("success", "Withdrawal successfully");
					setOpen(false);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	const [rewardStats, setRewardStats] = useState<RewardStats>();
	const [rewardLeaderboard, setRewardLeaderboard] = useState<
		Array<RewardLeaderboard>
	>([]);

	useEffect(() => {
		if (chain === "icp" && icJwtToken) {
			void getIcUserRewardStats(icJwtToken).then((result) => {
				if (!result) return;
				setRewardStats(result);
			});

			void getIcUserRewardLeaderboard(icJwtToken).then((result) => {
				if (!result) return;
				setRewardLeaderboard(result);
			});
		}

		if (chain === "bitcoin" && btcJwtToken) {
			void getBtcUserRewardStats(btcJwtToken).then((result) => {
				if (!result) return;
				setRewardStats(result);
			});

			void getBtcUserRewardLeaderboard(btcJwtToken).then((result) => {
				if (!result) return;
				setRewardLeaderboard(result);
			});
		}
	}, [btcJwtToken, icJwtToken, chain]);

	const domain = window.location.origin;

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(show: boolean) => {
					if (loading) return;
					setOpen(show);
				}}
			>
				<DialogContent
					className={cn(
						"border-gray-755 bg-gray-755 transition-height flex w-[398px] flex-col rounded-3xl px-5 py-6 text-white duration-300"
					)}
				>
					<div className="mt-5 flex w-full flex-col items-center">
						<img alt="svg" className="w-[40px]" src="/svgs/withdraw.svg" />
						<div className="mt-[15px] w-full justify-center px-2 text-center font-['Albert_Sans'] text-lg leading-relaxed font-medium text-white">
							Should the entire amount of the reward be made available?
						</div>
						<div className="mt-[40px] flex w-full gap-x-4">
							<div
								className="flex h-[42px] flex-1 cursor-pointer items-center justify-center rounded-[21px] border border-[#f7b406]"
								onClick={() => {
									if (loading) return;
									setOpen(false);
								}}
							>
								<div className="text-base leading-none font-semibold text-white">
									Cancel
								</div>
							</div>
							<div
								className={cn(
									"flex h-[42px] flex-1 cursor-pointer items-center justify-center rounded-[21px] border bg-[#f7b406]",
									loading && "!cursor-not-allowed opacity-80"
								)}
								onClick={() => {
									onWithdraw();
								}}
							>
								{loading && (
									<img
										alt=""
										className="mr-2 h-3.5 w-3.5 animate-spin"
										src="/svgs/loading.svg"
									/>
								)}
								<div className="text-base leading-none font-semibold text-black">
									Confirm
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<div className="flex h-full w-full">
				<div className="flex w-[350px] flex-shrink-0 flex-col">
					<ReferralContent
						earned={rewardStats?.reward.total || ""}
						referralLink={`${domain}?chain=${chain}&ref=${chain === "icp" ? identityProfileIc?.invite_code : identityProfileBTC?.invite_code}`}
						referralText={
							chain === "icp"
								? [
										"Inviting friends to log in will earn you 0.5 ICPS.",
										"First-level commission rebate: 20%",
										"Secondary commission rebate: 5%",
										"Third-level anti-bribery: 3%",
									]
								: [
										"First-level commission rebate: 20%",
										"Secondary commission rebate: 5%",
									]
						}
						referrals={
							(rewardStats?.level1Count || 0) + (rewardStats?.level2Count || 0)
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
					<div className="flex h-[212px] w-full gap-x-[13px] rounded-xl border border-[#f7b406]/30 bg-[#111111] p-3">
						{rewardLeaderboard.map((item, index) => (
							<div
								key={index}
								className="flex h-[188px] flex-1 flex-col items-center justify-center rounded-xl bg-[#191919] pb-[30px]"
							>
								{item.rank === 1 && (
									<img alt="" className="w-[94px]" src="/images/gold.png" />
								)}
								{item.rank === 2 && (
									<img alt="" className="w-[94px]" src="/images/silver.png" />
								)}
								{item.rank === 3 && (
									<img alt="" className="w-[94px]" src="/images/copper.png" />
								)}

								<div className="flex gap-x-[80px]">
									<div className="flex flex-col gap-y-[13px]">
										<p className="text-sm font-normal text-white/50">
											Claimed Rewards:
										</p>
										<p className="flex text-base font-medium text-white">
											{item.totalRewards}{" "}
											<p className="text ml-1 uppercase">
												{chain === "icp" ? "ICP" : "SARS"}
											</p>
										</p>
									</div>
									<div className="flex flex-col gap-y-[13px]">
										<p className="text-sm font-normal text-white/50">
											Invitee:
										</p>
										<p className="text-base font-medium text-white">
											{(item.level1Count || 0) + (item.level2Count || 0)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-5 flex h-[188px] w-full rounded-xl border border-neutral-800 bg-[#111111]">
						<div className="flex flex-1 flex-col justify-center border-r border-neutral-800 px-5">
							<p className="text-sm leading-none font-normal text-white/50">
								My total Rewards
							</p>
							<p className="mt-2 flex text-2xl leading-none font-medium text-white">
								{rewardStats?.reward?.total || "0"}{" "}
								<p className="text ml-1 uppercase">
									{chain === "icp" ? "ICP" : "Sats"}
								</p>
							</p>
							<p className="mt-[12px] text-sm leading-none font-normal text-white/60">
								{chain === "icp" ? (
									<PriceRewardsIcp data={rewardStats?.reward?.total || "0"} />
								) : (
									<PriceRewardsSats data={rewardStats?.reward?.total || "0"} />
								)}
							</p>
						</div>
						<div className="flex flex-1 flex-col justify-center border-r border-neutral-800 px-5">
							<p className="text-sm leading-none font-normal text-white/50">
								Withdrawal completed
							</p>
							<p className="mt-2 flex text-2xl leading-none font-medium text-white">
								{rewardStats?.reward?.withdrawn || "0"}{" "}
								<p className="text ml-1 uppercase">
									{chain === "icp" ? "ICP" : "Sats"}
								</p>
							</p>
							<p className="mt-[12px] text-sm leading-none font-normal text-white/60">
								{chain === "icp" ? (
									<PriceRewardsIcp
										data={rewardStats?.reward?.withdrawn || "0"}
									/>
								) : (
									<PriceRewardsSats
										data={rewardStats?.reward?.withdrawn || "0"}
									/>
								)}
							</p>
						</div>
						<div className="flex flex-1 items-center justify-center border-r border-neutral-800 px-5">
							<div className="flex flex-1 flex-col">
								<p className="text-sm leading-none font-normal text-white/50">
									Can withdraw
								</p>
								<p className="mt-2 flex text-2xl leading-none font-medium text-white">
									{rewardStats?.reward?.available || "0"}{" "}
									<p className="text ml-1 uppercase">
										{chain === "icp" ? "ICP" : "Sats"}
									</p>
								</p>
								<p className="mt-[12px] text-sm leading-none font-normal text-white/60">
									{chain === "icp" ? (
										<PriceRewardsIcp
											data={rewardStats?.reward?.available || "0"}
										/>
									) : (
										<PriceRewardsSats
											data={rewardStats?.reward?.available || "0"}
										/>
									)}
								</p>
							</div>
							<div
								className="flex h-[38px] w-[103px] cursor-pointer items-center justify-center rounded-[21px] bg-white text-sm font-semibold text-[#111111]"
								onClick={() => {
									setOpen(true);
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
		</>
	);
}
