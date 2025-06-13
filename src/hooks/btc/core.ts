import { useMemo } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import superjson from "superjson";

import {
	add_liquidity,
	btc_buy,
	btc_sell,
	type BuyArgs,
	calculateBuy,
	calculateSell,
	createMemeToken,
	type CreateMemeTokenArgs,
	DEFAULT_HOLDERS_PAGE_SIZE,
	getChainBTCCoreCanisterId,
	getCoreTokenBalance,
	getCurrentPrice,
	getHolders,
	getMemeToken,
	pre_add_liquidity,
	pre_remove_liquidity,
	type PreAddLiquidityArgs,
	remove_liquidity,
	type SellArgs,
	token_all_liquidity,
	token_user_liquidity,
} from "@/canisters/btc_core";
// import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { showToast } from "@/components/utils/toast";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";
import { validatePrincipalText } from "@/lib/ic/principal";

import { useBtcConnectedIdentity } from "../providers/wallet/bitcoin";

import type {
	LedgerType,
	LiquidityAddArg,
	LiquidityRemoveArg,
	PreLiquidityRemoveArg,
} from "@/canisters/btc_core/index.did.d";

const NETWORK_FEE = 0.00002;
const FEE = 0.0000001;

// todo get btc deposit FEE and minter FEE
export type BtcFeeType = {
	row: bigint;
	formatted: number;
};
export const useBtcFees = () => {
	const fees: BtcFeeType = useMemo(() => {
		// todo get btc deposit FEE and minter FEE
		return {
			row: BigInt((NETWORK_FEE + FEE) * 1e8),
			formatted: NETWORK_FEE + FEE,
		};
	}, []);

	return fees;
};

// ================================ read ================================
export const useBtcMemeTokenInfo = (id: number) => {
	return useQuery({
		queryKey: ["btc-core", "meme-token", id],
		queryFn: () =>
			getMemeToken(getChainBTCCoreCanisterId().toText(), BigInt(id)),
		refetchInterval: 1000 * 10,
	});
};

export const useBtcCoreTokenBalance = (args: {
	owner?: string;
	token?: LedgerType;
}) => {
	return useQuery({
		queryKey: [
			"btc-core",
			"core-token-balance",
			args.owner,
			superjson.stringify(args.token),
		],
		queryFn: () => {
			if (!args.owner || !args.token) {
				throw new Error("No owner or token provided");
			}
			return getCoreTokenBalance(getChainBTCCoreCanisterId().toText(), {
				owner: args.owner,
				token: args.token,
			});
		},
		enabled: !!args.owner && !!args.token,
		refetchInterval: 1000 * 10,
	});
};

export const useBtcMemeCurrentPrice = (args: { id: number }) => {
	return useQuery({
		queryKey: ["btc-core", "current-price", args.id.toString()],
		queryFn: async () => {
			const result = await getCurrentPrice(
				getChainBTCCoreCanisterId().toText(),
				BigInt(args.id)
			);

			return {
				raw: result,
				formattedPerPayToken: result,
				// BigNumber(1)
				// 	.times(10 ** getCkbtcCanisterToken().decimals)
				// 	.div(BigNumber(result))
				// 	.toString(),
			};
		},
		refetchInterval: 2000,
	});
};

export const useBtcCalculateBuy = (args: {
	amount?: bigint;
	id: number;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: [
			"btc-core",
			"calculate-buy",
			args.id.toString(),
			args.amount?.toString(),
		],
		queryFn: async () => {
			if (args.amount === undefined) {
				throw new Error("No amount provided");
			}
			const result = await calculateBuy(getChainBTCCoreCanisterId().toText(), {
				amount: args.amount,
				id: BigInt(args.id),
			});
			const decimals = 8;
			return {
				raw: result,
				formatted: formatNumberSmart(formatUnits(result, decimals)),
				decimals,
			};
		},
		refetchInterval: 1000 * 2,
		enabled: args.amount !== undefined && args.enabled,
	});
};

export const useBtcCalculateSell = (args: {
	amount?: bigint;
	id: number;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: [
			"btc-core",
			"calculate-sell",
			args.id.toString(),
			args.amount?.toString(),
		],
		queryFn: async () => {
			if (args.amount === undefined) {
				throw new Error("No amount provided");
			}
			const result = await calculateSell(getChainBTCCoreCanisterId().toText(), {
				amount: args.amount,
				id: BigInt(args.id),
			});
			const decimals = 8;
			return {
				raw: result,
				formatted: formatNumberSmart(formatUnits(result, decimals)),
				decimals,
			};
		},
		refetchInterval: 1000 * 2,
		enabled: args.amount !== undefined && args.enabled,
	});
};

export const useBtcTokenHolders = (args: {
	id: number;
	page: number;
	pageSize?: number;
}) => {
	const pageSize = args.pageSize ?? DEFAULT_HOLDERS_PAGE_SIZE;
	return useQuery({
		queryKey: [
			"btc-core",
			"holders",
			args.id.toString(),
			args.page.toString(),
			pageSize.toString(),
		],
		queryFn: () =>
			getHolders(getChainBTCCoreCanisterId().toText(), BigInt(args.id), {
				page: args.page,
				pageSize,
			}),
		enabled: !!args.id && !!args.page,
		refetchInterval: 1000 * 2,
	});
};

export const useBtcMultipleTokenHoldersCount = (args: {
	ids: Array<string> | [];
}) => {
	return useQuery({
		queryKey: ["btc-core", "multi-holders-count"],
		queryFn: async () => {
			if (args.ids.length === 0) {
				throw new Error("No ids provided");
			}
			const result = await Promise.all(
				args.ids.map((id) =>
					getHolders(getChainBTCCoreCanisterId().toText(), BigInt(id), {
						page: 1,
						pageSize: 10,
					})
				)
			);
			return result.map((r, index) => ({
				id: args.ids[index],
				total: r.total.toString(),
			}));
		},
		enabled: !!args.ids && args.ids.length > 0,
	});
};
export const useBtcMultipleCurrentPrice = (args: {
	ids: Array<string> | [];
}) => {
	return useQuery({
		queryKey: ["btc-core", "multi-current-price"],
		queryFn: async () => {
			if (args.ids.length === 0) {
				throw new Error("No ids provided");
			}
			const result = await Promise.all(
				args.ids.map((id) =>
					getCurrentPrice(getChainBTCCoreCanisterId().toText(), BigInt(id))
				)
			);
			return result.map((r, index) => ({
				id: args.ids[index],
				raw: r,
				formattedPerPayToken: formatNumberSmart(
					BigNumber(r)
					// BigNumber(1)
					// 	.multipliedBy(10 ** getCkbtcCanisterToken().decimals)
					// 	.div(BigNumber(r))
				),
			}));
		},
		enabled: !!args.ids && args.ids.length > 0,
	});
};

// ================================ write ================================
export const useCreateBtcMemeToken = () => {
	const { actorCreator } = useBtcConnectedIdentity();
	return useMutation({
		mutationKey: ["btc-core", "create-meme-token"],
		mutationFn: async (args: CreateMemeTokenArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return createMemeToken(
				actorCreator,
				getChainBTCCoreCanisterId().toText(),
				{
					name: args.name,
					logo: args.logo,
					ticker: args.ticker,
					description: args.description,
					website: args.website,
					telegram: args.telegram,
					twitter: args.twitter,
					devBuy: args.devBuy,
					logoBase64: args.logoBase64,
				}
			);
		},
	});
};

export const useBtcBuy = () => {
	const { actorCreator } = useBtcConnectedIdentity();
	return useMutation({
		mutationKey: ["btc-core", "buy"],
		mutationFn: async (args: BuyArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return btc_buy(actorCreator, getChainBTCCoreCanisterId().toText(), args);
		},
	});
};

export const useBtcSell = () => {
	const { actorCreator } = useBtcConnectedIdentity();
	return useMutation({
		mutationKey: ["btc-core", "sell"],
		mutationFn: async (args: SellArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return btc_sell(actorCreator, getChainBTCCoreCanisterId().toText(), args);
		},
		onError: (error) => {
			if (error.message.indexOf("is out of cycles") !== -1) {
				showToast("error", `Cycles insufficient`);
			} else {
				showToast("error", "Failed to sell token");
			}
		},
	});
};

export const useBtcPreAddLiquidity = (
	args: PreAddLiquidityArgs & { enabled: boolean },
	enabled?: boolean
) => {
	return useQuery({
		queryKey: ["btc-core", "pre-add-liquidity"],
		queryFn: async () =>
			pre_add_liquidity(getChainBTCCoreCanisterId().toText(), args),
		enabled: !!args.id && enabled,
	});
};

export const useBtcAddLiquidity = () => {
	const { actorCreator } = useBtcConnectedIdentity();
	return useMutation({
		mutationKey: ["btc-core", "add-liquidity"],
		mutationFn: async (args: LiquidityAddArg) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return add_liquidity(
				actorCreator,
				getChainBTCCoreCanisterId().toText(),
				args
			);
		},
	});
};

export const useBtcPreRemoveLiquidity = (args: PreLiquidityRemoveArg) => {
	return useQuery({
		queryKey: ["btc-core", "pre-remove-liquidity"],
		queryFn: async () =>
			pre_remove_liquidity(getChainBTCCoreCanisterId().toText(), args),
		enabled: !!args.id,
	});
};

export const useBtcRemoveLiquidity = () => {
	const { actorCreator } = useBtcConnectedIdentity();
	return useMutation({
		mutationKey: ["btc-core", "remove-liquidity"],
		mutationFn: async (args: LiquidityRemoveArg) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return remove_liquidity(
				actorCreator,
				getChainBTCCoreCanisterId().toText(),
				args
			);
		},
	});
};

export const useBtcMemeTokenAllLiquidity = (args: { id: number }) => {
	return useQuery({
		queryKey: ["btc-core", "meme-token-all-liquidity", args.id],
		queryFn: async () =>
			token_all_liquidity(getChainBTCCoreCanisterId().toText(), {
				id: BigInt(args.id),
			}),
		enabled: !!args.id,
	});
};

export const useBtcMemeTokenUserLiquidity = (args: { id: number }) => {
	const { principal } = useBtcConnectedIdentity();
	return useQuery({
		queryKey: ["btc-core", "meme-token-user-liquidity", principal, args.id],
		queryFn: async () => {
			if (!principal) {
				throw new Error("No principal found");
			}
			return token_user_liquidity(
				validatePrincipalText(principal),
				getChainBTCCoreCanisterId().toText(),
				{ id: BigInt(args.id) }
			);
		},
		enabled: !!args.id,
	});
};
