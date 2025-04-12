export function formatBytes(
	bytes: number,
	options: {
		decimals?: number;
		sizeType?: "accurate" | "normal";
	} = {}
) {
	const { decimals = 0, sizeType = "normal" } = options;

	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
	if (bytes === 0) return "0 Byte";
	const index = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, index)).toFixed(decimals)} ${
		sizeType === "accurate"
			? (accurateSizes[index] ?? "Bytes")
			: (sizes[index] ?? "Bytes")
	}`;
}
