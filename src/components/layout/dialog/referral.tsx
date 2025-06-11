import { useEffect, useState } from "react";

import copy from "copy-to-clipboard";

import { getIcUserRewardStats } from "@/apis/reward";
import { getBtcUserRewardStats } from "@/apis/reward-btc";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/utils/toast";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
import { useChainStore } from "@/store/chain";
import { useIcIdentityStore } from "@/store/ic";

type ReferralProps = {
	referralLink: string;
	referralText: Array<string>;
	referrals: number;
	earned: string;
};

export const ReferralContent: React.FC<ReferralProps> = ({
	referralLink,
	referralText,
	referrals,
	earned,
}) => {
	const { chain } = useChainStore();

	return (
		<div className="relative flex w-full">
			<img
				alt="fomowell"
				className="flex w-full"
				src="/images/referral-dialog-bg.png"
			/>
			<div className="absolute top-0 left-0 flex h-full min-h-[500px] w-full flex-col justify-between p-5">
				<div className="flex flex-col">
					<div className="flex w-full flex-col">
						<img
							alt="fomowell"
							className="w-[135px]"
							src="/images/logo/fomowell.png"
						/>
						<p className="mt-5 text-2xl leading-[100%] font-semibold text-white">
							Invite your friends
						</p>
						<p className="mt-[16px] text-sm leading-[100%] font-normal text-white/60">
							Share your unique referral link with them.
						</p>
					</div>
					<div className="mt-[64px] flex flex-col gap-y-5">
						{referralText.map((item, index) => (
							<div key={index} className="flex w-full items-center">
								<div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#ebcf85]" />
								<p className="ml-[6px] text-xs leading-[100%] font-normal text-[#eace85]">
									{item}
								</p>
							</div>
						))}
					</div>
				</div>
				<div className="flex w-full flex-col">
					<p className="text-lg leading-none font-semibold text-[#111111]">
						Invitation code
					</p>
					<div className="mt-[18px] flex w-full items-center">
						<div className="flex h-[38px] flex-1 items-center truncate rounded-[10px] border border-[#101010]/60 text-sm font-normal text-[#101010]">
							<input
								disabled
								className="mx-2 h-full w-full text-left outline-none"
								value={referralLink}
							></input>
						</div>
						<img
							alt="fomowell"
							className="ml-3 h-3.5 w-3.5 flex-shrink-0 cursor-pointer"
							src="/svgs/copy-dark.svg"
							onClick={withStopPropagation(() => {
								copy(referralLink ?? "");
								showToast("success", "Copy Successfully");
							})}
						/>
					</div>
					<div className="mt-[16px] flex w-full justify-between">
						<p className="text-sm font-medium text-[#101010]">
							Referrals: {referrals} users
						</p>
						<p className="text-sm font-medium text-[#101010]">
							{chain === "icp" ? "ICP" : "SATS"} Earned: {earned}{" "}
							{chain === "icp" ? "ICP" : "SATS"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const ReferralDialog: React.FC<
	ReferralProps & { open: boolean; setOpen: (open: boolean) => void }
> = ({ open, setOpen, referralLink, referralText }) => {
	const { chain } = useChainStore();
	const { jwt_token: btcJwtToken } = useBtcIdentityStore();
	const { jwt_token: icJwtToken } = useIcIdentityStore();

	const [referrals, setReferrals] = useState<number>(0);
	const [earned, setEarned] = useState<string>("0");

	useEffect(() => {
		if (chain === "icp" && icJwtToken) {
			void getIcUserRewardStats(icJwtToken).then((result) => {
				if (!result) {
					return;
				}
				setReferrals(result?.level1Count + result?.level2Count);
				setEarned(result?.reward.total);
			});
		}

		if (chain === "bitcoin" && btcJwtToken) {
			void getBtcUserRewardStats(btcJwtToken).then((result) => {
				if (!result) {
					return;
				}
				setReferrals(result?.level1Count + result?.level2Count);
				setEarned(result?.reward.total);
			});
		}
	}, [btcJwtToken, chain, icJwtToken]);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(show: boolean) => {
					setOpen(show);
				}}
			>
				<DialogContent
					className={cn(
						"border-gray-755 bg-gray-755 transition-height flex w-[398px] flex-col rounded-3xl px-5 py-6 text-white duration-300"
					)}
				>
					<DialogHeader>
						<DialogTitle className="text-left text-lg font-semibold text-white">
							Referral
						</DialogTitle>
					</DialogHeader>

					<ReferralContent
						earned={earned}
						referralLink={referralLink}
						referralText={referralText}
						referrals={referrals}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ReferralDialog;
