import { getCKBTCCanisterId, getIcrcTokenBalance } from "../icrc3";

export const getCKBTCBalance = async (principal: string) => {
	const canisterId = getCKBTCCanisterId();
	const r = await getIcrcTokenBalance({ canisterId, principal });
	return r;
};
