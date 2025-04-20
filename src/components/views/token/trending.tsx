import { useMemo, useState } from "react";

import { useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";

import Sorts from "@/components/icons/common/sorts";
import { exampleImage } from "@/lib/common/img";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";

const timeFilters = ["1m", "5m", "1h", "24h"] as const;

type TimeFilter = (typeof timeFilters)[number];
type TrendingToken = {
	id: string;
	name: string;
	icon: string;
	price: string;
	change: string;
	transactions: {
		total: number;
		buys: number;
		sells: number;
	};
};

export default function Trending() {
	const [activeTime, setActiveTime] = useState<TimeFilter>("5m");
	const [isExpanded, setIsExpanded] = useState(true);

	const data = useMemo<Array<TrendingToken>>(
		() => [
			{
				id: "1",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "2",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "3",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "4",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "5",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "6",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "7",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "8",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "9",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "10",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "11",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "12",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "13",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			{
				id: "14",
				name: "Kizzy",
				icon: exampleImage,
				price: "$0.0034",
				change: "+20%",
				transactions: {
					total: 200,
					buys: 164,
					sells: 36,
				},
			},
			// {
			// 	id: "15",
			// 	name: "Kizzy",
			// 	icon: exampleImage,
			// 	price: "$0.0034",
			// 	change: "+20%",
			// 	transactions: {
			// 		total: 200,
			// 		buys: 164,
			// 		sells: 36,
			// 	},
			// },
			// {
			// 	id: "16",
			// 	name: "Kizzy",
			// 	icon: exampleImage,
			// 	price: "$0.0034",
			// 	change: "+20%",
			// 	transactions: {
			// 		total: 200,
			// 		buys: 164,
			// 		sells: 36,
			// 	},
			// },
			// {
			// 	id: "17",
			// 	name: "Kizzy",
			// 	icon: exampleImage,
			// 	price: "$0.0034",
			// 	change: "+20%",
			// 	transactions: {
			// 		total: 200,
			// 		buys: 164,
			// 		sells: 36,
			// 	},
			// },
			// {
			// 	id: "18",
			// 	name: "Kizzy",
			// 	icon: exampleImage,
			// 	price: "$0.0034",
			// 	change: "+20%",
			// 	transactions: {
			// 		total: 200,
			// 		buys: 164,
			// 		sells: 36,
			// 	},
			// },
			// {
			// 	id: "19",
			// 	name: "Kizzy",
			// 	icon: exampleImage,
			// 	price: "$0.0034",
			// 	change: "+20%",
			// 	transactions: {
			// 		total: 200,
			// 		buys: 164,
			// 		sells: 36,
			// 	},
			// },
			// {
			// 	id: "20",
			// 	name: "Kizzy",
			// 	icon: exampleImage,
			// 	price: "$0.0034",
			// 	change: "+20%",
			// 	transactions: {
			// 		total: 200,
			// 		buys: 164,
			// 		sells: 36,
			// 	},
			// },
		],
		[]
	);

	const columnHelper = createColumnHelper<TrendingToken>();

	const columns = useMemo(
		() => [
			// Token column
			columnHelper.accessor("name", {
				id: "token",
				header: () => (
					<div
						className="flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {})}
					>
						<span className="text-xs font-medium text-white/40 group-hover:text-white">
							Token/Txns
						</span>
						<Sorts />
					</div>
				),
				cell: (info) => (
					<div className="flex items-center gap-1">
						<div className="relative h-6 w-6 overflow-hidden rounded-full">
							<img
								alt={info.getValue()}
								className="h-full w-full object-cover"
								src={info.row.original.icon}
							/>
						</div>
						<div className="flex flex-col gap-y-0.5">
							<span className="text-[13px] font-medium text-white">
								{info.getValue()}
							</span>
							<div className="text-[10px] font-normal">
								<span>{info.row.original.transactions.total} </span>
								<span className="text-price-positive">
									({info.row.original.transactions.buys}
								</span>
								<span className="text-price-negative">
									/ {info.row.original.transactions.sells})
								</span>
							</div>
						</div>
					</div>
				),
				size: 150,
			}),

			// Price column
			columnHelper.accessor("price", {
				id: "price",
				header: () => (
					<div
						className="flex cursor-pointer items-center justify-end gap-1"
						onClick={withStopPropagation(() => {})}
					>
						<span className="text-xs font-medium text-white/40 group-hover:text-white">
							Price/Change
						</span>{" "}
						<Sorts />
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full flex-col items-end justify-center">
						<span className="text-[13px] font-medium text-white">
							{info.getValue()}
						</span>
						<span className="text-price-positive text-[10px] font-normal">
							{info.row.original.change}
						</span>
					</div>
				),
				size: 110,
			}),
		],
		[columnHelper]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const router = useRouter();
	const { chain } = useChainStore();

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div
			className="h-full flex-shrink-0 rounded-2xl"
			style={{ width: isExpanded ? 230 : 0 }}
		>
			{isExpanded ? (
				<div className="flex h-full flex-col p-4 pt-0">
					<div className="flex items-center justify-between">
						<h2 className="text-base font-semibold text-white">Trending</h2>
						<button
							className="flex-shrink-0 text-gray-400"
							onClick={toggleExpanded}
						>
							<ChevronLeft />
						</button>
					</div>

					{/* Time filters */}
					<div className="border-gray-710 mt-4 grid grid-cols-4 gap-0 rounded-[12px] border">
						{timeFilters.map((time, index) => (
							<button
								key={time}
								className={cn(
									"bg-gray-860 py-2 text-center text-sm font-medium",
									activeTime === time
										? "bg-gray-700 text-white"
										: "bg-transparent text-gray-500",
									index === 0 && "rounded-l-[12px]",
									index === timeFilters.length - 1 && "rounded-r-[12px]"
								)}
								onClick={() => {
									setActiveTime(time);
								}}
							>
								{time}
							</button>
						))}
					</div>

					{/* Table */}
					<div className="no-scrollbar mt-4 flex-1 overflow-y-auto">
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
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className="hover:bg-gray-750 cursor-pointer"
										onClick={() => {
											void router.navigate({
												to: `/${chain}/token/$id`,
												params: { id: row.original.id },
											});
										}}
									>
										{row.getVisibleCells().map((cell) => (
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
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<button
					className="bg-gray-760 absolute top-20 left-0 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-r-full text-gray-400"
					onClick={toggleExpanded}
				>
					<ChevronLeft className="rotate-180" />
				</button>
			)}
		</div>
	);
}
