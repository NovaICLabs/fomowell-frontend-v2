import { request } from ".";

const getIndexerBtcBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BTC_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BTC_BASE_URL is not set");
	}
	return indexerBaseUrl;
};

export type RewardStats = {
	level1Count: number;
	level2Count: number;
	reward: {
		total: string;
		available: string;
		withdrawn: string;
		updatedAt: string;
	};
};

export type RewardLeaderboard = {
	rank: number;
	user: {
		id: number;
		principal: string;
		name: string;
		avatar: string;
	};
	totalRewards: string;
	availableRewards: string;
	level1Count: number;
	level2Count: number;
};

export const getBtcUserRewardStats = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: RewardStats;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/users/reward-stats`, {
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

export const getBtcUserRewardLeaderboard = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: Array<RewardLeaderboard>;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/users/reward-leaderboard`, {
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

export const getBtcUserRewardWithdraw = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: RewardStats;
		statusCode: number;
		message: string;
	}>(`${getIndexerBtcBaseUrl()}/api/v1/users/reward-withdraw`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
	});

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch user: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
