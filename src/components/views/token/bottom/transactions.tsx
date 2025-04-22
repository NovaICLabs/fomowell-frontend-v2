import { useMemo } from "react";

import { useParams } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { BigNumber } from "bignumber.js";

import { getICPCanisterToken } from "@/canisters/icrc3/specials";
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

export default function Transactions() {
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data } = useInfiniteTokenTransactionsHistory({
		token0: id,
	});
	const columnHelper = createColumnHelper<Transaction>();
	const { data: icpPrice } = useICPPrice();
	const columns = useMemo(
		() => [
			// Maker column
			columnHelper.accessor("token1", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Maker</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center gap-1">
						<div className="flex items-center gap-1">
							<img
								alt=""
								className="h-4 w-4 rounded-full"
								src={getAvatar(info.getValue())}
							/>
							<span className="text-center text-sm font-medium text-white/60">
								{truncatePrincipal(info.getValue())}
							</span>
						</div>
					</div>
				),
				size: 150,
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
							<span
								className={cn(
									"text-sm leading-4",
									info.row.original.tradeType === "sell"
										? "text-price-negative"
										: "text-price-positive"
								)}
							>
								{formatNumberSmart(
									BigNumber(1)
										.times(10 ** getICPCanisterToken().decimals)
										.div(BigNumber(info.getValue()))
										.toString()
								)}
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
							{info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}),
			// Time column
			columnHelper.accessor("tradeTs", {
				header: () => <div className="w-full text-end">Time</div>,
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<div className="w-full text-end text-sm leading-4 text-white/60">
							{fromNow(BigInt(info.getValue()))}
						</div>
					</div>
				),
				size: 120,
			}),
		],
		[columnHelper, icpPrice]
	);

	const table = useReactTable({
		data: data?.pages.flatMap((page) => page.data) ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 120,
		},
	});
	return (
		<div className="no-scrollbar h-screen overflow-auto">
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
					{table.getRowModel().rows.map((row) => (
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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
