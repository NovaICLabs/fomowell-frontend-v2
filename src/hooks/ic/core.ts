import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import superjson from "superjson";

import {
	buy,
	type BuyArgs,
	calculateBuy,
	calculateSell,
	claimFaucet,
	createMemeToken,
	type CreateMemeTokenArgs,
	DEFAULT_HOLDERS_PAGE_SIZE,
	deposit,
	type DepositArgs,
	get_generate_random,
	getChainICCoreCanisterId,
	getCoreTokenBalance,
	getCurrentPrice,
	getHolders,
	getMemeToken,
	sell,
	type SellArgs,
	withdraw,
	type WithdrawArgs,
} from "@/canisters/core";
import { getICPCanisterId } from "@/canisters/icrc3";
import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import { showToast } from "@/components/utils/toast";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";
import { validatePrincipalText } from "@/lib/ic/principal";

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
		refetchInterval: 1000 * 10,
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
		refetchInterval: 1000 * 2,
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
		refetchInterval: 1000 * 2,
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
				formattedPerPayToken: BigNumber(1)
					.times(10 ** getICPCanisterToken().decimals)
					.div(BigNumber(result))
					.toString(),
			};
		},
		refetchInterval: 2000,
	});
};
export const useTokenHolders = (args: {
	id: number;
	page: number;
	pageSize?: number;
}) => {
	const pageSize = args.pageSize ?? DEFAULT_HOLDERS_PAGE_SIZE;
	return useQuery({
		queryKey: [
			"ic-core",
			"holders",
			args.id.toString(),
			args.page.toString(),
			pageSize.toString(),
		],
		queryFn: () =>
			getHolders(getChainICCoreCanisterId().toText(), BigInt(args.id), {
				page: args.page,
				pageSize,
			}),
		enabled: !!args.id && !!args.page,
	});
};

export const useMultipleTokenHoldersCount = (args: {
	ids: Array<string> | [];
}) => {
	return useQuery({
		queryKey: ["ic-core", "multi-holders-count"],
		queryFn: async () => {
			if (args.ids.length === 0) {
				throw new Error("No ids provided");
			}
			const result = await Promise.all(
				args.ids.map((id) =>
					getHolders(getChainICCoreCanisterId().toText(), BigInt(id), {
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
export const useMultipleCurrentPrice = (args: { ids: Array<string> | [] }) => {
	return useQuery({
		queryKey: ["ic-core", "multi-current-price"],
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
		enabled: !!args.ids && args.ids.length > 0,
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
					logoBase64: args.logoBase64,
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
		onError: (error) => {
			if (error.message.indexOf("is out of cycles") !== -1) {
				showToast("error", `Cycles insufficient`);
			} else {
				showToast("error", "Failed to sell token");
			}
		},
	});
};

export const useGenerateRandom = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-core", "generate-random"],
		mutationFn: async () => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return get_generate_random(
				actorCreator,
				getChainICCoreCanisterId().toText()
			);
		},
	});
};

export const useClaimFaucet = () => {
	const { actorCreator, principal } = useConnectedIdentity();
	const { refetch: refetchCoreTokenBalance } = useCoreTokenBalance({
		owner: principal,
		token: { ICRCToken: getICPCanisterId() },
	});
	return useMutation({
		mutationKey: ["ic-core", "claim-faucet"],
		mutationFn: () => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return claimFaucet(actorCreator, getChainICCoreCanisterId().toText(), {
				principal: validatePrincipalText(principal),
			});
		},
		onSuccess: () => {
			void refetchCoreTokenBalance();
		},
	});
};
