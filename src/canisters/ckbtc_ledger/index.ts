import { getAnonymousActorCreator } from "@/hooks/providers/wallet/ic";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";
import { validatePrincipalText } from "@/lib/ic/principal";

import { idlFactory as ckBTCLedgerIdlFactory } from "./index.did";

import type { _SERVICE } from "./index.did.d";
import type { Principal } from "@dfinity/principal";
// import { unwrapRustResult } from "@/lib/ic/rust/result";

// import type { ActorCreator } from "@/lib/ic/connectors";

// ckBTC Ledger Canister ID
export const getCkBTCLedgerCanisterId = () => {
	return validatePrincipalText(
		import.meta.env["VITE_CKBTC_LEDGER_CANISTER_ID"]
	);
};

// ================================ read ================================
export const getIcrcCkbtcTokenBalance = async ({
	canisterId,
	principal,
}: {
	canisterId: string | Principal;
	principal: string;
}) => {
	if (!canisterId) {
		throw new Error("Canister ID is required");
	}
	const creator = getAnonymousActorCreator();
	const actor = await creator<_SERVICE>({
		idlFactory: ckBTCLedgerIdlFactory,
		canisterId,
	});
	const r = await actor.icrc1_balance_of({
		owner: validatePrincipalText(principal),
		subaccount: [],
	});
	const decimals = await actor.icrc1_decimals();
	return {
		raw: r,
		decimals,
		formatted: formatNumberSmart(formatUnits(r, decimals)),
	};
};
