import { request } from ".";

import type { RewardStats } from "./reward-btc";

const getIndexerBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BASE_URL is not set");
	}
	return indexerBaseUrl;
};

export const getIcUserRewardStats = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: RewardStats;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/users/reward-stats`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
	});

	if (response.statusCode !== 200 || !response.data) {
		throw new Error(
			`Failed to fetch user: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
