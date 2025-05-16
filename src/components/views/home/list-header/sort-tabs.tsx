import { useRouter, useSearch } from "@tanstack/react-router";

import {
	tokenListFiltersOptions,
	type TokenListSortOption,
	tokenListSortOptions,
} from "@/apis/indexer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
export default function SortFiltersTabs() {
	const { sort, direction, completed, completing } = useSearch({
		from: "/",
	});
	const router = useRouter();
	const value =
		completed !== undefined
			? "completed"
			: completing !== undefined
				? "completing"
				: direction === "desc"
					? sort
					: "";
	return (
		<Tabs
			className=""
			value={value}
			onValueChange={(value) => {
				const direction = "desc";
				const isFilter = tokenListFiltersOptions.includes(value);

				void router.navigate({
					to: "/",
					search: (previous) => {
						return {
							...previous,
							tab: undefined,
							...(isFilter
								? {
										...Object.fromEntries(
											tokenListFiltersOptions.map((option) => [
												option,
												undefined,
											])
										),
										[value]: true,
										sort: undefined,
										direction: undefined,
									}
								: {
										sort: value as TokenListSortOption,
										direction,
										...Object.fromEntries(
											tokenListFiltersOptions.map((option) => [
												option,
												undefined,
											])
										),
									}),
						};
					},
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
