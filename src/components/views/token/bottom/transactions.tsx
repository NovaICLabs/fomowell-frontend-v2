import { useEffect, useMemo, useRef } from "react";

import { Link, useParams } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BigNumber } from "bignumber.js";

import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import { Skeleton } from "@/components/ui/skeleton";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useInfiniteTokenTransactionsHistory } from "@/hooks/apis/indexer";
import { getAvatar } from "@/lib/common/avatar";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
} from "@/lib/common/number";
import { fromNow } from "@/lib/common/time";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";

import type { Transaction } from "@/apis/indexer";

const TableItemsSkeleton = () => {
	return (
		<div className="flex h-12 w-full items-center justify-center">
			<Skeleton className="h-12 w-full" />
		</div>
	);
};

export default function Transactions() {
	const { id } = useParams({ from: "/icp/token/$id" });
	const {
		data,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		status,
		error,
		isFetching,
	} = useInfiniteTokenTransactionsHistory({
		token0: id,
	});
	const columnHelper = createColumnHelper<Transaction>();
	const { data: icpPrice } = useICPPrice();

	const columns = useMemo(
		() => [
			// Time column
			columnHelper.accessor("tradeTs", {
				header: () => <div className="w-full text-start">Age</div>,
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<div className="w-full text-start text-sm leading-4 text-white/60">
							{fromNow(BigInt(info.getValue()))}
						</div>
					</div>
				),
				size: 120,
			}),

			// Type column
			columnHelper.accessor("tradeType", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Type</span>
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isSell = value === "sell";
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4 capitalize",
									isSell ? "text-price-negative" : "text-price-positive"
								)}
							>
								{value}
							</span>
						</div>
					);
				},
				size: 70,
			}),
			// Amount column
			columnHelper.accessor("token0Amount", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Amount</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/60">
							{formatNumberSmart(formatUnits(info.getValue()), true)}
						</span>
					</div>
				),
				size: 100,
			}),
			// Total USD column
			columnHelper.accessor("token1Amount", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Total USD
						</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span
							className={cn(
								"text-sm leading-4",
								info.row.original.tradeType === "sell"
									? "text-price-negative"
									: "text-price-positive"
							)}
						>
							{getTokenUsdValueTotal(
								{
									amount: BigInt(info.getValue()),
								},
								icpPrice ?? 0
							)}
						</span>
					</div>
				),
				size: 120,
			}), // Price column
			columnHelper.accessor("token1Price", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Price</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/60">
							<span className={cn("text-sm leading-4")}>
								{formatNumberSmart(
									BigNumber(1)
										.times(10 ** getICPCanisterToken().decimals)
										.div(BigNumber(info.getValue()))
										.toString()
								)}{" "}
								ICP
							</span>
						</span>
					</div>
				),
				size: 150,
			}),
			// Fee column
			columnHelper.accessor("token1Volume", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Fee</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/60">
							{formatNumberSmart(
								BigNumber(info.getValue())
									.div(BigNumber(10 ** getICPCanisterToken().decimals))
									.toString()
							)}{" "}
							ICP
						</span>
					</div>
				),
				size: 120,
			}), // Maker column
			columnHelper.accessor("maker", {
				header: () => (
					<div className="group flex cursor-pointer items-center justify-end gap-1">
						<span className="duration-300 group-hover:text-white">Maker</span>
					</div>
				),
				cell: (info) => (
					<Link
						className="flex h-full w-full items-center justify-end gap-1"
						params={{ userid: info.getValue() ?? "" }}
						target="_blank"
						to={"/icp/profile/$userid"}
					>
						<div className="flex items-center gap-1 hover:underline">
							<img
								alt=""
								className="h-4 w-4 rounded-full"
								src={getAvatar(info.getValue() ?? "")}
							/>
							<span className="text-center text-sm font-medium text-white/60">
								{truncatePrincipal(info.getValue() ?? "")}
							</span>
						</div>
					</Link>
				),
				size: 150,
			}),
		],
		[columnHelper, icpPrice]
	);

	const items = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data]
	);

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 120,
		},
	});

	const parentRef = useRef<HTMLDivElement>(null);
	const tableRows = table.getRowModel().rows;

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? tableRows.length + 1 : tableRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 48, // Adjusted estimate size for transaction rows (h-12)
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

	const virtualRows = rowVirtualizer.getVirtualItems();
	const paddingTop =
		virtualRows.length > 0 ? (virtualRows?.[0]?.start ?? 0) : 0;
	const paddingBottom =
		virtualRows.length > 0
			? rowVirtualizer.getTotalSize() -
				(virtualRows?.[virtualRows.length - 1]?.end ?? 0)
			: 0;

	if (status === "pending") {
		return (
			<div className="bg-background flex h-screen w-full flex-col items-center justify-start gap-1 pt-10">
				{Array.from({ length: 12 }).map((_, index) => (
					<Skeleton key={index} className="h-11.5 w-full" />
				))}
			</div>
		);
	}
	if (status === "error") {
		return <span>Error: {error?.message}</span>;
	}

	return (
		<div ref={parentRef} className="no-scrollbar h-screen overflow-auto">
			<table className="w-full" style={{ minWidth: "max-content" }}>
				<thead className="bg-background sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="border-gray-710">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="border-gray-710 border-b p-3 text-left text-xs leading-4 font-medium text-white/40"
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
					{virtualRows.map((virtualRow) => {
						const isLoaderRow = virtualRow.index >= tableRows.length;

						if (isLoaderRow) {
							return (
								<tr key="loader" className="h-12">
									<td colSpan={columns.length}>
										<div className="flex h-full w-full items-center justify-center">
											{hasNextPage ? (
												<TableItemsSkeleton />
											) : (
												<span className="text-sm text-white/40">
													No more transactions
												</span>
											)}
										</div>
									</td>
								</tr>
							);
						}
						const row = tableRows[virtualRow.index] as Row<Transaction>;
						return (
							<tr
								key={row.id}
								className="group hover:bg-gray-750 relative duration-300"
							>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className="border-gray-710 h-12 border-b p-0 pt-px text-sm text-white"
										style={{ width: cell.column.getSize() }}
									>
										<div className="flex h-full items-center p-3">
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
			{isFetching && !isFetchingNextPage ? (
				<div className="fixed right-4 bottom-4 text-white/50">
					Background Updating...
				</div>
			) : null}
		</div>
	);
}
