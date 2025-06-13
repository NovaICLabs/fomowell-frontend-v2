import BigNumber from "bignumber.js";

import {
	createActorCreatorFromIdentity,
	getAnonymousActorCreator,
} from "@/hooks/providers/wallet/ic";
import { string2array } from "@/lib/common/data/arrays";
import { bigint2string } from "@/lib/common/data/bigint";
import { formatNumberSmart } from "@/lib/common/number";
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
// import { approve, getICPCanisterId } from "../icrc3";
// import { getCkbtcCanisterToken } from "../icrc3/specials";

import type {
	_SERVICE,
	LedgerType,
	LiquidityAddArg,
	LiquidityRemoveArg,
	PreLiquidityRemoveArg,
	StableToken,
} from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";
import type { Identity } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";

export const getChainBTCCoreCanisterId = () => {
	return validateCanisterIdText(
		import.meta.env["VITE_CHAIN_BTC_CORE_CANISTER_ID"]
	);
};

export const getCkbtcCanisterId = () => {
	const value = import.meta.env["VITE_CKBTC_RUN_WALLET_CANISTER_ID"];
	return validatePrincipalText(value);
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
		rune_name: r.rune_name,
		// canister_id: unwrapOption(r.ledger_canister),
		liquidity: r.market_cap_token,
		created_at: r.created_at,
		// bc: r.bc, // no use
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
	const formatted = formatNumberSmart(
		BigNumber(result)
			.div(10 ** decimals)
			.toFixed(2, 1)
			.toString()
	);
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
			// bc: r.token.bc, // no use
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
	logoBase64: string;
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
		// logoBase64,
	} = args;
	console.log("🚀 ~ args:", args);

	const result = await actor.create_token({
		// token: getCkbtcCanisterToken(),
		name,
		ticker,
		description,
		website: wrapOption(website),
		telegram: wrapOption(telegram),
		twitter: wrapOption(twitter),
		creator: wrapOption(creator ? validatePrincipalText(creator) : undefined),
		logo,
		dev_buy: wrapOption(devBuy),
		// logo_base64: logoBase64,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// // deposit no use
// export type DepositArgs = {
// 	token: StableToken;
// 	amount: bigint;
// };

// export const deposit = async (
// 	createActor: ActorCreator,
// 	canisterId: string,
// 	args: DepositArgs
// ) => {
// 	await approve({
// 		creator: createActor,
// 		canisterId: getICPCanisterId().toText(),
// 		args: {
// 			amount: args.amount + getICPCanisterToken().fee,
// 			spender: canisterId,
// 		},
// 	});
// 	const actor = await createActor<_SERVICE>({
// 		canisterId,
// 		interfaceFactory: idlFactory,
// 	});
// 	if (!actor) {
// 		throw new Error("Failed to create actor");
// 	}
// 	const { token, amount } = args;

// 	const result = await actor.deposit({
// 		to: [], // [] is current user
// 		token,
// 		amount,
// 		subaccount: [],
// 		memo: wrapOption(string2array((Math.random() * 100).toString())),
// 	});
// 	return unwrapRustResult(result, (error) => {
// 		throw new Error(error);
// 	});
// };
// withdraw
export type WithdrawArgs = {
	token: StableToken;
	amount: bigint;
	to: string;
	from: string;
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
	const { token, amount, to, from } = args;
	const result = await actor.withdraw({
		token,
		amount,
		subaccount: [],
		from: {
			owner: validatePrincipalText(from),
			subaccount: [],
		},
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
export const btc_buy = async (
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
		console.debug("🚀 ~ return unwrap RustResult ~ error:", error);
		throw new Error(error);
	});
};

// sell
export type SellArgs = {
	amount: bigint;
	id: bigint;
	amount_out_min: bigint;
};

export const btc_sell = async (
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
// export type ClaimFaucetArgs = {
// 	principal?: Principal;
// };

// export const claimFaucet = async (
// 	createActor: ActorCreator,
// 	canisterId: string,
// 	args: ClaimFaucetArgs
// ) => {
// 	const actor = await createActor<_SERVICE>({
// 		canisterId,
// 		interfaceFactory: idlFactory,
// 	});
// 	if (!actor) {
// 		throw new Error("Failed to create actor");
// 	}
// 	const result = await actor.claim({
// 		token: getICPCanisterToken(),
// 		claimer: wrapOption(args.principal),
// 	});
// 	return unwrapRustResult(result, (error) => {
// 		throw new Error(error);
// 	});
// };

// =================ck btc================

// withdraw ckbtc
export type WithdrawBtcArgs = {
	token: StableToken;
	amount: bigint;
	to: string;
	from: string;
};

export const withdrawBtc = async (
	identity: Identity,
	canisterId: string,
	args: WithdrawBtcArgs
) => {
	const createActor = createActorCreatorFromIdentity(identity);
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { token, amount, to, from } = args;
	const result = await actor.withdraw_ckbtc({
		to: to,
		token,
		from: {
			owner: validatePrincipalText(from),
			subaccount: [],
		},
		memo: wrapOption(string2array((Math.random() * 100).toString())),
		amount,
		subaccount: [],
	});

	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// pre add liquidity
export type PreAddLiquidityArgs = {
	sats: string | undefined;
	id: bigint;
	runes: string | undefined;
};

export const pre_add_liquidity = async (
	canisterId: string,
	args: PreAddLiquidityArgs
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		canisterId,
		idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { sats, id, runes } = args;

	const result = await actor.pre_add_liquidity({
		id,
		sats: sats ? [BigInt(sats)] : [],
		runes: runes ? [BigInt(runes)] : [],
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// add liquidity
export const add_liquidity = async (
	createActor: ActorCreator,
	canisterId: string,
	args: LiquidityAddArg
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { sats, id, runes, nonce } = args;

	const result = await actor.add_liquidity({
		id,
		sats: sats,
		runes: runes,
		nonce: nonce,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// pre add liquidity
export const pre_remove_liquidity = async (
	canisterId: string,
	args: PreLiquidityRemoveArg
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		canisterId,
		idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { id, liquidity } = args;

	const result = await actor.pre_withdraw_liquidity({
		id,
		liquidity,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

// remove liquidity
export const remove_liquidity = async (
	createActor: ActorCreator,
	canisterId: string,
	args: LiquidityRemoveArg
) => {
	const actor = await createActor<_SERVICE>({
		canisterId,
		interfaceFactory: idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { id, liquidity, nonce } = args;

	const result = await actor.withdraw_liquidity({
		id,
		liquidity: liquidity,
		nonce: nonce,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};

export const token_all_liquidity = async (
	canisterId: string,
	args: {
		id: bigint;
	}
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}
	const actor = await createActor<_SERVICE>({
		canisterId,
		idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { id } = args;

	const result = await actor.query_meme_token_pool(id);

	return unwrapOption(result);
};

export const token_user_liquidity = async (
	principal: Principal,
	canisterId: string,
	args: {
		id: bigint;
	}
) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		canisterId,
		idlFactory,
	});
	if (!actor) {
		throw new Error("Failed to create actor");
	}
	const { id } = args;

	const result = await actor.query_user_meme_token_lp([principal], id);

	return bigint2string(result);
};
