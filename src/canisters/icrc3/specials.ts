import { getCkbtcCanisterId } from "@/canisters/core";

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

export const getCkbtcCanisterToken = () => {
	return {
		canister_id: getCkbtcCanisterId(),
		decimals: 8,
		fee: BigInt(10n),
		name: "ckBTC",
		symbol: "ckBTC",
	};
};
