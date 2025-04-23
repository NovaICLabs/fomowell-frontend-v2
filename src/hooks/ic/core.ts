import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import superjson from "superjson";

import {
	buy,
	type BuyArgs,
	calculateBuy,
	calculateSell,
	createMemeToken,
	type CreateMemeTokenArgs,
	deposit,
	type DepositArgs,
	getChainICCoreCanisterId,
	getCoreTokenBalance,
	getCurrentPrice,
	getMemeToken,
	sell,
	type SellArgs,
	withdraw,
	type WithdrawArgs,
} from "@/canisters/core";
import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import { showToast } from "@/components/utils/toast";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";

import { useConnectedIdentity } from "../providers/wallet/ic";

import type { LedgerType } from "@/canisters/core/index.did.d";
// ================================ read ================================
export const useMemeTokenInfo = (id: number) => {
	return useQuery({
		queryKey: ["ic-core", "meme-token", id],
		queryFn: () =>
			getMemeToken(getChainICCoreCanisterId().toText(), BigInt(id)),
		refetchInterval: 1000 * 10,
	});
};

export const useCoreTokenBalance = (args: {
	owner?: string;
	token?: LedgerType;
}) => {
	return useQuery({
		queryKey: [
			"ic-core",
			"core-token-balance",
			args.owner,
			superjson.stringify(args.token),
		],
		queryFn: () => {
			if (!args.owner || !args.token) {
				throw new Error("No owner or token provided");
			}
			return getCoreTokenBalance(getChainICCoreCanisterId().toText(), {
				owner: args.owner,
				token: args.token,
			});
		},
		enabled: !!args.owner && !!args.token,
	});
};

export const useCalculateBuy = (args: {
	amount?: bigint;
	id: number;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: [
			"ic-core",
			"calculate-buy",
			args.id.toString(),
			args.amount?.toString(),
		],
		queryFn: async () => {
			if (args.amount === undefined) {
				throw new Error("No amount provided");
			}
			const result = await calculateBuy(getChainICCoreCanisterId().toText(), {
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
		enabled: args.amount !== undefined && args.enabled,
	});
};

export const useCalculateSell = (args: {
	amount?: bigint;
	id: number;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: [
			"ic-core",
			"calculate-sell",
			args.id.toString(),
			args.amount?.toString(),
		],
		queryFn: async () => {
			if (args.amount === undefined) {
				throw new Error("No amount provided");
			}
			const result = await calculateSell(getChainICCoreCanisterId().toText(), {
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
		enabled: args.amount !== undefined && args.enabled,
	});
};

export const useCurrentPrice = (args: { id: number }) => {
	return useQuery({
		queryKey: ["ic-core", "current-price", args.id.toString()],
		queryFn: async () => {
			const result = await getCurrentPrice(
				getChainICCoreCanisterId().toText(),
				BigInt(args.id)
			);
			return {
				raw: result,
				formattedPerPayToken: formatNumberSmart(
					BigNumber(1)
						.multipliedBy(10 ** getICPCanisterToken().decimals)
						.div(BigNumber(result))
				),
			};
		},
	});
};

export const useMultipleCurrentPrice = (args: { ids: Array<string> | [] }) => {
	return useQuery({
		queryKey: ["ic-core", "current-price", args.ids.toString()],
		queryFn: async () => {
			if (args.ids.length === 0) {
				throw new Error("No ids provided");
			}
			const result = await Promise.all(
				args.ids.map((id) =>
					getCurrentPrice(getChainICCoreCanisterId().toText(), BigInt(id))
				)
			);
			return result.map((r, index) => ({
				id: args.ids[index],
				raw: r,
				formattedPerPayToken: formatNumberSmart(
					BigNumber(1)
						.multipliedBy(10 ** getICPCanisterToken().decimals)
						.div(BigNumber(r))
				),
			}));
		},
	});
};

// ================================ write ================================
export const useCreateMemeToken = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-core", "create-meme-token"],
		mutationFn: async (args: CreateMemeTokenArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return createMemeToken(
				actorCreator,
				getChainICCoreCanisterId().toText(),
				{
					name: args.name,
					logo: args.logo,
					ticker: args.ticker,
					description: args.description,
					website: args.website,
					telegram: args.telegram,
					twitter: args.twitter,
					devBuy: args.devBuy,
				}
			);
		},
	});
};

export const useDeposit = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-core", "deposit"],
		mutationFn: async (args: DepositArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return deposit(actorCreator, getChainICCoreCanisterId().toText(), args);
		},
	});
};

export const useWithdraw = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-core", "withdraw"],
		mutationFn: async (args: WithdrawArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return withdraw(actorCreator, getChainICCoreCanisterId().toText(), args);
		},
	});
};

export const useBuy = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-core", "buy"],
		mutationFn: async (args: BuyArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return buy(actorCreator, getChainICCoreCanisterId().toText(), args);
		},
		onError: () => {
			showToast("error", "Failed to purchase token");
		},
	});
};

export const useSell = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-core", "sell"],
		mutationFn: async (args: SellArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return sell(actorCreator, getChainICCoreCanisterId().toText(), args);
		},
		onError: () => {
			showToast("error", "Failed to sell token");
		},
	});
};
