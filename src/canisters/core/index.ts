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
import { getICPCanisterToken } from "../icrc3/specials";

import type { _SERVICE, LedgerType, StableToken } from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";
import type { Principal } from "@dfinity/principal";

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
		progress: r.process,
		creator: r.creator,
		completed: r.completed,
		available_token: r.available_token,
		ledger_canister: unwrapOption(r.ledger_canister),
		liquidity: r.market_cap_token,
		created_at: r.created_at,
		bc: r.bc, // no use
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

export const DEFAULT_HOLDERS_PAGE_SIZE = 10;
// get holders
export const getHolders = async (
	canisterId: string,
	tokenId: bigint,
	args: {
		page: number;
		pageSize?: number;
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
	const { page, pageSize } = args;
	const result = await actor.query_token_holders(
		tokenId,
		BigInt(page),
		BigInt(pageSize ?? DEFAULT_HOLDERS_PAGE_SIZE)
	);
	return {
		data: result[0],
		total: result[1],
	};
};

export type CreatedToken = {
	id: string;
	name: string;
	ticker: string;
	description: string;
	logo: string;
	process: number;
	price: number | string | undefined;
	creator: string;
	completed: boolean;
	available_token: bigint;
	market_cap_token: bigint;
	liquidity: bigint;
	created_at: bigint;
	decimals: number;
	holders: string | undefined;
};

// query user created meme token
export const getUserCreatedMemeTokens = async (
	canisterId: string,
	args: {
		owner?: string;
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

	const { owner } = args;
	const parameters: [Principal] | [] = owner
		? [validatePrincipalText(owner)]
		: [];

	const result = await actor.query_user_create_meme_tokens(parameters);

	if (!result) {
		return [];
	}
	return result.map((r) => {
		return {
			id: r.id.toString(),
			name: r.name,
			ticker: r.ticker,
			description: r.description,
			logo: r.logo,
			process: r.process,
			price: r.price,
			creator: r.creator,
			completed: r.completed,
			available_token: r.available_token,
			market_cap_token: r.market_cap_token,
			liquidity: r.market_cap_token,
			created_at: r.created_at,
			decimals: 8,
			holders: undefined,
		};
	}) as Array<CreatedToken>;
};

// query user tokens
export type MemeTokenDetails = {
	id: string;
	balance: string;
	name: string;
	ticker: string;
	description: string;
	logo: string;
	price: number | string | undefined;
	progress: number;
	creator: string;
	completed: boolean;
	available_token: number;
	liquidity: number;
	created_at: Date;
	bc: string; // no use
	decimals: number;
	holders: string | undefined;
};
export type UserHoldings = Array<MemeTokenDetails>;
export const getUserTokens = async (
	canisterId: string,
	args: {
		owner: string;
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

	const { owner } = args;
	const result = await actor.query_user_tokens([
		{
			owner: validatePrincipalText(owner),
			subaccount: [],
		},
	]);

	if (!result) {
		return [];
	}

	return result.map((r) => {
		return {
			id: r.token.id.toString(),
			balance: r.balance.toString(),
			name: r.token.name,
			ticker: r.token.ticker,
			description: r.token.description,
			price: r.token.price,
			logo: r.token.logo,
			progress: r.token.process,
			creator: r.token.creator,
			completed: r.token.completed,
			available_token: r.token.available_token,
			liquidity: r.token.market_cap_token,
			created_at: r.token.created_at,
			bc: r.token.bc, // no use
			decimals: 8,
		} as unknown as MemeTokenDetails;
	});
};

// ================================ write ================================
// createMemeToken
export type CreateMemeTokenArgs = {
	name: string;
	logo: string;
	ticker: string;
	description: string;
	website?: string;
	telegram?: string;
	twitter?: string;
	creator?: string;
	devBuy?: bigint;
	logoBase64: Array<number>;
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
		devBuy,
		logoBase64,
	} = args;

	const result = await actor.create_token({
		token: getICPCanisterToken(),
		name,
		ticker,
		description,
		website: wrapOption(website),
		telegram: wrapOption(telegram),
		twitter: wrapOption(twitter),
		creator: wrapOption(creator ? validatePrincipalText(creator) : undefined),
		logo,
		dev_buy: wrapOption(devBuy),
		logo_base64: logoBase64,
	});
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
			amount: args.amount + getICPCanisterToken().fee,
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
// withdraw
export type WithdrawArgs = {
	token: StableToken;
	amount: bigint;
	to: string;
};

export const withdraw = async (
	createActor: ActorCreator,
	canisterId: string,
	args: WithdrawArgs
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { token, amount, to } = args;
	const result = await actor.withdraw({
		token,
		amount,
		subaccount: [],
		to: {
			owner: validatePrincipalText(to),
			subaccount: [],
		},
		memo: wrapOption(string2array((Math.random() * 100).toString())),
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// buy
export type BuyArgs = {
	amount_out_min: bigint;
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

	const { amount_out_min, id, amount } = args;

	const result = await actor.buy({
		amount_out_min: wrapOption(amount_out_min),
		subaccount: [],
		amount_in: amount,
		meme_token_id: id,
		memo: wrapOption(string2array((Math.random() * 100).toString())),
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// sell
export type SellArgs = {
	amount: bigint;
	id: bigint;
	amount_out_min: bigint;
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
	const { amount, id, amount_out_min } = args;
	const result = await actor.sell({
		amount_in: amount,
		subaccount: [],
		amount_out_min: wrapOption(amount_out_min),
		meme_token_id: id,
		memo: wrapOption(string2array((Math.random() * 100).toString())),
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// get generate random
export const get_generate_random = async (
	createActor: ActorCreator,
	canisterId: string
): Promise<string | undefined> => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const result = await actor.generate_random();
	return result.toString();
};

// claim faucet
export type ClaimFaucetArgs = {
	principal?: Principal;
};

export const claimFaucet = async (
	createActor: ActorCreator,
	canisterId: string,
	args: ClaimFaucetArgs
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const result = await actor.claim({
		token: getICPCanisterToken(),
		claimer: wrapOption(args.principal),
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};
