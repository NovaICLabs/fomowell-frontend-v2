import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Star } from "@/components/icons/star";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const LiquidityHeader = ({
	sortBy,
	setSortBy,
}: {
	sortBy: string;
	setSortBy: (sortBy: string) => void;
}) => {
	const headers = [
		{
			id: "token",
			label: "Token",
			sortable: false,
			className:
				"w-[150px] pl-[50px] md:w-[400px] sticky left-0 bg-[#1E1E1E] z-[1]",
		},
		{
			id: "create",
			label: "Create",
			sortable: true,
			className: "w-[120px] md:w-[220px]",
		},
		{
			id: "mkt-cap",
			label: "Mkt cap",
			sortable: true,
			className: "w-[120px] md:w-[220px]",
		},
		{
			id: "total-liq",
			label: "Total liq",
			sortable: true,
			className: "w-[120px] md:w-[220px]",
		},
		{
			id: "fees",
			label: "Fees",
			sortable: true,
			className: "w-[120px] md:w-[220px]",
		},
		{
			id: "total-swap",
			label: "Total swap",
			sortable: true,
			className: "w-[120px] md:w-[220px]",
		},
		{
			id: "add-liquidity",
			label: "Add Liquidity",
			sortable: false,
			className: "w-[120px] md:w-[220px] sticky right-0 bg-[#1E1E1E] z-[1]",
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

const LiquidityListItemSkeleton = () => {
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

type TypeLiquidityListItem = {
	id: number;
	isFollow?: boolean | undefined;
};
const LiquidityListItem = ({
	itemData,
}: {
	itemData: TypeLiquidityListItem;
}) => {
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
				// 	to: `/${chain}/token/$id`,
				// 	params: { id: row.original.memeTokenId.toString() },
				// });
			}}
		>
			<Star
				className="ml-[20px] h-4 w-4 shrink-0 cursor-pointer text-white/40"
				isActive={itemData.isFollow}
				// onClick={withStopPropagation(() => {
				// 	favoriteToken({
				// 		tokenId: token.memeTokenId.toString(),
				// 	});
				// })}
			/>
		</motion.tr>
	);
};

export default function LiquidityPage() {
	const [sortBy, setSortBy] = useState<string>("");

	const [list, setList] = useState<Array<TypeLiquidityListItem> | undefined>(
		undefined
	);

	const sortedList = useMemo(() => {
		if (!list) {
			return undefined;
		}
		return list;
	}, [list]);

	useEffect(() => {
		const data = [
			{ id: 1, isFollow: true },
			{ id: 2, isFollow: false },
			{ id: 3, isFollow: true },
		];
		setTimeout(() => {
			setList(data);
		}, 1000);
	}, [sortBy]);

	return (
		<div className="no-scrollbar flex h-full w-full flex-col overflow-x-scroll">
			<table className="h-full w-full min-w-max">
				<thead className="sticky top-0 z-10">
					<LiquidityHeader setSortBy={setSortBy} sortBy={sortBy} />
				</thead>
				<tbody className="flex w-full flex-col">
					{!sortedList && <LiquidityListItemSkeleton />}
					{sortedList && sortedList.length ? (
						sortedList.map((item) => (
							<LiquidityListItem key={item.id} itemData={item} />
						))
					) : (
						<Empty />
					)}
				</tbody>
			</table>
		</div>
	);
}
