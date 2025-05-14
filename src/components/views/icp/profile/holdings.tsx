import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useParams, useRouter } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import BigNumber from "bignumber.js";

// import SortsIcon from "@/components/icons/common/sorts";
import { Empty } from "@/components/ui/empty";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useUserTokenHoldersList } from "@/hooks/ic/tokens/icp";
import { formatNumberSmart, isNullOrUndefined } from "@/lib/common/number";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";

import type { MemeTokenDetails } from "@/canisters/core";

const ProfileHoldings = () => {
	const router = useRouter();
	const { chain } = useChainStore();
	const { data: icpPrice } = useICPPrice();
	const { userid } = useParams({ from: "/icp/profile/$userid" });
	const { data: items, isFetching, refetch } = useUserTokenHoldersList(userid);
	const columnHelper = useMemo(
		() => createColumnHelper<MemeTokenDetails>(),
		[]
	);

	// const {
	// 	data: allPrices,
	// 	isFetching: isPriceFetching,
	// 	refetch: priceRefetch,
	// } = useMultipleCurrentPrice({ ids: data ? data?.map((row) => row.id) : [] });

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [displayedItems, setDisplayedItems] = useState<Array<MemeTokenDetails>>(
		[]
	);
	const loadingRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!userid) return;

		void refetch();
	}, [userid, refetch]);

	// const [sortStates, setSortStates] = useState<
	// 	Record<string, "asc" | "desc" | "none">
	// >({
	// 	totalUsd: "none",
	// 	price: "none",
	// 	balance: "none",
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
				size: 250,
			}),
			columnHelper.accessor("price", {
				id: "totalUsd",
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Total USD
						</span>
						{/* <SortsIcon /> */}
					</div>
				),
				cell: ({ row }) => {
					const balance = row.original.balance;
					const raw = row.original.price;

					const priceInIcp =
						raw === undefined || raw === 0 ? BigNumber(0) : BigNumber(raw);

					const priceInUsd = priceInIcp.times(icpPrice ?? 0);
					const totalUsd = priceInUsd.times(balance);

					return (
						<div className="text-sm leading-4 font-medium text-white">
							$
							{isNullOrUndefined(raw)
								? "--"
								: formatNumberSmart(totalUsd, {
										shortZero: true,
									})}
						</div>
					);
				},
				size: 120,
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
										})}{" "}
								ICP
							</span>
						</div>
					);
				},
				size: 140,
			}),
			// amount/balance column
			columnHelper.accessor("balance", {
				header: () => {
					return (
						<div className="group flex cursor-pointer items-center gap-1">
							<span className="duration-300 group-hover:text-white">
								Amount
							</span>
							{/* <SortsIcon /> */}
						</div>
					);
				},
				cell: ({ row }) => {
					const balance = row.original.balance;

					const balanceFormatted =
						balance === null || BigNumber(balance).isZero()
							? "--"
							: formatNumberSmart(balance, {
									shortenLarge: true,
								});
					return (
						<div className="text-sm leading-4 font-medium text-white">
							{balanceFormatted}
						</div>
					);
				},
				size: 140,
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
		data: displayedItems,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
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
			<table className="h-full w-full min-w-max">
				<thead className="sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="border-gray-710">
							{headerGroup.headers.map((header) => {
								return (
									<th
										key={header.id}
										className={cn(
											"bg-gray-760 border-gray-710 border-b p-3 text-left text-xs leading-4 font-medium text-white/40"
										)}
										style={{
											width: header.getSize(),
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
								return (
									<td
										key={cell.id}
										className={cn(
											"border-gray-710 h-18 border-b p-0 pt-px text-sm text-white"
										)}
										style={{
											width: cell.column.getSize(),
										}}
									>
										<div
											className={cn(
												"flex h-full cursor-pointer items-center p-3"
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
				{!allItemsLoaded && !isFetching ? (
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

export default ProfileHoldings;
