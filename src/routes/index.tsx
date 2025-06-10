import { useEffect } from "react";

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";
import { z } from "zod";

import { tokenListSortOptions } from "@/apis/indexer";
import BtcMemeList from "@/components/views/home/btc-meme-list";
import FavoriteTab from "@/components/views/home/list-header/favorite";
import Slippage from "@/components/views/home/list-header/slippage";
import SortFiltersTabs from "@/components/views/home/list-header/sort-tabs";
import TrendingSort from "@/components/views/home/list-header/trending";
import MemeList from "@/components/views/home/meme-list";
import { cn } from "@/lib/utils";
import { chains, useChainStore } from "@/store/chain";

// Derived type
// type SearchParameters = z.infer<typeof SearchSchema>;

const directionOptions = ["asc", "desc"] as const;
export type SortDirection = (typeof directionOptions)[number];
// Using Zod to define search parameters schema
const SearchSchema = z.object({
	chain: z.enum(chains).optional(),
	sort: z.enum(tokenListSortOptions).optional(),
	direction: z.enum(directionOptions).optional(),
	tab: z.string().optional(),
	completed: z.boolean().optional(),
	completing: z.boolean().optional(),
});

function Home() {
	const { chain: chainFromSearch } = Route.useSearch();

	const router = useRouter();
	const { chain, setChain } = useChainStore();

	useEffect(() => {
		if (chainFromSearch && chainFromSearch !== chain) {
			setChain(chainFromSearch);
		}
	}, [chainFromSearch, chain, router, setChain]);

	return (
		<div
			className={cn("mt-4.5 flex flex-col overflow-auto", isMobile && "mt-2.5")}
		>
			{isMobile ? (
				<div
					className={cn(
						"sticky top-0 z-10 flex flex-col gap-4 px-2.5 text-white"
					)}
				>
					<div className="no-scrollbar flex w-full gap-2 overflow-auto">
						<SortFiltersTabs />
						<FavoriteTab />
					</div>
					<div className="flex">
						<TrendingSort />
						<Slippage />
					</div>
				</div>
			) : (
				<div className={cn("sticky top-0 z-10 flex gap-4 text-white")}>
					<TrendingSort />
					<SortFiltersTabs />
					<FavoriteTab />
					<Slippage />
				</div>
			)}
			<div className="mt-4 flex flex-col overflow-auto">
				{chain === "icp" && <MemeList />}
				{chain === "bitcoin" && <BtcMemeList />}
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
