import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";
import { isMobile } from "react-device-detect";

import { getICPCanisterId } from "@/canisters/icrc3";
import { CopyIcon } from "@/components/icons/common/copy";
import { EditIcon } from "@/components/icons/common/edit";
import WithdrawIcon from "@/components/icons/common/withdraw";
import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/utils/toast";
import ProfileActivity from "@/components/views/icp/profile/activity";
import ProfileCreatedTokens from "@/components/views/icp/profile/create-list";
import EditInfoModal from "@/components/views/icp/profile/edit-info-modal";
import ProfileHoldings from "@/components/views/icp/profile/holdings";
import { useUserInfo } from "@/hooks/apis/user";
import { useClaimFaucet, useCoreTokenBalance } from "@/hooks/ic/core";
import { getAvatar } from "@/lib/common/avatar";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore } from "@/store/ic";

export const Route = createFileRoute("/icp/profile/$userid")({
	component: UserId,
});
const UserInfo = () => {
	const { userid } = Route.useParams();

	const [principalCopied, setPrincipalCopied] = useState(false);
	const { identityProfile } = useIcIdentityStore();

	const { data: userInfo, refetch: refetchUserInfo } = useUserInfo(userid);

	const [isShow, setIsShow] = useState<boolean>(false);

	// is self
	const isSelf = userid === identityProfile?.principal;
	return (
		<div className="flex items-center gap-2">
			<EditInfoModal
				initAvatar={userInfo?.avatar ?? getAvatar(userid)}
				open={isShow}
				setOpen={(open: boolean) => {
					setIsShow(open);
				}}
				onSuccess={() => {
					void refetchUserInfo();
				}}
			/>
			{userInfo ? (
				<div
					className="h-16 w-16 rounded-full"
					style={{
						backgroundImage: `url(${userInfo.avatar ?? getAvatar(userid)})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				></div>
			) : (
				<Skeleton className="h-16 w-16 rounded-full"></Skeleton>
			)}

			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					{userInfo ? (
						<span className="text-lg font-semibold">{userInfo.name}</span>
					) : (
						<Skeleton className="h-7 w-20"></Skeleton>
					)}

					{isSelf && (
						<span
							onClick={() => {
								setIsShow(true);
							}}
						>
							<EditIcon />
						</span>
					)}
				</div>
				<div className="flex items-center text-xs text-gray-400">
					<span>ID: {truncatePrincipal(userid)}</span>
					{principalCopied ? (
						<Check className="ml-1 opacity-40" size={16} strokeWidth={4} />
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
	);
};
function UserId() {
	const { userid } = Route.useParams();
	const [activeTab, setActiveTab] = useState("Created");
	const { identityProfile } = useIcIdentityStore();
	const { data: coreTokenBalance } = useCoreTokenBalance({
		owner: userid,
		token: { ICRCToken: getICPCanisterId() },
	});
	// const { data: icpPrice } = useICPPrice();
	// const usdValue =
	// 	coreTokenBalance && icpPrice
	// 		? getTokenUsdValueTotal({ amount: coreTokenBalance.raw }, icpPrice)
	//         : "--";

	const { setDepositWithdrawOpen } = useDialogStore();
	const { mutateAsync: claimFaucet, isPending: isClaimingFaucet } =
		useClaimFaucet();

	// is self
	const isSelf = userid === identityProfile?.principal;
	return (
		<div className="flex h-full w-full flex-1 flex-col overflow-auto pt-5">
			<div
				className={cn(
					"sticky mb-5 flex h-[162px] w-full gap-x-5",
					isMobile && "h-auto"
				)}
			>
				<div
					className={cn(
						"bg-gray-760 relative flex w-full gap-x-2 rounded-2xl p-5",
						isMobile && "bg-background p-0 pl-2.5"
					)}
				>
					<UserInfo />
					<div
						className={cn(
							"absolute top-1/2 right-5 flex -translate-y-1/2 gap-x-6",
							isSelf ? "flex" : "hidden",
							isMobile && "hidden"
						)}
					>
						<div className="relative flex h-9 w-[102px] items-center justify-center rounded-full p-[2px]">
							<Button
								className="disabled:bg-gray-710 dark:hover:bg-gray-710 dark:bg-background z-1 h-full w-full rounded-full bg-transparent text-xs text-white disabled:opacity-100"
								disabled={isClaimingFaucet}
								onClick={async () => {
									try {
										await claimFaucet();
										showToast("success", "100 tICP claimed");
									} catch (error) {
										console.debug("🚀 ~ onClick={ ~ error:", error);
										showToast("error", "Can only claim once per day");
									}
								}}
							>
								{isClaimingFaucet ? "Claiming..." : "Get 100 tICP"}
							</Button>
							<div className="absolute inset-0 top-px right-px bottom-px left-px z-0 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500"></div>
						</div>
						<Button className="rounded-full">
							<img alt="Refer to earn" src="/svgs/common/refer.svg" />
							Refer to earn
						</Button>
					</div>
				</div>
				<div
					className={cn(
						"bg-gray-760 flex w-120 flex-col items-center rounded-2xl p-5",
						isMobile && "hidden"
					)}
				>
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
						<div className={cn("mt-4 flex gap-4", isSelf ? "flex" : "hidden")}>
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
						<div className="bg-gray-760 h-full overflow-auto rounded-2xl p-5 text-white/60">
							<ProfileHoldings />
						</div>
					)}
					{activeTab === "Created" && (
						<div className="bg-gray-760 h-full overflow-auto rounded-2xl p-5 text-white/60">
							<ProfileCreatedTokens />
						</div>
					)}
					{activeTab === "Activity" && (
						<div className="bg-gray-760 h-full overflow-auto rounded-2xl p-5 text-white/60">
							<ProfileActivity />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
