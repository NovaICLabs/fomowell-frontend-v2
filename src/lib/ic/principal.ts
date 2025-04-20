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

export const validatePrincipalText = (text: string | undefined): Principal => {
	if (!text) throw new Error("Principal text is undefined");
	try {
		return Principal.fromText(text);
	} catch (error) {
		console.error(error);
		throw new Error("Principal text is not a valid principal");
	}
};

export const truncatePrincipal = (principal: string): string => {
	return principal.slice(0, 6) + "..." + principal.slice(-4);
};

export const validateCanisterIdText = (text: string | undefined): Principal => {
	if (!text) throw new Error("Canister ID text is undefined");
	if (text.length !== 27)
		throw new Error("Canister ID text is not a valid canister ID");
	return validatePrincipalText(text);
};
