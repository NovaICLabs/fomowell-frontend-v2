import { getAnonymousActorCreator } from "@/hooks/providers/wallet/ic";
import { string2array } from "@/lib/common/data/arrays";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";
import { validatePrincipalText } from "@/lib/ic/principal";
import { wrapOption } from "@/lib/ic/rust/option";
import { unwrapRustResult } from "@/lib/ic/rust/result";

import { idlFactory as icrc3IdlFactory, idlFactory } from "./index.did";

import type { _SERVICE } from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";
import type { Principal } from "@dfinity/principal";
export const getICPCanisterId = () => {
	return validatePrincipalText(import.meta.env["VITE_ICP_CANISTER_ID"]);
};
// ================================ read ================================
export const getIcrcTokenBalance = async ({
	canisterId,
	principal,
}: {
	canisterId?: string | Principal;
	principal: string;
}) => {
	if (!canisterId) {
		throw new Error("Canister ID is required");
	}
	const creator = getAnonymousActorCreator();
	const actor = await creator<_SERVICE>({
		idlFactory: icrc3IdlFactory,
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

// ================================ write ================================
// approve
export type ApproveArgs = {
	amount: bigint;
	spender: string;
};

export const approve = async ({
	creator,
	canisterId,
	args,
}: {
	creator: ActorCreator;
	canisterId: string;
	args: ApproveArgs;
}) => {
	const actor = await creator<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const result = await actor.icrc2_approve({
		fee: [],
		amount: args.amount,
		spender: {
			owner: validatePrincipalText(args.spender),
			subaccount: [],
		},
		memo: wrapOption(string2array(Math.random().toString())),
		from_subaccount: [],
		created_at_time: [],
		expected_allowance: [],
		expires_at: [],
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(Object.keys(error)[0]);
	});
};
// transfer
export type TransferArgs = {
	amount: bigint;
	to: string;
	fee: bigint;
	canisterId: string;
};
export const transfer = async ({
	creator,
	args,
}: {
	creator: ActorCreator;
	args: TransferArgs;
}) => {
	const actor = await creator<_SERVICE>({
		canisterId: args.canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const result = await actor.icrc1_transfer({
		from_subaccount: [],
		created_at_time: [],
		memo: wrapOption(string2array(Math.random().toString())),
		amount: args.amount,
		to: {
			owner: validatePrincipalText(args.to),
			subaccount: [],
		},
		fee: wrapOption(args.fee),
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(Object.keys(error)[0]);
	});
};
