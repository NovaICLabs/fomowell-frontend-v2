import { useMutation } from "@tanstack/react-query";

import {
	createMemeToken,
	type CreateMemeTokenArgs,
	getChainICCoreCanisterId,
} from "@/canisters/core";

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
