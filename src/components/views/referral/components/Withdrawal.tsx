import { useState } from "react";

import { motion } from "framer-motion";

import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { MyWithdrawalsItem } from "@/apis/reward-btc";

const headers = [
	{
		id: "time",
		label: "Time",
		sortable: false,
		className: "min-w-[200px] w-[40%] pl-[20px]",
	},
	{
		id: "amount",
		label: "Withdrawal amount (ICP)",
		sortable: false,
		className: "min-w-[200px] w-[40%] pl-[20px]",
	},
	{
		id: "state",
		label: "State",
		sortable: false,
		className: "min-w-[150px] w-[20%]",
	},
];

const WithdrawalHeader = ({
	sortBy,
	setSortBy,
}: {
	sortBy: string;
	setSortBy: (sortBy: string) => void;
}) => {
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

const WithdrawalListItemSkeleton = () => {
	return (
		<>
			{Array.from({ length: 3 }).map((_, index) => (
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

const WithdrawalListItem = ({ itemData }: { itemData: MyWithdrawalsItem }) => {
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
			className="group relative flex h-[70px] items-center border-b border-[#262626] duration-300 hover:!bg-[#262626]"
			initial="initial"
			variants={rowVariants}
			onClick={() => {}}
		>
			<div className="flex h-full min-w-[40%] flex-1 flex-col justify-center pl-[20px] text-left text-sm leading-4 font-medium text-white/60">
				<p className="text-sm font-normal text-white/60">
					{itemData.createdAt}
				</p>
			</div>
			<div className="flex h-full min-w-[40%] flex-1 flex-col justify-center text-left text-sm leading-4 font-medium text-white/60">
				<p className="text-sm font-normal text-white/60">{itemData.amount}</p>
			</div>
			<div className="flex h-full min-w-[20%] flex-1 flex-col justify-center text-left text-sm leading-4 font-medium text-white/60">
				<p className="text-sm font-normal text-white/60">{itemData.status}</p>
			</div>
		</motion.tr>
	);
};

const WithdrawalTable = ({
	data,
}: {
	data: Array<MyWithdrawalsItem> | undefined;
}) => {
	const [sortBy, setSortBy] = useState<string>("");

	// const sortedList = useMemo(() => {
	// 	if (!data) {
	// 		return undefined;
	// 	}

	// 	return data;
	// }, [data]);

	return (
		<table className="h-full w-full min-w-max">
			<thead className="sticky top-0 z-10">
				<WithdrawalHeader setSortBy={setSortBy} sortBy={sortBy} />
			</thead>
			{!data && <WithdrawalListItemSkeleton />}
			{data && !data.length && <Empty />}
			{data && data.length ? (
				<tbody className="flex w-full flex-col">
					{data.map((item, index) => (
						<WithdrawalListItem key={index} itemData={item} />
					))}
				</tbody>
			) : (
				<></>
			)}
		</table>
	);
};

export default WithdrawalTable;
