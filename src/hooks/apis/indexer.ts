import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
	getTokenList,
	getTokenTransactionList,
	type TokenListParameters,
} from "@/apis/indexer";
import { getICPCanisterId } from "@/canisters/icrc3";

export const useInfiniteTokenList = (parameters: TokenListParameters) => {
	return useInfiniteQuery({
		queryKey: [
			"ic-core",
			"tokenList",
			parameters.sort,
			parameters.sortDirection,
		],
		queryFn: ({ pageParam: page = 1 }) =>
			getTokenList({
				...parameters,
				page,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
		refetchInterval: 2000,
	});
};

export const useSingleTokenInfo = (parameters: { id: string }) => {
	return useQuery({
		queryKey: ["ic-core", "tokenInfo", parameters.id],
		queryFn: () => getTokenList({ id: parameters.id }),
	});
};

export const useInfiniteTokenTransactionsHistory = (parameters: {
	token0: string;
}) => {
	return useInfiniteQuery({
		queryKey: ["ic-core", "tokenTransactionList", parameters.token0],
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
		refetchInterval: 2000,
	});
};
