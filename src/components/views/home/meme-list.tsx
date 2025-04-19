import { useMemo } from "react";

import { useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import SortsIcon from "@/components/icons/common/sorts";
import Telegram from "@/components/icons/media/telegram";
import Website from "@/components/icons/media/website";
import X from "@/components/icons/media/x";
import Star from "@/components/icons/star";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { showToast } from "@/components/utils/toast";
import { useBuy } from "@/hooks/ic/core";
import { formatNumberSmart, parseUnits } from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { fromNow } from "@/lib/common/time";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useQuickBuyStore } from "@/store/quick-buy";

type Token = {
	id: bigint;
	name: string;
	symbol: string;
	created: bigint;
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
				id: 4n,
				name: "FROG FUCK",
				symbol: "FROG",
				created: 1744880732722367464n,
				amount: "0.0016 ICP",
				price: "0.1",
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
		],
		[]
	);

	// Percentage columns to display

	const percentageKeys = useMemo(() => ["1m", "5m", "1h", "24h"], []);

	const columnHelper = createColumnHelper<Token>();

	const { mutateAsync: buyToken } = useBuy();
	const { amount: flashAmount } = useQuickBuyStore();

	const flashAmountBigInt = useMemo(() => {
		if (flashAmount === "") {
			return 0n;
		}
		return BigInt(parseUnits(flashAmount, 8));
	}, [flashAmount]);
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
						<Star
							className="h-4 w-4 cursor-pointer text-white/40"
							onClick={withStopPropagation(() => {})}
						/>
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
										<img
											alt="duck"
											className="absolute rounded-full p-[2px]"
											src="https://ipfs.io/ipfs/QmQ4H6Y23dSEjn9LKB85M7KpVFiDu6KfDNZAcrqiCwFQQH?img-width=800&img-dpr=2&img-onerror=redirect"
										/>
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
									{row.original.symbol}
								</span>
								<div className="ml-3 flex cursor-pointer items-center gap-x-2.5">
									<X
										className="h-2.5 text-white/40 hover:text-white"
										onClick={withStopPropagation(() => {})}
									/>
									<Telegram
										className="h-2.5 text-white/40 hover:text-white"
										onClick={withStopPropagation(() => {})}
									/>
									<Website
										className="h-2.5 text-white/40 hover:text-white"
										onClick={withStopPropagation(() => {})}
									/>
								</div>
							</div>
							<div className="text-xs leading-4 font-light text-white/60">
								{row.original.name}
							</div>
						</div>
					</div>
				),
				size: 250,
				enablePinning: true,
			}),
			// Age column
			columnHelper.accessor("created", {
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
							{fromNow(info.getValue())}
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
							${0.5}
						</span>
						<span className="text-xs leading-4 font-light text-white/60">
							{info.getValue()} ICP
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
										isNegative ? "text-price-negative" : "text-price-positive"
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
							{info.getValue()} ICP
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
						<Button
							className="hover:bg-gray-710 h-9 w-[63px] rounded-full bg-transparent text-xs text-white"
							onClick={withStopPropagation(() => {
								showToast("loading", "Buying token(id:6)...");
								void buyToken({
									amount: flashAmountBigInt,
									id: 4n,
									slippage: 100,
								}).then(() => {
									showToast(
										"success",
										`${formatNumberSmart(flashAmount)} tokens(id:${7}) received!`
									);
								});
							})}
						>
							<img alt="flash" src="/svgs/flash.svg" />
							Buy
						</Button>
					</div>
				),
				size: 120,
				enablePinning: true,
			}),
		],
		[buyToken, columnHelper, flashAmount, percentageKeys]
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

	const router = useRouter();
	const { chain } = useChainStore();
	return (
		<div className="bg-gray-760 no-scrollbar h-screen overflow-auto rounded-t-2xl">
			<table className="w-full min-w-max">
				<thead className="sticky top-0 z-10">
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
							className="group hover:bg-gray-750 relative duration-300"
							onClick={() => {
								void router.navigate({
									to: `/${chain}/token/$id`,
									params: { id: row.original.id.toString() },
								});
							}}
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
												"flex h-full cursor-pointer items-center p-3",
												isPinned &&
													"bg-gray-760 group-hover:bg-gray-750 duration-300"
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
	);
}
