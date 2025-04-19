import { useEffect, useState } from "react";

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import SlippageSetting from "@/components/icons/common/slippage-setting";
import IcpLogo from "@/components/icons/logo/icp";
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
import { validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { chains, useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";
import { useQuickBuyStore } from "@/store/quick-buy";

const tabs = ["recent", "new", "completing", "completed", "favorite"] as const;
type TabType = (typeof tabs)[number];
// Using Zod to define search parameters schema
const SearchSchema = z.object({
	tab: z.enum(tabs).optional(),
	chain: z.enum(chains).optional(),
});

// Derived type
// type SearchParameters = z.infer<typeof SearchSchema>;

const timeOptions = ["5 mins", "1 hrs", "6 hrs", "1 day"] as const;
type TimeOption = (typeof timeOptions)[number];

function Home() {
	const { tab, chain: chainFromSearch, ...search } = Route.useSearch();
	const [time, setTime] = useState<TimeOption>("5 mins");

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
	return (
		<div className="mt-4.5 flex flex-col overflow-auto">
			<div className="sticky top-0 z-10 flex gap-4 text-white">
				<Select
					value={time}
					onValueChange={(value: TimeOption) => {
						setTime(value);
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
						{timeOptions.map((tabName) => (
							<SelectItem
								key={tabName}
								className="flex h-[42px] cursor-pointer items-center gap-x-1.5 rounded-[14px] text-sm font-semibold hover:bg-gray-700 data-[state=checked]:bg-gray-700"
								value={tabName}
							>
								{tabName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Tabs
					className=""
					defaultValue="recent"
					onValueChange={(value) => {
						void router.navigate({
							to: "/",
							search: { ...search, tab: value as TabType },
						});
					}}
				>
					<TabsList className="border-gray-650 h-[38px] rounded-full border bg-transparent">
						{tabs.slice(0, 4).map((tabName) => (
							<TabsTrigger
								key={tabName}
								value={tabName}
								className={cn(
									"rounded-full px-4 py-2 text-white/60 capitalize dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
								)}
							>
								{tabName}
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
						<IcpLogo className="h-4 w-4 flex-shrink-0" />
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
					<div className="relative ml-2 flex h-8 w-[60px] items-center rounded-full bg-gray-800 px-2">
						<Input
							className="h-8 w-full rounded-full border-none px-1 text-sm font-medium text-white focus-visible:ring-0 dark:bg-gray-800"
							value={slippage}
							onBlur={() => {
								if (slippage.endsWith(".")) {
									setSlippage(slippage.slice(0, -1));
								}
							}}
							onChange={(event) => {
								const value = event.target.value.trim();
								validateInputNumber({
									value,
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
				{(!tab || tab === "recent") && <MemeList />}
				{tab === "new" && <div>New Creation content - Chain: {chain}</div>}
				{tab === "completing" && <div>Completing content - Chain: {chain}</div>}
				{tab === "completed" && <div>Completed content - Chain: {chain}</div>}
				{tab === "favorite" && <div>Favorite content - Chain: {chain}</div>}
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
