import { useEffect, useState } from "react";

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import SlippageSetting from "@/components/icons/common/slippage-setting";
import Star from "@/components/icons/star";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemeList from "@/components/views/home/meme-list";
import { slippageRange, validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { chains, useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";
import { useQuickBuyStore } from "@/store/quick-buy";

import type { TokenListSortOption } from "@/apis/indexer";

const tabs = ["recent", "new", "completing", "completed", "favorite"] as const;
type TabType = (typeof tabs)[number];
// Using Zod to define search parameters schema
const SearchSchema = z.object({
	tab: z.enum(tabs).optional(),
	chain: z.enum(chains).optional(),
});

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

function Home() {
	const { tab, chain: chainFromSearch, ...search } = Route.useSearch();
	const [trendingTime, setTrendingTime] =
		useState<TrendingTimeOption>("5 mins");

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

	const [sort, setSort] = useState<TokenListSortOption>("recent");

	return (
		<div className="mt-4.5 flex flex-col overflow-auto">
			<div className="sticky top-0 z-10 flex gap-4 text-white">
				<Select
					value={trendingTime}
					onValueChange={(value: TrendingTimeOption) => {
						setTrendingTime(value);
						const option = trendingTimeOptions.find(
							(option) => option.label === value
						);
						if (!option) {
							return;
						}
						setSort(option.value);
					}}
				>
					<SelectTrigger className="dark:bg-gray-710 dark:hover:bg-gray-710/80 *:data-[slot=select-value]:bg-gray-760 h-[38px] min-w-[162px] rounded-full border-none px-4 text-sm font-semibold focus-visible:ring-0 *:data-[slot=select-value]:h-6 *:data-[slot=select-value]:rounded-full *:data-[slot=select-value]:px-2 *:data-[slot=select-value]:text-xs *:data-[slot=select-value]:font-medium *:data-[slot=select-value]:text-white/60">
						<div className="flex items-center gap-x-1">
							<img alt="fire" src="/svgs/fire.svg" />
							<span className="text-sm font-semibold">Trending</span>
						</div>
						<SelectValue
							className="dark:bg-gray-760 dark:text-gray-760 text-sm font-semibold"
							placeholder=""
						/>
					</SelectTrigger>
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
					defaultValue={tab ?? "recent"}
					onValueChange={(value) => {
						setSort(value as TokenListSortOption);
						void router.navigate({
							to: "/",
							search: { ...search, tab: value as TabType },
						});
					}}
				>
					<TabsList className="border-gray-650 h-[38px] rounded-full border bg-transparent">
						{tabs.slice(0, 4).map((tab) => (
							<TabsTrigger
								key={tab}
								value={tab}
								className={cn(
									"rounded-full px-4 py-2 text-white/60 capitalize dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
								)}
							>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
				<Link
					className="bg-gray-750 rounded-full px-4 py-2 text-white/60"
					search={{ ...search, tab: "favorite" }}
					to="/"
				>
					<Star
						className={cn(
							"text-white/80 hover:text-yellow-500",
							tab === "favorite" && "text-yellow-500"
						)}
					/>
				</Link>
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
				<MemeList sort={sort} />
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
