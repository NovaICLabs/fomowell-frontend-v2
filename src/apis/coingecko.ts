import { request } from ".";

export const getICPPrice = async (): Promise<number> => {
	const response = await request<{
		"internet-computer": { usd: number };
	}>(
		`${import.meta.env.VITE_COINGECKO_API_BASE_URL}/simple/price?ids=internet-computer&vs_currencies=usd`
	);
	return response["internet-computer"].usd;
};
