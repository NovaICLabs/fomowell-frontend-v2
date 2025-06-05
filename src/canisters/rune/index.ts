// import {
// 	getAnonymousActorCreator,
// } from "@/hooks/providers/wallet/ic";
import { createActorCreatorFromIdentity } from "@/hooks/providers/wallet/ic";
import { validatePrincipalText } from "@/lib/ic/principal";
import { unwrapRustResult } from "@/lib/ic/rust/result";

import { idlFactory as runeIdlFactory } from "./index.did";

import type { _SERVICE, RuneId, WithdrawalType } from "./index.did.d";
import type { Identity } from "@dfinity/agent";

// import { bigint2string } from "@/lib/common/data/bigint";

export const getRuneCanisterId = () => {
	const value = import.meta.env["VITE_RUNE_WALLET_CANISTER_ID"];
	return validatePrincipalText(value);
};

export const getFastBtcAddress = async (identity: Identity) => {
	const createActor = createActorCreatorFromIdentity(identity);
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		canisterId: getRuneCanisterId().toText(),
		idlFactory: runeIdlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}

	const result = await actor.get_fast_btc_address([]);

	return unwrapRustResult(result, (error) => {
		console.log("🚀 ~ returnunwrapRustResult ~ error:", error);
		throw new Error(Object.keys(error)[0]);
	});
};

// withdraw
export type WithdrawArgs = {
	type: "Rune" | "Bitcoin";
	amount: bigint;
	to: string;
	runeid?: RuneId;
	fee_per_vbytes: bigint | undefined;
};

export const btcWithdraw = async (identity: Identity, arg: WithdrawArgs) => {
	const createActor = createActorCreatorFromIdentity(identity);
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		canisterId: getRuneCanisterId().toText(),
		idlFactory: runeIdlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}

	let args = {} as WithdrawalType;

	if (arg.type === "Rune") {
		args = {
			Rune: {
				to: arg.to,
				fee_per_vbytes: arg.fee_per_vbytes ? [arg.fee_per_vbytes] : [],
				runeid: arg.runeid!,
				amount: arg.amount,
			},
		};
	}

	if (arg.type === "Bitcoin") {
		args = {
			Bitcoin: {
				to: arg.to,
				amount: arg.amount,
				fee_per_vbytes: arg.fee_per_vbytes ? [arg.fee_per_vbytes] : [],
			},
		};
	}

	const result = await actor.withdraw(args);

	return result;
};
