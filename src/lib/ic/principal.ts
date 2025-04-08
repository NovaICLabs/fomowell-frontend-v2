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
