import { useInfiniteQuery } from "@tanstack/react-query";

import { getTokenList, getTokenTransactionList } from "@/apis/indexer";
import { getICPCanisterId } from "@/canisters/icrc3";

export const useInfiniteTokenList = () => {
	return useInfiniteQuery({
		queryKey: ["ic-core", "tokenList"],
		queryFn: ({ pageParam: pageParameter = 1 }) =>
			getTokenList({
				page: pageParameter,
				pageSize: 10,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
	});
};

export const useInfiniteTokenTransactionsHistory = (parameters: {
	token0: string;
}) => {
	return useInfiniteQuery({
		queryKey: ["ic-core", "tokenTransactionList"],
		queryFn: ({ pageParam: pageParameter = 1 }) =>
			getTokenTransactionList({
				...parameters,
				page: pageParameter,
				token1: getICPCanisterId().toText(),
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
	});
};
