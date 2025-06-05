import { validatePrincipalText } from "@/lib/ic/principal";

export const getRuneCanisterId = () => {
	const value = import.meta.env["VITE_RUNE_WALLET_CANISTER_ID"];
	return validatePrincipalText(value).toString();
};
