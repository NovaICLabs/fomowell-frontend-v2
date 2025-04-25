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
	return valueAsBN.times(multiplier).toFixed();
}
// min zeros for special format
const MIN_ZEROS_FOR_SPECIAL_FORMAT = 3;
// significant digits to show
const SIGNIFICANT_DIGITS_TO_SHOW = 3;
const subscriptDigits = [
	"₀",
	"₁",
	"₂",
	"₃",
	"₄",
	"₅",
	"₆",
	"₇",
	"₈",
	"₉",
	"₁₀",
	"₁₁",
	"₁₂",
	"₁₃",
	"₁₄",
	"₁₅",
	"₁₆",
	"₁₇",
	"₁₈",
	"₁₉",
	"₂₀",
];

export function countLeadingDecimalZeros(numberString: string): number {
	const decimalPointIndex = numberString.indexOf(".");
	if (decimalPointIndex === -1) {
		return 0;
	}
	let zeroCount = 0;
	// Start checking right after the decimal point
	for (
		let index = decimalPointIndex + 1;
		index < numberString.length;
		index++
	) {
		if (numberString[index] === "0") {
			zeroCount++;
		} else {
			// Found the first non-zero digit, stop counting
			break;
		}
	}
	return zeroCount;
}
export const formatNumberSmart = (
	value: BigNumber | string | number,
	options: {
		shortenLarge?: boolean;
		shortZero?: boolean;
	} = {
		shortenLarge: false,
		shortZero: false,
	}
): string => {
	const bn = new BigNumber(value);
	if (bn.isZero()) return "0.000";
	if (options.shortenLarge) {
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
	const absBn = bn.abs();
	if (absBn.isLessThan(1)) {
		const numberString = absBn.toFixed(
			MIN_ZEROS_FOR_SPECIAL_FORMAT + SIGNIFICANT_DIGITS_TO_SHOW + 5
		);
		const zeroCount = countLeadingDecimalZeros(numberString);
		// if shortZero is true and the number of leading zeros is greater than or equal to MIN_ZEROS_FOR_SPECIAL_FORMAT, format the number as a short zero
		if (options.shortZero && zeroCount >= MIN_ZEROS_FOR_SPECIAL_FORMAT) {
			const decimalPointIndex = numberString.indexOf(".");
			const firstNonZeroIndex = decimalPointIndex + 1 + zeroCount;
			// Extract significant digits, remove trailing zeros added by toFixed if necessary
			const significantDigits = numberString
				.substring(firstNonZeroIndex)
				.replace(/0+$/, ""); // Remove trailing zeros from toFixed padding

			const truncatedSignificantDigits = significantDigits.substring(
				0,
				SIGNIFICANT_DIGITS_TO_SHOW
			);
			return `0.0${subscriptDigits[zeroCount]}${truncatedSignificantDigits}`;
		}

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

export const getTokenUsdValueTotal = (
	token: { amount: bigint; decimals?: number },
	price: number
) => {
	return formatNumberSmart(
		new BigNumber(token.amount)
			.div(new BigNumber(10).pow(token.decimals ?? 8))
			.times(price),
		{
			shortenLarge: true,
		}
	);
};

export const isNullOrUndefined = (value: number | undefined | null) => {
	return value === undefined || value === null;
};
