import { useQuery } from "@tanstack/react-query";

import { getICPCanisterId } from "@/canisters/icrc3";
import { getICPBalance } from "@/canisters/tokens/icp";
import { useIcIdentityStore } from "@/store/ic";

export const useICPBalance = (principal?: string) => {
	const { principal: self } = useIcIdentityStore();
	const p = principal ?? self;
	return useQuery({
		queryKey: ["balance", getICPCanisterId().toText(), p],
		queryFn: async () => {
			if (!p) throw new Error("Principal is not set");
			return getICPBalance(p);
		},
		enabled: !!p,
		refetchInterval: 3000,
	});
};
