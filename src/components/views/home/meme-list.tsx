import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearch } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import BigNumber from "bignumber.js";
import { motion } from "framer-motion";

import { getICPCanisterId } from "@/canisters/icrc3";
import SortsIcon from "@/components/icons/common/sorts";
import Telegram from "@/components/icons/media/telegram";
import Website from "@/components/icons/media/website";
import X from "@/components/icons/media/x";
import { Star } from "@/components/icons/star";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { showToast } from "@/components/utils/toast";
import { useICPPrice } from "@/hooks/apis/coingecko";
import {
	useFavoriteToken,
	useInfiniteFavoriteTokenList,
	useInfiniteTokenList,
} from "@/hooks/apis/indexer";
import { useBuy, useCoreTokenBalance } from "@/hooks/ic/core";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";
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
import { useDialogStore } from "@/store/dialog";
import { useQuickBuyStore } from "@/store/quick-buy";

import type { TokenInfo, TokenListSortOption } from "@/apis/indexer";

const TableItemsSkeleton = () => {
	return (
		<div className="flex h-18 w-full items-center justify-center">
			<Skeleton className="h-18 w-full" />
		</div>
	);
};

export default function MemeList() {
	const { setIcpConnectOpen } = useDialogStore();
	const { sort, direction, tab } = useSearch({
		from: "/",
	});

	const { principal } = useConnectedIdentity();
	const { data: balance } = useCoreTokenBalance({
		owner: principal,
		token: {
			ICRCToken: getICPCanisterId(),
		},
	});
	const {
		data: allTokenList,
		hasNextPage: hasNextPageAllTokenList,
		fetchNextPage: fetchNextPageAllTokenList,
		isFetchingNextPage: isFetchingNextPageAllTokenList,
		status: statusAllTokenList,
		error: errorAllTokenList,
		isFetching: isFetchingAllTokenList,
	} = useInfiniteTokenList({
		sort,
		sortDirection: direction,
		pageSize: 16,
		principal,
	});

	const {
		data: favoriteTokenList,
		hasNextPage: hasNextPageFavoriteTokenList,
		fetchNextPage: fetchNextPageFavoriteTokenList,
		isFetchingNextPage: isFetchingNextPageFavoriteTokenList,
		status: statusFavoriteTokenList,
		error: errorFavoriteTokenList,
		isFetching: isFetchingFavoriteTokenList,
	} = useInfiniteFavoriteTokenList({
		isEnabled: tab === "favorite",
	});

	const {
		data,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		status,
		error,
		isFetching,
	} = useMemo(() => {
		return tab === "favorite"
			? {
					data: favoriteTokenList,
					hasNextPage: hasNextPageFavoriteTokenList,
					fetchNextPage: fetchNextPageFavoriteTokenList,
					isFetchingNextPage: isFetchingNextPageFavoriteTokenList,
					status: statusFavoriteTokenList,
					error: errorFavoriteTokenList,
					isFetching: isFetchingFavoriteTokenList,
				}
			: {
					data: allTokenList,
					hasNextPage: hasNextPageAllTokenList,
					fetchNextPage: fetchNextPageAllTokenList,
					isFetchingNextPage: isFetchingNextPageAllTokenList,
					status: statusAllTokenList,
					error: errorAllTokenList,
					isFetching: isFetchingAllTokenList,
				};
	}, [
		tab,
		favoriteTokenList,
		hasNextPageFavoriteTokenList,
		fetchNextPageFavoriteTokenList,
		isFetchingNextPageFavoriteTokenList,
		statusFavoriteTokenList,
		errorFavoriteTokenList,
		isFetchingFavoriteTokenList,
		allTokenList,
		hasNextPageAllTokenList,
		fetchNextPageAllTokenList,
		isFetchingNextPageAllTokenList,
		statusAllTokenList,
		errorAllTokenList,
		isFetchingAllTokenList,
	]);

	const router = useRouter();

	const columnHelper = useMemo(() => createColumnHelper<TokenInfo>(), []);

	const { mutateAsync: buyToken } = useBuy();
	const { amount: flashAmount } = useQuickBuyStore();

	const [flashingRows, setFlashingRows] = useState<Set<string>>(new Set());
	const previousRecentTradeTsRef = useRef<Map<string, string | null>>(
		new Map()
	);
	const isInitialized = useRef(false);

	const flashAmountBigInt = useMemo(() => {
		if (flashAmount === "") {
			return 0n;
		}
		return BigInt(parseUnits(flashAmount, 8));
	}, [flashAmount]);
	const { data: icpPrice } = useICPPrice();

	const items = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data]
	);
	const handleSort = useCallback(
		(selectedSort: TokenListSortOption) => {
			const currentDirection =
				selectedSort === sort ? (direction === "asc" ? "desc" : "asc") : "desc";
			void router.navigate({
				to: "/",
				search: (search) => ({
					...search,
					sort: selectedSort,
					direction: currentDirection,
				}),
			});
		},
		[direction, router, sort]
	);
	useEffect(() => {
		const currentRecentTradeTs = new Map<string, string | null>();
		const newlyFlashed = new Set<string>();

		items.forEach((item) => {
			const id = item.memeTokenId.toString();
			const previousTs = previousRecentTradeTsRef.current.get(id);
			const currentTs = item.recentTradeTs;
			currentRecentTradeTs.set(id, currentTs);

			if (
				isInitialized.current &&
				previousTs !== undefined &&
				currentTs !== null &&
				previousTs !== currentTs
			) {
				newlyFlashed.add(id);
			}
		});

		if (newlyFlashed.size > 0) {
			setFlashingRows((previous) => {
				const updated = new Set(previous);
				newlyFlashed.forEach((id) => updated.add(id));
				return updated;
			});

			newlyFlashed.forEach((id) => {
				setTimeout(() => {
					setFlashingRows((previous) => {
						const updated = new Set(previous);
						updated.delete(id);
						return updated;
					});
				}, 800);
			});
		}

		previousRecentTradeTsRef.current = currentRecentTradeTs;

		if (!isInitialized.current) {
			isInitialized.current = true;
		}
	}, [items]);

	// favorite token
	const { mutateAsync: favoriteToken } = useFavoriteToken({
		sort,
		sortDirection: direction,
	});
	const columns = useMemo(
		() => [
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
								isActive={row.original.isFollow}
								onClick={withStopPropagation(() => {
									void favoriteToken({
										tokenId: row.original.memeTokenId.toString(),
									});
								})}
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
											<div className="bg-gray-710 absolute h-9 w-9 rounded-full p-[2px]"></div>
											<div
												className="absolute h-9 w-9 rounded-full p-[2px]"
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
									<span className="text-sm leading-4 font-medium text-white uppercase">
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
			columnHelper.accessor("process", {
				id: "process",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className={cn("duration-300 group-hover:text-white")}>
							Status
						</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center gap-1">
						<span className="text-sm leading-4 text-white">
							{parseFloat(`${info.getValue() * 100}`).toFixed(2)}%
						</span>
					</div>
				),
				size: 120,
			}),
			columnHelper.accessor("timestamp", {
				id: "age",
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("new");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "new" && "text-white"
							)}
						>
							Age
						</span>
						<SortsIcon
							direction={direction === "desc" ? "asc" : "desc"}
							selected={sort === "new"}
						/>
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
			columnHelper.accessor("price", {
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("price");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "price" && "text-white"
							)}
						>
							Price
						</span>
						<SortsIcon direction={direction} selected={sort === "price"} />
					</div>
				),
				cell: (info) => {
					const raw = info.getValue();
					const priceInIcp =
						raw === null ? BigNumber(0) : BigNumber(1).div(BigNumber(raw));
					const priceInUsd = priceInIcp.times(icpPrice ?? 0);
					return (
						<div className="flex h-full w-full flex-col items-start justify-center">
							<div className="flex items-center text-sm font-medium text-white">
								<span>$</span>
								{raw === null
									? "--"
									: formatNumberSmart(priceInUsd, {
											shortZero: true,
										})}
							</div>
							<div className="flex items-center gap-x-0.5 text-xs font-light text-white/60">
								{formatNumberSmart(priceInIcp, {
									shortZero: true,
								})}
								<span>ICP</span>
							</div>
						</div>
					);
				},
				size: 140,
			}),
			columnHelper.accessor("market_cap_token", {
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("liquidity");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "liquidity" && "text-white"
							)}
						>
							Liquidity
						</span>
						<SortsIcon direction={direction} selected={sort === "liquidity"} />
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
			columnHelper.accessor((row) => row.price, {
				id: "mc",
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("mc");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "mc" && "text-white"
							)}
						>
							MC
						</span>
						<SortsIcon direction={direction} selected={sort === "mc"} />
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
								$
								{value === null
									? "--"
									: formatNumberSmart(mc, {
											shortenLarge: true,
										})}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			columnHelper.accessor((row) => row.priceChangeRate1H, {
				id: "priceChangeRate1H",
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("price_change_1h");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "price_change_1h" && "text-white"
							)}
						>
							1h
						</span>
						<SortsIcon
							direction={direction}
							selected={sort === "price_change_1h"}
						/>
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
				size: 100,
			}),

			columnHelper.accessor((row) => row.priceChangeRate8H, {
				id: "priceChangeRate8H",
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("price_change_8h");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "price_change_8h" && "text-white"
							)}
						>
							8h
						</span>
						<SortsIcon
							direction={direction}
							selected={sort === "price_change_8h"}
						/>
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
				size: 100,
			}),
			columnHelper.accessor((row) => row.priceChangeRate24H, {
				id: "priceChangeRate24H",
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						onClick={withStopPropagation(() => {
							handleSort("price_change_24h");
						})}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white",
								sort === "price_change_24h" && "text-white"
							)}
						>
							24h
						</span>
						<SortsIcon
							direction={direction}
							selected={sort === "price_change_24h"}
						/>
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
				size: 100,
			}),
			columnHelper.accessor("volume24H", {
				id: "volume",
				header: () => (
					<div
						className="group flex cursor-pointer items-center gap-1"
						// onClick={withStopPropagation(() => {
						// 	handleSort("volume");
						// })}
					>
						<span
							className={cn(
								"duration-300 group-hover:text-white"
								// sort === "volume" && "text-white"
							)}
						>
							Volume
						</span>
						{/* <SortsIcon direction={direction} selected={sort === "volume"} /> */}
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const inIcp =
						value === null
							? "--"
							: formatNumberSmart(formatUnits(value), {
									shortenLarge: true,
								});
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
				size: 100,
			}),
			columnHelper.group({
				id: "actions",
				header: () => (
					<div className="flex cursor-pointer justify-end pr-2.5">
						<span className="text-right">Quick buy</span>
					</div>
				),
				cell: (info) => (
					<div className="relative ml-auto flex items-center justify-end p-px pr-2">
						<Button
							className="dark:hover:bg-gray-710 dark:bg-background z-10 h-9 w-21 rounded-full bg-transparent text-xs text-white"
							onClick={withStopPropagation(() => {
								// if not login
								if (!principal) {
									setIcpConnectOpen(true);
									return;
								}
								if (balance == undefined) {
									showToast("error", "Waiting for ICP balance loading...");
									return;
								}
								// not enough icp
								if (BigNumber(balance.raw).lt(flashAmountBigInt)) {
									showToast("error", "Not enough ICP");
									return;
								}

								const tokenId = info.row.original.memeTokenId.toString();
								showToast(
									"loading",
									`Buying token($${info.row.original.ticker.toLocaleUpperCase()})...`
								);
								void buyToken({
									amount: flashAmountBigInt,
									id: BigInt(tokenId),
									amount_out_min: BigInt(0),
								}).then((receivedAmount) => {
									showToast(
										"success",
										`${formatNumberSmart(formatUnits(receivedAmount, info.row.original.decimals))} $${info.row.original.ticker.toLocaleUpperCase()} received!`
									);
								});
							})}
						>
							<img alt="flash" src="/svgs/flash.svg" />
							Buy
						</Button>
						<div className="absolute inset-0 right-1.75 z-0 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500"></div>
					</div>
				),
				size: 120,
				enablePinning: true,
			}),
		],
		[
			balance,
			buyToken,
			columnHelper,
			direction,
			favoriteToken,
			flashAmount,
			flashAmountBigInt,
			handleSort,
			icpPrice,
			principal,
			setIcpConnectOpen,
			sort,
		]
	);

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 120,
		},
		getRowId: (row) => row.memeTokenId.toString(),
		state: {
			columnPinning: {
				left: ["token"],
				right: ["actions"],
			},
		},
	});

	const { chain } = useChainStore();
	const parentRef = useRef<HTMLDivElement>(null);

	const tableRows = table.getRowModel().rows;

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? tableRows.length + 1 : tableRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 72,
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
			<div className="bg-gray-760 flex h-screen w-full flex-col items-center justify-center gap-2 rounded-t-2xl pt-10">
				{Array.from({ length: 12 }).map((_, index) => (
					<Skeleton key={index} className="h-18 w-full" />
				))}
			</div>
		);
	}

	if (status === "error") {
		return <span>Error: {error?.message}</span>;
	}

	return (
		<div
			ref={parentRef}
			className="bg-gray-760 no-scrollbar h-screen overflow-auto rounded-t-2xl"
		>
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
					{paddingTop > 0 && (
						<tr>
							<td style={{ height: `${paddingTop}px` }} />
						</tr>
					)}
					{virtualRows.map((virtualRow) => {
						const isLoaderRow = virtualRow.index >= tableRows.length;

						if (isLoaderRow) {
							return (
								<tr key="loader" className="h-18">
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

						const row = tableRows[virtualRow.index] as Row<TokenInfo>;
						const isFlashing = flashingRows.has(
							row.original.memeTokenId.toString()
						);

						return (
							<motion.tr
								key={row.original.memeTokenId}
								animate={isFlashing ? "flash" : "normal"}
								className="group hover:!bg-gray-750 relative duration-300"
								initial="initial"
								variants={rowVariants}
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
												cell.column.getIsPinned() === "right" && "right-0",
												isPinned && isFlashing && "bg-inherit"
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
														"bg-gray-760 group-hover:bg-gray-750 duration-300",
													isPinned && isFlashing && "bg-inherit"
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
							</motion.tr>
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
