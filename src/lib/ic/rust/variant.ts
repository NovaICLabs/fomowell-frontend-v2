export const unwrapVariantKey = <T extends string>(
	v: Record<string, unknown>
): T => {
	const keys = Object.keys(v);
	if (keys.length === 0) throw new Error("variant must has a key");
	return keys[0] as T;
};
