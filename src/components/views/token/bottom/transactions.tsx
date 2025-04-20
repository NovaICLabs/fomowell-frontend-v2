import { useMemo } from "react";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { getAvatar } from "@/lib/common/avatar";
import { exampleImage } from "@/lib/common/img";
import { cn } from "@/lib/utils";
type Transaction = {
	id: string;
	maker: string;
	type: "Buy" | "Sell";
	price: string;
	amount: string;
	total: string;
	fee: string;
	time: string;
};

export default function Transactions() {
	const data = useMemo<Array<Transaction>>(
		() => [
			{
				id: "1",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$26.71",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
			{
				id: "2",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$6.83",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "3",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$95.74",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "4",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$98.50",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "5",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$7.43",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "6",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$68.83",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "7",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$67.96",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "8",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$77.41",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
			{
				id: "3",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$95.74",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "4",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$98.50",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "5",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$7.43",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "6",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$68.83",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "7",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$67.96",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "8",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$77.41",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
			{
				id: "3",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$95.74",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "4",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$98.50",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "5",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$7.43",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "6",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$68.83",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "7",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$67.96",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "8",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$77.41",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
			{
				id: "3",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$95.74",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "4",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$98.50",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "5",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$7.43",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "6",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$68.83",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "7",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$67.96",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "8",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$77.41",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
			{
				id: "3",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$95.74",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "4",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$98.50",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "5",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$7.43",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "6",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$68.83",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "7",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$67.96",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "8",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$77.41",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
			{
				id: "3",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$95.74",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "4",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$98.50",
				amount: "9.4K",
				total: "$240,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "5",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$7.43",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "6",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$68.83",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "4m ago",
			},
			{
				id: "7",
				maker: "Star7p...6op",
				type: "Sell",
				price: "$67.96",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "5m ago",
			},
			{
				id: "8",
				maker: "Star7p...6op",
				type: "Buy",
				price: "$77.41",
				amount: "9.4K",
				total: "$250,059.00",
				fee: "0.00001 BTC",
				time: "6m ago",
			},
		],
		[]
	);

	const columnHelper = createColumnHelper<Transaction>();

	const columns = useMemo(
		() => [
			// Maker column
			columnHelper.accessor("maker", {
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
								src={getAvatar(exampleImage)}
							/>
							<span className="text-center text-sm font-medium text-white/60">
								{info.getValue()}
							</span>
						</div>
					</div>
				),
				size: 150,
			}),
			// Type column
			columnHelper.accessor("type", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Type</span>
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isSell = value === "Sell";
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4",
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
			columnHelper.accessor("amount", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Amount</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/60">
							{info.getValue()}
						</span>
					</div>
				),
				size: 100,
			}),
			// Total USD column
			columnHelper.accessor("total", {
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
								info.row.original.type === "Sell"
									? "text-price-negative"
									: "text-price-positive"
							)}
						>
							{info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}), // Price column
			columnHelper.accessor("price", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Price</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/60">
							{100} Sats (
							<span
								className={cn(
									"text-sm leading-4",
									info.row.original.type === "Sell"
										? "text-price-negative"
										: "text-price-positive"
								)}
							>
								{info.getValue()}
							</span>
							)
						</span>
					</div>
				),
				size: 150,
			}),
			// Fee column
			columnHelper.accessor("fee", {
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
			columnHelper.accessor("time", {
				header: () => <div className="w-full text-end">Time</div>,
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<div className="w-full text-end text-sm leading-4 text-white/60">
							{info.getValue()}
						</div>
					</div>
				),
				size: 120,
			}),
		],
		[columnHelper]
	);

	const table = useReactTable({
		data,
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
