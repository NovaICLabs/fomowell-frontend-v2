import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
	owner: Principal;
	subaccount: [] | [Uint8Array | number[]];
}
export interface Addresses {
	icrc1_string: string;
	account_identifier: Uint8Array | number[];
	icrc1: Account;
	ckbtc_mint: string;
	bitcoin: string;
	account_identifier_string: string;
}
export type BitcoinNetwork =
	| { mainnet: null }
	| { regtest: null }
	| { testnet: null };
export interface EtchingArgs {
	cap: bigint;
	height: [] | [[bigint, bigint]];
	turbo: boolean;
	premine: bigint;
	rune: string;
	divisibility: number;
	offset: [] | [[bigint, bigint]];
	fee_rate: [] | [bigint];
	amount: bigint;
	symbol: number;
}
export interface InitArgs {
	runes_indexer: Principal;
	network: BitcoinNetwork;
	ckbtc_minter: Principal;
	ckbtc_ledger: Principal;
	timer_for_reveal_txn: number;
}
export interface MintAddress {
	mint_btc_address: string;
	platform_icrc1_subaccount: [] | [Uint8Array | number[]];
	index: bigint;
	mint_icrc1_subaccount: [] | [Uint8Array | number[]];
}
export interface Outpoint {
	txid: Uint8Array | number[];
	vout: number;
}
export interface PagedResponse {
	total: bigint;
	offset: bigint;
	limit: bigint;
	items: Array<RuneInfo>;
}
export type Result = { Ok: null } | { Err: string };
export type Result_1 = { Ok: string } | { Err: string };
export interface RuneEntry {
	confirmations: number;
	mints: bigint;
	terms: [] | [Terms];
	etching: string;
	turbo: boolean;
	premine: bigint;
	divisibility: number;
	spaced_rune: string;
	number: bigint;
	timestamp: bigint;
	block: bigint;
	burned: bigint;
	rune_id: string;
	symbol: [] | [string];
}
export interface RuneId {
	tx: number;
	block: bigint;
}
export interface RuneInfo {
	id: bigint;
	confirmations: number;
	mints: bigint;
	terms: [] | [Terms];
	etching: string;
	turbo: boolean;
	premine: bigint;
	rune_utxo_vout: number;
	rune_utxo: [] | [string];
	divisibility: number;
	rune_balance: bigint;
	spaced_rune: string;
	number: bigint;
	timestamp: bigint;
	block: bigint;
	burned: bigint;
	rune_id: string;
	mint_address: string;
	symbol: [] | [string];
}
export interface RunicUtxo {
	balance: bigint;
	utxo: Utxo;
}
export interface StatusRequest {
	memory_size: boolean;
	cycles: boolean;
	heap_memory_size: boolean;
}
export interface StatusResponse {
	memory_size: [] | [bigint];
	cycles: [] | [bigint];
	heap_memory_size: [] | [bigint];
}
export type SubmittedTxidType = { Bitcoin: { txid: string } };
export interface Terms {
	cap: [] | [bigint];
	height: [[] | [bigint], [] | [bigint]];
	offset: [[] | [bigint], [] | [bigint]];
	amount: [] | [bigint];
}
export type TokenType = { Rune: RuneId } | { Bitcoin: null };
export interface Utxo {
	height: number;
	value: bigint;
	outpoint: Outpoint;
}
export type UtxoStatus =
	| { ValueTooSmall: Utxo }
	| { Tainted: Utxo }
	| {
			Minted: {
				minted_amount: bigint;
				block_index: bigint;
				utxo: Utxo;
			};
	  }
	| { Checked: Utxo };
export interface WalletReceiveResult {
	accepted: bigint;
}
export type WithdrawalType =
	| {
			Rune: {
				to: string;
				fee_per_vbytes: [] | [bigint];
				runeid: RuneId;
				amount: bigint;
			};
	  }
	| {
			Bitcoin: {
				to: string;
				fee_per_vbytes: [] | [bigint];
				amount: bigint;
			};
	  };
export interface _SERVICE {
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	add_used_tx_id: ActorMethod<[string, bigint], Result>;
	canister_get_status: ActorMethod<[StatusRequest], StatusResponse>;
	confirm_and_convert_ckbtc: ActorMethod<[], bigint>;
	etch_rune: ActorMethod<[EtchingArgs], [string, string]>;
	get_btc_balance: ActorMethod<[], bigint>;
	get_deposit_address_for_bitcoin: ActorMethod<[], string>;
	get_deposit_address_for_ckbtc: ActorMethod<[], string>;
	get_deposit_addresses: ActorMethod<[], Addresses>;
	get_estimated_cbktc_conversion_fee: ActorMethod<[], bigint>;
	get_fast_btc_address: ActorMethod<[[] | [Uint8Array | number[]]], Result_1>;
	get_mint_rune_by_id: ActorMethod<[bigint], [] | [RuneInfo]>;
	get_mint_rune_by_name: ActorMethod<[string], [] | [RuneInfo]>;
	get_rune_list: ActorMethod<[bigint, bigint], PagedResponse>;
	get_user_balances: ActorMethod<[], Array<[TokenType, bigint]>>;
	query_conversion_status: ActorMethod<[bigint], string>;
	query_user_bitcoin_utxos: ActorMethod<[string], Array<Utxo>>;
	query_user_ckbtc_address_paginated: ActorMethod<
		[bigint, bigint],
		[Array<[Principal, MintAddress]>, bigint, [] | [bigint]]
	>;
	query_user_runic_utxos: ActorMethod<[string, RuneId], Array<RunicUtxo>>;
	record_user_runic_utxos: ActorMethod<
		[string, RuneId, Array<RunicUtxo>],
		Result
	>;
	update_fast_btc_balance: ActorMethod<[], Array<UtxoStatus>>;
	update_rune_balance: ActorMethod<[bigint, string, number, bigint], Result>;
	update_rune_from_indexer: ActorMethod<[string], [] | [RuneEntry]>;
	wallet_balance: ActorMethod<[], bigint>;
	wallet_receive: ActorMethod<[], WalletReceiveResult>;
	withdraw: ActorMethod<[WithdrawalType], SubmittedTxidType>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
