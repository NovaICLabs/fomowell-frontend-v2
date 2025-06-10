import { useMemo } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
// import BigNumber from "bignumber.js";
import superjson from "superjson";

import {
	createMemeToken,
	type CreateMemeTokenArgs,
	getChainBTCCoreCanisterId,
	getCoreTokenBalance,
} from "@/canisters/btc_core";

import { useBtcConnectedIdentity } from "../providers/wallet/bitcoin";

import type { LedgerType } from "@/canisters/btc_core/index.did.d";

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
