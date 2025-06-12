// import { BigNumber } from "bignumber.js";

import { getCkbtcCanisterId } from "@/canisters/btc_core";
// import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { validatePrincipalText } from "@/lib/ic/principal";

import { request } from ".";

import type { UTCTimestamp } from "lightweight-charts";

const getIndexerBtcBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BTC_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BASE_URL is not set");
	}
	return indexerBaseUrl;
};
interface PaginatedDataBase {
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface PaginatedDataWithData<T> extends PaginatedDataBase {
	data: Array<T>;
	items?: never;
}

// type PaginatedData<T> = PaginatedDataWithItems<T> | PaginatedDataWithData<T>;
// =============================== Token List ===============================

export type BtcTokenInfo = {
	id: number;
	memeTokenId: number;
	name: string;
	ticker: string;
	logo: string;
	description: string;
	creator: string;
	timestamp: string;
	market: "BTC";
	rune_name: string;
	tokenAddress?: string;
	decimals: number;
	holders: string;
	fee: string;
	tx_id: string | null;
	tx_index: number;
	maxTotalSupply: string;
	createdAt: object;
	updatedAt: object;
	telegram: string | null;
	website: string | null;
	twitter: string | null;
	process: number;
	completed: boolean;
	price: number | null;
	priceChangeRate5M: number | null;
	priceChangeRate1H: number | null;
	priceChangeRate6H: number | null;
	priceChangeRate8H: number | null;
	priceChangeRate24H: number | null;
	volume5M: string;
	volume1H: string;
	volume6H: string;
	volume8H: string;
	volume24H: string;
	volumeAll: string;
	token_reserve: string;
	meme_token_reserve: string;
	market_cap_token: string | null;
	token1Address: string;
	token1Name: string;
	recentTradeTs: string | null;
	isFollow?: boolean;
};
export const tokenListSortOptions = [
	"recent",
	"new",
	"completing",
	"completed",
	"popularity_5m",
	"popularity_1h",
	"popularity_6h",
	"popularity_24h",
	"price",
	"liquidity",
	"mc",
	"volume",
	"price_change_5m",
	"price_change_1h",
	"price_change_6h",
	"price_change_8h",
	"price_change_24h",
] as const;

export const tokenListFiltersOptions = ["completed", "completing"] as const;

export type TokenListFiltersOption = (typeof tokenListFiltersOptions)[number];

export type TokenListSortOption = (typeof tokenListSortOptions)[number];

export type TokenListParameters = {
	page?: number;
	pageSize?: number;
	name?: string;
	ticker?: string;
	market?: string;
	sort?: TokenListSortOption;
	sortDirection?: "asc" | "desc";
	search?: string;
	filters?: Record<string, boolean | undefined>;
	// single token info
	tokenId?: string;
	principal?: string;
};

export const getTokenList = async (parameters: TokenListParameters) => {
	const {
		page = 1,
		pageSize = 10,
		market = "BTC",
		sort = "recent",
		sortDirection = "desc",
		tokenId,
		principal,
		filters,
		search,
	} = parameters;
	const queryParameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		market,
		sort,
		sortDirection,
		...(filters
			? Object.fromEntries(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					Object.entries(filters).filter(([_, value]) => value !== undefined)
				)
			: {}),
		...(search ? { search } : {}),
	});
	if (principal) {
		queryParameters.set("principal", principal);
	}
	if (tokenId) {
		queryParameters.set("tokenId", tokenId);
	}
	const response = await request<{
		data: PaginatedDataWithData<BtcTokenInfo>;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBtcBaseUrl()}/api/v1/token_info/list?${queryParameters.toString()}`
	);
	if (response.statusCode !== 200) {
		throw new Error(response.message);
	}
	return response.data;
};
export const getFavoriteTokenList = async (parameters: {
	page?: number;
	pageSize?: number;
	principal?: string;
	market?: string;
}) => {
	const { page = 1, pageSize = 10, principal, market } = parameters;
	const queryParameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		market: market ?? "BTC",
	});
	if (principal) {
		queryParameters.set("principal", principal);
	}
	const response = await request<{
		data: PaginatedDataWithData<BtcTokenInfo>;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/follow?${queryParameters.toString()}`);
	if (response.statusCode !== 200) {
		throw new Error(response.message);
	}
	return response.data;
};

// =============================== transaction history ===============================

export type Transaction = {
	id: string;
	tradeType: "buy" | "sell";
	token0: string;
	token1: string;
	maker: string | null;
	fee: string | null;
	token0Amount: string;
	token1Amount: string;
	token0Reserve: string;
	token1Reserve: string;
	token0Price: string;
	token1Price: string;
	token0Volume: string;
	token1Volume: string;
	token0Usd: number;
	token1Usd: number;
	tradeTs: string;
	tx_index: number;
	createdAt: unknown;
	updatedAt: unknown;
};

export const getTokenTransactionList = async (parameters: {
	token0: string;
	token1: string;
	page?: number;
	pageSize?: number;
}) => {
	const { token0, token1, page = 1, pageSize = 20 } = parameters;
	const queryParameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		token0: token0.toString(),
		token1: token1,
	});
	const response = await request<{
		data: PaginatedDataWithData<Transaction>;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBtcBaseUrl()}/api/v1/token_trade/list?${queryParameters.toString()}`
	);

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch token trade list: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};

// =============================== token price candle ===============================

export type CandleData = {
	wStart: string;
	wEnd: string;
	time: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
};

type CandleApiResponse = {
	data: Array<CandleData>;
	statusCode: number;
	message: string;
};
export type CandleParameters = {
	tokenId: string;
	interval: "minute" | "5min" | "15min" | "hourly" | "daily";
	market?: string;
	duration?: number;
};
export const getTokenPriceCandle = async (parameters: CandleParameters) => {
	const { tokenId, interval, market, duration = 7 } = parameters;
	const intervalPathMap: Record<typeof interval, string> = {
		minute: "minute-candles",
		"5min": "5min-candles",
		"15min": "15min-candles",
		hourly: "hourly-candles",
		daily: "daily-candles",
	};
	const pathSegment = intervalPathMap[interval];
	const now = Math.floor(Date.now() / 1000) * 1000;
	const start = now - duration * 24 * 60 * 60 * 1000;
	const queryParameters = new URLSearchParams({
		token0: tokenId,
		token1: getCkbtcCanisterId().toText(),
		market: market ?? "BTC",
		start: start.toString(),
		end: now.toString(),
	});
	const url = `${getIndexerBtcBaseUrl()}/api/v1/token_trade/${pathSegment}?${queryParameters.toString()}`;

	const response = await request<CandleApiResponse>(url);

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch token ${interval} candles for ${tokenId}/${market}: ${response.message} (Status: ${response.statusCode})`
		);
	}
	// const decimals = getCkbtcCanisterToken().decimals;
	return response.data.map((candle) => ({
		time: Number(candle.wStart.substring(0, 10)) as UTCTimestamp,
		...(candle.low === "NULL" ||
		candle.high === "NULL" ||
		candle.open === "NULL"
			? {
					low: candle.close,
					high: candle.close,
					open: candle.close,
					close: candle.close,
				}
			: {
					low: candle.low,
					high: candle.high,
					open: candle.open,
					close: candle.close,
				}),
	}));
};

// favorite token
export const favoriteToken = async (user_token: string, tokenId: number) => {
	const response = await request<{
		data: string;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/follow`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
		body: JSON.stringify({ tokenId }),
	});
	if (response.statusCode !== 201) {
		throw new Error(response.message);
	}
};

export type ActivityItem = {
	id: string;
	trans_type: "buy" | "sell" | "deposit" | "withdraw";
	tokenTicker: string;
	tokenName: string;
	token0: string;
	token1: string;
	maker: string | null;
	fee: string | null;
	token0Amount: string;
	token1Amount: string;
	token0Reserve: string;
	token1Reserve: string;
	token0Price: string;
	token1Price: string;
	token0Volume: string;
	token1Volume: string;
	token0Usd: number;
	token1Usd: number;
	tradeTs: string;
	tx_index: number;
	createdAt: unknown;
	updatedAt: unknown;
};

export const getUserActivity = async (parameters: {
	userid: string;
	page?: number;
	pageSize?: number;
}) => {
	const { userid, page = 1, pageSize = 20 } = parameters;
	const queryParameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
	});
	const response = await request<{
		data: PaginatedDataWithData<ActivityItem>;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBtcBaseUrl()}/api/v1/users/activity/${userid}?${queryParameters.toString()}`
	);

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch token trade list: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};

export type UserInfo = {
	id: number;
	principal: string;
	eth_account: string | null;
	btc_account: string | null;
	avatar: string | null;
	email: string | null;
	name: string;
	role: string;
	invite_code: string;
	createdAt: string;
	updatedAt: string;
};

export const getUserInfo = async (userid: string) => {
	// validate principal
	validatePrincipalText(userid);

	const response = await request<{
		data: UserInfo;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/users/${userid}`);
	if (response.statusCode !== 200) {
		throw new Error(response.message);
	}
	return response.data;
};

export const getLaunchedTokenList = async () => {
	const response = await request<{
		data: PaginatedDataWithData<BtcTokenInfo>;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBtcBaseUrl()}/api/v1/token_info/list?page=1&pageSize=99999&market=BTC&sort=completed&sortDirection=desc`
	);
	if (response.statusCode !== 200) {
		throw new Error(response.message);
	}
	return response.data.data.filter((token) => token.tokenAddress);
};

export type PendingDeposit = {
	id: number;
	pid: string;
	address: string;
	txid: string;
	vout: number;
	value: string;
	confirmed: boolean;
	blockHeight: number;
	blockHash: string;
	blockTime: string;
	createdAt: number;
	updatedAt: number;
	executedAt: null;
	mintedAt: null;
	collectedAt: null;
};
// is have deposit loading
export const getBtcPendingDeposits = async (user_token: string) => {
	const response = await request<{
		data: Array<PendingDeposit>;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/users/btc/pending-deposits`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
	});
	if (response.statusCode !== 200) {
		throw new Error(response.message);
	}
	return response.data;
};
