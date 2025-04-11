import { useMemo } from "react";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import SortsIcon from "../icons/common/sorts";
import Telegram from "../icons/media/telegram";
import Website from "../icons/media/website";
import X from "../icons/media/x";
import Star from "../icons/star";
import { Button } from "../ui/button";

type Token = {
	id: string;
	name: string;
	symbol: string;
	age: string;
	amount: string;
	price: string;
	liquidity: string;
	marketCap: string;
	percentages: Record<string, string>;
	volume: string;
	progress: number;
};

export default function MemeList() {
	// Use useMemo to avoid infinite loops caused by data recreation
	const data = useMemo<Array<Token>>(
		() => [
			{
				id: "1",
				name: "Krizz",
				symbol: "KKK",
				age: "5m",
				amount: "0.0016 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "+2.5%",
					"5m": "+12.5%",
					"1h": "+15.3%",
					"24h": "+32.7%",
				},
				volume: "100",
				progress: 80,
			},
			{
				id: "2",
				name: "Krizz",
				symbol: "KK",
				age: "10m",
				amount: "0.008 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "-1.2%",
					"5m": "-4.5%",
					"1h": "-7.1%",
					"24h": "-10.3%",
				},
				volume: "100",
				progress: 30,
			},
			{
				id: "3",
				name: "Krizz",
				symbol: "KK",
				age: "30m",
				amount: "0.048 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "+3.5%",
					"5m": "+3.6%",
					"1h": "+3.4%",
					"24h": "+3.5%",
				},
				volume: "100",
				progress: 90,
			},
			{
				id: "4",
				name: "Krizz",
				symbol: "KK",
				age: "5m",
				amount: "0.048 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "-10.7%",
					"5m": "-32.7%",
					"1h": "-30.9%",
					"24h": "-22.5%",
				},
				volume: "100",
				progress: 40,
			},
			{
				id: "1",
				name: "Krizz",
				symbol: "KKK",
				age: "5m",
				amount: "0.0016 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "+2.5%",
					"5m": "+12.5%",
					"1h": "+15.3%",
					"24h": "+32.7%",
				},
				volume: "100",
				progress: 80,
			},
			{
				id: "2",
				name: "Krizz",
				symbol: "KK",
				age: "10m",
				amount: "0.008 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "-1.2%",
					"5m": "-4.5%",
					"1h": "-7.1%",
					"24h": "-10.3%",
				},
				volume: "100",
				progress: 30,
			},
			{
				id: "3",
				name: "Krizz",
				symbol: "KK",
				age: "30m",
				amount: "0.048 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "+3.5%",
					"5m": "+3.6%",
					"1h": "+3.4%",
					"24h": "+3.5%",
				},
				volume: "100",
				progress: 90,
			},
			{
				id: "4",
				name: "Krizz",
				symbol: "KK",
				age: "5m",
				amount: "0.048 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "-10.7%",
					"5m": "-32.7%",
					"1h": "-30.9%",
					"24h": "-22.5%",
				},
				volume: "100",
				progress: 40,
			},
			{
				id: "1",
				name: "Krizz",
				symbol: "KKK",
				age: "5m",
				amount: "0.0016 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "+2.5%",
					"5m": "+12.5%",
					"1h": "+15.3%",
					"24h": "+32.7%",
				},
				volume: "100",
				progress: 80,
			},
			{
				id: "2",
				name: "Krizz",
				symbol: "KK",
				age: "10m",
				amount: "0.008 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "-1.2%",
					"5m": "-4.5%",
					"1h": "-7.1%",
					"24h": "-10.3%",
				},
				volume: "100",
				progress: 30,
			},
			{
				id: "3",
				name: "Krizz",
				symbol: "KK",
				age: "30m",
				amount: "0.048 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "+3.5%",
					"5m": "+3.6%",
					"1h": "+3.4%",
					"24h": "+3.5%",
				},
				volume: "100",
				progress: 90,
			},
			{
				id: "4",
				name: "Krizz",
				symbol: "KK",
				age: "5m",
				amount: "0.048 BTC",
				price: "1",
				liquidity: "$135.5K",
				marketCap: "$250K",
				percentages: {
					"1m": "-10.7%",
					"5m": "-32.7%",
					"1h": "-30.9%",
					"24h": "-22.5%",
				},
				volume: "100",
				progress: 40,
			},
		],
		[]
	);

	// Percentage columns to display
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const percentageKeys = ["1m", "5m", "1h", "24h"];

	const columnHelper = createColumnHelper<Token>();

	// Use useMemo to define columns to avoid re-rendering issues
	const columns = useMemo(
		() => [
			// Left fixed column - Token
			columnHelper.group({
				id: "token",
				header: () => (
					<div className="flex cursor-pointer items-center gap-1 pl-5">
						<span className="">Token</span>
					</div>
				),
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<Star className="h-4 w-4 cursor-pointer text-white/40" />
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full">
										<div className="absolute inset-0 rounded-full border-[2px] border-gray-500"></div>
										<div
											className="absolute inset-0 rounded-full"
											style={{
												background: `conic-gradient(#F7B406 ${row.original.progress}%, transparent ${row.original.progress}%)`,
												clipPath: "circle(50% at center)",
											}}
										></div>
										<div className="absolute inset-[2px] rounded-full bg-gradient-to-r from-blue-500 to-black"></div>
									</div>
								</TooltipTrigger>
								<TooltipContent className="bg-white px-1 py-1 text-xs font-semibold text-black">
									{row.original.progress} %
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<div className="flex flex-col gap-1.5">
							<div className="flex items-center gap-1">
								<span className="text-sm leading-4 font-medium text-white">
									{row.original.name}
								</span>
								<div className="ml-3 flex cursor-pointer items-center gap-x-2.5">
									<X className="h-2.5 text-white/40 hover:text-white" />
									<Telegram className="h-2.5 text-white/40 hover:text-white" />
									<Website className="h-2.5 text-white/40 hover:text-white" />
								</div>
							</div>
							<div className="text-xs leading-4 font-light text-white/60">
								{row.original.symbol}
							</div>
						</div>
					</div>
				),
				size: 250,
				enablePinning: true,
			}),
			// Age column
			columnHelper.accessor("age", {
				id: "age",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Age</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center gap-1">
						<span className="text-sm leading-4 font-medium text-white/60">
							{info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}),
			// Price column
			columnHelper.accessor("price", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Price</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full flex-col items-start justify-center gap-1.5">
						<span className="text-sm leading-4 font-medium text-white">
							{info.getValue()} BTC
						</span>
						<span className="text-xs leading-4 font-light text-white/60">
							{info.getValue()} sats
						</span>
					</div>
				),
				size: 120,
			}),
			// Liquidity column
			columnHelper.accessor("liquidity", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Liquidity
						</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center gap-1">
						<span className="text-sm leading-4 font-medium text-white">
							{info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}),
			// Market Cap column
			columnHelper.accessor("marketCap", {
				id: "mc",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">MC</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center gap-1">
						<span className="text-sm leading-4 font-medium text-white">
							{info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}),
			// Percentage columns
			...percentageKeys.map((key) =>
				columnHelper.accessor((row) => row.percentages[key], {
					id: key,
					header: () => (
						<div className="group flex cursor-pointer items-center gap-1">
							<span className="duration-300 group-hover:text-white">{key}</span>
							<SortsIcon />
						</div>
					),
					cell: (info) => {
						const value = info.getValue();
						const isNegative = value?.startsWith("-");
						return (
							<div className="flex h-full w-full items-center">
								<span
									className={cn(
										"text-sm leading-4 font-medium",
										isNegative ? "text-[#DE3F4D]" : "text-[#1BBB61]"
									)}
								>
									{value}
								</span>
							</div>
						);
					},
					size: 120,
				})
			),
			// Volume column
			columnHelper.accessor((row) => row.volume, {
				id: "volume",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Volume</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full flex-col items-start justify-center gap-1.5">
						<span className="text-sm leading-4 font-medium text-white">
							{info.getValue()} BTC
						</span>
						<span className="text-xs leading-4 font-light text-white/60">
							${info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}),
			// Right fixed column - Quick buy
			columnHelper.group({
				id: "actions",
				header: () => (
					<div className="flex cursor-pointer justify-end pr-2.5">
						<span className="text-right">Quick buy</span>
					</div>
				),
				cell: () => (
					<div className="ml-auto flex items-center justify-end pr-2">
						<Button className="bg-gray-710 h-9 w-[63px] rounded-full text-xs text-white hover:bg-gray-600">
							<img alt="flash" src="/svgs/flash.svg" />
							Buy
						</Button>
					</div>
				),
				size: 120,
				enablePinning: true,
			}),
		],
		[columnHelper, percentageKeys]
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
		<div className="bg-gray-760 overflow-hidden rounded-2xl">
			<div className="relative overflow-hidden">
				<div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
					<table className="min-w-[1500px]">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="border-gray-710">
									{headerGroup.headers.map((header) => {
										const isPinned =
											header.column.getIsPinned() === "left" ||
											header.column.getIsPinned() === "right";

										return (
											<th
												key={header.id}
												className={cn(
													"bg-gray-760 border-gray-710 border-b p-3 text-left text-xs leading-4 font-medium text-white/40",
													isPinned && "sticky",
													header.column.getIsPinned() === "left" && "left-0",
													header.column.getIsPinned() === "right" && "right-0"
												)}
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
								<tr
									key={row.id}
									className="group hover:bg-gray-710 relative duration-300"
								>
									{row.getVisibleCells().map((cell) => {
										const isPinned =
											cell.column.getIsPinned() === "left" ||
											cell.column.getIsPinned() === "right";

										return (
											<td
												key={cell.id}
												className={cn(
													"border-gray-710 h-18 border-b p-0 pt-px text-sm text-white",
													isPinned && "sticky",
													cell.column.getIsPinned() === "left" && "left-0",
													cell.column.getIsPinned() === "right" && "right-0"
												)}
												style={{
													width: cell.column.getSize(),
													position: isPinned ? "sticky" : undefined,
													left:
														cell.column.getIsPinned() === "left"
															? `${cell.column.getStart("left")}px`
															: undefined,
													right:
														cell.column.getIsPinned() === "right"
															? `0px`
															: undefined,
												}}
											>
												<div
													className={cn(
														"flex h-full items-center p-3",
														isPinned &&
															"bg-gray-760 group-hover:bg-gray-710 duration-300"
													)}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</div>
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
