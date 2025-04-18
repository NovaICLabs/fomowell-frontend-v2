export const getInputRegex = (decimals: number) => {
	return new RegExp(`^(0|[1-9]\\d*)(\\.\\d{0,${decimals}})?$`);
};
