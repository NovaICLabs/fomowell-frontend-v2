import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
	owner: Principal;
	subaccount: [] | [Uint8Array | number[]];
}
export interface AddLiquidity {
	token: Principal;
	from: Account;
	reserve_runes: bigint;
	input_runes: bigint;
	reserve_sats: bigint;
	meme_token_id: bigint;
	input_sats: bigint;
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
	archives: Array<[Principal, GetBlocksRequest]>;
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
	ticker: string;
	twitter: [] | [string];
	logo: string;
	name: string;
	description: string;
	website: [] | [string];
	dev_buy: [] | [bigint];
	telegram: [] | [string];
}
export interface Curve {
	sold: bigint;
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
	to: [] | [Account];
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
	rune_fee_rate: [] | [bigint];
	create_token_fee: Array<TokenAmount>;
	archive_init: [] | [InitArchiveArg];
	ckbtc_minter: Principal;
	swap_fee: bigint;
	token_launch_threshold: Array<TokenAmount>;
	ckbtc_ledger: Principal;
	maintenance: boolean;
	fee_percentage: [] | [number];
	swap_burn: bigint;
	btc_custody_canister: Principal;
}
export interface InnerSwap {
	fee: [] | [bigint];
	token: Principal;
	from: Account;
	sats: bigint;
	sold: bigint;
	meme_token_id: bigint;
	amount: bigint;
	swap_type: SwapType;
}
export type LedgerType = { MemeToken: bigint } | { ICRCToken: Principal };
export interface LineDisplayPage {
	lines: Array<string>;
}
export interface LiquidityAddArg {
	id: bigint;
	sats: bigint;
	nonce: bigint;
	runes: bigint;
}
export interface LiquidityRemoveArg {
	id: bigint;
	liquidity: bigint;
	nonce: bigint;
}
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
	market_cap_token: bigint;
	curve: Curve;
	completed: boolean;
	rune_name: string;
	description: string;
	created_at: bigint;
	website: [] | [string];
	price: number;
	telegram: [] | [string];
	process: number;
	is_etch: boolean;
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
export interface OuterSwap {
	fee: bigint;
	token: Principal;
	burn: bigint;
	from: Account;
	sats: bigint;
	reserve_runes: bigint;
	nonce: bigint;
	reserve_sats: bigint;
	meme_token_id: bigint;
	swap_type: SwapType;
	runes: bigint;
}
export interface PoolView {
	k: bigint;
	id: bigint;
	sats: bigint;
	runes: bigint;
}
export interface PreLiquidityAddArg {
	id: bigint;
	sats: [] | [bigint];
	runes: [] | [bigint];
}
export interface PreLiquidityRemoveArg {
	id: bigint;
	liquidity: bigint;
}
export interface PreRunesSwapSatsArg {
	id: bigint;
	runes: bigint;
}
export interface PreRunesSwapSatsResponse {
	sats: bigint;
	nonce: bigint;
}
export interface PreSatsSwapRunesArg {
	id: bigint;
	sats: bigint;
}
export interface PreSatsSwapRunesResponse {
	nonce: bigint;
	runes: bigint;
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
export type Result = { Ok: PoolView } | { Err: string };
export type Result_1 = { Ok: BuyResponse } | { Err: string };
export type Result_2 = { Ok: bigint } | { Err: string };
export type Result_3 = { Ok: MemeToken } | { Err: string };
export type Result_4 = { Ok: ConsentInfo } | { Err: Icrc21Error };
export type Result_5 = { Ok: LiquidityAddArg } | { Err: string };
export type Result_6 = { Ok: PreRunesSwapSatsResponse } | { Err: string };
export type Result_7 = { Ok: PreSatsSwapRunesResponse } | { Err: string };
export type Result_8 = { Ok: number } | { Err: string };
export type Result_9 = { Ok: bigint } | { Err: string };
export interface RunesSwapSatsArg {
	id: bigint;
	sats_min: [] | [bigint];
	nonce: bigint;
	runes: bigint;
}
export interface SatsSwapRunesArg {
	id: bigint;
	sats: bigint;
	nonce: bigint;
	runes_min: [] | [bigint];
}
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
	rune_fee_rate: [] | [bigint];
	create_token_fee: Array<TokenAmount>;
	ckbtc_minter: Principal;
	swap_fee: bigint;
	token_launch_threshold: Array<TokenAmount>;
	ckbtc_ledger: Principal;
	maintainer: Account;
	maintenance: boolean;
	fee_percentage: [] | [number];
	swap_burn: bigint;
	btc_custody_canister: Principal;
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
export type SwapType = { rune_to_btc: null } | { btc_to_rune: null };
export interface TokenAmount {
	token: Principal;
	amount: bigint;
}
export interface Transaction {
	buy: [] | [Buy];
	inner_swap: [] | [InnerSwap];
	add_liquidity: [] | [AddLiquidity];
	withdraw_rewards: [] | [WithdrawRewards];
	withdraw: [] | [Deposit];
	kind: string;
	mint: [] | [Mint];
	sell: [] | [Buy];
	deposit: [] | [Deposit];
	withdraw_ckbtc: [] | [WithdrawCkbtc];
	withdraw_liquidity: [] | [WithdrawLiquidity];
	timestamp: bigint;
	outer_swap: [] | [OuterSwap];
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
	| { Map: BTreeMap }
	| { Nat: bigint }
	| { Nat64: bigint }
	| { Blob: Uint8Array | number[] }
	| { Text: string }
	| { Array: Array<Value> };
export interface WithdrawArgs {
	to: Account;
	token: StableToken;
	from: Account;
	memo: [] | [Uint8Array | number[]];
	subaccount: [] | [Uint8Array | number[]];
	amount: bigint;
}
export interface WithdrawByCkbtcArgs {
	to: string;
	token: StableToken;
	from: Account;
	memo: [] | [Uint8Array | number[]];
	subaccount: [] | [Uint8Array | number[]];
	amount: bigint;
}
export interface WithdrawCkbtc {
	to: string;
	token: Principal;
	block_index: bigint;
	memo: [] | [Uint8Array | number[]];
	amount: bigint;
	spender: Account;
}
export interface WithdrawLiquidity {
	to: Account;
	token: Principal;
	out_put_liquidity: bigint;
	reserve_runes: bigint;
	output_runes: bigint;
	reserve_sats: bigint;
	output_sats: bigint;
	meme_token_id: bigint;
}
export interface WithdrawRewards {
	to: Account;
	token: Principal;
	from: Account;
	memo: [] | [Uint8Array | number[]];
	amount: bigint;
}
export interface WithdrawRewardsArgs {
	to: Account;
	token: Principal;
	memo: [] | [Uint8Array | number[]];
	amount: bigint;
}
export interface _SERVICE {
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	add_liquidity: ActorMethod<[LiquidityAddArg], Result>;
	buy: ActorMethod<[BuyArgs], Result_1>;
	calculate_buy: ActorMethod<[bigint, bigint], Result_2>;
	calculate_sell: ActorMethod<[bigint, bigint], Result_2>;
	claim: ActorMethod<[ClaimArg], Result_2>;
	create_token: ActorMethod<[CreateMemeTokenArg], Result_3>;
	deposit: ActorMethod<[DepositArgs], Result_2>;
	generate_random: ActorMethod<[], bigint>;
	getCanistergeekInformation: ActorMethod<
		[GetInformationRequest],
		GetInformationResponse
	>;
	get_transactions: ActorMethod<[GetBlocksRequest], GetTransactionsResponse>;
	icrc10_supported_standards: ActorMethod<[], Array<SupportedStandard>>;
	icrc1_balance_of: ActorMethod<[LedgerType, Account], bigint>;
	icrc21_canister_call_consent_message: ActorMethod<
		[ConsentMessageRequest],
		Result_4
	>;
	icrc28_trusted_origins: ActorMethod<[], Icrc28TrustedOrigins>;
	pre_add_liquidity: ActorMethod<[PreLiquidityAddArg], Result_5>;
	pre_runes_swap_sats: ActorMethod<[PreRunesSwapSatsArg], Result_6>;
	pre_sats_swap_runes: ActorMethod<[PreSatsSwapRunesArg], Result_7>;
	pre_withdraw_liquidity: ActorMethod<[PreLiquidityRemoveArg], Result_5>;
	query_meme_token: ActorMethod<[bigint], [] | [MemeToken]>;
	query_meme_token_pool: ActorMethod<[bigint], [] | [PoolView]>;
	query_meme_token_price: ActorMethod<[bigint], Result_8>;
	query_meme_tokens: ActorMethod<[QueryMemeTokenArgs], QueryMemeTokenResponse>;
	query_state: ActorMethod<[], State>;
	query_token_holders: ActorMethod<
		[bigint, bigint, bigint],
		[Array<Holder>, bigint]
	>;
	query_user_by_random: ActorMethod<[bigint], [] | [Principal]>;
	query_user_create_meme_tokens: ActorMethod<
		[[] | [Principal]],
		Array<MemeToken>
	>;
	query_user_meme_token_lp: ActorMethod<[[] | [Principal], bigint], bigint>;
	query_user_tokens: ActorMethod<[[] | [Account]], Array<MemeTokenBalance>>;
	runes_swap_sats: ActorMethod<[RunesSwapSatsArg], Result_2>;
	sats_swap_runes: ActorMethod<[SatsSwapRunesArg], Result_2>;
	sell: ActorMethod<[BuyArgs], Result_2>;
	test: ActorMethod<[bigint], undefined>;
	withdraw: ActorMethod<[WithdrawArgs], Result_2>;
	withdraw_ckbtc: ActorMethod<[WithdrawByCkbtcArgs], Result_9>;
	withdraw_liquidity: ActorMethod<[LiquidityRemoveArg], Result>;
	withdraw_rewards: ActorMethod<[WithdrawRewardsArgs], Result_2>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
