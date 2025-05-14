import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import BigNumber from "bignumber.js";
import { Command as CommandPrimitive } from "cmdk";
import { Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Star } from "@/components/icons/star";
import { CommandInput, CommandList } from "@/components/ui/command";
import { useICPPrice } from "@/hooks/apis/coingecko";
import {
	useFavoriteToken,
	useInfiniteTokenList,
	useSearchTokenList,
} from "@/hooks/apis/indexer";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
	isNullOrUndefined,
} from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useSearchStore } from "@/store/search";

import type { TokenInfo } from "@/apis/indexer";

export default function Search() {
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const tableParentRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms debounce
	const router = useRouter();
	const { chain } = useChainStore();
	const { data: icpPrice } = useICPPrice();

	// useRecent
	const { recentSearch, addRecentSearch, clearRecentSearch } = useSearchStore();
	// Fetch trending tokens (24h)
	const { principal } = useConnectedIdentity();

	const queryParameters = useMemo(
		() => ({
			sort: "popularity_24h" as const,
			sortDirection: "desc" as const,
			pageSize: 20,
			principal,
		}),
		[principal]
	);
	const { data: trendingTokensData, hasNextPage } =
		useInfiniteTokenList(queryParameters);
	const { data: searchTokensData, isLoading: isSearchLoading } =
		useSearchTokenList({
			sort: "popularity_24h",
			sortDirection: "desc",
			search: debouncedSearchTerm,
			principal,
		});
	const isSearch = debouncedSearchTerm !== "";
	const items = useMemo(
		() =>
			isSearch
				? (searchTokensData?.data ?? [])
				: (trendingTokensData?.pages.flatMap((page) => page.data) ?? []),
		[trendingTokensData, searchTokensData, isSearch]
	);

	// Setup react-table for trending tokens
	const columnHelper = useMemo(() => createColumnHelper<TokenInfo>(), []);
	const { mutateAsync: favoriteToken } = useFavoriteToken(queryParameters);
	const columns = useMemo(
		() => [
			columnHelper.accessor("ticker", {
				id: "token",
				cell: (info) => (
					<div className="flex items-center gap-2">
						<Star
							className="h-4 w-4 shrink-0 cursor-pointer text-white/40"
							isActive={info.row.original.isFollow}
							onClick={withStopPropagation(() => {
								void favoriteToken({
									tokenId: info.row.original.memeTokenId.toString(),
								});
							})}
						/>
						<div className="relative h-8 w-8 overflow-hidden rounded-full">
							<img
								alt={info.row.original.ticker}
								className="h-full w-full object-cover"
								src={info.row.original.logo}
							/>
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium text-white uppercase">
								{info.row.original.ticker}
							</span>
							<span className="max-w-[100px] truncate text-xs text-white/60">
								{info.row.original.name}
							</span>
						</div>
					</div>
				),
				size: 180,
			}),
			columnHelper.accessor("market_cap_token", {
				id: "mc",
				cell: (info) => {
					const vol = isNullOrUndefined(info.row.original.volume24H)
						? "--"
						: formatNumberSmart(
								formatUnits(
									BigNumber(info.row.original.volume24H).times(icpPrice ?? 0)
								),
								{
									shortenLarge: true,
								}
							);
					const liq = isNullOrUndefined(info.row.original.market_cap_token)
						? "--"
						: getTokenUsdValueTotal(
								{
									amount: isNullOrUndefined(info.row.original.market_cap_token)
										? 0n
										: BigInt(info.row.original.market_cap_token),
								},
								icpPrice ?? 0
							);
					return (
						<div className="flex h-full w-full flex-col items-end justify-center">
							<div className="flex items-center gap-1">
								<span className="text-xs text-white/60">24h Vol:</span>
								<span className="text-xs text-white">${vol}</span>
							</div>
							<div className="flex items-center gap-1">
								<span className="text-xs text-white/60">Liq:</span>
								<span className="text-xs text-white">${liq}</span>
							</div>
						</div>
					);
				},
				size: 120,
			}),
			columnHelper.accessor("price", {
				id: "price",
				cell: (info) => {
					const raw = info.getValue();
					const priceInIcp =
						raw === null ? BigNumber(0) : BigNumber(1).div(BigNumber(raw));
					const priceInUsd = priceInIcp.times(icpPrice ?? 0);
					return (
						<div className="flex h-full flex-col items-end justify-center">
							<div className="flex items-center gap-1">
								<span className="text-xs text-white/60">Price:</span>
								<span className="text-xs font-medium text-white">
									${formatNumberSmart(priceInUsd, { shortZero: true })}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<span className="text-xs text-white/60">24h:</span>
								<span
									className={cn(
										"text-xs font-medium",
										info.row.original.priceChangeRate24H === null
											? "text-white/40"
											: info.row.original.priceChangeRate24H < 0
												? "text-price-negative"
												: "text-price-positive"
									)}
								>
									{info.row.original.priceChangeRate24H === null
										? "--"
										: `${info.row.original.priceChangeRate24H}%`}
								</span>
							</div>
						</div>
					);
				},
				size: 100,
			}),
		],
		[columnHelper, favoriteToken, icpPrice]
	);

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.memeTokenId.toString(),
	});

	const tableRows = table.getRowModel().rows;

	// Setup virtualization
	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? tableRows.length + 1 : tableRows.length,
		getScrollElement: () => tableParentRef.current,
		estimateSize: () => 56, // Adjust height based on your row height
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();

	// Keyboard event handling
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (!input) return;

			if (!isOpen) {
				setIsOpen(true);
			}

			if (event.key === "Escape") {
				input.blur();
				setIsOpen(false);
			}
		},
		[isOpen]
	);

	// Add a click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpen &&
				inputRef.current &&
				dropdownRef.current &&
				!inputRef.current.contains(event.target as Node) &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);
	// Calculate padding for virtualization
	const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
	const paddingBottom =
		virtualItems.length > 0
			? rowVirtualizer.getTotalSize() -
				(virtualItems[virtualItems.length - 1]?.end || 0)
			: 0;

	return (
		<CommandPrimitive className="relative max-w-80" onKeyDown={handleKeyDown}>
			<CommandInput
				ref={inputRef}
				placeholder="Search by symbol or address"
				value={searchTerm}
				className={cn(
					"h-full rounded-xl bg-gray-800 text-xs placeholder:text-xs placeholder:text-white/30"
				)}
				onValueChange={setSearchTerm}
				onFocus={() => {
					setIsOpen(true);
				}}
			/>
			<div className="relative w-125">
				<div
					ref={dropdownRef}
					className={cn(
						"animate-in fade-in-0 zoom-in-95 bg-popover absolute top-2 z-10 w-full rounded-xl outline-none",
						isOpen ? "block" : "hidden"
					)}
				>
					<CommandList className="bg-gray-750 max-h-[400px] overflow-y-auto rounded-2xl p-3 pb-2">
						<>
							{recentSearch[chain].length > 0 && (
								<>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-white">Recent</span>
										<span
											className="cursor-pointer text-sm text-white/60 hover:text-white"
											onClick={() => {
												clearRecentSearch(chain);
											}}
										>
											Clear
										</span>
									</div>
									<div className="no-scrollbar mb-6 w-full overflow-x-auto">
										<div className="flex gap-4.5">
											{recentSearch[chain].map((item) => {
												return (
													<div
														key={item.id}
														className="flex cursor-pointer items-center gap-1 rounded-xl p-1 hover:bg-gray-700"
														onClick={() => {
															void router.navigate({
																to: `/${chain}/token/$id`,
																params: {
																	id: item.id.toString(),
																},
															});
															setIsOpen(false);
														}}
													>
														<div
															className="relative h-4.5 w-4.5 overflow-hidden rounded-full"
															style={{
																backgroundImage: `url(${item.logo})`,
																backgroundSize: "cover",
																backgroundPosition: "center",
															}}
														></div>
														<span className="text-xs font-medium uppercase">
															{item.symbol}
														</span>
													</div>
												);
											})}
										</div>
									</div>
								</>
							)}

							<div>
								<div className="mb-2 flex items-center">
									<div className="flex h-4.5 items-end gap-x-1">
										<img
											alt="fire"
											className={cn(isSearch ? "hidden" : "block")}
											src="/svgs/fire.svg"
										/>
										<span className="text-sm leading-none text-white">
											{isSearch ? "Tokens" : "24h Trending"}
										</span>
									</div>
								</div>
								{/* Trending tokens table with virtualization */}
								<div
									ref={tableParentRef}
									className="no-scrollbar mb-3 h-[200px] w-full overflow-auto"
								>
									{isSearch && isSearchLoading ? (
										<div className="flex h-full items-center justify-center">
											<Loader2 className="h-4 w-4 animate-spin" />
										</div>
									) : (
										<table className="w-full">
											<tbody>
												{paddingTop > 0 && (
													<tr>
														<td
															colSpan={columns.length}
															style={{ height: `${paddingTop}px` }}
														/>
													</tr>
												)}
												{virtualItems.map((virtualRow) => {
													const isLoaderRow =
														virtualRow.index >= tableRows.length;

													if (isLoaderRow) {
														return (
															<tr key="loader" className="h-14">
																<td colSpan={columns.length}>
																	<div className="flex h-full w-full items-center justify-center">
																		<span className="text-xs text-white/40">
																			No more tokens
																		</span>
																	</div>
																</td>
															</tr>
														);
													}

													const row = tableRows[virtualRow.index];
													return (
														<tr
															key={row?.id}
															className="h-14 cursor-pointer hover:bg-gray-700"
															onClick={withStopPropagation(() => {
																void router.navigate({
																	to: `/${chain}/token/$id`,
																	params: {
																		id: row?.original.memeTokenId.toString(),
																	},
																});
																setIsOpen(false);
															})}
														>
															{row?.getVisibleCells().map((cell) => (
																<td
																	key={cell.id}
																	className="h-14 px-2 py-2"
																	style={{
																		width: cell.column.getSize(),
																	}}
																	onClick={() => {
																		addRecentSearch({
																			id: row?.original.memeTokenId,
																			symbol: row?.original.ticker,
																			logo: row?.original.logo,
																			chain,
																		});
																	}}
																>
																	{flexRender(
																		cell.column.columnDef.cell,
																		cell.getContext()
																	)}
																</td>
															))}
														</tr>
													);
												})}
												{paddingBottom > 0 && (
													<tr>
														<td
															colSpan={columns.length}
															style={{ height: `${paddingBottom}px` }}
														/>
													</tr>
												)}
											</tbody>
										</table>
									)}
								</div>
							</div>
						</>
					</CommandList>
				</div>
			</div>
		</CommandPrimitive>
	);
}
