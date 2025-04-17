import { useQuery } from "@tanstack/react-query";

import { getCKBTCCanisterId } from "@/canisters/icrc3";
import { getCKBTCBalance } from "@/canisters/tokens/ckbtc";
import { useIcIdentityStore } from "@/store/ic";

export const useCKBTCBalance = (principal?: string) => {
	const { principal: self } = useIcIdentityStore();
	const p = principal ?? self;
	return useQuery({
		queryKey: ["balance", getCKBTCCanisterId().toText(), p],
		queryFn: async () => {
			if (!p) throw new Error("Principal is not set");
			return getCKBTCBalance(p);
		},
		enabled: !!p,
	});
};
