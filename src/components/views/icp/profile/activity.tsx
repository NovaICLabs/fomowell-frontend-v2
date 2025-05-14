import { useEffect, useMemo, useRef } from "react";

import { useParams } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import { Empty } from "@/components/ui/empty";
import { useInfiniteUserActivity } from "@/hooks/apis/indexer";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
} from "@/lib/common/number";
import { cn } from "@/lib/utils";

import type { ActivityItem } from "@/apis/indexer";

const ProfileActivity = () => {
	// const router = useRouter();
	// const { chain } = useChainStore();
	// const { data: icpPrice } = useICPPrice();
	const { userid } = useParams({ from: "/icp/profile/$userid" });
	const { data, isFetching, refetch, hasNextPage, fetchNextPage } =
		useInfiniteUserActivity({
			pageSize: 10,
			userid,
		});
	const columnHelper = useMemo(() => createColumnHelper<ActivityItem>(), []);

	const items = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data]
	);

	const loadingRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!userid) return;

		void refetch();
	}, [userid, refetch]);

	const columns = useMemo(
		() => [
			// Token column
			columnHelper.accessor("tokenTicker", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Token</span>
					</div>
				),
				cell: (info) => {
					return (
						<div className="text-sm leading-4 text-white/60">
							{info.getValue()}
						</div>
					);
				},
				size: 150, // Adjust size as needed
			}),
			// Type column
			columnHelper.accessor("trans_type", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Type</span>
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const isSell = value === "sell";
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4 capitalize",
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
			columnHelper.accessor("token0Amount", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Amount</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/60">
							{formatNumberSmart(formatUnits(info.getValue()), {
								shortenLarge: true,
							})}
						</span>
					</div>
				),
				size: 100,
			}),
			// Total USD column
			columnHelper.accessor("token1Usd", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Total USD
						</span>
					</div>
				),
				cell: (info) => {
					const amount = info.row.original.token1Amount;
					if (!amount) {
						return <div>--</div>;
					}
					return (
						<div className="flex h-full w-full items-center">
							<span
								className={cn(
									"text-sm leading-4",
									info.row.original.trans_type === "sell"
										? "text-price-negative"
										: "text-price-positive"
								)}
							>
								$
								{amount
									? getTokenUsdValueTotal(
											{
												amount: BigInt(amount),
											},
											info.row.original.token1Usd ?? 0
										)
									: ""}
							</span>
						</div>
					);
				},
				size: 120,
			}),
			// Fee column
			columnHelper.accessor("token1Amount", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Total ICP
						</span>
					</div>
				),
				cell: (info) => {
					const value = info.getValue();
					const type = info.row.original.trans_type;
					const deposit = info.row.original.token0Amount;
					const withdraw = info.row.original.token1Amount;
					const isDeposit = type === "deposit";
					const isWithdraw = type === "withdraw";

					const amount = isDeposit ? deposit : isWithdraw ? withdraw : value;
					if (!amount) {
						return <div>--</div>;
					}
					return (
						<div className="flex h-full w-full items-center">
							<span className="text-sm leading-4 text-white/60">
								{formatNumberSmart(
									formatUnits(amount, getICPCanisterToken().decimals)
								)}{" "}
								ICP
							</span>
						</div>
					);
				},
				size: 130,
			}),
			// Price column
			columnHelper.accessor("token1Price", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Price / Count
						</span>
					</div>
				),
				cell: (info) => {
					const type = info.row.original.trans_type;
					const sellPrice = info.row.original.token0Price;
					const buyPrice = info.row.original.token1Price;
					const isBuy = type === "buy";
					const isSell = type === "sell";
					const price = isSell ? sellPrice : isBuy ? buyPrice : undefined;

					if (!price) {
						return <div>--</div>;
					}

					return (
						<div className="flex h-full w-full items-center gap-1">
							<span className="text-sm leading-4">
								{formatNumberSmart(
									BigNumber(1)
										.times(10 ** getICPCanisterToken().decimals)
										.div(BigNumber(price))
										.toString(),
									{
										shortZero: true,
									}
								)}
							</span>
							<span className="text-sm leading-4 text-white/60">ICP</span>
						</div>
					);
				},
				size: 150,
			}),
			// Time column
			columnHelper.accessor("createdAt", {
				header: () => <div className="w-full text-start">Time</div>,
				cell: (info) => {
					const value = info.getValue();

					return (
						<div className="flex h-full w-full items-center">
							<div className="w-full text-start text-sm leading-4 text-white/60">
								{value
									? dayjs(Number(value)).format("YYYY-MM-DD HH:mm:ss")
									: ""}
							</div>
						</div>
					);
				},
				size: 120,
			}),
		],
		[columnHelper]
	);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries &&
					entries[0] &&
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetching
				) {
					void fetchNextPage();
				}
			},
			{ threshold: 0.1 }
		);

		const currentLoadingRef = loadingRef.current;
		if (currentLoadingRef) {
			observer.observe(currentLoadingRef);
		}

		return () => {
			if (currentLoadingRef) {
				observer.unobserve(currentLoadingRef);
			}
		};
	}, [fetchNextPage, hasNextPage, isFetching]);

	const table = useReactTable({
		data: items,
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
						<tr
							key={row.id}
							className="group hover:bg-gray-750 relative duration-300"
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
				{isFetching ? (
					<div className="py-4 text-center text-sm text-white/60">
						Loading more...
					</div>
				) : null}
				{!isFetching && items.length > 0 ? (
					<div className="py-4 text-center text-sm text-white/60">No more</div>
				) : null}
			</div>
			<div className="min-h-5 w-full">
				{!isFetching && (!items || items.length === 0) && <Empty />}
			</div>
		</div>
	);
};

export default ProfileActivity;
