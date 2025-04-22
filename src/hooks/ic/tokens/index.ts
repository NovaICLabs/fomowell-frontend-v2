import { useMutation } from "@tanstack/react-query";

import { transfer, type TransferArgs } from "@/canisters/icrc3";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";

export const useIcrcTransfer = () => {
	const { actorCreator } = useConnectedIdentity();
	return useMutation({
		mutationKey: ["ic-tokens", "transfer"],
		mutationFn: async (args: TransferArgs) => {
			if (!actorCreator) {
				throw new Error("No actor creator found");
			}
			return transfer({
				creator: actorCreator,
				args,
			});
		},
	});
};
