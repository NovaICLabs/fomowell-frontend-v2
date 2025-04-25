import { request } from ".";

const getIndexerBaseUrl = () => {
	const indexerBaseUrl = import.meta.env.VITE_INDEXER_BASE_URL;
	if (!indexerBaseUrl) {
		throw new Error("VITE_INDEXER_BASE_URL is not set");
	}
	return indexerBaseUrl;
};

// ================== comment ==================
export type CommentInfo = {
	id: number;
	user_id: number;
	tokenId: number;
	meme_token_id: string;
	photo: string | undefined;
	content: string;
	created_at: string;
	updated_at: string;
};
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
		data: {
			list: Array<CommentInfo>;
			total: number;
		};
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
			tokenId: commentInfo.tokenId,
			photo: commentInfo.photo,
			content: commentInfo.content,
		}),
	});

	if (response.statusCode !== 200) {
		throw new Error(
			`Failed to create token comment : ${response.message} (Status: ${response.statusCode})`
		);
	}
	return response.data;
};
