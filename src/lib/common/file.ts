async function fileToNumberArray(file: File): Promise<Array<number>> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);
		const numberArray = Array.from(uint8Array);
		return numberArray;
	} catch (error) {
		console.error("Error converting file to number[]:", error);
		throw error;
	}
}

export { fileToNumberArray };
