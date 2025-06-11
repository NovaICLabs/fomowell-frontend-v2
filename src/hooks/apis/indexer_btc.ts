import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";

import { createComment, getCommentList } from "@/apis/comment";
import {
	type BtcTokenInfo,
	type CandleParameters,
	favoriteToken,
	getFavoriteTokenList,
	getLaunchedTokenList,
	getTokenList,
	getTokenPriceCandle,
	getTokenTransactionList,
	getUserActivity,
	type PaginatedDataWithData,
	type TokenListParameters,
} from "@/apis/indexer_btc";
import { getUserRewardStats } from "@/apis/reward-btc";
import { updateUserInfo } from "@/apis/user-login-btc";
import { getCkbtcCanisterId } from "@/canisters/btc_core";
import { getIcrcTokenBalance } from "@/canisters/icrc3";
import { useBtcIdentityStore } from "@/store/btc";
import { useDialogStore } from "@/store/dialog";

import { useBtcConnectedIdentity } from "../providers/wallet/bitcoin";

const getBtcTokenListKey = (parameters: TokenListParameters) => {
	return [
		"btc-core",
		"tokenList",
		parameters.sort,
		parameters.sortDirection,
		parameters.principal,
		parameters.filters,
	];
};
const getBtcSearchTokenListKey = (parameters: TokenListParameters) => {
	return [
		"btc-core",
		"searchTokenList",
		parameters.principal,
		parameters.search,
	];
};
export const useBtcSearchTokenList = (parameters: TokenListParameters) => {
	return useQuery({
		queryKey: getBtcSearchTokenListKey(parameters),
		queryFn: () =>
			getTokenList({
				...parameters,
				page: 1,
				pageSize: 10,
			}),
	});
};
export const useBtcInfiniteTokenList = (parameters: TokenListParameters) => {
	return useInfiniteQuery({
		queryKey: getBtcTokenListKey(parameters),
		queryFn: ({ pageParam: page = 1 }) =>
			getTokenList({
				...parameters,
				page,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
		// refetchInterval: 2000,
	});
};

export const useBtcInfiniteFavoriteTokenList = (parameters: {
	isEnabled?: boolean;
}) => {
	const { principal } = useBtcConnectedIdentity();

	return useInfiniteQuery({
		queryKey: ["btc-core", "favoriteTokenList", principal],
		queryFn: ({ pageParam: page = 1 }) =>
			getFavoriteTokenList({
				principal,
				page,
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
		// refetchInterval: 2000,
		enabled: !!principal && parameters.isEnabled,
	});
};

export const getBtcSingleTokenInfoKey = (id: string, principal?: string) => {
	return ["btc-core", "tokenInfo", id, principal];
};

export const useBtcSingleTokenInfo = (parameters: { id: string }) => {
	const { principal } = useBtcConnectedIdentity();
	return useQuery({
		queryKey: getBtcSingleTokenInfoKey(parameters.id, principal),
		queryFn: async () => {
			const { data } = await getTokenList({
				tokenId: parameters.id,
				page: 1,
				pageSize: 1,
				principal,
			});
			return data[0];
		},
		// refetchInterval: 5000,
	});
};

export const useBtcInfiniteTokenTransactionsHistory = (parameters: {
	token0: string;
}) => {
	return useInfiniteQuery({
		queryKey: ["btc-core", "tokenTransactionList", parameters.token0],
		queryFn: ({ pageParam: pageParameter = 1 }) =>
			getTokenTransactionList({
				...parameters,
				page: pageParameter,
				token1: getCkbtcCanisterId().toText(),
			}),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
		// refetchInterval: 2000,
	});
};

export const useBtcTokenPriceCandle = (parameters: CandleParameters) => {
	return useQuery({
		queryKey: [
			"btc-core",
			"tokenPriceCandle",
			parameters.tokenId,
			parameters.interval,
		],
		queryFn: () => getTokenPriceCandle(parameters),
		// refetchInterval: 2000,
	});
};

export const useBtcTokenComments = (parameters: {
	meme_token_id: string;
	page?: number;
	pageSize?: number;
}) => {
	return useInfiniteQuery({
		queryKey: ["btc-core", "tokenCommentList", parameters.meme_token_id],
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

export const useBtcInfiniteUserActivity = (parameters: {
	pageSize: number;
	userid: string;
}) => {
	return useInfiniteQuery({
		queryKey: ["btc-core", "userActivityList", parameters.userid],
		queryFn: ({ pageParam: pageParameter = 1 }) =>
			getUserActivity({
				...parameters,
				page: pageParameter,
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
export const useBtcCreateTokenComment = (parameters: { tokenId: string }) => {
	const { jwt_token } = useBtcIdentityStore();
	return useMutation({
		mutationKey: ["btc-core", "sendComment", parameters.tokenId],
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
export const useBtcUpdateUserInfo = () => {
	const { jwt_token } = useBtcIdentityStore();
	return useMutation({
		mutationKey: ["btc-core", "updateUserInfo"],
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
export const useBtcFavoriteToken = (listParameters?: TokenListParameters) => {
	const { jwt_token } = useBtcIdentityStore();
	const queryClient = useQueryClient();
	const { principal } = useBtcConnectedIdentity();
	const { setIcpConnectOpen } = useDialogStore();
	return useMutation({
		mutationKey: ["btc-core", "favoriteToken"],
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
					const queryKeys = [
						getBtcTokenListKey(listParameters),
						getBtcSearchTokenListKey(listParameters),
					];
					queryKeys.forEach((queryKey) => {
						queryClient.setQueryData(
							queryKey,
							(
								oldData:
									| {
											pages: Array<PaginatedDataWithData<BtcTokenInfo>>;
									  }
									| { data: Array<BtcTokenInfo> }
							) => {
								if (!oldData) return;
								return produce(oldData, (old) => {
									if ("pages" in old) {
										old.pages.forEach((page) => {
											page.data.forEach((token) => {
												if (token.memeTokenId === Number(args.tokenId)) {
													token.isFollow = !token.isFollow;
												}
											});
										});
									} else {
										old.data.forEach((token) => {
											if (token.memeTokenId === Number(args.tokenId)) {
												token.isFollow = !token.isFollow;
											}
										});
									}
								});
							}
						);
					});
				} else {
					queryClient.setQueryData(
						getBtcSingleTokenInfoKey(args.tokenId, principal),
						(oldData: BtcTokenInfo) => {
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

export const useBtcLinkedWalletTokensBalance = (principal?: string) => {
	const { principal: connectedPrincipal } = useBtcConnectedIdentity();
	const finalPrincipal = principal ?? connectedPrincipal;
	return useQuery({
		queryKey: ["btc-core", "linkedWalletTokenBalance", finalPrincipal],
		queryFn: async () => {
			if (!finalPrincipal) {
				throw new Error("No principal");
			}
			const launchedTokenList = await getLaunchedTokenList();
			const tokenBalances = await Promise.all(
				launchedTokenList
					.filter((token) => token.tokenAddress)
					.map(async (token) => {
						const balance = await getIcrcTokenBalance({
							canisterId: token.tokenAddress,
							principal: finalPrincipal,
						});
						return {
							...token,
							balance,
						};
					})
			);
			return tokenBalances;
		},
		enabled: !!finalPrincipal,
	});
};

export const useBtcRewardStats = () => {
	const { jwt_token } = useBtcIdentityStore();
	console.log("🚀 ~ useBtcRewardStats ~ jwt_token:", jwt_token);
	if (!jwt_token) {
		throw new Error("No login jwt token");
	}

	return useQuery({
		queryKey: ["btc-core", "rewardStats"],
		queryFn: () => getUserRewardStats(jwt_token),
		// refetchInterval: 2000,
	});
	// return useMutation({
	// 	qu: ["btc-core", "rewardStats"],
	// 	mutationFn: async () => {
	// 		if (!jwt_token) {
	// 			throw new Error("No login jwt token");
	// 		}
	// 		return getUserRewardStats(jwt_token);
	// 	},
	// });
};
