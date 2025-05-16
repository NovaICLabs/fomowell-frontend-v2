import { validatePrincipalText } from "../ic/principal";

export const icpexWebsite = import.meta.env.VITE_ICPEX_SWAP;

export const getSwapUrlByCanisterId = ({
	input,
	output,
}: {
	input: string;
	output: string;
}) => {
	const inputPrincipal = validatePrincipalText(input);
	const outputPrincipal = validatePrincipalText(output);
	return `${icpexWebsite}/?input=${inputPrincipal.toText()}&output=${outputPrincipal.toText()}`;
};
