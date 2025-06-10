// import { Principal } from "@dfinity/principal";

import { getAnonymousActorCreator } from "@/hooks/providers/wallet/ic";
import { bigint2string } from "@/lib/common/data/bigint";
import { validatePrincipalText } from "@/lib/ic/principal";
import { unwrapRustResult } from "@/lib/ic/rust/result";

import { idlFactory as ckBTCMinterIdlFactory } from "./index.did";
import { getChainBTCCoreCanisterId } from "../btc_core";

import type { _SERVICE } from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";

// ckBTC Minter Canister ID
export const getCkBTCMinterCanisterId = () => {
	return validatePrincipalText(
		import.meta.env["VITE_CKBTC_MINTER_CANISTER_ID"]
	);
};

export const getBTCDepositAddress = async () => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		idlFactory: ckBTCMinterIdlFactory,
		canisterId: getCkBTCMinterCanisterId().toText(),
	});

	if (!actor) {
		throw new Error("Failed to create ckBTC minter actor");
	}

	// const defaultSubaccount = new Uint8Array(32).fill(0);

	console.log(
		"getChainBTCCoreCanisterId()======getBTCDepositAddress========",
		getChainBTCCoreCanisterId().toString()
	);
	const address = await actor.get_btc_address({
		owner: [getChainBTCCoreCanisterId()],
		subaccount: [],
	});

	return address;
};

export const getDepositFee = async () => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		idlFactory: ckBTCMinterIdlFactory,
		canisterId: getCkBTCMinterCanisterId().toText(),
	});

	if (!actor) {
		throw new Error("Failed to create ckBTC minter actor");
	}

	const result = await actor.get_deposit_fee();

	return bigint2string(result);
};

export const estimateWithdrawalFee = async (amount?: bigint) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		idlFactory: ckBTCMinterIdlFactory,
		canisterId: getCkBTCMinterCanisterId().toText(),
	});

	if (!actor) {
		throw new Error("Failed to create ckBTC minter actor");
	}

	const result = await actor.estimate_withdrawal_fee({
		amount: amount ? [amount] : [],
	});

	return {
		minterFee: result.minter_fee,
		bitcoinFee: result.bitcoin_fee,
		totalFee: result.minter_fee + result.bitcoin_fee,
	};
};

export const retrieveBTCStatus = async (blockIndex: bigint) => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		idlFactory: ckBTCMinterIdlFactory,
		canisterId: getCkBTCMinterCanisterId().toText(),
	});

	if (!actor) {
		throw new Error("Failed to create ckBTC minter actor");
	}

	const status = await actor.retrieve_btc_status({
		block_index: blockIndex,
	});

	return status;
};

export const getMinterInfo = async () => {
	const createActor = getAnonymousActorCreator();
	if (!createActor) {
		throw new Error("Failed to create actor");
	}

	const actor = await createActor<_SERVICE>({
		idlFactory: ckBTCMinterIdlFactory,
		canisterId: getCkBTCMinterCanisterId().toText(),
	});

	if (!actor) {
		throw new Error("Failed to create ckBTC minter actor");
	}

	return actor.get_minter_info();
};

export const retrieveBTC = async ({
	creator,
	address,
	amount,
}: {
	creator: ActorCreator;
	address: string;
	amount: bigint;
}) => {
	const actor = await creator<_SERVICE>({
		interfaceFactory: ckBTCMinterIdlFactory,
		canisterId: getCkBTCMinterCanisterId().toText(),
	});

	if (!actor) {
		throw new Error("Failed to create ckBTC minter actor");
	}

	const result = await actor.retrieve_btc({
		address,
		amount,
	});

	return unwrapRustResult(result, (error) => {
		throw new Error(Object.keys(error)[0]);
	});
};
