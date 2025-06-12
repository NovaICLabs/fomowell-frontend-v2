import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BigNumber } from "bignumber.js";
import { ChevronLeft } from "lucide-react";

import SortsIcon from "@/components/icons/common/sorts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBtcInfiniteTokenList } from "@/hooks/apis/indexer_btc";
import {
	formatNumberSmart,
	formatUnits,
	isNullOrUndefined,
} from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";

import type { BtcTokenInfo, TokenListSortOption } from "@/apis/indexer_btc";

const trendingTimeOptions: Array<{
	label: string;
	value: TokenListSortOption;
}> = [
	{ label: "5m", value: "popularity_5m" },
	{ label: "1h", value: "popularity_1h" },
	{ label: "6h", value: "popularity_6h" },
	{ label: "24h", value: "popularity_24h" },
] as const;

type TrendingTimeOption = (typeof trendingTimeOptions)[number];

function getPriceChangeRate(option: TrendingTimeOption, token: BtcTokenInfo) {
	switch (option.value) {
		case "popularity_5m":
			return token.priceChangeRate5M;
		case "popularity_1h":
			return token.priceChangeRate1H;
		case "popularity_6h":
			return token.priceChangeRate6H;
		case "popularity_24h":
			return token.priceChangeRate24H;
		default:
			return 0;
	}
}
function getVolume(option: TrendingTimeOption, token: BtcTokenInfo) {
	switch (option.value) {
		case "popularity_5m":
			return token.volume5M;
		case "popularity_1h":
			return token.volume1H;
		case "popularity_6h":
			return token.volume6H;
		case "popularity_24h":
			return token.volume24H;
		default:
			return 0;
	}
}

const TableItemsSkeleton = () => {
	return (
		<div className="flex h-12.5 w-full items-center justify-center">
			<Skeleton className="h-12.5 w-full" />
		</div>
	);
};

export default function Trending() {
	const [sort, setSort] = useState<TokenListSortOption>("popularity_5m");
	const [direction, setDirection] = useState<"asc" | "desc">("desc");
	const [isExpanded, setIsExpanded] = useState(true);

	const {
		data,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		status,
		error,
		isFetching,
	} = useBtcInfiniteTokenList({
		sort: sort,
		sortDirection: direction,
		pageSize: 20,
	});

	const items = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data]
	);

	const columnHelper = useMemo(() => createColumnHelper<BtcTokenInfo>(), []);

	const handleSort = useCallback(
		(selectedSort: TokenListSortOption) => {
			const currentDirection =
				selectedSort === sort ? (direction === "asc" ? "desc" : "asc") : "desc";
			setSort(selectedSort);
			setDirection(currentDirection);
		},
		[direction, sort]
	);

	const handleTimeFilterClick = (time: {
		label: string;
		value: TokenListSortOption;
	}) => {
		setSort(time.value);
		setDirection("desc");
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor("ticker", {
				id: "token",
				header: () => (
					<div
						className="flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {})}
					>
						<span className="text-xs font-medium text-white/40 group-hover:text-white">
							Token/Vol
						</span>
					</div>
				),
				cell: (info) => (
					<div className="flex items-center gap-1">
						<div className="relative h-6 w-6 overflow-hidden rounded-full">
							<img
								alt={"logo"}
								className="h-full w-full object-cover"
								src={info.row.original.logo}
							/>
						</div>
						<div className="flex flex-col gap-y-0.5">
							<span className="text-[13px] font-medium text-white uppercase">
								{info.row.original.ticker}
							</span>
							<div className="text-[10px] font-normal">
								<span className="text-white/40">Vol: </span>
								<span>
									{formatNumberSmart(
										formatUnits(
											getVolume({ label: "", value: sort }, info.row.original)
										),
										{
											shortenLarge: true,
										}
									)}{" "}
									sats
								</span>
							</div>
						</div>
					</div>
				),
				size: 150,
			}),

			columnHelper.accessor("price", {
				id: "price",
				header: () => (
					<div
						className="flex cursor-pointer items-center justify-end gap-1"
						onClick={withStopPropagation(() => {
							handleSort("price");
						})}
					>
						<span
							className={cn(
								"text-xs font-medium text-white/40 group-hover:text-white",
								sort === "price" && "text-white"
							)}
						>
							Price/Change
						</span>{" "}
						<SortsIcon direction={direction} selected={sort === "price"} />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const price = isNullOrUndefined(value) ? undefined : BigNumber(value);
					// : BigNumber(1).div(BigNumber(value));
					const priceChangeRate = getPriceChangeRate(
						{ label: "", value: sort },
						info.row.original
					);
					return (
						<div className="flex h-full w-full flex-col items-end justify-center">
							{price === undefined ? (
								<span className="text-[13px] font-medium text-white">--</span>
							) : (
								<span className="text-[13px] font-medium text-white">
									{formatNumberSmart(price, {
										shortZero: true,
									})}
								</span>
							)}
							<span
								className={cn(
									"text-[10px] font-normal",
									isNullOrUndefined(priceChangeRate)
										? "text-white/40"
										: priceChangeRate > 0
											? "text-price-positive"
											: "text-price-negative"
								)}
							>
								{isNullOrUndefined(priceChangeRate)
									? "--"
									: priceChangeRate + "%"}
							</span>
						</div>
					);
				},
				size: 110,
			}),
		],
		[columnHelper, handleSort, sort, direction]
	);

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const router = useRouter();
	const { chain } = useChainStore();

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const parentRef = useRef<HTMLDivElement>(null);
	const tableRows = table.getRowModel().rows;

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? tableRows.length + 1 : tableRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 50,
		overscan: 5,
	});
	const virtualItems = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		if (!virtualItems || virtualItems.length === 0) return;

		const [lastItem] = [...virtualItems].reverse();

		if (!lastItem) {
			return;
		}

		if (
			lastItem.index >= tableRows.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			void fetchNextPage();
		}
	}, [
		hasNextPage,
		fetchNextPage,
		tableRows.length,
		isFetchingNextPage,
		virtualItems,
	]);

	const paddingTop =
		virtualItems.length > 0 ? (virtualItems?.[0]?.start ?? 0) : 0;
	const paddingBottom =
		virtualItems.length > 0
			? rowVirtualizer.getTotalSize() -
				(virtualItems?.[virtualItems.length - 1]?.end ?? 0)
			: 0;

	if (status === "pending") {
		return (
			<div
				className="h-full flex-shrink-0 rounded-2xl"
				style={{ width: isExpanded ? 230 : 0 }}
			>
				{isExpanded ? (
					<div className="flex h-full flex-col p-4 pt-0">
						<div className="flex items-center justify-between">
							<h2 className="text-base font-semibold text-white">Trending</h2>
							<div
								className="flex-shrink-0 cursor-pointer text-gray-400"
								onClick={toggleExpanded}
							>
								<ChevronLeft />
							</div>
						</div>

						<div className="border-gray-710 mt-4 grid grid-cols-4 gap-0 rounded-[12px] border">
							{trendingTimeOptions.map((time, index) => (
								<div
									key={time.value}
									className={cn(
										"bg-gray-860 cursor-pointer py-2 text-center text-sm font-medium",
										sort === time.value
											? "bg-gray-700 text-white"
											: "bg-transparent text-gray-500",
										index === 0 && "rounded-l-[12px]",
										index === trendingTimeOptions.length - 1 &&
											"rounded-r-[12px]"
									)}
									onClick={() => {
										handleTimeFilterClick(time);
									}}
								>
									{time.label}
								</div>
							))}
						</div>
						<div
							ref={parentRef}
							className="no-scrollbar mt-4 flex-1 overflow-y-auto"
						>
							<table className="w-full">
								<thead className="bg-background sticky top-0 z-10">
									{table.getHeaderGroups().map((headerGroup) => (
										<tr key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<th
													key={header.id}
													className="group py-3 text-left text-xs leading-4 font-medium text-white/40"
													style={{ width: header.getSize() }}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody>
									{Array.from({ length: 20 }).map((_, index) => (
										<tr key={`skeleton-${index}`} className="h-12.5">
											<td colSpan={columns.length}>
												<div className="flex h-full w-full items-center justify-center">
													<TableItemsSkeleton />
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div
						className="bg-gray-760 absolute top-20 left-0 inline-flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-r-full text-gray-400"
						onClick={toggleExpanded}
					>
						<ChevronLeft className="rotate-180" />
					</div>
				)}
			</div>
		);
	}

	if (status === "error") {
		return (
			<div
				className="h-full flex-shrink-0 rounded-2xl"
				style={{ width: isExpanded ? 230 : 0 }}
			>
				Error: {error?.message}
			</div>
		);
	}

	return (
		<div
			className="h-full flex-shrink-0 rounded-2xl"
			style={{ width: isExpanded ? 230 : 0 }}
		>
			{isExpanded ? (
				<div className="flex h-full flex-col p-4 pt-0">
					<div className="flex items-center justify-between">
						<h2 className="text-base font-semibold text-white">Trending</h2>
						<div
							className="flex-shrink-0 cursor-pointer text-gray-400"
							onClick={toggleExpanded}
						>
							<ChevronLeft />
						</div>
					</div>

					<div className="border-gray-710 mt-4 grid grid-cols-4 gap-0 rounded-[12px] border">
						{trendingTimeOptions.map((time, index) => (
							<div
								key={time.value}
								className={cn(
									"bg-gray-860 cursor-pointer py-2 text-center text-sm font-medium",
									sort === time.value
										? "bg-gray-700 text-white"
										: "bg-transparent text-gray-500",
									index === 0 && "rounded-l-[12px]",
									index === trendingTimeOptions.length - 1 && "rounded-r-[12px]"
								)}
								onClick={() => {
									handleTimeFilterClick(time);
								}}
							>
								{time.label}
							</div>
						))}
					</div>

					<div
						ref={parentRef}
						className="no-scrollbar mt-4 flex-1 overflow-y-auto"
					>
						<table className="w-full">
							<thead className="bg-background sticky top-0 z-10">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className="group py-3 text-left text-xs leading-4 font-medium text-white/40"
												style={{ width: header.getSize() }}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{paddingTop > 0 && (
									<tr>
										<td style={{ height: `${paddingTop}px` }} />
									</tr>
								)}
								{virtualItems.map((virtualRow) => {
									const isLoaderRow = virtualRow.index >= tableRows.length;

									if (isLoaderRow) {
										return (
											<tr key="loader" className="h-12.5">
												<td colSpan={columns.length}>
													<div className="flex h-full w-full items-center justify-center">
														{hasNextPage ? (
															<TableItemsSkeleton />
														) : (
															<span className="text-sm text-white/40">
																No more tokens
															</span>
														)}
													</div>
												</td>
											</tr>
										);
									}

									const row = tableRows[virtualRow.index];
									return (
										<tr
											key={row?.id}
											className="hover:bg-gray-750 cursor-pointer"
											style={{ height: `${virtualRow.size}px` }}
											onClick={() => {
												void router.navigate({
													to: `/${chain}/token/$id`,
													params: { id: row?.original.memeTokenId.toString() },
												});
											}}
										>
											{row?.getVisibleCells().map((cell) => (
												<td
													key={cell.id}
													className="border-gray-710 h-12.5 border-b p-0 pt-px text-sm text-white"
													style={{ width: cell.column.getSize() }}
												>
													<div className="flex h-full items-center">
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</div>
												</td>
											))}
										</tr>
									);
								})}
								{paddingBottom > 0 && (
									<tr>
										<td style={{ height: `${paddingBottom}px` }} />
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{isFetching && !isFetchingNextPage ? (
						<div className="absolute right-4 bottom-4 text-xs text-white/50">
							Updating...
						</div>
					) : null}
				</div>
			) : (
				<div
					className="bg-gray-760 absolute top-20 left-0 inline-flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-r-full text-gray-400"
					onClick={toggleExpanded}
				>
					<ChevronLeft className="rotate-180" />
				</div>
			)}
		</div>
	);
}
