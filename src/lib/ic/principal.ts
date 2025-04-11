import { Principal } from "@dfinity/principal";

export const isPrincipalText = (text: string | undefined): boolean => {
	if (!text) return false;
	try {
		Principal.fromText(text);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const truncatePrincipal = (principal: string): string => {
	return principal.slice(0, 6) + "..." + principal.slice(-4);
};
