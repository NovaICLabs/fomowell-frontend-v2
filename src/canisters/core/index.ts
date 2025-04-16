import {
	validateCanisterIdText,
	validatePrincipalText,
} from "@/lib/ic/principal";
import { wrapOption } from "@/lib/ic/rust/option";
import { unwrapRustResult } from "@/lib/ic/rust/result";

import { idlFactory } from "./index.did";

import type { _SERVICE, MetadataValue } from "./index.did.d";
import type { ActorCreator } from "@/lib/ic/connectors";

export const getChainICCoreCanisterId = () => {
	return validateCanisterIdText(
		import.meta.env["VITE_CHAIN_IC_CORE_CANISTER_ID"]
	);
};

async function fileToMetadataValue(file: File): Promise<MetadataValue> {
	const arrayBuffer = await file.arrayBuffer();

	const uint8Array = new Uint8Array(arrayBuffer);

	return { Blob: uint8Array };
}

export type CreateMemeTokenArgs = {
	name: string;
	logo: File;
	ticker: string;
	description: string;
	website?: string;
	telegram?: string;
	twitter?: string;
	rune_ticker?: string;
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
	const logoMetadata = await fileToMetadataValue(logo);
	const result = await actor.create_token({
		name,
		ticker,
		description,
		website: wrapOption(website),
		telegram: wrapOption(telegram),
		twitter: wrapOption(twitter),
		rune_ticker: "12213",
		creator: wrapOption(creator ? validatePrincipalText(creator) : undefined),
		logo: logoMetadata,
	});
	return unwrapRustResult(result, (error) => {
		throw new Error(error);
	});
};
