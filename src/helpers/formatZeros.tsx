import type { JSX } from 'react';

// Problem:
// Prices with many fractional digits (e.g., 12 decimal places) do not fit well on mobile screens,
// causing layout issues.
//
// Solution:
// Instead of displaying all the trailing zeros after the decimal point, we show the count of these zeros
// as a small subscript number. This keeps the price compact and readable.
//
// Example:
// Input: "0.0000000123"
// Output: 0.0₆123  (where the subscript "6" indicates six zeros)

function formatZeros(num: string | number, maxDecimals = 3): JSX.Element {
	const numStr = typeof num === 'number' ? num.toString() : num;
	// Split the number into integer and decimal parts using the decimal point
	const parts = numStr.split('.');

	// If there is no decimal part, return the number as is (no formatting needed)
	if (parts.length < 2) {
		return <>{numStr}</>;
	}

	const decimalPart = parts[1];
	let zeroCount = 0;

	// Count how many zeros appear consecutively at the start of the decimal part
	for (const char of decimalPart) {
		if (char === '0') zeroCount++;
		else break;
	}

	// If the entire decimal part is zeros, display just a single "0"
	if (zeroCount === decimalPart.length) {
		return <>0</>;
	}

	// If there are no leading zeros after the decimal, return the original number string
	if (zeroCount === 0) {
		return <>{numStr}</>;
	}

	// Slice the decimal part to exclude the leading zeros that we counted
	const rest = decimalPart.slice(zeroCount);

	// Render the formatted number:
	// - "0." followed by a zero,
	// - then a subscript showing how many zeros we compressed,
	// - followed by the remaining decimal digits after those zeros.
	return (
		<>
			0.0<sub className="text-[50%]">{zeroCount}</sub>
			{rest.slice(0, maxDecimals)}
		</>
	);
}

export default formatZeros;
