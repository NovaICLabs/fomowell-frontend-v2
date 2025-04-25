import { request } from ".";

const getIndexerBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BASE_URL is not set");
	}
	return indexerBaseUrl;
};

// login api
export type LoginParameters = {
	principal: string;
	random: string;
};
export const loginOrRegisterByPrincipal = async (
	parameters: LoginParameters
): Promise<string> => {
	const { principal, random } = parameters;

	const response = await request<{
		data: { access_token: string };
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			principal: principal,
			random: random,
		}),
	});

	if (
		response.statusCode !== 201 ||
		!response.data ||
		!response.data.access_token
	) {
		throw new Error(response.message);
	}
	return response.data.access_token;
};

// refresh token
export const refreshToken = async (token: string) => {
	const response = await request<{
		data: { access_token: string };
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/auth/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
	});
	if (
		response.statusCode !== 201 ||
		!response.data ||
		!response.data.access_token
	) {
		throw new Error(response.message);
	}
	return response.data.access_token;
};

// check login
export const checkLogin = async (token: string): Promise<boolean> => {
	if (!token) {
		return false;
	}
	const response = await request<{
		data: unknown;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/auth/verfiy?token=${token}`);

	if (response.statusCode !== 200) {
		return false;
	}
	return true;
};

// ================= user ====================
export type CreateUser = {
	principal: string;
	eth_account?: string;
	btc_account?: string;
	avatar?: string;
	email?: string;
	name?: string;
};
export const createNewUser = async () => {
	const response = await request<{
		data: string;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/users/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			principal: "aaaaa-aa",
			eth_account: "string",
			btc_account: "string",
			avatar: "string",
			email: "user@example.com",
			name: "John",
		}),
	});
	if (response.statusCode === 409) {
		throw new Error("User already exists");
	}
	if (response.statusCode !== 201 || !response.data) {
		throw new Error(
			`Failed to create new User: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};

export type UserInfo = {
	id: number;
	name: string;
	email?: string;
	avatar: string;
	description: string;
	principal: string;
	created_at: string;
	updated_at: string;
};
export const getUserInfoByToken = async (user_token: string) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: UserInfo;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/users/user`, {
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

// update user info
export const updateUserInfo = async (
	user_token: string,
	userInfo: Partial<UserInfo>
) => {
	if (!user_token) {
		return undefined;
	}
	const parameters: Partial<UserInfo> = { name: userInfo.name };
	if (userInfo.avatar) parameters.avatar = userInfo.avatar;

	const response = await request<{
		data: string;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/users/update`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
		body: JSON.stringify(parameters),
	});

	if (response.statusCode !== 201 || !response.data) {
		throw new Error(
			`Failed to update user info: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
