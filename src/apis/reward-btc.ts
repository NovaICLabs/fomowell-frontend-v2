import { request } from ".";

import type { UserInfo } from "./indexer";

const getIndexerBtcBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BTC_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BTC_BASE_URL is not set");
	}
	return indexerBaseUrl;
};

export const getUserRewardStats = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: UserInfo;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/users/reward-stats`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
	});
	console.log("🚀 ~ getUserRewardStats ~ response:", response);

	if (response.statusCode !== 200 || !response.data) {
		throw new Error(
			`Failed to fetch user: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
