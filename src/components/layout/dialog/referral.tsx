import copy from "copy-to-clipboard";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/utils/toast";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";

export const ReferralContent: React.FC<{
	referralLink: string;
}> = ({ referralLink }) => {
	return (
		<div className="relative flex w-full">
			<img
				alt="fomowell"
				className="flex w-full"
				src="/images/referral-dialog-bg.png"
			/>
			<div className="absolute top-0 left-0 flex h-full w-full flex-col justify-between p-5">
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
						<div className="flex w-full items-center">
							<div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#ebcf85]" />
							<p className="ml-[6px] text-xs leading-[100%] font-normal text-[#eace85]">
								Inviting friends to log in will earn you 0.5 ICPS.
							</p>
						</div>
						<div className="flex w-full items-center">
							<div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#ebcf85]" />
							<p className="ml-[6px] text-xs leading-[100%] font-normal text-[#eace85]">
								First-level commission rebate: 10%
							</p>
						</div>
						<div className="flex w-full items-center">
							<div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#ebcf85]" />
							<p className="ml-[6px] text-xs leading-[100%] font-normal text-[#eace85]">
								Secondary commission rebate: 5%
							</p>
						</div>
						<div className="flex w-full items-center">
							<div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#ebcf85]" />
							<p className="ml-[6px] text-xs leading-[100%] font-normal text-[#eace85]">
								Third-level anti-bribery: 3%
							</p>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col">
					<p className="text-lg leading-none font-semibold text-[#111111]">
						Invitation code
					</p>
					<div className="mt-[18px] flex w-full items-center">
						<div className="flex h-[38px] flex-1 items-center truncate rounded-[10px] border border-[#101010]/60 text-sm font-normal text-[#101010]">
							<p className="mx-2 truncate text-left">{referralLink}</p>
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
							Referrals: 0 users
						</p>
						<p className="text-sm font-medium text-[#101010]">
							Sats earned: 0 sats
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const ReferralDialog: React.FC<{
	referralLink: string;
}> = ({ referralLink }) => {
	// const [open, setOpen] = useState(false);

	const { referralOpen, setReferralOpen } = useDialogStore();

	return (
		<>
			<Dialog
				open={referralOpen}
				onOpenChange={(show: boolean) => {
					setReferralOpen(show);
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

					<ReferralContent referralLink={referralLink} />
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ReferralDialog;
