import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { TypeReferralListItem } from "..";

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
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		{
			id: "level",
			label: "Level",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		{
			id: "transaction-amount",
			label: "Transaction amount ",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		{
			id: "fee",
			label: "Fee",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
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
			onClick={() => {}}
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

const InvitationTable = () => {
	const [sortBy, setSortBy] = useState<string>("");
	const [list, setList] = useState<Array<TypeReferralListItem> | undefined>(
		undefined
	);

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

	return (
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
	);
};

export default InvitationTable;
