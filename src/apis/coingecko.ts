import { request } from ".";

export const getICPPrice = async (): Promise<number> => {
	const response = await request<{
		"internet-computer": { usd: number };
	}>(
		`${import.meta.env.VITE_COINGECKO_API_BASE_URL}/simple/price?ids=internet-computer&vs_currencies=usd`
	);
	return response["internet-computer"].usd;
};

export const getCkBtcPrice = async (): Promise<number> => {
	const response = await request<{
		"chain-key-bitcoin": { usd: number };
	}>(
		`${import.meta.env.VITE_COINGECKO_API_BASE_URL}/simple/price?ids=chain-key-bitcoin&vs_currencies=usd`
	);
	return response["chain-key-bitcoin"].usd;
};

export const getBtcPrice = async (): Promise<number> => {
	const response = await request<{
		bitcoin: { usd: number };
	}>(
		`${import.meta.env.VITE_COINGECKO_API_BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd`
	);
	return response["bitcoin"].usd;
};

export const getSatsPrice = async (): Promise<number> => {
	const response = await request<{
		"sats-ordinals": { usd: number };
	}>(
		`${import.meta.env.VITE_COINGECKO_API_BASE_URL}/simple/price?ids=sats-ordinals&vs_currencies=usd`
	);
	return response["sats-ordinals"].usd;
};
