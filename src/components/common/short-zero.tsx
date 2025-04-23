import BigNumber from "bignumber.js";

import { formatNumberSmart } from "@/lib/common/number";

/**
 * Counts the number of leading zeros immediately following the decimal point in a number string.
 * Assumes the input string represents a number between 0 and 1.
 * @param {string} numStr The string representation of the number (e.g., from toFixed()).
 * @returns {number} The count of leading zeros after the decimal.
 */
function countLeadingDecimalZeros(numberString: string): number {
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

const MIN_ZEROS_FOR_SPECIAL_FORMAT = 3;

const SIGNIFICANT_DIGITS_TO_SHOW = 3;

export default function FormattedSmallNumber({
	number,
	className,
}: {
	number: BigNumber | string | number;
	className?: string;
}) {
	const bn = BigNumber(number);
	let formatted: string;

	const isNegative = bn.isNegative();
	const absBn = bn.abs();

	if (!isNegative && absBn.gt(0) && absBn.lt(1)) {
		const numberString = absBn.toFixed(
			MIN_ZEROS_FOR_SPECIAL_FORMAT + SIGNIFICANT_DIGITS_TO_SHOW + 5
		);
		const zeroCount = countLeadingDecimalZeros(numberString);

		if (zeroCount >= MIN_ZEROS_FOR_SPECIAL_FORMAT) {
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
			formatted = `0.0{${zeroCount}}${truncatedSignificantDigits}`;
			return (
				<div className={`${className} flex items-center`}>
					<span>0.0</span>
					<span className="mt-2 text-xs">{zeroCount}</span>
					<span>{truncatedSignificantDigits}</span>
				</div>
			);
		} else {
			formatted = formatNumberSmart(bn.toString());
		}
	} else {
		// Use standard formatting for negatives, >=1, 0, or numbers without enough leading zeros
		formatted = formatNumberSmart(bn.toString());
	}

	return <span className={className}>{formatted}</span>;
}
