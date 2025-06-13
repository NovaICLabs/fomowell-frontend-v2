import { useMemo, useState } from "react";

import { Link, useRouter } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { motion } from "framer-motion";

import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { Star } from "@/components/icons/star";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useCKBTCPrice } from "@/hooks/apis/coingecko";
import { useBtcInfiniteTokenList } from "@/hooks/apis/indexer_btc";
import { useBtcConnectedIdentity } from "@/hooks/providers/wallet/bitcoin";
import { string2bigint } from "@/lib/common/data/bigint";
import {
	formatNumberSmart,
	formatUnits,
	getTokenUsdValueTotal,
} from "@/lib/common/number";
import { fromNow } from "@/lib/common/time";
// import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";

import type { BtcTokenInfo } from "@/apis/indexer_btc";

const LiquidityHeader = ({
	sortBy,
	setSortBy,
}: {
	sortBy: string;
	setSortBy: (sortBy: string) => void;
}) => {
	const headers = [
		{
			id: "token",
			label: "Token",
			sortable: false,
			className:
				"min-w-[18%] w-[180px] pr-[10px] pl-[50px] md:w-[400px] sticky left-0 bg-[#1E1E1E] z-[1]",
		},
		{
			id: "create",
			label: "Create",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		{
			id: "mkt-cap",
			label: "Mkt cap",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		{
			id: "total-liq",
			label: "Total liq",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		// {
		// 	id: "fees",
		// 	label: "Fees",
		// 	sortable: true,
		// 	className: "min-w-[15%] w-[120px] md:w-[220px]",
		// },
		{
			id: "total-swap",
			label: "Total swap",
			sortable: true,
			className: "min-w-[15%] w-[120px] md:w-[220px]",
		},
		{
			id: "add-liquidity",
			label: "Add Liquidity",
			sortable: false,
			className:
				"min-w-[10%] w-[100px] pl-[10px] md:w-[220px] sticky right-0 bg-[#1E1E1E] z-[1]",
		},
	];

	const handleSort = (field: string): void => {
		if (sortBy === `${field}-up`) {
			setSortBy(`${field}-down`);
		} else if (sortBy === `${field}-down`) {
			setSortBy("");
		} else {
			setSortBy(`${field}-up`);
		}
	};

	const renderSortArrows = (field: string) => {
		return (
			<div className="relative ml-2 flex flex-shrink-0 flex-col gap-y-[2px]">
				<div
					className={cn(
						"h-0 w-0 border-x-[3.5px] border-b-[4px] border-x-transparent border-b-[#ffff]/40",
						sortBy === `${field}-up` && "border-b-[#ffffff]"
					)}
				/>
				<div
					className={cn(
						"h-0 w-0 border-x-[3.5px] border-t-[4px] border-x-transparent border-t-[#ffff]/40",
						sortBy === `${field}-down` && "border-t-[#ffffff]"
					)}
				/>
			</div>
		);
	};

	return (
		<tr className="flex h-[48px] w-full items-center border-b border-[#262626]">
			{headers.map((header) => (
				<th
					key={header.id}
					className={cn(
						`flex h-full items-center text-left text-xs leading-none font-medium text-white/40`,
						header.className,
						header.sortable &&
							"flex cursor-pointer items-center hover:text-white/60"
					)}
					onClick={() => {
						if (header.sortable) {
							handleSort(header.id);
						}
					}}
				>
					{header.label}
					{header.sortable && renderSortArrows(header.id)}
				</th>
			))}
		</tr>
	);
};

const LiquidityListItemSkeleton = () => {
	return (
		<>
			{Array.from({ length: 15 }).map((_, index) => (
				<div
					key={index}
					className="flex h-[70px] w-full flex-shrink-0 items-center justify-center border-b border-[#262626]"
				>
					<Skeleton className="h-[70px] w-full" />
				</div>
			))}
		</>
	);
};

// type TypeLiquidityListItem = {
// 	id: number;
// 	isFollow?: boolean | undefined;
// 	logo: string;
// 	chain: "ic" | "btc";
// 	symbol: string;
// 	address: string;
// 	twitterLink?: string | undefined;
// 	telegramLink?: string | undefined;
// 	websiteLink?: string | undefined;
// 	createAt: bigint;
// };

const LiquidityListItem = ({
	itemData,
	ckBtcPrice,
}: {
	itemData: BtcTokenInfo;
	ckBtcPrice: number | undefined;
}) => {
	const router = useRouter();
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

	const onFavoriteLiquidity = () => {};

	const onAddLiquidity = () => {
		void router.navigate({
			to: `/bitcoin/token/$id`,
			params: { id: `${itemData.id}` },
			search: { type: "add_liquidity" },
		});
	};

	const priceSats = useMemo(() => {
		return itemData.price === null
			? 0
			: formatNumberSmart(itemData.price, {
					shortenLarge: true,
					shortZero: true,
					formatCount: 3,
				});
	}, [itemData.price]);

	const mc = useMemo(() => {
		const priceInUsd =
			itemData.price === null
				? BigNumber(0)
				: BigNumber(itemData.price)
						.div(10 ** getCkbtcCanisterToken().decimals)
						.times(ckBtcPrice ?? 0);

		const mcUsd = BigNumber(21_000_000).times(priceInUsd).toString();
		return formatNumberSmart(mcUsd, { shortenLarge: true });
	}, [ckBtcPrice, itemData.price]);

	return (
		<motion.tr
			key={itemData.id}
			className="group relative flex h-[70px] items-center border-b border-[#262626] duration-300 hover:!bg-[#262626]"
			initial="initial"
			variants={rowVariants}
		>
			<div className="sticky left-0 z-[1] flex h-full w-[180px] min-w-[18%] items-center bg-[#1E1E1E] pr-[10px] text-left text-xs leading-none font-medium text-white/60 duration-300 group-hover:!bg-[#262626] md:w-[400px]">
				<Star
					className="ml-[20px] h-4 w-4 shrink-0 cursor-pointer text-white/40"
					isActive={itemData.isFollow}
					onClick={() => {
						onFavoriteLiquidity();
					}}
				/>
				<div
					className="relative ml-[10px] flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full"
					onClick={() => {
						void router.navigate({
							to: `/bitcoin/token/$id`,
							params: { id: `${itemData.id}` },
						});
					}}
				>
					<div className="absolute inset-0 rounded-full border-[2px] border-gray-500"></div>
					<div className="bg-gray-710 absolute h-9 w-9 rounded-full p-[2px]"></div>
					<div
						className="absolute h-9 w-9 rounded-full p-[2px]"
						style={{
							backgroundImage: `url(${itemData.logo})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					/>
					{/* {itemData.chain === "ic" && (
						<img
							alt="ic-logo"
							className="absolute right-0 bottom-0 flex h-3 w-3 items-center justify-center rounded-full bg-[#ffffff]"
							src={`/svgs/chains/icp.svg`}
						/>
					)} */}
					{/* {chain === "btc" && (
						<img
							alt="ic-logo"
							className="absolute right-0 bottom-0 flex h-3 w-3 items-center justify-center rounded-full"
							src={`/svgs/chains/bitcoin.svg`}
						/>
					)} */}
				</div>
				<div className="ml-[10px] flex flex-col justify-center">
					<div className="flex items-center gap-x-[10px]">
						<p
							className="cursor-pointer text-sm leading-none font-medium text-white"
							onClick={() => {
								void router.navigate({
									to: `/bitcoin/token/$id`,
									params: { id: `${itemData.id}` },
								});
							}}
						>
							{itemData?.ticker}
						</p>
						{itemData.twitter && (
							<Link
								className="hidden flex-shrink-0 md:flex"
								target="_black"
								to={itemData.twitter}
							>
								<img alt="" src="/svgs/links/twitter.svg" />
							</Link>
						)}
						{itemData.telegram && (
							<Link
								className="hidden flex-shrink-0 md:flex"
								target="_black"
								to={itemData.telegram}
							>
								<img alt="" src="/svgs/links/telegram.svg" />
							</Link>
						)}
						{itemData.website && (
							<Link
								className="hidden flex-shrink-0 md:flex"
								target="_black"
								to={itemData.website}
							>
								<img alt="" src="/svgs/links/website.svg" />
							</Link>
						)}
					</div>
					<p className="mt-[6px] text-xs leading-none font-light text-white/60">
						{/* {truncatePrincipal(itemData.creator)} */}
						{itemData.rune_name}
					</p>
				</div>
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] items-center text-left text-sm leading-4 font-medium text-white/60 md:w-[220px]">
				{fromNow(string2bigint(itemData.timestamp))}
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] flex-col justify-center text-left md:w-[220px]">
				<p className="text-sm leading-4 font-medium text-white">${mc}</p>
				<p className="mt-1 text-xs leading-4 font-medium text-white/60">
					{priceSats} sats
				</p>
			</div>
			<div className="flex h-full w-[120px] min-w-[14%] items-center text-left text-sm leading-4 font-medium text-white md:w-[220px]">
				$
				{ckBtcPrice
					? getTokenUsdValueTotal(
							{
								amount:
									itemData.market_cap_token === null
										? 0n
										: BigInt(itemData.market_cap_token),
							},
							ckBtcPrice ?? 0
						)
					: "--"}
			</div>
			{/* <div className="flex h-full w-[120px] min-w-[14%] flex-col justify-center text-left text-sm leading-4 font-medium text-white/60 md:w-[220px]">
				<p className="text-sm leading-4 font-medium text-white/60">$116.79</p>
				<p className="mt-1 text-xs leading-4 font-medium text-white/60">
					APR: 6.09%
				</p>
			</div> */}
			<div className="flex h-full w-[120px] min-w-[14%] flex-col justify-center text-left md:w-[220px]">
				<p className="text-sm leading-4 font-medium text-white">
					{itemData.volumeAll === null
						? "--"
						: formatNumberSmart(formatUnits(itemData.volumeAll), {
								shortenLarge: true,
							})}{" "}
					BTC
				</p>
				<p className="mt-1 text-xs leading-4 font-medium text-white/60">
					$
					{itemData.volumeAll === null || !ckBtcPrice
						? "--"
						: getTokenUsdValueTotal(
								{ amount: BigInt(itemData.volumeAll) },
								ckBtcPrice ?? 0
							)}
				</p>
			</div>
			<div className="sticky right-0 z-[1] flex h-full w-[100px] min-w-[10%] items-center bg-[#1E1E1E] pl-[10px] text-left text-sm leading-4 font-medium text-white/60 duration-300 group-hover:!bg-[#262626] md:w-[220px]">
				<div
					className="flex h-9 w-[84px] cursor-pointer items-center justify-center rounded-[19px] border border-[#f7b406] bg-[#111111] text-sm font-medium text-white"
					style={{
						backgroundImage: `url(svgs/liquidity/add-border.png)`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
					onClick={() => {
						onAddLiquidity();
					}}
				>
					<img
						alt=""
						className="mr-[6px] h-4 w-4"
						src="/svgs/liquidity/lightning.svg"
					/>
					Add
				</div>
			</div>
		</motion.tr>
	);
};

export default function LiquidityPage() {
	const [sortBy, setSortBy] = useState<string>("");
	const { data: ckBtcPrice } = useCKBTCPrice();

	const { principal } = useBtcConnectedIdentity();
	// const [list, setList] = useState<Array<TypeLiquidityListItem> | undefined>(
	// 	undefined
	// );

	// const sortedList = useMemo(() => {
	// 	if (!list) {
	// 		return undefined;
	// 	}
	// 	return list;
	// }, [list]);

	// useEffect(() => {
	// 	const data: Array<TypeLiquidityListItem> = [
	// 		{
	// 			id: 1,
	// 			isFollow: true,
	// 			logo: "https://image-uploader.sophiamoon231.workers.dev/1747409754481-o1baf9bquf.gif",
	// 			chain: "ic",
	// 			symbol: "Symbol1",
	// 			address:
	// 				"aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaa",
	// 			twitterLink: "test link",
	// 			telegramLink: "test link",
	// 			websiteLink: "test link",
	// 			createAt: 1749191039000000000n,
	// 		},
	// 		{
	// 			id: 2,
	// 			isFollow: false,
	// 			logo: "https://image-uploader.sophiamoon231.workers.dev/1747409754481-o1baf9bquf.gif",
	// 			chain: "btc",
	// 			symbol: "Symbol2",
	// 			address:
	// 				"aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaa",
	// 			twitterLink: "test link",
	// 			telegramLink: "",
	// 			websiteLink: "test link",
	// 			createAt: 1749191039000000000n,
	// 		},
	// 		{
	// 			id: 3,
	// 			isFollow: true,
	// 			logo: "https://image-uploader.sophiamoon231.workers.dev/1747409754481-o1baf9bquf.gif",
	// 			chain: "ic",
	// 			symbol: "Symbol3",
	// 			address:
	// 				"aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaa",
	// 			twitterLink: "test link",
	// 			telegramLink: "test link",
	// 			websiteLink: "",
	// 			createAt: 1749191039000000000n,
	// 		},
	// 	];
	// 	setTimeout(() => {
	// 		setList(data);
	// 	}, 1000);
	// }, [sortBy]);

	const queryParameters = useMemo(
		() => ({
			// sort,
			// sortDirection: direction,
			pageSize: 16,
			principal,
			filters: {
				completed: true,
			},
		}),
		// sort, direction,
		[principal]
	);

	const {
		data: allTokenList,
		hasNextPage: hasNextPageAllTokenList,
		fetchNextPage: fetchNextPageAllTokenList,
		isFetchingNextPage: isFetchingNextPageAllTokenList,
		status: statusAllTokenList,
		error: errorAllTokenList,
		isFetching: isFetchingAllTokenList,
	} = useBtcInfiniteTokenList(queryParameters);

	const {
		data,
		// hasNextPage,
		// fetchNextPage,
		// isFetchingNextPage,
		// status,
		// error,
		// isFetching,
	} = useMemo(() => {
		return {
			data: allTokenList,
			hasNextPage: hasNextPageAllTokenList,
			fetchNextPage: fetchNextPageAllTokenList,
			isFetchingNextPage: isFetchingNextPageAllTokenList,
			status: statusAllTokenList,
			error: errorAllTokenList,
			isFetching: isFetchingAllTokenList,
		};
	}, [
		allTokenList,
		hasNextPageAllTokenList,
		fetchNextPageAllTokenList,
		isFetchingNextPageAllTokenList,
		statusAllTokenList,
		errorAllTokenList,
		isFetchingAllTokenList,
	]);

	const items = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data]
	);

	return (
		<div className="no-scrollbar flex h-full w-full flex-col overflow-x-scroll">
			<table className="h-full w-full min-w-max">
				<thead className="sticky top-0 z-10">
					<LiquidityHeader setSortBy={setSortBy} sortBy={sortBy} />
				</thead>
				<tbody className="flex w-full flex-col">
					{!items && <LiquidityListItemSkeleton />}
					{items && items.length ? (
						items.map((item) => (
							<LiquidityListItem
								key={item.id}
								ckBtcPrice={ckBtcPrice}
								itemData={item}
							/>
						))
					) : (
						<Empty />
					)}
				</tbody>
			</table>
		</div>
	);
}
