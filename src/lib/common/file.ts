import superjson from "superjson";

async function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = (error) => {
			reject(new Error(superjson.stringify(error) || "File read error"));
		};
	});
}

export { fileToBase64 };
