import { useCallback, useMemo, useState } from "react";

import { useRouter, useSearch } from "@tanstack/react-router";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { TokenListSortOption } from "@/apis/indexer";
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
export default function TrendingSort() {
	const { sort, direction } = useSearch({
		from: "/",
	});
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
					completed: undefined,
					completing: undefined,
				}),
			});
		},
		[router]
	);
	return (
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
	);
}
