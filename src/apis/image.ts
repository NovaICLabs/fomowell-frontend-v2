import { request } from ".";
// const IMG_UPLOADER_URL = import.meta.env.VITE_IMG_UPLOADER_URL;

const NEW_IMG_UPLOADER_URL = "https://image-uploader.fomowell.com";
export const uploadImage = async (image: File) => {
	const formData = new FormData();
	formData.append("image", image);
	const response = await request<{
		success: true;
		filename: string;
	}>(NEW_IMG_UPLOADER_URL, {
		method: "PUT",
		body: formData,
	});
	if (!response.success) {
		throw new Error("Failed to upload image");
	}
	return `${NEW_IMG_UPLOADER_URL}/${response.filename}`;
};
