import { ReferralContent } from "@/components/layout/dialog/referral";

export default function ReferralPage() {
	const withdrawal = [
		"Each withdrawal requires a minimum of 1 ICP to be eligible for application (if not met, it will continue to accumulate).",
		"Withdrawals usually arrive within 24 hours, and you can also query the blockchain transaction hash.",
		"All commission rewards will be accumulated once credited, and withdrawals will be deducted based on the total amount.",
	];

	return (
		<div className="no-scrollbar flex h-full w-full overflow-x-scroll">
			<div className="flex w-[350px] flex-col">
				<ReferralContent
					earnedTotal={0}
					referralLink={"test link"}
					referralsTotal={2}
					referralText={[
						"First-level commission rebate: 10%",
						"Secondary commission rebate: 5%",
					]}
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
					<div className="flex flex-col gap-y-[27px]">
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
			<div className="ml-5 flex flex-1 flex-col">
				<div className="flex h-[212px] w-full gap-x-[13px] rounded-xl border border-[#f7b406] bg-[#111111] p-3">
					<div className="flex h-[188px] flex-1 items-end justify-center gap-x-[80px] rounded-xl bg-[#191919] pb-[30px]">
						<div className="flex flex-col gap-y-[13px]">
							<p className="text-sm font-normal text-white/50">
								Claimed Rewards:
							</p>
							<p className="text-base font-medium text-white">250 ICP</p>
						</div>
						<div className="flex flex-col gap-y-[13px]">
							<p className="text-sm font-normal text-white/50">Invitee:</p>
							<p className="text-base font-medium text-white">255</p>
						</div>
					</div>
					<div className="flex h-[188px] flex-1 items-end justify-center gap-x-[80px] rounded-xl bg-[#191919] pb-[30px]">
						<div className="flex flex-col gap-y-[13px]">
							<p className="text-sm font-normal text-white/50">
								Claimed Rewards:
							</p>
							<p className="text-base font-medium text-white">150 ICP</p>
						</div>
						<div className="flex flex-col gap-y-[13px]">
							<p className="text-sm font-normal text-white/50">Invitee:</p>
							<p className="text-base font-medium text-white">255</p>
						</div>
					</div>
					<div className="flex h-[188px] flex-1 items-end justify-center gap-x-[80px] rounded-xl bg-[#191919] pb-[30px]">
						<div className="flex flex-col gap-y-[13px]">
							<p className="text-sm font-normal text-white/50">
								Claimed Rewards:
							</p>
							<p className="text-base font-medium text-white">250 ICP</p>
						</div>
						<div className="flex flex-col gap-y-[13px]">
							<p className="text-sm font-normal text-white/50">Invitee:</p>
							<p className="text-base font-medium text-white">255</p>
						</div>
					</div>
				</div>
				<div className="flex"></div>
			</div>
		</div>
	);
}
