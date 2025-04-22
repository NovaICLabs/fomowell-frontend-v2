import { request } from ".";

const getIndexerBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BASE_URL is not set");
	}
	return indexerBaseUrl;
};
interface PaginatedData<T> {
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
	items: Array<T>;
}
// =============================== Token List ===============================

export type tokenInfo = {
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
	createdAt: unknown;
	updatedAt: unknown;
};

export const getTokenList = async () => {
	const response = await request<{
		data: PaginatedData<tokenInfo>;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/token_info/list`);
	if (response.statusCode !== 200) {
		throw new Error(response.message);
	}
	return response.data;
};
