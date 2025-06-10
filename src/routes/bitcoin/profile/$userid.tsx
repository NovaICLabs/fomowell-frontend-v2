import { useState } from "react";

import { createFileRoute, useRouter } from "@tanstack/react-router";
import copy from "copy-to-clipboard";
import { Check } from "lucide-react";
import { isMobile } from "react-device-detect";

import { getCkbtcCanisterId } from "@/canisters/core";
import { CopyIcon } from "@/components/icons/common/copy";
// import { EditIcon } from "@/components/icons/common/edit";
import ReferIcon from "@/components/icons/common/refer";
import WithdrawIcon from "@/components/icons/common/withdraw";
import DepositWithdrawIcon from "@/components/icons/links-popover/deposit-withdraw";
import ReferralDialog from "@/components/layout/dialog/referral";
import { Button } from "@/components/ui/button";
import EditInfoModal from "@/components/views/icp/profile/edit-info-modal";
import { useUserInfo } from "@/hooks/apis/user";
import { useBtcCoreTokenBalance } from "@/hooks/btc/core";
import { getAvatar } from "@/lib/common/avatar";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
import { useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";

// import { Skeleton } from "@/components/ui/skeleton";
// import { showToast } from "@/components/utils/toast";
// import ProfileActivity from "@/components/views/icp/profile/activity";
// import ProfileCreatedTokens from "@/components/views/icp/profile/create-list";
// import ProfileHoldings from "@/components/views/icp/profile/holdings";

export const Route = createFileRoute("/bitcoin/profile/$userid")({
	component: UserId,
});
const UserInfo = () => {
	const { userid } = Route.useParams();

	const [principalCopied, setPrincipalCopied] = useState(false);
	const { principal } = useBtcIdentityStore();

	const { data: userInfo, refetch: refetchUserInfo } = useUserInfo(userid);

	const [isShow, setIsShow] = useState<boolean>(false);

	// is self
	const isSelf = userid === principal;

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
			{/* {userInfo ? ( */}
			<div
				className="h-16 w-16 rounded-full"
				style={{
					// userInfo.avatar ??
					backgroundImage: `url(${getAvatar(userid)})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			></div>
			{/* ) : (
				<Skeleton className="h-16 w-16 rounded-full"></Skeleton>
			)} */}

			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					{/* {userInfo ? ( userInfo.name */}
					<span className="text-lg font-semibold">
						{truncatePrincipal(principal ?? "")}
					</span>
					{/* ) : (
						<Skeleton className="h-7 w-20"></Skeleton>
					)} */}

					{isSelf && (
						<span
							onClick={() => {
								setIsShow(true);
							}}
						>
							{/* <EditIcon /> */}
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
	const { principal } = useBtcIdentityStore();
	const { referral2BTCOpen, setReferral2BTCOpen } = useDialogStore();

	const { data: coreTokenBalance } = useBtcCoreTokenBalance({
		owner: principal,
		token: {
			ICRCToken: getCkbtcCanisterId(),
		},
	});
	// const { data: icpPrice } = useICPPrice();
	// const usdValue =
	// 	coreTokenBalance && icpPrice
	// 		? getTokenUsdValueTotal({ amount: coreTokenBalance.raw }, icpPrice)
	//         : "--";

	const { setBtcDepositWithdrawOpen } = useDialogStore();
	// const { mutateAsync: claimFaucet, isPending: isClaimingFaucet } =
	// 	useClaimFaucet();
	const router = useRouter();
	// is self
	const isSelf = userid === principal;

	const domain = window.location.origin;
	const { chain } = useChainStore();

	return (
		<>
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
								isSelf ? "flex" : "hidden"
							)}
							onClick={() => {
								setReferral2BTCOpen(true);
							}}
						>
							<Button className={cn("rounded-full", isMobile && "hidden")}>
								<ReferIcon className="text-black" />
								Refer to Earn
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
							<div className="text-sm font-medium text-gray-400">
								Total Value
							</div>
							<div className="mt-1">
								<span className="text-3xl leading-tight font-bold">
									{coreTokenBalance?.formatted ?? "--"}
								</span>
								<span className="ml-1.5 text-xl leading-tight font-semibold text-gray-300">
									{" "}
									BTC
								</span>
							</div>
							<div
								className={cn("mt-4 flex gap-4", isSelf ? "flex" : "hidden")}
							>
								<Button
									className="h-[38px] w-[103px] rounded-full bg-white text-sm font-semibold hover:bg-white/80"
									onClick={() => {
										setBtcDepositWithdrawOpen({ open: true, type: "deposit" });
									}}
								>
									<DepositWithdrawIcon className="text-black" />
									Deposit
								</Button>
								<Button
									className="bg-gray-710 hover:bg-gray-710/80 h-[38px] w-[103px] rounded-full text-sm font-semibold text-white"
									onClick={() => {
										setBtcDepositWithdrawOpen({ open: true, type: "withdraw" });
									}}
								>
									<WithdrawIcon />
									Withdraw
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div
					className={cn(
						"mt-3 mb-7.5 flex justify-between px-7.5",
						!isMobile && "hidden"
					)}
				>
					<div
						className="flex flex-col items-center gap-y-1.5"
						onClick={() => {
							setBtcDepositWithdrawOpen({
								open: true,
								type: "deposit",
							});
							void router.navigate({ to: "/mobile/bitcoin/deposit-withdraw" });
						}}
					>
						<div className="bg-gray-710 flex h-14 w-14 items-center justify-center rounded-full">
							<DepositWithdrawIcon className="text-yellow-500" size={28} />
						</div>
						<span className="text-sm">Deposit</span>
					</div>
					<div
						className="flex flex-col items-center gap-y-1.5"
						onClick={() => {
							setBtcDepositWithdrawOpen({ open: true, type: "withdraw" });
							void router.navigate({
								to: "/mobile/bitcoin/deposit-withdraw",
							});
						}}
					>
						<div className="bg-gray-710 flex h-14 w-14 items-center justify-center rounded-full">
							<WithdrawIcon className="text-yellow-500" size={28} />
						</div>
						<span className="text-sm">Withdraw</span>
					</div>
					<div
						className="flex flex-col items-center gap-y-1.5"
						onClick={() => {
							setReferral2BTCOpen(true);
						}}
					>
						<div className="bg-gray-710 flex h-14 w-14 items-center justify-center rounded-full">
							<ReferIcon className="text-yellow-500" size={28} />
						</div>
						<span className="text-sm">Refer to Earn</span>
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
						{/* {activeTab === "Holdings" && (
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
					)} */}
					</div>
				</div>
			</div>
			<ReferralDialog
				earnedTotal={0}
				open={referral2BTCOpen}
				referralLink={`${domain}?chain=${chain}&ref=${"123123"}`}
				referralsTotal={1}
				setOpen={setReferral2BTCOpen}
				referralText={[
					"Inviting friends to log in will earn you 0.5 ICPS.",
					"First-level commission rebate: 10%",
					"Secondary commission rebate: 5%",
					"Third-level anti-bribery: 3%",
				]}
			/>
		</>
	);
}
