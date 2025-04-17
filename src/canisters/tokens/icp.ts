import { getICPCanisterId, getIcrcTokenBalance } from "../icrc3";

export const getICPBalance = async (principal: string) => {
	const canisterId = getICPCanisterId();
	const r = await getIcrcTokenBalance({ canisterId, principal });
	return r;
};
