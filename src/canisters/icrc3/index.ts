import BigNumber from "bignumber.js";

import { getAnonymousActorCreator } from "@/hooks/providers/wallet/ic";
import { formatUnits } from "@/lib/common/number";
import { validatePrincipalText } from "@/lib/ic/principal";

import { idlFactory as icrc3IdlFactory } from "./index.did";

import type { _SERVICE } from "./index.did.d";
import type { Principal } from "@dfinity/principal";
export const getCKBTCCanisterId = () => {
	return validatePrincipalText(import.meta.env["VITE_CKBTC_CANISTER_ID"]);
};

export const getIcrcTokenBalance = async ({
	canisterId,
	principal,
}: {
	canisterId: string | Principal;
	principal: string;
}) => {
	const creator = getAnonymousActorCreator();
	const actor = await creator<_SERVICE>(icrc3IdlFactory, canisterId);
	const r = await actor.icrc1_balance_of({
		owner: validatePrincipalText(principal),
		subaccount: [],
	});
	const decimals = await actor.icrc1_decimals();
	return {
		raw: r,
		decimals,
		formatted: BigNumber(formatUnits(r, decimals)).toFixed(decimals),
	};
};
