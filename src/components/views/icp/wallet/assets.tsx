import { useMemo, useState } from "react";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import IcpLogo from "@/components/icons/logo/icp";
import TransferDialog from "@/components/layout/dialog/transfer";
import { Button } from "@/components/ui/button";
import { useICPPrice } from "@/hooks/apis/coingecko";
import { useICPBalance } from "@/hooks/ic/tokens/icp";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";
import { getTokenUsdValueTotal } from "@/lib/common/number";
import { cn } from "@/lib/utils";

type Asset = {
	id: string; // Unique ID for the row/asset
	tokenName: string;
	symbol: string;
	priceChanged: string;
	balance: string;
	totalUsd: number; // e.g., 36.11
	priceBtc: string; // e.g., "0.002693 BTC"
	priceSats: string; // e.g., "0.12 sats"
	amount: string; // e.g., "260,059.00"
	positionPercent: number; // e.g., 9
	holdingDuration: string; // e.g., "24h"
};
const TransferButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			className="dark:group-hover:bg-gray-710 dark:bg-background dark:hover:bg-gray-710/80 h-[38px] w-[113px] rounded-full font-medium text-white"
			onClick={onClick}
		>
			<img alt="Transfer" className="h-4 w-4" src="/svgs/common/transfer.svg" />
			Transfer
		</Button>
	);
};
export default function Assets({ pid }: { pid: string }) {
	const { data: balance } = useICPBalance(pid);
	const { data: price } = useICPPrice();
	const usdValue =
		balance && price
			? getTokenUsdValueTotal({ amount: balance.raw }, price)
			: "--";
	const data = useMemo<Array<Asset>>(
		() => [
			{
				id: "a1",
				tokenName: "Internet Computer",
				symbol: "ICP",
				priceChanged: "12.34%",
				balance: "9.4K sats",
				totalUsd: 36.11,
				priceBtc: "0.002693 BTC",
				priceSats: "0.12 sats",
				amount: "260,059.00",
				positionPercent: 9,
				holdingDuration: "24h",
			},
		],
		[]
	);

	const columnHelper = createColumnHelper<Asset>();
	const [transferDialogOpen, setTransferDialogOpen] = useState(false);
	const { principal } = useConnectedIdentity();
	const isSelf = useMemo(() => {
		return pid === principal;
	}, [pid, principal]);
	const columns = useMemo(
		() => [
			// Token column
			columnHelper.accessor(
				(row) => ({ name: row.tokenName, symbol: row.symbol }),
				{
					id: "token",
					header: () => (
						<div className="group flex cursor-pointer items-center gap-1">
							<span className="duration-300 group-hover:text-white">Token</span>
						</div>
					),
					cell: (info) => (
						<div className="flex h-full w-full items-center gap-1">
							<IcpLogo className="h-6 w-6" />
							<div className="flex flex-col">
								<span className="text-sm font-medium text-white">
									{info.getValue().symbol}
								</span>
								<span className="text-xs text-white/80">
									{info.getValue().name}
								</span>
							</div>
						</div>
					),
					size: 150, // Adjust size as needed
				}
			),
			// BTC column
			columnHelper.accessor("balance", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">Balance</span>
					</div>
				),
				cell: () => (
					<div className="flex h-full w-full items-center">
						{/* Add sub-label if needed or just the value */}
						<span className="text-sm leading-4 text-white/80">
							{balance?.formatted}
						</span>
					</div>
				),
				size: 100,
			}),
			// Price column
			columnHelper.accessor(
				(row) => ({ btc: row.priceBtc, sats: row.priceSats }),
				{
					id: "price",
					header: () => (
						<div className="group flex cursor-pointer items-center gap-1">
							<span className="duration-300 group-hover:text-white">Price</span>
						</div>
					),
					cell: () => (
						<div className="flex h-full w-full flex-col items-start justify-center">
							${price}
						</div>
					),
					size: 100,
				}
			),
			// Total USD column
			columnHelper.accessor("totalUsd", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">
							Total USD
						</span>
					</div>
				),
				cell: () => (
					<div className="flex h-full w-full items-center">
						<span className="text-price-positive text-sm leading-4 font-medium">
							${usdValue}
						</span>
					</div>
				),
				size: 100,
			}),

			// Amount column
			columnHelper.accessor("priceChanged", {
				header: () => (
					<div className="group flex cursor-pointer items-center gap-1">
						<span className="duration-300 group-hover:text-white">24h%</span>
					</div>
				),
				cell: (info) => (
					<div className="flex h-full w-full items-center">
						<span className="text-sm leading-4 text-white/80">
							{info.getValue()}
						</span>
					</div>
				),
				size: 120,
			}),

			// Action column (Transfer)
			columnHelper.display({
				id: "action",
				header: () => <div className="w-full text-end">Action</div>, // Empty header or text like 'Action'
				cell: () => (
					<div className={cn("ml-auto", !isSelf && "hidden")}>
						<TransferButton
							onClick={() => {
								setTransferDialogOpen(true);
							}}
						/>
					</div>
				),
				size: 100,
			}),
		],
		[balance?.formatted, columnHelper, price, usdValue, isSelf]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 120, // Default size if not specified
		},
	});

	return (
		// Using the same outer div and table structure as Transactions
		<div className="no-scrollbar overflow-auto">
			<table className="w-full" style={{ minWidth: "max-content" }}>
				<thead className="bg-background sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="border-gray-710">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="border-gray-710 border-b p-3 text-left text-xs leading-4 font-medium text-white/40" // Match styling
									style={{ width: header.getSize() }}
								>
									{header.isPlaceholder
										? null
										: flexRender(
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
							className="group hover:bg-gray-750 relative duration-300" // Match styling
						>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="border-gray-710 h-12 border-b p-0 pt-px text-sm text-white" // Match styling
									style={{ width: cell.column.getSize() }}
								>
									<div className="flex h-full items-center p-3">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<TransferDialog
				open={transferDialogOpen}
				setOpen={setTransferDialogOpen}
			/>
		</div>
	);
}
