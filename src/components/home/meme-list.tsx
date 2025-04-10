import { useMemo } from "react";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

type Token = {
	id: string;
	name: string;
	symbol: string;
	time: string;
	amount: string;
	price: string;
	percentages: Record<string, string>;
	icp: {
		amount: string;
		price: string;
	};
	progress: number;
};

export default function MemeList() {
	// Use useMemo to avoid infinite loops caused by data recreation
	const data = useMemo<Array<Token>>(
		() => [
			{
				id: "1",
				name: "Krizz",
				symbol: "BTC/ICP",
				time: "5m",
				amount: "0.0016 BTC",
				price: "$10.32K",
				percentages: {
					"12.5%": "+12.5%",
					"32.3%": "+32.3%",
					"12.9%": "+12.9%",
					"32.5%": "+32.5%",
					"16.8%": "+16.8%",
					"8.4%": "+8.4%",
					"22.1%": "+22.1%",
					"19.3%": "+19.3%",
					"7.2%": "+7.2%",
					"14.5%": "+14.5%",
				},
				icp: {
					amount: "0.06 ICP",
					price: "$0.60",
				},
				progress: 80,
			},
			{
				id: "2",
				name: "Krizz",
				symbol: "SOL/ICP",
				time: "10m",
				amount: "0.008 BTC",
				price: "$10.32K",
				percentages: {
					"12.5%": "-4.5%",
					"32.3%": "-10.3%",
					"12.9%": "-1.9%",
					"32.5%": "-1.5%",
					"16.8%": "-5.8%",
					"8.4%": "-3.4%",
					"22.1%": "-7.1%",
					"19.3%": "-8.3%",
					"7.2%": "-2.2%",
					"14.5%": "-9.5%",
				},
				icp: {
					amount: "0.06 ICP",
					price: "$0.60",
				},
				progress: 30,
			},
			{
				id: "3",
				name: "Krizz",
				symbol: "ETH/ICP",
				time: "30m",
				amount: "0.048 BTC",
				price: "$10.32K",
				percentages: {
					"12.5%": "+3.5%",
					"32.3%": "+3.6%",
					"12.9%": "+3.4%",
					"32.5%": "+3.5%",
					"16.8%": "+3.8%",
					"8.4%": "+3.4%",
					"22.1%": "+3.1%",
					"19.3%": "+3.3%",
					"7.2%": "+3.2%",
					"14.5%": "+3.5%",
				},
				icp: {
					amount: "0.06 ICP",
					price: "$0.60",
				},
				progress: 90,
			},
			{
				id: "4",
				name: "Krizz",
				symbol: "BNB/ICP",
				time: "5m",
				amount: "0.048 BTC",
				price: "$10.32K",
				percentages: {
					"12.5%": "-10.7%",
					"32.3%": "-32.7%",
					"12.9%": "-30.9%",
					"32.5%": "-22.5%",
					"16.8%": "-32.8%",
					"8.4%": "-38.4%",
					"22.1%": "-27.1%",
					"19.3%": "-19.3%",
					"7.2%": "-17.2%",
					"14.5%": "-24.5%",
				},
				icp: {
					amount: "0.06 ICP",
					price: "$0.60",
				},
				progress: 40,
			},
		],
		[]
	);

	const columnHelper = createColumnHelper<Token>();

	// Use useMemo to define columns to avoid re-rendering issues
	const columns = useMemo(
		() => [
			// Left fixed column
			columnHelper.group({
				id: "token",
				header: "Token",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500"></div>
						<div>
							<div className="flex items-center gap-1">
								<span className="font-medium text-white">
									{row.original.name}
								</span>
								<span className="text-xs text-white/60">
									{row.original.symbol}
								</span>
							</div>
							<div className="text-xs text-white/60">{row.original.time}</div>
						</div>
					</div>
				),
				size: 150,
				enablePinning: true,
			}),
			// Price column
			columnHelper.accessor("price", {
				header: "Price",
				cell: (info) => info.getValue(),
				size: 120,
			}),
			// Percentage columns - scrollable area
			columnHelper.accessor((row) => row.percentages["12.5%"], {
				id: "12.5%",
				header: "12.5%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["32.3%"], {
				id: "32.3%",
				header: "32.3%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["12.9%"], {
				id: "12.9%",
				header: "12.9%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["32.5%"], {
				id: "32.5%",
				header: "32.5%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["16.8%"], {
				id: "16.8%",
				header: "16.8%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["8.4%"], {
				id: "8.4%",
				header: "8.4%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["22.1%"], {
				id: "22.1%",
				header: "22.1%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["19.3%"], {
				id: "19.3%",
				header: "19.3%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["7.2%"], {
				id: "7.2%",
				header: "7.2%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.percentages["14.5%"], {
				id: "14.5%",
				header: "14.5%",
				cell: (info) => {
					const value = info.getValue();
					const isNegative = value?.startsWith("-");
					return (
						<span className={isNegative ? "text-red-500" : "text-green-500"}>
							{value}
						</span>
					);
				},
				size: 120,
			}),
			// Volume column
			columnHelper.accessor((row) => row.icp.amount, {
				id: "volume",
				header: "Volume",
				cell: (info) => info.getValue(),
				size: 120,
			}),
			// Right fixed column - fix header alignment issue
			columnHelper.group({
				id: "actions",
				header: "Quick buy",
				cell: () => (
					<div className="flex justify-center">
						<button className="rounded-full bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600">
							Buy
						</button>
					</div>
				),
				size: 120,
				enablePinning: true,
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
		state: {
			// Pin first and last columns
			columnPinning: {
				left: ["token"],
				right: ["actions"],
			},
		},
	});

	return (
		<div className="bg-gray-760 rounded-2xl">
			<div className="relative overflow-hidden">
				{/* Set container max width to ensure scrollbar appears */}
				<div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
					<table className="min-w-[1500px]">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const isPinned =
											header.column.getIsPinned() === "left" ||
											header.column.getIsPinned() === "right";

										return (
											<th
												key={header.id}
												className="bg-gray-760 border-b border-gray-800 p-3 text-left text-sm font-medium text-white/60"
												style={{
													width: header.getSize(),
													position: isPinned ? "sticky" : undefined,
													left:
														header.column.getIsPinned() === "left"
															? `${header.getStart("left")}px`
															: undefined,
													right:
														header.column.getIsPinned() === "right"
															? `0px`
															: undefined,
													zIndex: isPinned ? 10 : undefined,
												}}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="border-t border-gray-800">
									{row.getVisibleCells().map((cell) => {
										const isPinned =
											cell.column.getIsPinned() === "left" ||
											cell.column.getIsPinned() === "right";

										return (
											<td
												key={cell.id}
												className={cn(
													"p-3 text-sm text-white",
													isPinned && "bg-gray-760 sticky z-10"
												)}
												style={{
													width: cell.column.getSize(),
													left:
														cell.column.getIsPinned() === "left"
															? `${cell.column.getStart("left")}px`
															: undefined,
													right:
														cell.column.getIsPinned() === "right"
															? `${cell.column.getStart("right")}px`
															: undefined,
												}}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
