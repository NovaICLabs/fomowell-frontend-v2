import { request } from ".";

const getIndexerBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BASE_URL is not set");
	}
	return indexerBaseUrl;
};

// ================== comment ==================
export type CommentUser = {
	avatar: string | undefined;
	btc_account?: string | null;
	email?: string | null;
	eth_account?: string | null;
	name?: string | null;
};
export type CommentInfo = {
	id: number;
	principal: string;
	tokenId?: number;
	memeTokenId: number;
	photo: string | undefined;
	content: string;
	user?: CommentUser;
	createdAt: string;
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

export const getCommentList = async ({
	page = 1,
	pageSize = 10,
	meme_token_id,
}: {
	page: number;
	pageSize?: number;
	meme_token_id: string;
}) => {
	const queryParameters = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		meme_token_id: meme_token_id.toString(),
	});

	const response = await request<{
		data: PaginatedDataWithData<CommentInfo>;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/comment?${queryParameters.toString()}`, {
		method: "GET",
	});

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to fetch token comment list: ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};

export const createComment = async (
	user_token: string,
	commentInfo: Partial<CommentInfo>
) => {
	if (!user_token) {
		return undefined;
	}
	const response = await request<{
		data: string;
		statusCode: number;
		message: string;
	}>(`${getIndexerBaseUrl()}/api/v1/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${user_token}`,
		},
		body: JSON.stringify({
			meme_token_id: commentInfo.tokenId,
			photo: commentInfo.photo,
			content: commentInfo.content,
		}),
	});

	if (response.statusCode !== 201) {
		throw new Error(
			`Failed to create token comment : ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
