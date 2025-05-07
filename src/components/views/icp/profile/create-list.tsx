import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useParams, useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import BigNumber from "bignumber.js";

// import SortsIcon from "@/components/icons/common/sorts";
import { Empty } from "@/components/ui/empty";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useUserCreatedTokenList } from "@/hooks/ic/tokens/icp";
import {
	formatNumberSmart,
	getTokenUsdValueTotal,
	isNullOrUndefined,
} from "@/lib/common/number";
import { formatDate } from "@/lib/common/time";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";

import type { CreatedToken } from "@/canisters/core";

const ProfileCreatedTokens = () => {
	const router = useRouter();
	const { chain } = useChainStore();
	const { data: icpPrice } = useICPPrice();
	const { userid } = useParams({ from: "/icp/profile/$userid" });
	// const { data, isFetching, refetch } = useUserCreatedTokens();
	const columnHelper = createColumnHelper<CreatedToken>();

	const { data: items, isFetching, refetch } = useUserCreatedTokenList(userid);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [displayedItems, setDisplayedItems] = useState<Array<CreatedToken>>([]);
	const loadingRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!userid) return;

		void refetch();
	}, [userid, refetch]);

	// const [sortStates, setSortStates] = useState<
	// 	Record<string, "asc" | "desc" | "none">
	// >({
	// 	price: "none",
	// 	market_cap_token: "none",
	// 	status: "none",
	// 	createdAt: "none",
	// });

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
					return (
						<div className="flex items-center gap-2">
							<div className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
								<div
									className="absolute h-[36px] w-[36px] rounded-full p-[2px]"
									style={{
										backgroundImage: `url(${row.original.logo})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center gap-1">
									<span className="text-sm leading-4 font-medium text-white">
										{row.original.ticker}
									</span>
								</div>
								<div className="text-xs leading-4 font-light text-white/60">
									{row.original.name}
								</div>
							</div>
						</div>
					);
				},
				size: 200,
				enablePinning: true,
			}),
			// Price column
			columnHelper.accessor("price", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Price</span>
						{/* <SortsIcon /> */}
					</div>
				),
				cell: ({ row }) => {
					const raw = row.original.price;

					const priceInIcp =
						raw === undefined || raw === 0 ? BigNumber(0) : BigNumber(raw);

					const priceInUsd = priceInIcp.times(icpPrice ?? 0);

					return (
						<div className="flex h-full w-full flex-col items-start justify-center gap-1.5">
							<span className="text-sm leading-4 font-medium text-white">
								$
								{isNullOrUndefined(raw)
									? "--"
									: formatNumberSmart(priceInUsd, {
											shortZero: true,
										})}
							</span>
							<span className="text-xs leading-4 font-light text-white/60">
								{isNullOrUndefined(raw)
									? "--"
									: formatNumberSmart(priceInIcp, {
											shortZero: true,
										})}
								ICP
							</span>
						</div>
					);
				},
				size: 140,
			}),
			// market_cap_token column
			columnHelper.accessor("market_cap_token", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Market Cap
						</span>
						{/* <SortsIcon /> */}
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isNull = value === null;
					const mc = getTokenUsdValueTotal(
						{
							amount: isNull ? 0n : BigInt(value) * 2n,
						},
						icpPrice ?? 0
					);
					return (
						<div className="flex h-full w-full items-center gap-1">
							<span className="text-sm leading-4 font-medium text-white">
								${mc}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			// process column
			columnHelper.accessor((row) => row.process, {
				id: "status",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Status</span>
						{/* <SortsIcon /> */}
					</div>
				),
				cell: (info) => {
					const value = info.getValue() * 100;
					return (
						<div className="text-sm leading-4 font-medium text-white">
							{formatNumberSmart(value)}%
						</div>
					);
				},
				size: 120,
			}),
			// holders column
			columnHelper.accessor((row) => row.holders, {
				id: "holders",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Holders</span>
						{/* <SortsIcon /> */}
					</div>
				),
				cell: (info) => {
					return (
						<div className="text-sm leading-4 font-medium text-white">
							{info.getValue()}
						</div>
					);
				},
				size: 120,
			}),
			// created_at column
			columnHelper.accessor("created_at", {
				id: "createdAt",
				header: () => (
					<div className="group flex cursor-pointer items-center justify-end gap-1">
						<span className="duration-300 group-hover:text-white">
							Created At
						</span>
						{/* <SortsIcon /> */}
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center justify-end gap-1">
						<div className="text-right text-sm leading-4 font-medium text-white">
							{formatDate(info.getValue())}
						</div>
					</div>
				),
				size: 120,
			}),
		],
		[columnHelper, icpPrice]
	);

	const allItemsLoaded = useMemo(() => {
		return displayedItems.length >= (items?.length || 0);
	}, [displayedItems, items]);

	useEffect(() => {
		if (items && items.length > 0) {
			setDisplayedItems(items.slice(0, pagination.pageSize));
		}
	}, [items, pagination.pageSize]);

	const loadMoreItems = useCallback(() => {
		if (allItemsLoaded || !items) return;

		const nextPageIndex = pagination.pageIndex + 1;
		const startIndex = 0;
		const endIndex = (nextPageIndex + 1) * pagination.pageSize;

		setDisplayedItems(items.slice(startIndex, endIndex));
		setPagination((previous) => ({ ...previous, pageIndex: nextPageIndex }));
	}, [allItemsLoaded, items, pagination]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0] &&
					entries[0].isIntersecting &&
					!allItemsLoaded &&
					items &&
					items.length > pagination.pageSize &&
					displayedItems.length < items.length
				) {
					loadMoreItems();
				}
			},
			{ threshold: 0.1 }
		);

		if (loadingRef.current) {
			observer.observe(loadingRef.current);
		}

		return () => {
			if (loadingRef.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(loadingRef.current);
			}
		};
	}, [
		loadMoreItems,
		allItemsLoaded,
		items,
		pagination.pageSize,
		displayedItems.length,
	]);

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
				// right: ["actions"],
			},
		},
	});

	return (
		<div className="h-full rounded-2xl text-white/60">
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
												header.column.getIsPinned() === "right" ? 0 : undefined,
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
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
												cell.column.getIsPinned() === "right" ? 0 : undefined,
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
			<div ref={loadingRef}>
				{!allItemsLoaded && !isFetching && items && items.length > 0 ? (
					<div className="py-4 text-center text-sm text-white/60">
						Loading more...
					</div>
				) : null}
				{allItemsLoaded && displayedItems.length > 0 ? (
					<div className="text-sm text-white/60"></div>
				) : null}
			</div>
			<div className="min-h-5 w-full">
				{!isFetching && (!items || items.length === 0) && <Empty />}
			</div>
		</div>
	);
};

export default ProfileCreatedTokens;
