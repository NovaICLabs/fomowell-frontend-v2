import { getAnonymousActorCreator } from "@/hooks/providers/wallet/ic";
import { string2array } from "@/lib/common/data/arrays";
import { formatNumberSmart, formatUnits } from "@/lib/common/number";
import {
	validateCanisterIdText,
	validatePrincipalText,
} from "@/lib/ic/principal";
import {
	unwrapOption,
	unwrapOptionMap,
	wrapOption,
} from "@/lib/ic/rust/option";
import { unwrapRustResult } from "@/lib/ic/rust/result";

import { idlFactory } from "./index.did";
import { approve, getICPCanisterId } from "../icrc3";

import type { _SERVICE, LedgerType, StableToken } from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";

export const getChainICCoreCanisterId = () => {
	return validateCanisterIdText(
		import.meta.env["VITE_CHAIN_IC_CORE_CANISTER_ID"]
	);
};

// ================================ read ================================
export const getMemeToken = async (canisterId: string, id: bigint) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		idlFactory,
		canisterId,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const result = await actor.query_meme_token(id);
	const memeToken = unwrapOptionMap(result, (r) => ({
		name: r.name,
		ticker: r.ticker,
		description: r.description,
		website: unwrapOption(r.website),
		telegram: unwrapOption(r.telegram),
		twitter: unwrapOption(r.twitter),
		logo: r.logo,
		creator: r.creator,
		completed: r.completed,
		available_token: r.available_token,
		ledger_canister: unwrapOption(r.ledger_canister),
		market_cap_icp: r.market_cap_icp,
		created_at: r.created_at,
		decimals: 8,
	}));
	if (!memeToken) {
		throw new Error("Meme token not found");
	}
	return memeToken;
};
// getCoreTokenBalance
export const getCoreTokenBalance = async (
	canisterId: string,
	args: {
		owner: string;
		token: LedgerType;
	}
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		idlFactory,
		canisterId,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { owner, token } = args;
	const result = await actor.icrc1_balance_of(token, {
		owner: validatePrincipalText(owner),
		subaccount: [],
	});
	const decimals = 8;
	const formatted = formatNumberSmart(formatUnits(result, decimals));
	return {
		raw: result,
		formatted,
		decimals,
	};
};

// calculateBuy
export const calculateBuy = async (
	canisterId: string,
	args: {
		amount: bigint;
		id: bigint;
	}
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		idlFactory,
		canisterId,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { amount, id } = args;
	const result = await actor.calculate_buy(id, amount);
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// calculateSell
export const calculateSell = async (
	canisterId: string,
	args: {
		amount: bigint;
		id: bigint;
	}
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		idlFactory,
		canisterId,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { amount, id } = args;
	const result = await actor.calculate_sell(id, amount);
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// get current price
export const getCurrentPrice = async (canisterId: string, tokenId: bigint) => {
	console.debug("🚀 ~ getCurrentPrice ~ tokenId:", tokenId);
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		idlFactory,
		canisterId,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const result = await actor.query_meme_token_price(tokenId);
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// ================================ write ================================
// createMemeToken
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
	console.debug("🚀 ~ result:", result);
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// deposit
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

// buy
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
		amount_out_min: minTokenReceived,
		boning_curve_id: id,
		subaccount: [],
		amount_in: amount,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// sell
export type SellArgs = {
	amount: bigint;
	id: bigint;
	minTokenReceived: bigint;
};

export const sell = async (
	createActor: ActorCreator,
	canisterId: string,
	args: SellArgs
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { amount, id, minTokenReceived } = args;
	const result = await actor.sell({
		amount_in: amount,
		boning_curve_id: id,
		subaccount: [],
		amount_out_min: minTokenReceived,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};
