import { ReferralContent } from "@/components/layout/dialog/referral";

export default function ReferralPage() {
	return (
		<div className="no-scrollbar flex h-full w-full flex-col overflow-x-scroll">
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
			</div>
			<div>2</div>
		</div>
	);
}
