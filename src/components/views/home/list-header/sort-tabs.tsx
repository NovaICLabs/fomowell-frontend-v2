import { useRouter, useSearch } from "@tanstack/react-router";

import { type TokenListSortOption, tokenListSortOptions } from "@/apis/indexer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
export default function SortTabs() {
	const { sort, direction } = useSearch({
		from: "/",
	});
	const router = useRouter();
	return (
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
	);
}
