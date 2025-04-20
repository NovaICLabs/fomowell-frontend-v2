import { type KeyboardEvent, useCallback, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { Check, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import {
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SearchResult {
	id: string;
	title: string;
	type: string;
}

// Mock initial recommendations
const initialRecommendations: Array<SearchResult> = [
	{ id: "1", title: "Trending 1", type: "trending" },
	{ id: "2", title: "Trending 2", type: "trending" },
	{ id: "3", title: "Recent Search 1", type: "recent" },
	{ id: "4", title: "Recent Search 2", type: "recent" },
];

export default function Search() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selected, setSelected] = useState<SearchResult | null>(null);
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms debounce

	// Search request
	const { data: searchResults, isLoading } = useQuery({
		queryKey: ["search", debouncedSearchTerm],
		queryFn: async () => {
			// Return recommendations when empty
			if (!debouncedSearchTerm.trim()) {
				return initialRecommendations;
			}

			// Replace with actual API call
			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			}); // Simulate network request

			return [
				{ id: "r1", title: `Result: ${debouncedSearchTerm}`, type: "result" },
				{ id: "r2", title: `Related: ${debouncedSearchTerm}`, type: "result" },
			] as Array<SearchResult>;
		},
		enabled: true, // Always make requests
	});

	// Handle selection
	const handleSelectOption = useCallback((item: SearchResult) => {
		setSearchTerm(item.title);
		setSelected(item);
		setIsOpen(false);

		// Handle blur
		setTimeout(() => {
			inputRef?.current?.blur();
		}, 0);
	}, []);

	// Keyboard event handling
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (!input) return;

			if (!isOpen) {
				setIsOpen(true);
			}

			if (event.key === "Escape") {
				input.blur();
			}
		},
		[isOpen]
	);

	// Handle blur
	const handleBlur = useCallback(() => {
		setIsOpen(false);
	}, []);

	// Group results
	const trendingResults =
		searchResults?.filter((item) => item.type === "trending") || [];
	const recentResults =
		searchResults?.filter((item) => item.type === "recent") || [];
	const searchMatches =
		searchResults?.filter((item) => item.type === "result") || [];

	return (
		<CommandPrimitive
			className="relative hidden w-[240px]"
			onKeyDown={handleKeyDown}
		>
			<div className="relative">
				<CommandInput
					ref={inputRef}
					className="h-full rounded-xl bg-gray-800 text-xs placeholder:text-xs placeholder:text-white/30"
					placeholder="Search by symbol or address"
					value={searchTerm}
					onBlur={handleBlur}
					onValueChange={setSearchTerm}
					onFocus={() => {
						setIsOpen(true);
					}}
				/>
			</div>
			<div className="relative mt-1">
				<div
					className={cn(
						"animate-in fade-in-0 zoom-in-95 bg-popover absolute top-0 z-10 w-full rounded-xl outline-none",
						isOpen ? "block" : "hidden"
					)}
				>
					<CommandList className="max-h-[300px] overflow-y-auto rounded-lg">
						{isLoading ? (
							<CommandPrimitive.Loading>
								<div className="flex items-center justify-center py-6">
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							</CommandPrimitive.Loading>
						) : (
							<>
								{trendingResults.length > 0 && (
									<CommandGroup heading="Trending">
										{trendingResults.map((item) => {
											const isSelected = selected?.id === item.id;
											return (
												<CommandItem
													key={item.id}
													value={item.title}
													className={cn(
														"flex w-full items-center gap-2",
														!isSelected ? "pl-8" : null
													)}
													onSelect={() => {
														handleSelectOption(item);
													}}
												>
													{isSelected ? <Check className="w-4" /> : null}
													{item.title}
												</CommandItem>
											);
										})}
									</CommandGroup>
								)}

								{recentResults.length > 0 && (
									<CommandGroup heading="Recent Searches">
										{recentResults.map((item) => {
											const isSelected = selected?.id === item.id;
											return (
												<CommandItem
													key={item.id}
													value={item.title}
													className={cn(
														"flex w-full items-center gap-2",
														!isSelected ? "pl-8" : null
													)}
													onSelect={() => {
														handleSelectOption(item);
													}}
												>
													{isSelected ? <Check className="w-4" /> : null}
													{item.title}
												</CommandItem>
											);
										})}
									</CommandGroup>
								)}

								{searchMatches.length > 0 && (
									<CommandGroup heading="Search Results">
										{searchMatches.map((item) => {
											const isSelected = selected?.id === item.id;
											return (
												<CommandItem
													key={item.id}
													value={item.title}
													className={cn(
														"flex w-full items-center gap-2",
														!isSelected ? "pl-8" : null
													)}
													onSelect={() => {
														handleSelectOption(item);
													}}
												>
													{isSelected ? <Check className="w-4" /> : null}
													{item.title}
												</CommandItem>
											);
										})}
									</CommandGroup>
								)}

								{!searchResults || searchResults.length === 0 ? (
									<CommandPrimitive.Empty className="text-muted-foreground py-3 text-center text-sm select-none">
										No results found
									</CommandPrimitive.Empty>
								) : null}
							</>
						)}
					</CommandList>
				</div>
			</div>
		</CommandPrimitive>
	);
}
