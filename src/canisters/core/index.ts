import { string2array } from "@/lib/common/data/arrays";
import {
	validateCanisterIdText,
	validatePrincipalText,
} from "@/lib/ic/principal";
import { wrapOption } from "@/lib/ic/rust/option";
import { unwrapRustResult } from "@/lib/ic/rust/result";

import { idlFactory } from "./index.did";
import { approve, getICPCanisterId } from "../icrc3";

import type { _SERVICE, StableToken } from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";
export const getChainICCoreCanisterId = () => {
	return validateCanisterIdText(
		import.meta.env["VITE_CHAIN_IC_CORE_CANISTER_ID"]
	);
};

export type CreateMemeTokenArgs = {
	name: string;
	logo: File;
	ticker: string;
	description: string;
	website?: string;
	telegram?: string;
	twitter?: string;
	creator?: string;
};

export const createMemeToken = async (
	createActor: ActorCreator,
	canisterId: string,
	args: CreateMemeTokenArgs
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const {
		name,
		logo,
		ticker,
		description,
		website,
		telegram,
		twitter,
		creator,
	} = args;
	console.debug("🚀 ~ logo:", logo);
	const result = await actor.create_token({
		name,
		ticker,
		description,
		website: wrapOption(website),
		telegram: wrapOption(telegram),
		twitter: wrapOption(twitter),
		creator: wrapOption(creator ? validatePrincipalText(creator) : undefined),
		logo: "https://ipfs.io/ipfs/QmQ4H6Y23dSEjn9LKB85M7KpVFiDu6KfDNZAcrqiCwFQQH?img-width=800&img-dpr=2&img-onerror=redirect",
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// ================================ deposit ================================
export type DepositArgs = {
	token: StableToken;
	amount: bigint;
};

export const deposit = async (
	createActor: ActorCreator,
	canisterId: string,
	args: DepositArgs
) => {
	await approve({
		creator: createActor,
		canisterId: getICPCanisterId().toText(),
		args: {
			amount: args.amount + 20000n,
			spender: canisterId,
		},
	});
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { token, amount } = args;

	const result = await actor.deposit({
		token,
		amount,
		subaccount: [],
		memo: wrapOption(string2array((Math.random() * 100).toString())),
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};
export type BuyArgs = {
	minTokenReceived: bigint;
	id: bigint;
	amount: bigint;
};

export const buy = async (
	createActor: ActorCreator,
	canisterId: string,
	args: BuyArgs
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}

	const { minTokenReceived, id, amount } = args;

	const result = await actor.buy({
		buy_min_token: minTokenReceived,
		boning_curve_id: id,
		subaccount: [],
		ckbtc_amount: amount,
	});
	console.debug("🚀 ~ result:", result);
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};
