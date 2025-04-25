import { useCallback, useEffect, useMemo, useState } from "react";

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { type TokenListSortOption, tokenListSortOptions } from "@/apis/indexer";
import SlippageSetting from "@/components/icons/common/slippage-setting";
import { Star } from "@/components/icons/star";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemeList from "@/components/views/home/meme-list";
import { slippageRange, validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { chains, useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";
import { useQuickBuyStore } from "@/store/quick-buy";

// Derived type
// type SearchParameters = z.infer<typeof SearchSchema>;

const trendingTimeOptions: Array<{
	label: string;
	value: TokenListSortOption;
}> = [
	{ label: "5 mins", value: "popularity_5m" },
	{ label: "1 hrs", value: "popularity_1h" },
	{ label: "6 hrs", value: "popularity_6h" },
	{ label: "1 day", value: "popularity_24h" },
] as const;
type TrendingTimeOption = (typeof trendingTimeOptions)[number]["label"];

const directionOptions = ["asc", "desc"] as const;
export type SortDirection = (typeof directionOptions)[number];
// Using Zod to define search parameters schema
const SearchSchema = z.object({
	chain: z.enum(chains).optional(),
	sort: z.enum(tokenListSortOptions).optional(),
	direction: z.enum(directionOptions).optional(),
	tab: z.string().optional(),
});

function Home() {
	const { sort, direction, tab, chain: chainFromSearch } = Route.useSearch();

	const [trendingTime, setTrendingTime] = useState<TrendingTimeOption>(
		trendingTimeOptions.find((option) => option.value === sort)?.label ??
			"5 mins"
	);
	const trendingTimeSelected = useMemo(
		() =>
			trendingTimeOptions.find((option) => option.value === sort)?.label ===
				trendingTime && direction === "desc",
		[sort, direction, trendingTime]
	);
	const router = useRouter();
	const { chain, setChain } = useChainStore();

	useEffect(() => {
		if (chainFromSearch && chainFromSearch !== chain) {
			setChain(chainFromSearch);
		}
	}, [chainFromSearch, chain, router, setChain]);
	const {
		amount: flashAmount,
		setAmount: setFlashAmount,
		slippage,
		setSlippage,
	} = useQuickBuyStore();
	const { setSlippageOpen } = useDialogStore();

	const handleTrendingTimeSort = useCallback(
		(value: TrendingTimeOption) => {
			const option = trendingTimeOptions.find(
				(option) => option.label === value || option.value === value
			);
			if (!option) {
				return;
			}
			const direction = "desc";
			// navigate to the new tab
			void router.navigate({
				to: "/",
				search: (previous) => ({
					...previous,
					tab: undefined,
					sort: option.value,
					direction,
				}),
			});
		},
		[router]
	);

	return (
		<div className="mt-4.5 flex flex-col overflow-auto">
			<div className="sticky top-0 z-10 flex gap-4 text-white">
				<Select
					value={
						trendingTime ??
						trendingTimeOptions.find((option) => option.value === sort)?.label
					}
					onValueChange={(value) => {
						handleTrendingTimeSort(value);
						setTrendingTime(value);
					}}
				>
					<div className={cn("relative flex items-center rounded-full p-px")}>
						{trendingTimeSelected && (
							<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF3D0C] to-[#FFEA14]"></div>
						)}
						<div className="relative flex h-full items-center rounded-full">
							<div
								className="absolute left-2 flex h-full cursor-pointer items-center justify-between gap-x-1"
								onClick={() => {
									handleTrendingTimeSort(trendingTime);
								}}
							>
								<img alt="fire" src="/svgs/fire.svg" />
								<span className="text-sm font-semibold">Trending</span>
								<div className="bg-gray-760 flex h-6 w-[50px] items-center justify-center rounded-full px-1.5 text-xs font-medium">
									<span className="text-white/60">{trendingTime}</span>
								</div>
							</div>
							<SelectTrigger className="dark:bg-gray-710 dark:hover:bg-gray-710/80 *:data-[slot=select-value]:bg-gray-760 h-[38px] min-w-[175px] justify-end rounded-full border-none px-4 focus-visible:ring-0 *:data-[slot=select-value]:h-6 *:data-[slot=select-value]:rounded-full *:data-[slot=select-value]:px-2 *:data-[slot=select-value]:text-xs *:data-[slot=select-value]:font-medium *:data-[slot=select-value]:text-white/60"></SelectTrigger>
						</div>
					</div>
					<SelectContent className="bg-gray-750 rounded-2xl border-none py-[5px]">
						{trendingTimeOptions.map((option) => (
							<SelectItem
								key={option.label}
								className="flex h-[42px] cursor-pointer items-center gap-x-1.5 rounded-[14px] text-sm font-semibold hover:bg-gray-700 data-[state=checked]:bg-gray-700"
								value={option.label}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Tabs
					className=""
					value={direction === "desc" ? sort : ""}
					onValueChange={(value) => {
						const direction = "desc";

						void router.navigate({
							to: "/",
							search: (previous) => ({
								...previous,
								tab: undefined,
								sort: value as TokenListSortOption,
								direction,
							}),
						});
					}}
				>
					<TabsList className="border-gray-650 h-[38px] rounded-full border bg-transparent">
						{tokenListSortOptions.slice(0, 4).map((sort) => (
							<TabsTrigger
								key={sort}
								value={sort}
								className={cn(
									"rounded-full px-4 py-2 text-white/60 capitalize dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
								)}
							>
								{sort}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
				<div
					className={cn(
						"bg-gray-750 cursor-pointer rounded-full px-4 py-2 text-white/60",
						tab === "favorite" && "bg-white"
					)}
					onClick={() => {
						void router.navigate({
							to: "/",
							search: (previous) => ({
								...previous,
								sort: undefined,
								direction: undefined,
								tab: "favorite",
							}),
						});
					}}
				>
					<Star isActive={tab === "favorite"} />
				</div>
				<div className="bg-gray-710 ml-auto flex h-[38px] items-center rounded-full px-4 text-white">
					<img alt="flash" src="/svgs/flash.svg" />
					<span className="ml-1.5 text-sm font-medium text-white">Buy</span>
					<div className="ml-2 flex h-8 items-center rounded-full bg-gray-800 px-2">
						<img alt={"icp-logo"} src={`/svgs/chains/icp.svg`} />
						<Input
							className="h-8 w-24 rounded-full border-none px-1 text-sm font-medium text-white focus-visible:ring-0 dark:bg-gray-800"
							placeholder="0"
							value={flashAmount}
							onBlur={() => {
								if (flashAmount.endsWith(".")) {
									setFlashAmount(flashAmount.slice(0, -1));
								}
							}}
							onChange={(event) => {
								const value = event.target.value.trim();
								validateInputNumber({
									value,
									callback: setFlashAmount,
								});
							}}
						></Input>
					</div>
					<span className="ml-4 text-sm font-medium text-white/60 capitalize">
						Slippage
					</span>
					<div
						className={cn(
							"relative ml-2 flex h-8 w-[63px] items-center overflow-hidden rounded-full border border-transparent bg-gray-800 pr-3 pl-2",
							Number(slippage) < slippageRange[0] ||
								(Number(slippage) > slippageRange[1] && "border-price-negative")
						)}
					>
						<Input
							value={slippage}
							className={cn(
								"h-full w-full rounded-full border-none px-1 text-sm font-medium text-white focus-visible:ring-0 dark:bg-gray-800"
							)}
							onBlur={() => {
								if (slippage.endsWith(".")) {
									setSlippage(slippage.slice(0, -1));
								}
								if (
									slippage === "" ||
									Number(slippage) < slippageRange[0] ||
									Number(slippage) > slippageRange[1]
								) {
									setSlippage("1");
								}
							}}
							onChange={(event) => {
								const value = event.target.value.trim();
								validateInputNumber({
									value,
									decimals: 2,
									callback: setSlippage,
								});
							}}
						/>
						<span className="absolute right-2 text-sm font-medium text-white/60">
							%
						</span>
					</div>
					<SlippageSetting
						className="ml-1.5 h-4 w-4 cursor-pointer"
						onClick={() => {
							setSlippageOpen({
								open: true,
								type: "global",
							});
						}}
					/>
				</div>
			</div>
			<div className="mt-4 flex flex-col overflow-auto">
				<MemeList />
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: Home,
	validateSearch: (search) => {
		return SearchSchema.parse(search);
	},
});
