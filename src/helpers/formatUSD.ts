export default function formatUSD(amount: number, fractionDigits = 2) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	}).format(amount);
}
