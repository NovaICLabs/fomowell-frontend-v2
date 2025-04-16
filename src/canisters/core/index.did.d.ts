import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface BuyArgs {
	buy_min_token: bigint;
	boning_curve_id: bigint;
	ckbtc_amount: bigint;
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
	rune_ticker: string;
	creator: [] | [Principal];
	ticker: string;
	twitter: [] | [string];
	logo: MetadataValue;
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
export interface HourlyMetricsData {
	updateCalls: BigUint64Array | bigint[];
	canisterHeapMemorySize: BigUint64Array | bigint[];
	canisterCycles: BigUint64Array | bigint[];
	canisterMemorySize: BigUint64Array | bigint[];
	timeMillis: bigint;
}
export interface InitArg {
	fee_receiver: Principal;
	ckbtc_canister: StableToken;
	create_token_fee: [] | [bigint];
	ckbtc_launch_thread_hold: bigint;
	maintenance: boolean;
	fee_percentage: [] | [number];
}
export interface LogMessageData {
	timeNanos: bigint;
	message: string;
}
export interface MemeToken {
	id: bigint;
	rune_ticker: string;
	creator: string;
	ticker: string;
	available_token: bigint;
	twitter: [] | [string];
	logo: MetadataValue;
	name: string;
	completed: boolean;
	description: string;
	created_at: bigint;
	website: [] | [string];
	market_cap_ckbtc: bigint;
	ledger_canister: [] | [string];
	telegram: [] | [string];
}
export type MetadataValue =
	| { Int: bigint }
	| { Nat: bigint }
	| { Blob: Uint8Array | number[] }
	| { Text: string };
export type MetricsGranularity = { hourly: null } | { daily: null };
export interface MetricsRequest {
	parameters: GetMetricsParameters;
}
export interface MetricsResponse {
	metrics: [] | [CanisterMetrics];
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
export interface SellArgs {
	token_amount: bigint;
	boning_curve_id: bigint;
	btc_min_amount: bigint;
}
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
export interface _SERVICE {
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	buy: ActorMethod<[BuyArgs], Result>;
	calculate_buy: ActorMethod<[bigint, bigint], Result>;
	calculate_sell: ActorMethod<[bigint, bigint], Result>;
	create_token: ActorMethod<[CreateMemeTokenArg], Result_1>;
	getCanistergeekInformation: ActorMethod<
		[GetInformationRequest],
		GetInformationResponse
	>;
	query_meme_token: ActorMethod<[bigint], [] | [MemeToken]>;
	sell: ActorMethod<[SellArgs], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
