import BigNumber from "bignumber.js";

export function formatUnits(
	value: string | number | BigNumber | bigint,
	decimals: number = 8
): string {
	const valueAsBN = new BigNumber(value);
	const divisor = new BigNumber(10).pow(decimals);
	return valueAsBN.div(divisor).toString();
}

export function parseUnits(
	value: string | number | BigNumber,
	decimals: number = 8
): string {
	const valueAsBN = new BigNumber(value);
	const multiplier = new BigNumber(10).pow(decimals);
	return valueAsBN.times(multiplier).toFixed(0);
}
