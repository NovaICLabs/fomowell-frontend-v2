import { getICPCanisterId } from "@/canisters/icrc3";

import { request } from ".";

const getIndexerBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BASE_URL;
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

interface PaginatedDataWithData<T> extends PaginatedDataBase {
	data: Array<T>;
	items?: never;
}

// type PaginatedData<T> = PaginatedDataWithItems<T> | PaginatedDataWithData<T>;
// =============================== Token List ===============================

export type TokenInfo = {
	id: number;
	memeTokenId: number;
	name: string;
	ticker: string;
	logo: string;
	description: string;
	creator: string;
	timestamp: string;
	market: "ICP";
	tokenAddress: string;
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
	token_reserve: string;
	meme_token_reserve: string;
	market_cap_token: string | null;
	token1Address: string;
	token1Name: string;
	recentTradeTs: string | null;
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
] as const;

export type TokenListSortOption = (typeof tokenListSortOptions)[number];

export type TokenListParameters = {
	page?: number;
	pageSize?: number;
	name?: string;
	ticker?: string;
	market?: string;
	sort?: TokenListSortOption;
	sortDirection?: "asc" | "desc";

	// single token info
	id?: string;
};
export const getTokenList = async (parameters: TokenListParameters) => {
	const {
		page = 1,
		pageSize = 10,
		market = "ICP",
		sort = "recent",
		sortDirection = "desc",
	} = parameters;
	const queryParameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		market,
		sort,
		sortDirection,
	});
	const response = await request<{
		data: PaginatedDataWithData<TokenInfo>;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBaseUrl()}/api/v1/token_info/list?${queryParameters.toString()}`
	);
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
		`${getIndexerBaseUrl()}/api/v1/token_trade/list?${queryParameters.toString()}`
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
	time: number;
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
	start?: number;
	end?: number;
};
export const getTokenPriceCandle = async (parameters: CandleParameters) => {
	const { tokenId, interval, market, start, end } = parameters;
	const intervalPathMap: Record<typeof interval, string> = {
		minute: "minute-candles",
		"5min": "5min-candles",
		"15min": "15min-candles",
		hourly: "hourly-candles",
		daily: "daily-candles",
	};
	const pathSegment = intervalPathMap[interval];

	const queryParameters = new URLSearchParams({
		token0: tokenId,
		token1: getICPCanisterId().toText(),
		market: market ?? "ICP",
	});

	if (start !== undefined) {
		queryParameters.set("start", start.toString());
	}
	if (end !== undefined) {
		queryParameters.set("end", end.toString());
	}

	const url = `${getIndexerBaseUrl()}/api/v1/token_trade/${pathSegment}?${queryParameters.toString()}`;

	const response = await request<CandleApiResponse>(url);

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch token ${interval} candles for ${tokenId}/${market}: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
