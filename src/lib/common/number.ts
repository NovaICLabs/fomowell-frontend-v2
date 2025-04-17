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

export const formatNumberSmart = (
	value: BigNumber | string | number,
	shorten: boolean = false
): string => {
	const bn = new BigNumber(value);

	if (bn.isZero()) return "0.000";

	if (shorten) {
		if (bn.abs().isGreaterThanOrEqualTo(1e9)) {
			return `${bn
				.dividedBy(1e9)
				.toFixed(2)
				.replace(/\.?0+$/, "")}B`;
		} else if (bn.abs().isGreaterThanOrEqualTo(1e6)) {
			return `${bn
				.dividedBy(1e6)
				.toFixed(2)
				.replace(/\.?0+$/, "")}M`;
		} else if (bn.abs().isGreaterThanOrEqualTo(1e3)) {
			return `${bn
				.dividedBy(1e3)
				.toFixed(1)
				.replace(/\.?0+$/, "")}K`;
		}
	}
	if (bn.abs().isLessThan(1)) {
		const absString = bn.abs().toFixed();

		if (absString.includes("e")) {
			return bn.toExponential(2);
		}

		const parts = absString.split(".");
		if (parts.length > 1) {
			const decimalPart = parts[1];

			let leadingZeros = 0;
			while (
				leadingZeros < (decimalPart?.length ?? 0) &&
				decimalPart?.[leadingZeros] === "0"
			) {
				leadingZeros++;
			}

			if (leadingZeros >= (decimalPart?.length ?? 0)) {
				return bn.toExponential(2);
			}

			const significantDigits = leadingZeros + 3;
			const formattedDecimal = bn.toFixed(Math.min(significantDigits, 20));

			return formattedDecimal.replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1");
		}
	}

	return bn.toFormat(2).replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1");
};
