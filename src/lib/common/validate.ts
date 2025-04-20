import { getInputRegex } from "./regex";

export const validateInputNumber = (args: {
	value: string;
	decimals?: number;
	callback?: (value: string) => void;
}) => {
	const { value, decimals = 8, callback } = args;
	const regex = getInputRegex(decimals);
	if (value === "" || value === "0" || value === "." || regex.test(value)) {
		callback?.(value);
	}
};

export const slippageRange = [0, 50] as const;
