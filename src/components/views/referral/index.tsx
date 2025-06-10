import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { ReferralContent } from "@/components/layout/dialog/referral";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useBtcIdentityStore } from "@/store/btc";
import { useIcIdentityStore } from "@/store/ic";

const ReferralHeader = ({
	sortBy,
	setSortBy,
}: {
	sortBy: string;
	setSortBy: (sortBy: string) => void;
}) => {
	const headers = [
		{
			id: "time",
			label: "Time",
			sortable: false,
			className:
				"min-w-[18%] w-[180px] pr-[10px] pl-[20px] md:w-[400px] sticky left-0 bg-[#191919] z-[1]",
		},
		{
			id: "invitee",
			label: "Invitee",
			sortable: true,
			className: "min-w-[14%] w-[120px] md:w-[220px]",
		},
		{
			id: "level",
			label: "Level",
			sortable: true,
			className: "min-w-[14%] w-[120px] md:w-[220px]",
		},
		{
			id: "transaction-amount",
			label: "Transaction amount ",
			sortable: true,
			className: "min-w-[14%] w-[120px] md:w-[220px]",
		},
		{
			id: "fee",
			label: "Fee",
			sortable: true,
			className: "min-w-[14%] w-[120px] md:w-[220px]",
		},
		{
			id: "my-invitation-rebate",
			label: "My invitation Rebate",
			sortable: true,
			className:
				"min-w-[10%] w-[100px] pl-[10px] md:w-[220px] sticky right-0 bg-[#191919] z-[1]",
		},
	];

	const handleSort = (field: string): void => {
		if (sortBy === `${field}-up`) {
			setSortBy(`${field}-down`);
		} else if (sortBy === `${field}-down`) {
			setSortBy("");
		} else {
			setSortBy(`${field}-up`);
		}
	};

	const renderSortArrows = (field: string) => {
		return (
			<div className="relative ml-2 flex flex-shrink-0 flex-col gap-y-[2px]">
				<div
					className={cn(
						"h-0 w-0 border-x-[3.5px] border-b-[4px] border-x-transparent border-b-[#ffff]/40",
						sortBy === `${field}-up` && "border-b-[#ffffff]"
					)}
				/>
				<div
					className={cn(
						"h-0 w-0 border-x-[3.5px] border-t-[4px] border-x-transparent border-t-[#ffff]/40",
						sortBy === `${field}-down` && "border-t-[#ffffff]"
					)}
				/>
			</div>
		);
	};

	return (
		<tr className="flex h-[48px] w-full items-center border-b border-[#262626]">
			{headers.map((header) => (
				<th
					key={header.id}
					className={cn(
						`flex h-full items-center text-left text-xs leading-none font-medium text-white/40`,
						header.className,
						header.sortable &&
							"flex cursor-pointer items-center hover:text-white/60"
					)}
					onClick={() => {
						if (header.sortable) {
							handleSort(header.id);
						}
					}}
				>
					{header.label}
					{header.sortable && renderSortArrows(header.id)}
				</th>
			))}
		</tr>
	);
};

const ReferralListItemSkeleton = () => {
	return (
		<>
			{Array.from({ length: 15 }).map((_, index) => (
				<div
					key={index}
					className="flex h-[70px] w-full flex-shrink-0 items-center justify-center border-b border-[#262626]"
				>
					<Skeleton className="h-[70px] w-full" />
				</div>
			))}
		</>
	);
};

type TypeReferralListItem = {
	id: number;
};
const ReferralListItem = ({ itemData }: { itemData: TypeReferralListItem }) => {
	const transparentBg = "rgba(0, 0, 0, 0)";
	const yellowBg = "rgba(247, 180, 6)";
	const rowVariants = {
		initial: { backgroundColor: transparentBg },
		flash: {
			backgroundColor: [
				yellowBg,
				yellowBg,
				transparentBg,
				transparentBg,
				yellowBg,
				yellowBg,
				transparentBg,
				transparentBg,
			],
			transition: {
				duration: 0.8,
				ease: "linear",
				times: [0, 0.15, 0.151, 0.3, 0.301, 0.45, 0.451, 1],
			},
		},
		normal: { backgroundColor: transparentBg },
	};

	return (
		<motion.tr
			key={itemData.id}
			className="group relative flex h-[70px] items-center border-b border-[#262626] duration-300 hover:!bg-[#262626]"
			initial="initial"
			variants={rowVariants}
			onClick={() => {
				// void router.navigate({
				// 	to: `/${chain === 'icp' ? 'icp':'btc'}/token/$id`,
				// 	params: { id: row.original.memeTokenId.toString() },
				// });
			}}
		>
			<div className="sticky left-0 z-[1] flex h-full w-[180px] min-w-[18%] items-center bg-[#191919] pr-[10px] pl-[20px] text-left text-xs leading-none font-medium text-white/60 duration-300 group-hover:!bg-[#262626] md:w-[400px]">
				<p className="text-sm font-normal text-white/60">06/08/2025</p>
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] items-center text-left text-sm leading-4 font-medium text-white/60 md:w-[220px]">
				<img
					alt=""
					className="mr-1 h-6 w-6 rounded-full"
					src="https://image-uploader.sophiamoon231.workers.dev/1749260495081-f2s89pv8438.jpeg"
				/>
				<p className="text-sm font-normal text-white/60">5an7p-...-6qe</p>
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] flex-col justify-center text-left md:w-[220px]">
				<p className="text-sm font-normal text-white/60">First</p>
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] items-center text-left text-sm leading-4 font-medium text-white md:w-[220px]">
				<p className="text-sm font-normal text-white/60">$1100.36</p>
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] flex-col justify-center text-left text-sm leading-4 font-medium text-white/60 md:w-[220px]">
				<p className="text-sm font-normal text-white/60">3.14 ICP</p>
			</div>
			<div className="sticky right-0 z-[1] flex h-full w-[100px] min-w-[10%] items-center bg-[#191919] pl-[10px] text-left text-sm leading-4 font-medium text-white/60 duration-300 group-hover:!bg-[#262626] md:w-[220px]">
				<p className="text-sm font-normal text-white/60">0.314 ICP</p>
			</div>
		</motion.tr>
	);
};

export default function ReferralPage() {
	const { identityProfile: identityProfileBTC } = useBtcIdentityStore();
	const { identityProfile: identityProfileIc } = useIcIdentityStore();

	const { chain } = useChainStore();

	const [tab, setTab] = useState<"invitation" | "withdrawal">("invitation");
	const [sortBy, setSortBy] = useState<string>("");
	const [list, setList] = useState<Array<TypeReferralListItem> | undefined>(
		undefined
	);

	const withdrawal = [
		"Each withdrawal requires a minimum of 1 ICP to be eligible for application (if not met, it will continue to accumulate).",
		"Withdrawals usually arrive within 24 hours, and you can also query the blockchain transaction hash.",
		"All commission rewards will be accumulated once credited, and withdrawals will be deducted based on the total amount.",
	];

	const onWithdraw = () => {
		console.log("🚀 ~ onWithdraw ~ onWithdraw:", onWithdraw);
	};

	const sortedList = useMemo(() => {
		if (!list) {
			return undefined;
		}
		return list;
	}, [list]);

	useEffect(() => {
		const data: Array<TypeReferralListItem> = [
			{
				id: 1,
			},
		];

		setTimeout(() => {
			setList(data);
		}, 1000);
	}, [sortBy]);

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
					<div className="flex h-[188px] flex-1 items-end justify-center gap-x-[80px] rounded-xl bg-[#191919] pb-[30px]">
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
					<div className="flex h-[188px] flex-1 items-end justify-center gap-x-[80px] rounded-xl bg-[#191919] pb-[30px]">
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
					<div className="flex h-[188px] flex-1 items-end justify-center gap-x-[80px] rounded-xl bg-[#191919] pb-[30px]">
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
						<table className="h-full w-full min-w-max">
							<thead className="sticky top-0 z-10">
								<ReferralHeader setSortBy={setSortBy} sortBy={sortBy} />
							</thead>
							<tbody className="flex w-full flex-col">
								{!sortedList && <ReferralListItemSkeleton />}
								{sortedList && sortedList.length ? (
									sortedList.map((item) => (
										<ReferralListItem key={item.id} itemData={item} />
									))
								) : (
									<Empty />
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
