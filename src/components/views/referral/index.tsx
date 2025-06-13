import { useEffect, useState } from "react";

import { Dialog } from "@radix-ui/react-dialog";

import {
	getIcUserRewardLeaderboard,
	getIcUserRewardMyInvitees,
	getIcUserRewardMyWithdraw,
	getIcUserRewardStats,
	getIcUserRewardWithdraw,
} from "@/apis/reward";
import {
	getBtcUserRewardLeaderboard,
	getBtcUserRewardMyInvitees,
	getBtcUserRewardMyWithdraw,
	getBtcUserRewardStats,
	getBtcUserRewardWithdraw,
	type MyInviteesItem,
	type MyWithdrawalsItem,
	type RewardLeaderboard,
	type RewardStats,
} from "@/apis/reward-btc";
import { ReferralContent } from "@/components/layout/dialog/referral";
import { DialogContent } from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { showToast } from "@/components/utils/toast";
import { useICPPrice, useSatsPrice } from "@/hooks/apis/coingecko";
import { formatNumberSmart } from "@/lib/common/number";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
import { useChainStore } from "@/store/chain";
import { useIcIdentityStore } from "@/store/ic";

import InvitationTable from "./components/Invitation";
import WithdrawalTable from "./components/Withdrawal";

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

const Explanation = () => {
	const { chain } = useChainStore();

	const withdrawal = [
		`Each withdrawal requires a minimum of 10000 ${chain === "icp" ? "ICP" : "SATS"} to be eligible for application (if not met, it will continue to accumulate).`,
		"Withdrawals usually arrive within 24 hours, and you can also query the blockchain transaction hash.",
		"All commission rewards will be accumulated once credited, and withdrawals will be deducted based on the total amount.",
	];

	return (
		<div className="w-full rounded-xl border border-[#f7b406]/40 bg-[#111111] px-4 py-7 md:mt-5">
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
					<div key={index} className="flex w-full">
						<div className="mt-[8px] mr-[6px] h-1 w-1 flex-shrink-0 rounded-full bg-white/60" />
						<p key={index} className="text-sm font-normal text-white/60">
							{item}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default function ReferralPage() {
	const { jwt_token: btcJwtToken } = useBtcIdentityStore();
	const { jwt_token: icJwtToken } = useIcIdentityStore();

	const { chain } = useChainStore();

	const [tab, setTab] = useState<"invitation" | "withdrawal">("invitation");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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

	const [openPopover, setOpenPopover] = useState(false);

	const [rewardStats, setRewardStats] = useState<RewardStats>();
	const [rewardLeaderboard, setRewardLeaderboard] = useState<
		Array<RewardLeaderboard>
	>([]);
	const [myInvitees, setMyInvitees] = useState<
		Array<MyInviteesItem> | undefined
	>(undefined);
	const [myWithdraw, setMyWithdraw] = useState<
		Array<MyWithdrawalsItem> | undefined
	>(undefined);

	useEffect(() => {
		if (chain === "icp") {
			if (icJwtToken) {
				void getIcUserRewardStats(icJwtToken).then((result) => {
					if (!result) return;
					setRewardStats(result);
				});

				void getIcUserRewardLeaderboard(icJwtToken).then((result) => {
					if (!result) return;
					setRewardLeaderboard(result);
				});

				void getIcUserRewardMyWithdraw(icJwtToken).then((result) => {
					if (!result) return;
					setMyWithdraw(result.withdrawals);
				});

				void getIcUserRewardMyInvitees(icJwtToken).then((result) => {
					if (!result) return;
					setMyInvitees(result);
				});
			}
		}

		if (chain === "bitcoin") {
			if (btcJwtToken) {
				void getBtcUserRewardStats(btcJwtToken).then((result) => {
					if (!result) return;
					setRewardStats(result);
				});

				void getBtcUserRewardLeaderboard(btcJwtToken).then((result) => {
					if (!result) return;
					setRewardLeaderboard(result);
				});

				void getBtcUserRewardMyWithdraw(btcJwtToken).then((result) => {
					if (!result) return;

					setMyWithdraw(result.withdrawals);
				});

				void getBtcUserRewardMyInvitees(btcJwtToken).then((result) => {
					console.log("🚀 ~ voidgetBtcUserRewardMyInvitees ~ result:", result);
					if (!result) return;
					setMyInvitees(result);
				});
			}
		}
	}, [btcJwtToken, icJwtToken, chain]);

	const RewardItem = ({ item }: { item: RewardLeaderboard }) => {
		return (
			<div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#191919] pb-[20px] md:h-[188px] md:pb-[30px]">
				{item.rank === 1 && (
					<img alt="" className="w-[94px]" src="/images/gold.png" />
				)}
				{item.rank === 2 && (
					<img alt="" className="w-[94px]" src="/images/silver.png" />
				)}
				{item.rank === 3 && (
					<img alt="" className="w-[94px]" src="/images/copper.png" />
				)}

				<div
					className={cn(
						"flex flex-row items-center gap-x-[80px]",
						item.rank > 1 && "w-full flex-col md:w-auto md:flex-row"
					)}
				>
					<div
						className={cn(
							"flex flex-shrink-0 flex-col px-3 md:gap-y-[13px]",
							item.rank > 1 && "w-full md:w-auto"
						)}
					>
						<p className="text-sm font-normal text-white/50">
							Claimed Rewards:
						</p>
						<p className="flex text-base font-medium text-white">
							{formatNumberSmart(item.totalRewards, { shortenLarge: true })}
							<p className="text ml-1 uppercase">
								{chain === "icp" ? "ICP" : "SATS"}
							</p>
						</p>
					</div>
					<div
						className={cn(
							"flex flex-shrink-0 flex-col px-3 md:gap-y-[13px]",
							item.rank > 1 && "mt-3 w-full md:mt-0 md:w-auto"
						)}
					>
						<p className="text-sm font-normal text-white/50">Invitee:</p>
						<p className="text-base font-medium text-white">
							{(item.level1Count || 0) + (item.level2Count || 0)}
						</p>
					</div>
				</div>
			</div>
		);
	};

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
			<div className="flex h-full w-full flex-col md:flex-row">
				<div className="flex w-full flex-shrink-0 flex-col md:w-[350px]">
					<ReferralContent
						earned={rewardStats?.reward.total || ""}
						referrals={
							(rewardStats?.level1Count || 0) + (rewardStats?.level2Count || 0)
						}
					/>
					<div className="hidden md:flex">
						<Explanation />
					</div>
				</div>

				<div className="mt-[30px] flex w-full justify-between md:hidden">
					<p className="text-base font-semibold text-white">Rewards</p>

					<Popover open={openPopover} onOpenChange={setOpenPopover}>
						<PopoverTrigger asChild>
							<img
								alt=""
								className="h-6 w-6 cursor-pointer"
								src="/svgs/info.svg"
							/>
						</PopoverTrigger>
						<PopoverContent
							className="z-100 -mt-1 mr-[12px] w-[71vw] border-none border-gray-700 bg-transparent p-0 pt-1"
							onMouseEnter={() => {
								setOpenPopover(true);
							}}
							onMouseLeave={() => {
								setOpenPopover(false);
							}}
						>
							<div className="flex w-[100%]">
								<Explanation></Explanation>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-y-10 md:ml-5 md:gap-y-0">
					<div
						className="order-3 flex w-full rounded-xl p-[1px] md:order-2 md:h-[212px]"
						style={{
							background:
								"linear-gradient(90deg, rgba(247, 180, 6, 0.4) 40%, rgba(247, 114, 6, 0.4) 100%)",
						}}
					>
						<div className="flex w-full flex-col gap-x-[13px] gap-y-[13px] rounded-xl bg-[#111111] p-3 md:flex-row">
							{rewardLeaderboard && rewardLeaderboard[0] ? (
								<RewardItem item={rewardLeaderboard[0]} />
							) : (
								<></>
							)}
							<div className="grid flex-2 grid-cols-2 gap-x-[13px]">
								{rewardLeaderboard.slice(1, 3).map((item, index) => (
									<RewardItem key={index} item={item} />
								))}{" "}
							</div>
						</div>
					</div>

					<div className="order-1 mt-5 flex w-full flex-col rounded-xl border border-neutral-800 bg-[#111111] md:order-2 md:h-[188px] md:flex-row">
						<div className="flex h-[148px] flex-col justify-center border-r border-b border-neutral-800 px-5 md:h-auto md:flex-1">
							<p className="text-sm leading-none font-normal text-white/50">
								My total Rewards
							</p>
							<div className="mt-2 flex text-2xl leading-none font-medium text-white">
								{rewardStats?.reward?.total
									? formatNumberSmart(rewardStats?.reward?.total, {
											shortenLarge: true,
										})
									: "0"}{" "}
								<p className="text ml-1 uppercase">
									{chain === "icp" ? "ICP" : "Sats"}
								</p>
							</div>
							<p className="mt-[6px] text-sm leading-none font-normal text-white/60 md:mt-[12px]">
								{chain === "icp" ? (
									<PriceRewardsIcp data={rewardStats?.reward?.total || "0"} />
								) : (
									<PriceRewardsSats data={rewardStats?.reward?.total || "0"} />
								)}
							</p>
						</div>
						<div className="flex h-[148px] flex-col justify-center border-r border-b border-neutral-800 px-5 md:h-auto md:flex-1">
							<p className="text-sm leading-none font-normal text-white/50">
								Withdrawal completed
							</p>
							<div className="mt-2 flex text-2xl leading-none font-medium text-white">
								{rewardStats?.reward?.withdrawn
									? formatNumberSmart(rewardStats?.reward?.withdrawn, {
											shortenLarge: true,
										})
									: "0"}{" "}
								<p className="text ml-1 uppercase">
									{chain === "icp" ? "ICP" : "Sats"}
								</p>
							</div>
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
						<div className="flex h-[148px] items-center justify-center border-r border-neutral-800 px-5 md:h-auto md:flex-1">
							<div className="flex flex-1 flex-col">
								<p className="text-sm leading-none font-normal text-white/50">
									Can withdraw
								</p>
								<div className="mt-2 flex text-2xl leading-none font-medium text-white">
									{rewardStats?.reward?.available
										? formatNumberSmart(rewardStats?.reward?.available, {
												shortenLarge: true,
											})
										: "0"}{" "}
									<p className="text ml-1 uppercase">
										{chain === "icp" ? "ICP" : "Sats"}
									</p>
								</div>
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

					<div className="order-2 flex w-full flex-col md:order-3 md:mt-[30px]">
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

						<div className="no-scrollbar relative mt-4 h-[331px] flex-shrink-0 overflow-x-scroll rounded-xl bg-[#191919]">
							{tab === "invitation" && <InvitationTable data={myInvitees} />}
							{tab === "withdrawal" && <WithdrawalTable data={myWithdraw} />}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
