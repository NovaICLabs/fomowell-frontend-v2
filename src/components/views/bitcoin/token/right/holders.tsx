import { useState } from "react";

import { Link } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { isMobile } from "react-device-detect";
import ReactPaginate from "react-paginate";

import { getChainICCoreCanisterId } from "@/canisters/core";
import { useBtcTokenHolders } from "@/hooks/btc/core";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import {
	formatNumberSmart,
	formatUnits,
	parseUnits,
} from "@/lib/common/number";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
export default function Holders() {
	const { id } = useTokenChainAndId();
	const [page, setPage] = useState(1);
	const handlePageClick = ({ selected }: { selected: number }) => {
		setPage(selected);
	};
	const { data: holders } = useBtcTokenHolders({
		id: Number(id),
		page,
	});

	return (
		<div className="-mt-2.5 flex flex-col items-center justify-between">
			<div
				className={cn(
					"flex w-full items-center justify-between",
					isMobile && "hidden"
				)}
			>
				<span className="text-base leading-normal font-semibold text-white">
					Holders
				</span>
				<span className="text-base font-semibold text-yellow-500">
					(
					{holders?.total
						? formatNumberSmart(Number(holders?.total ?? 0), {
								shortenLarge: true,
							})
						: "--"}
					)
				</span>
			</div>
			<div className="bg-gray-860 mt-2.5 flex h-[617px] w-full flex-col items-center justify-between rounded-[12px] pb-5">
				<table className="w-full">
					<thead>
						<tr className="border-b border-[#272727]">
							<th className="px-4.5 py-5 text-left text-sm font-normal text-[#A2A2A2]">
								Holder
							</th>
							<th className="px-4.5 py-5 text-right text-sm font-normal text-[#A2A2A2]">
								Balance
							</th>
						</tr>
					</thead>
					<tbody>
						{holders?.data.map((holder, index) => (
							<tr
								key={holder.account.owner.toText()}
								className="group h-[42px] cursor-pointer border-b border-[#272727]"
							>
								<td className="flex items-center justify-start px-4 py-5 text-left text-sm font-normal text-white/60">
									<Link
										className="flex items-center justify-start"
										to="/bitcoin/profile/$userid"
										params={{
											userid: holder.account.owner.toText(),
										}}
									>
										<div className="flex w-4 items-center justify-center">
											{index * page + 1}.
										</div>
										<div className="flex items-center justify-start group-hover:text-yellow-500">
											{truncatePrincipal(holder.account.owner.toText())}
										</div>
										<span className="ml-1">
											{holder.account.owner.toText() ===
											getChainICCoreCanisterId().toText() ? (
												<span className="text-white">(Pool)</span>
											) : null}
										</span>
									</Link>
								</td>
								<td className="h-[42px] px-4.5 py-5 text-right text-sm font-normal text-white">
									{formatNumberSmart(formatUnits(holder.balance), {
										shortenLarge: true,
									})}{" "}
									(
									{formatNumberSmart(
										BigNumber(holder.balance)
											.times(100)
											.div(parseUnits(1_000_000_000))
											.toString()
									)}
									% )
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="mt-auto">
					<ReactPaginate
						activeClassName="bg-yellow-500 !text-black rounded-[6px]"
						breakLabel="..."
						className="flex items-center gap-x-3"
						nextLabel=""
						pageClassName="text-sm text-white border h-[24px] min-w-[24px] border-[#36F]/0 flex items-center justify-center cursor-pointer"
						pageCount={Math.ceil(Number(holders?.total ?? 10) / 10)}
						pageRangeDisplayed={5}
						previousLabel=""
						renderOnZeroPageCount={null}
						onPageChange={handlePageClick}
					/>
				</div>
			</div>
		</div>
	);
}
