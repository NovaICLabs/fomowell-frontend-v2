import { useEffect, useMemo, useRef } from "react";

import { useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import BigNumber from "bignumber.js";
import { useInView } from "framer-motion";

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
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useInfiniteTokenList } from "@/hooks/apis/indexer";
import { useBuy } from "@/hooks/ic/core";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
	parseUnits,
} from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { fromNow } from "@/lib/common/time";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useQuickBuyStore } from "@/store/quick-buy";

import type { tokenInfo } from "@/apis/indexer";

export default function MemeList() {
	const { data, hasNextPage, fetchNextPage, isFetching } =
		useInfiniteTokenList();
	const router = useRouter();

	const columnHelper = createColumnHelper<tokenInfo>();

	const { mutateAsync: buyToken } = useBuy();
	const { amount: flashAmount } = useQuickBuyStore();

	const flashAmountBigInt = useMemo(() => {
		if (flashAmount === "") {
			return 0n;
		}
		return BigInt(parseUnits(flashAmount, 8));
	}, [flashAmount]);
	const { data: icpPrice } = useICPPrice();
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
				cell: ({ row }) => {
					const process = row.original.process * 100;
					return (
						<div className="flex items-center gap-2">
							<Star
								className="h-4 w-4 cursor-pointer text-white/40"
								onClick={withStopPropagation(() => {})}
							/>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
											<div className="absolute inset-0 rounded-full border-[2px] border-gray-500"></div>
											<div
												className="absolute inset-0 rounded-full"
												style={{
													background: `conic-gradient(#F7B406 ${process}%, transparent ${process}%)`,
													clipPath: "circle(50% at center)",
												}}
											></div>
											<div
												className="absolute h-[36px] w-[36px] rounded-full p-[2px]"
												style={{
													backgroundImage: `url(${row.original.logo})`,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}}
											/>
										</div>
									</TooltipTrigger>
									<TooltipContent className="bg-white px-1 py-1 text-xs font-semibold text-black">
										{process.toFixed(2)}%
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center gap-1">
									<span className="text-sm leading-4 font-medium text-white">
										{row.original.ticker}
									</span>
									<div className="ml-3 flex cursor-pointer items-center gap-x-2.5">
										{row.original.twitter && (
											<X
												className="h-2.5 text-white/40 hover:text-white"
												onClick={withStopPropagation(() => {
													if (row.original.twitter) {
														window.open(row.original.twitter, "_blank");
													}
												})}
											/>
										)}
										{row.original.telegram && (
											<Telegram
												className="h-2.5 text-white/40 hover:text-white"
												onClick={withStopPropagation(() => {
													if (row.original.telegram) {
														window.open(row.original.telegram, "_blank");
													}
												})}
											/>
										)}
										{row.original.website && (
											<Website
												className="h-2.5 text-white/40 hover:text-white"
												onClick={withStopPropagation(() => {
													if (row.original.website) {
														window.open(row.original.website, "_blank");
													}
												})}
											/>
										)}
									</div>
								</div>
								<div className="text-xs leading-4 font-light text-white/60">
									{row.original.name}
								</div>
							</div>
						</div>
					);
				},
				size: 250,
				enablePinning: true,
			}),
			// Age column
			columnHelper.accessor("timestamp", {
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
							{fromNow(BigInt(info.getValue()?.split("n")[0] ?? "0"))}
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
				cell: (info) => {
					const raw = info.getValue();
					const priceInIcp =
						raw === null ? BigNumber(0) : BigNumber(1).div(BigNumber(raw));
					const priceInUsd = priceInIcp.times(icpPrice ?? 0);
					return (
						<div className="flex h-full w-full flex-col items-start justify-center gap-1.5">
							<span className="text-sm leading-4 font-medium text-white">
								${raw === null ? "--" : formatNumberSmart(priceInUsd)}
							</span>
							<span className="text-xs leading-4 font-light text-white/60">
								{raw === null ? "--" : formatNumberSmart(priceInIcp)} ICP
							</span>
						</div>
					);
				},
				size: 140,
			}),
			// Liquidity column
			columnHelper.accessor("market_cap_token", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Liquidity
						</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isNull = value === null;
					return (
						<div className="flex h-full w-full items-center gap-1">
							<span className="text-sm leading-4 font-medium text-white">
								$
								{getTokenUsdValueTotal(
									{
										amount: isNull ? 0n : BigInt(value) * 2n,
									},
									icpPrice ?? 0
								)}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			// Market Cap column
			columnHelper.accessor((row) => row.price, {
				id: "mc",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">MC</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const priceInUsd =
						value === null
							? BigNumber(0)
							: BigNumber(1)
									.div(BigNumber(value))
									.times(icpPrice ?? 0);
					const mc = BigNumber(1_000_000_000).times(priceInUsd);
					return (
						<div className="flex h-full w-full items-center gap-1">
							<span className="text-sm leading-4 font-medium text-white">
								${value === null ? "--" : formatNumberSmart(mc)}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.priceChangeRate5M, {
				id: "priceChangeRate5M",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">5m</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isNull = value === null;
					const isNegative = !isNull && value < 0;
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4 font-medium",
									isNegative ? "text-price-negative" : "text-price-positive",
									isNull && "text-white/40"
								)}
							>
								{!isNull ? `${value}%` : "--"}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.priceChangeRate1H, {
				id: "priceChangeRate1H",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">1h</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isNull = value === null;
					const isNegative = !isNull && value < 0;
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4 font-medium",
									isNegative ? "text-price-negative" : "text-price-positive",
									isNull && "text-white/40"
								)}
							>
								{!isNull ? `${value}%` : "--"}
							</span>
						</div>
					);
				},
				size: 120,
			}),

			columnHelper.accessor((row) => row.priceChangeRate8H, {
				id: "priceChangeRate8H",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">8h</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isNull = value === null;
					const isNegative = !isNull && value < 0;
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4 font-medium",
									isNegative ? "text-price-negative" : "text-price-positive",
									isNull && "text-white/40"
								)}
							>
								{!isNull ? `${value}%` : "--"}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.priceChangeRate24H, {
				id: "priceChangeRate24H",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">24h</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isNull = value === null;
					const isNegative = !isNull && value < 0;
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4 font-medium",
									isNegative ? "text-price-negative" : "text-price-positive",
									isNull && "text-white/40"
								)}
							>
								{!isNull ? `${value}%` : "--"}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			// Volume column
			columnHelper.accessor("volume24H", {
				id: "volume",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Volume</span>
						<SortsIcon />
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const inIcp =
						value === null ? "--" : formatNumberSmart(formatUnits(value), true);
					const inUsd =
						value === null
							? "--"
							: getTokenUsdValueTotal({ amount: BigInt(value) }, icpPrice ?? 0);
					return (
						<div className="flex h-full w-full flex-col items-start justify-center gap-1.5">
							<span className="text-sm leading-4 font-medium text-white">
								{inIcp} ICP
							</span>
							<span className="text-xs leading-4 font-light text-white/60">
								${inUsd}
							</span>
						</div>
					);
				},
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
		[buyToken, columnHelper, flashAmount, flashAmountBigInt, icpPrice]
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
		state: {
			// Pin first and last columns
			columnPinning: {
				left: ["token"],
				right: ["actions"],
			},
		},
	});
	const { chain } = useChainStore();
	const loadMoreRef = useRef(null);
	const inView = useInView(loadMoreRef, { margin: "0px 0px -60px 0px" });

	useEffect(() => {
		if (inView && hasNextPage) {
			void fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);
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
									params: { id: row.original.memeTokenId.toString() },
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
			<div
				ref={loadMoreRef}
				className="flex h-15 w-full items-center justify-center"
			>
				{!isFetching && !hasNextPage && (
					<span className="text-sm text-white/40">No more tokens</span>
				)}
			</div>
		</div>
	);
}
