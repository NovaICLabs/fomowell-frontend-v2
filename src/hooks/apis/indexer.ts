import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";

import { createComment, getCommentList } from "@/apis/comment";
import {
	type CandleParameters,
	favoriteToken,
	getFavoriteTokenList,
	getTokenList,
	getTokenPriceCandle,
	getTokenTransactionList,
	type PaginatedDataWithData,
	type TokenInfo,
	type TokenListParameters,
} from "@/apis/indexer";
import { updateUserInfo } from "@/apis/user-login";
import { getICPCanisterId } from "@/canisters/icrc3";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore } from "@/store/ic";

import { useConnectedIdentity } from "../providers/wallet/ic";
const getTokenListKey = (parameters: TokenListParameters) => {
	return ["ic-core", "tokenList", parameters.sort, parameters.sortDirection];
};
export const useInfiniteTokenList = (parameters: TokenListParameters) => {
	return useInfiniteQuery({
		queryKey: getTokenListKey(parameters),
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

export const useInfiniteFavoriteTokenList = (parameters: {
	isEnabled?: boolean;
}) => {
	const { principal } = useConnectedIdentity();

	return useInfiniteQuery({
		queryKey: ["ic-core", "favoriteTokenList", principal],
		queryFn: ({ pageParam: page = 1 }) =>
			getFavoriteTokenList({
				principal,
				page,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
		refetchInterval: 2000,
		enabled: !!principal && parameters.isEnabled,
	});
};

export const getSingleTokenInfoKey = (id: string, principal?: string) => {
	return ["ic-core", "tokenInfo", id, principal];
};

export const useSingleTokenInfo = (parameters: { id: string }) => {
	const { principal } = useConnectedIdentity();
	return useQuery({
		queryKey: getSingleTokenInfoKey(parameters.id, principal),
		queryFn: async () => {
			const { data } = await getTokenList({
				tokenId: parameters.id,
				page: 1,
				pageSize: 1,
				principal,
			});
			return data[0];
		},
		refetchInterval: 5000,
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

export const useTokenComments = (parameters: {
	meme_token_id: string;
	page?: number;
	pageSize?: number;
}) => {
	return useInfiniteQuery({
		queryKey: ["ic-core", "tokenCommentList", parameters.meme_token_id],
		queryFn: ({ pageParam: page = 1 }) =>
			getCommentList({
				...parameters,
				page,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
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
			if (!jwt_token) {
				throw new Error("No login jwt token");
			}
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
	name: string;
	avatar?: string;
};
export const useUpdateUserInfo = () => {
	const { jwt_token } = useIcIdentityStore();
	return useMutation({
		mutationKey: ["ic-core", "updateUserInfo"],
		mutationFn: async (args: EditInfoArgs) => {
			if (!jwt_token) {
				throw new Error("No login jwt token");
			}
			return updateUserInfo(jwt_token, {
				name: args.name,
				avatar: args.avatar,
			});
		},
	});
};

// favorite token
export const useFavoriteToken = (listParameters?: TokenListParameters) => {
	const { jwt_token } = useIcIdentityStore();
	const queryClient = useQueryClient();
	const { principal } = useConnectedIdentity();
	const { setIcpConnectOpen } = useDialogStore();
	return useMutation({
		mutationKey: ["ic-core", "favoriteToken"],
		mutationFn: async (args: { tokenId: string }) => {
			if (!principal) {
				setIcpConnectOpen(true);
				return;
			}
			if (!jwt_token) {
				throw new Error("No token found");
			}

			try {
				// optimistic update
				if (listParameters) {
					queryClient.setQueryData(
						getTokenListKey(listParameters),
						(oldData: { pages: Array<PaginatedDataWithData<TokenInfo>> }) => {
							return produce(oldData, (old) => {
								old.pages.forEach((page) => {
									page.data.forEach((token) => {
										if (token.memeTokenId === Number(args.tokenId)) {
											token.isFollow = !token.isFollow;
										}
									});
								});
							});
						}
					);
				} else {
					queryClient.setQueryData(
						getSingleTokenInfoKey(args.tokenId, principal),
						(oldData: TokenInfo) => {
							return produce(oldData, (old) => {
								old.isFollow = !old.isFollow;
							});
						}
					);
				}
				await favoriteToken(jwt_token, Number(args.tokenId));
				return;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});
};
