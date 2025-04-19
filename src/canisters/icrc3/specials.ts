import { getICPCanisterId } from ".";

export const getICPCanisterToken = () => {
	return {
		canister_id: getICPCanisterId(),
		decimals: 8,
		fee: 10000n,
		name: "ICP",
		symbol: "ICP",
	};
};
