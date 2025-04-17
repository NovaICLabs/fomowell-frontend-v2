import { useMutation } from "@tanstack/react-query";

import {
	buy,
	type BuyArgs,
	createMemeToken,
	type CreateMemeTokenArgs,
	deposit,
	type DepositArgs,
	getChainICCoreCanisterId,
} from "@/canisters/core";
import { showToast } from "@/components/utils/toast";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";

import { useConnectedIdentity } from "../providers/wallet/ic";

export const useCreateMemeToken = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
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
				}
			);
		},
	});
};

export const useDeposit = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationFn: async (args: DepositArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return deposit(actorCreator, getChainICCoreCanisterId().toText(), args);
		},
	});
};

export const useBuy = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationFn: async (args: BuyArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return buy(actorCreator, getChainICCoreCanisterId().toText(), args);
		},
		onSuccess: (data, variables) => {
			showToast(
				"success",
				`${formatNumberSmart(formatUnits(data, 8))} tokens(id:${variables.id}) received!`
			);
		},
		onError: () => {
			showToast("error", "Failed to purchase token");
		},
	});
};
