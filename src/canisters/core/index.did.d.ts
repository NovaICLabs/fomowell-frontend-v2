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
export interface ArchiveLedgerInfo {
	setting: ArchiveSetting;
	last_index: bigint;
	first_index: bigint;
	local_ledger_size: bigint;
	txn_count: bigint;
	archive_txn_count: bigint;
	is_cleaning: boolean;
	archives: Array<[Principal, TransactionRange]>;
}
export interface ArchiveSetting {
	max_records_in_archive_instance: bigint;
	archive_cycles: bigint;
	settle_to_records: bigint;
	archive_controllers: [] | [[] | [Array<Principal>]];
	max_active_records: bigint;
	max_records_to_archive: bigint;
	max_archive_pages: bigint;
}
export interface ArchivedRange {
	callback: [Principal, string];
	start: bigint;
	length: bigint;
}
export type BTreeMap = Array<
	[
		string,
		(
			| { Int: bigint }
			| { Map: BTreeMap }
			| { Nat: bigint }
			| { Nat64: bigint }
			| { Blob: Uint8Array | number[] }
			| { Text: string }
			| { Array: Array<Value> }
		),
	]
>;
export interface BondingCurve {
	token: StableToken;
	token_reserve: bigint;
	meme_token_reserve: bigint;
	k_last: bigint;
	total_supply: bigint;
}
export interface Burn {
	from: Account;
	memo: [] | [Uint8Array | number[]];
	created_at_time: [] | [bigint];
	amount: bigint;
	spender: [] | [Account];
}
export interface Buy {
	fee: [] | [bigint];
	token: Principal;
	from: Account;
	amount_out: bigint;
	reserve_out: bigint;
	amount_in: bigint;
	reserve_in: bigint;
	meme_token_id: bigint;
}
export interface BuyArgs {
	amount_out_min: [] | [bigint];
	memo: [] | [Uint8Array | number[]];
	subaccount: [] | [Uint8Array | number[]];
	amount_in: bigint;
	meme_token_id: bigint;
}
export interface BuyResponse {
	amount_out: bigint;
	is_completed: boolean;
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
export interface ClaimArg {
	token: StableToken;
	claimer: [] | [Principal];
}
export interface ConsentInfo {
	metadata: ConsentMessageMetadata;
	consent_message: ConsentMessage;
}
export type ConsentMessage =
	| {
			LineDisplayMessage: { pages: Array<LineDisplayPage> };
	  }
	| { GenericDisplayMessage: string };
export interface ConsentMessageMetadata {
	utc_offset_minutes: [] | [number];
	language: string;
}
export interface ConsentMessageRequest {
	arg: Uint8Array | number[];
	method: string;
	user_preferences: ConsentMessageSpec;
}
export interface ConsentMessageSpec {
	metadata: ConsentMessageMetadata;
	device_spec: [] | [DisplayMessageType];
}
export interface CreateMemeTokenArg {
	creator: [] | [Principal];
	token: StableToken;
	ticker: string;
	logo_base64: string;
	twitter: [] | [string];
	logo: string;
	name: string;
	description: string;
	website: [] | [string];
	dev_buy: [] | [bigint];
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
export type DisplayMessageType =
	| { GenericDisplay: null }
	| {
			LineDisplay: {
				characters_per_line: number;
				lines_per_page: number;
			};
	  };
export interface ErrorInfo {
	description: string;
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
export interface Holder {
	balance: bigint;
	account: Account;
}
export interface HourlyMetricsData {
	updateCalls: BigUint64Array | bigint[];
	canisterHeapMemorySize: BigUint64Array | bigint[];
	canisterCycles: BigUint64Array | bigint[];
	canisterMemorySize: BigUint64Array | bigint[];
	timeMillis: bigint;
}
export type Icrc21Error =
	| {
			GenericError: { description: string; error_code: bigint };
	  }
	| { InsufficientPayment: ErrorInfo }
	| { UnsupportedCanisterCall: ErrorInfo }
	| { ConsentMessageUnavailable: ErrorInfo };
export interface Icrc28TrustedOrigins {
	trusted_origins: Array<string>;
}
export interface InitArchiveArg {
	maxRecordsToArchive: bigint;
	maxArchivePages: bigint;
	settleToRecords: bigint;
	archiveCycles: bigint;
	maxActiveRecords: bigint;
	maxRecordsInArchiveInstance: bigint;
	archiveControllers: [] | [[] | [Array<Principal>]];
}
export interface InitArg {
	fee_receiver: Account;
	create_token_fee: Array<TokenAmount>;
	archive_init: [] | [InitArchiveArg];
	token_launch_threshold: Array<TokenAmount>;
	maintenance: boolean;
	fee_percentage: [] | [number];
}
export type LedgerType = { MemeToken: bigint } | { ICRCToken: Principal };
export interface LineDisplayPage {
	lines: Array<string>;
}
export interface LogMessageData {
	timeNanos: bigint;
	message: string;
}
export interface MemeToken {
	bc: BondingCurve;
	id: bigint;
	creator: string;
	ticker: string;
	available_token: bigint;
	twitter: [] | [string];
	logo: string;
	name: string;
	market_cap_token: bigint;
	completed: boolean;
	description: string;
	lp_canister: [] | [Principal];
	created_at: bigint;
	website: [] | [string];
	ledger_canister: [] | [Principal];
	price: number;
	telegram: [] | [string];
	process: number;
}
export interface MemeTokenBalance {
	token: MemeToken;
	balance: bigint;
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
export interface QueryMemeTokenArgs {
	sort: [] | [Sort];
	start: bigint;
	length: bigint;
}
export interface QueryMemeTokenResponse {
	meme_tokens: Array<MemeToken>;
	count: bigint;
}
export type Result = { Ok: BuyResponse } | { Err: string };
export type Result_1 = { Ok: bigint } | { Err: string };
export type Result_2 = { Ok: MemeToken } | { Err: string };
export type Result_3 = { Ok: ConsentInfo } | { Err: Icrc21Error };
export type Sort = { CreateTimeDsc: null } | { MarketCapDsc: null };
export interface StableToken {
	fee: bigint;
	decimals: number;
	name: string;
	canister_id: Principal;
	symbol: string;
}
export interface State {
	archive_ledger_info: ArchiveLedgerInfo;
	fee_receiver: Account;
	create_token_fee: Array<TokenAmount>;
	token_launch_threshold: Array<TokenAmount>;
	maintainer: Account;
	maintenance: boolean;
	fee_percentage: [] | [number];
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
export interface SupportedStandard {
	url: string;
	name: string;
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
export interface TokenAmount {
	token: Principal;
	amount: bigint;
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
	start: bigint;
	length: bigint;
}
export interface TransactionRange_1 {
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
	| { Map: BTreeMap }
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
	calculate_buy: ActorMethod<[bigint, bigint], Result_1>;
	calculate_sell: ActorMethod<[bigint, bigint], Result_1>;
	claim: ActorMethod<[ClaimArg], Result_1>;
	create_token: ActorMethod<[CreateMemeTokenArg], Result_2>;
	deposit: ActorMethod<[DepositArgs], Result_1>;
	generate_random: ActorMethod<[], bigint>;
	getCanistergeekInformation: ActorMethod<
		[GetInformationRequest],
		GetInformationResponse
	>;
	get_transactions: ActorMethod<[TransactionRange], GetTransactionsResponse>;
	icrc10_supported_standards: ActorMethod<[], Array<SupportedStandard>>;
	icrc1_balance_of: ActorMethod<[LedgerType, Account], bigint>;
	icrc21_canister_call_consent_message: ActorMethod<
		[ConsentMessageRequest],
		Result_3
	>;
	icrc28_trusted_origins: ActorMethod<[], Icrc28TrustedOrigins>;
	query_meme_token: ActorMethod<[bigint], [] | [MemeToken]>;
	query_meme_token_price: ActorMethod<[bigint], Result_1>;
	query_meme_tokens: ActorMethod<[QueryMemeTokenArgs], QueryMemeTokenResponse>;
	query_state: ActorMethod<[], State>;
	query_token_holders: ActorMethod<
		[bigint, bigint, bigint],
		[Array<Holder>, bigint]
	>;
	query_txn_size: ActorMethod<[], bigint>;
	query_user_by_random: ActorMethod<[bigint], [] | [Principal]>;
	query_user_create_meme_tokens: ActorMethod<
		[[] | [Principal]],
		Array<MemeToken>
	>;
	query_user_tokens: ActorMethod<[[] | [Account]], Array<MemeTokenBalance>>;
	sell: ActorMethod<[BuyArgs], Result_1>;
	withdraw: ActorMethod<[WithdrawArgs], Result_1>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
