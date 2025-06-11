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

export type MyWithdrawalsItem = {
	id: number;
	userId: number;
	amount: string;
	status: "pending" | "completed" | "failed";
	createdAt: string;
};
export type MyWithdrawals = {
	total: number;
	page: number;
	pageSize: number;
	withdrawals: Array<MyWithdrawalsItem>;
};

export type MyInviteesItem = {
	principal: string;
	createdAt: string;
	level: number;
	total_fee: string;
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

export const getBtcUserRewardMyWithdraw = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const queryParameters = new URLSearchParams({
		page: "1",
		pageSize: "9999",
	});

	const response = await request<{
		data: MyWithdrawals;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBtcBaseUrl()}/api/v1/users/reward-my-withdrawals?${queryParameters.toString()}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${user_token}`,
			},
		}
	);

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch user: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};

export const getBtcUserRewardMyInvitees = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const queryParameters = new URLSearchParams({
		page: "1",
		pageSize: "9999",
	});

	const response = await request<{
		data: Array<MyInviteesItem>;
		statusCode: number;
		message: string;
	}>(
		`${getIndexerBtcBaseUrl()}/api/v1/users/reward-my-invitees?${queryParameters.toString()}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${user_token}`,
			},
		}
	);

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch user: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
