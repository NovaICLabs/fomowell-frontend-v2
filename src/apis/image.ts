import { request } from ".";
const IMG_UPLOADER_URL = import.meta.env.VITE_IMG_UPLOADER_URL;
export const uploadImage = async (image: File) => {
	const formData = new FormData();
	formData.append("image", image);
	const response = await request<{
		success: true;
		filename: string;
	}>(IMG_UPLOADER_URL, {
		method: "PUT",
		body: formData,
	});
	if (!response.success) {
		throw new Error("Failed to upload image");
	}
	return `${IMG_UPLOADER_URL}/${response.filename}`;
};
