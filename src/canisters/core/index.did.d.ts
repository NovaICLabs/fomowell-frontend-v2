import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
	owner: Principal;
	subaccount: [] | [Uint8Array | number[]];
}
export interface Approve {
	fee: [] | [bigint];
	from: Account;
	memo: [] | [Uint8Array | number[]];
	created_at_time: [] | [bigint];
	amount: bigint;
	expected_allowance: [] | [bigint];
	expires_at: [] | [bigint];
	spender: Account;
}
export interface ArchivedRange {
	callback: [Principal, string];
	start: bigint;
	length: bigint;
}
export interface Burn {
	from: Account;
	memo: [] | [Uint8Array | number[]];
	created_at_time: [] | [bigint];
	amount: bigint;
	spender: [] | [Account];
}
export interface Buy {
	token: Principal;
	from: Account;
	amount_out: bigint;
	reserve_out: bigint;
	amount_in: bigint;
	reserve_in: bigint;
	meme_token_id: bigint;
}
export interface BuyArgs {
	amount_out_min: bigint;
	boning_curve_id: bigint;
	subaccount: [] | [Uint8Array | number[]];
	amount_in: bigint;
}
export type CanisterLogFeature =
	| { filterMessageByContains: null }
	| { filterMessageByRegex: null };
export interface CanisterLogMessages {
	data: Array<LogMessageData>;
	lastAnalyzedMessageTimeNanos: [] | [bigint];
}
export interface CanisterLogMessagesInfo {
	features: Array<[] | [CanisterLogFeature]>;
	lastTimeNanos: [] | [bigint];
	count: number;
	firstTimeNanos: [] | [bigint];
}
export type CanisterLogRequest =
	| { getMessagesInfo: null }
	| { getMessages: GetLogMessagesParameters }
	| { getLatestMessages: GetLatestLogMessagesParameters };
export type CanisterLogResponse =
	| { messagesInfo: CanisterLogMessagesInfo }
	| { messages: CanisterLogMessages };
export interface CanisterMetrics {
	data: CanisterMetricsData;
}
export type CanisterMetricsData =
	| { hourly: Array<HourlyMetricsData> }
	| { daily: Array<DailyMetricsData> };
export interface CreateMemeTokenArg {
	creator: [] | [Principal];
	ticker: string;
	twitter: [] | [string];
	logo: string;
	name: string;
	description: string;
	website: [] | [string];
	telegram: [] | [string];
}
export interface DailyMetricsData {
	updateCalls: bigint;
	canisterHeapMemorySize: NumericEntity;
	canisterCycles: NumericEntity;
	canisterMemorySize: NumericEntity;
	timeMillis: bigint;
}
export interface Deposit {
	to: Account;
	height: bigint;
	token: Principal;
	memo: [] | [Uint8Array | number[]];
	amount: bigint;
	spender: Account;
}
export interface DepositArgs {
	token: StableToken;
	memo: [] | [Uint8Array | number[]];
	subaccount: [] | [Uint8Array | number[]];
	amount: bigint;
}
export interface GetBlocksRequest {
	start: bigint;
	length: bigint;
}
export interface GetInformationRequest {
	status: [] | [StatusRequest];
	metrics: [] | [MetricsRequest];
	logs: [] | [CanisterLogRequest];
	version: boolean;
}
export interface GetInformationResponse {
	status: [] | [StatusResponse];
	metrics: [] | [MetricsResponse];
	logs: [] | [CanisterLogResponse];
	version: [] | [bigint];
}
export interface GetLatestLogMessagesParameters {
	upToTimeNanos: [] | [bigint];
	count: number;
	filter: [] | [GetLogMessagesFilter];
}
export interface GetLogMessagesFilter {
	analyzeCount: number;
	messageRegex: [] | [string];
	messageContains: [] | [string];
}
export interface GetLogMessagesParameters {
	count: number;
	filter: [] | [GetLogMessagesFilter];
	fromTimeNanos: [] | [bigint];
}
export interface GetMetricsParameters {
	dateToMillis: bigint;
	granularity: MetricsGranularity;
	dateFromMillis: bigint;
}
export interface GetTransactionsResponse {
	first_index: bigint;
	log_length: bigint;
	transactions: Array<Transaction>;
	archived_transactions: Array<ArchivedRange>;
}
export interface HourlyMetricsData {
	updateCalls: BigUint64Array | bigint[];
	canisterHeapMemorySize: BigUint64Array | bigint[];
	canisterCycles: BigUint64Array | bigint[];
	canisterMemorySize: BigUint64Array | bigint[];
	timeMillis: bigint;
}
export interface InitArg {
	icp_launch_thread_hold: bigint;
	fee_receiver: Account;
	create_token_fee: [] | [bigint];
	maintenance: boolean;
	fee_percentage: [] | [number];
	icp_canister: StableToken;
}
export type LedgerType = { MemeToken: bigint } | { ICRCToken: Principal };
export interface LogMessageData {
	timeNanos: bigint;
	message: string;
}
export interface MemeToken {
	id: bigint;
	creator: string;
	ticker: string;
	available_token: bigint;
	twitter: [] | [string];
	logo: string;
	name: string;
	completed: boolean;
	description: string;
	created_at: bigint;
	website: [] | [string];
	ledger_canister: [] | [string];
	market_cap_icp: bigint;
	price: number;
	telegram: [] | [string];
}
export type MetricsGranularity = { hourly: null } | { daily: null };
export interface MetricsRequest {
	parameters: GetMetricsParameters;
}
export interface MetricsResponse {
	metrics: [] | [CanisterMetrics];
}
export interface Mint {
	meme_token0: bigint;
	metadata: Array<[string, Value]>;
	from: Account;
	reserve0: bigint;
	reserve1: bigint;
	token1: Principal;
}
export interface Mint_1 {
	to: Account;
	memo: [] | [Uint8Array | number[]];
	created_at_time: [] | [bigint];
	amount: bigint;
}
export interface NumericEntity {
	avg: bigint;
	max: bigint;
	min: bigint;
	first: bigint;
	last: bigint;
}
export type Result = { Ok: bigint } | { Err: string };
export type Result_1 = { Ok: MemeToken } | { Err: string };
export interface StableToken {
	fee: bigint;
	decimals: number;
	name: string;
	canister_id: Principal;
	symbol: string;
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
export interface Swap {
	from: Account;
	reserve0: bigint;
	reserve1: bigint;
	amount0: bigint;
	amount1: bigint;
	token0: Principal;
	token1: Principal;
}
export interface Transaction {
	buy: [] | [Buy];
	withdraw: [] | [Deposit];
	kind: string;
	mint: [] | [Mint];
	sell: [] | [Buy];
	swap: [] | [Swap];
	deposit: [] | [Deposit];
	timestamp: bigint;
	index: bigint;
	transfer: [] | [Transfer];
}
export interface TransactionRange {
	transactions: Array<Transaction_1>;
}
export interface Transaction_1 {
	burn: [] | [Burn];
	kind: string;
	mint: [] | [Mint_1];
	approve: [] | [Approve];
	timestamp: bigint;
	transfer: [] | [Transfer_1];
}
export interface Transfer {
	to: Account;
	from: Account;
	memo: [] | [Uint8Array | number[]];
	ledger: LedgerType;
	amount: bigint;
}
export interface Transfer_1 {
	to: Account;
	fee: [] | [bigint];
	from: Account;
	memo: [] | [Uint8Array | number[]];
	created_at_time: [] | [bigint];
	amount: bigint;
	spender: [] | [Account];
}
export type Value =
	| { Int: bigint }
	| { Map: Array<[string, Value]> }
	| { Nat: bigint }
	| { Nat64: bigint }
	| { Blob: Uint8Array | number[] }
	| { Text: string }
	| { Array: Array<Value> };
export interface WithdrawArgs {
	to: Account;
	token: StableToken;
	memo: [] | [Uint8Array | number[]];
	subaccount: [] | [Uint8Array | number[]];
	amount: bigint;
}
export interface _SERVICE {
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	buy: ActorMethod<[BuyArgs], Result>;
	calculate_buy: ActorMethod<[bigint, bigint], Result>;
	calculate_sell: ActorMethod<[bigint, bigint], Result>;
	create_token: ActorMethod<[CreateMemeTokenArg], Result_1>;
	deposit: ActorMethod<[DepositArgs], Result>;
	getCanistergeekInformation: ActorMethod<
		[GetInformationRequest],
		GetInformationResponse
	>;
	get_transactions: ActorMethod<[GetBlocksRequest], GetTransactionsResponse>;
	icrc1_balance_of: ActorMethod<[LedgerType, Account], bigint>;
	query_meme_token: ActorMethod<[bigint], [] | [MemeToken]>;
	query_meme_token_price: ActorMethod<[bigint], Result>;
	sell: ActorMethod<[BuyArgs], Result>;
	withdraw: ActorMethod<[WithdrawArgs], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
