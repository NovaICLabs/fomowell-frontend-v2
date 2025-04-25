import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { createComment, getCommentList } from "@/apis/comment";
import {
	type CandleParameters,
	getTokenList,
	getTokenPriceCandle,
	getTokenTransactionList,
	type TokenListParameters,
} from "@/apis/indexer";
import { updateUserInfo } from "@/apis/user-login";
import { getICPCanisterId } from "@/canisters/icrc3";
import { useIcIdentityStore } from "@/store/ic";

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
		queryFn: () => getTokenList({ id: parameters.id, page: 1, pageSize: 1 }),
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

export const useTokenPriceCandle = (parameters: CandleParameters) => {
	return useQuery({
		queryKey: [
			"ic-core",
			"tokenPriceCandle",
			parameters.tokenId,
			parameters.interval,
		],
		queryFn: () => getTokenPriceCandle(parameters),
		refetchInterval: 10000,
	});
};

export const useTokenComments = (parameters: { meme_token_id: string }) => {
	return useInfiniteQuery({
		queryKey: ["ic-core", "tokenCommentList", parameters.meme_token_id],
		queryFn: ({ pageParam: pageParameter = 1 }: { pageParam: number }) =>
			getCommentList({
				...parameters,
				page: pageParameter,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.total > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
	});
};

// ============== Mutations ================
export type SendCommentArgs = {
	tokenId: string;
	content: string;
	photo?: string;
};
export const useCreateTokenComment = (parameters: { tokenId: string }) => {
	const { jwt_token } = useIcIdentityStore();
	return useMutation({
		mutationKey: ["ic-core", "sendComment", parameters.tokenId],
		mutationFn: async (args: SendCommentArgs) => {
			return createComment(jwt_token, {
				tokenId: Number(args.tokenId),
				content: args.content,
				photo: args.photo,
			});
		},
	});
};

// update user info
export type EditInfoArgs = {
	userToken: string;
	name: string;
	avatar?: string;
};
export const useUpdateUserInfo = () => {
	return useMutation({
		mutationKey: ["ic-core", "updateUserInfo"],
		mutationFn: async (args: EditInfoArgs) => {
			return updateUserInfo(args.userToken, {
				name: args.name,
				avatar: args.avatar,
			});
		},
	});
};
