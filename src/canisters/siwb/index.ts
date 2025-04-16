import { validatePrincipalText } from "@/lib/ic/principal";

const getSIWBCanisterId = () => {
	const value = import.meta.env["VITE_SIWB_CANISTER_ID"];
	return validatePrincipalText(value).toString();
};

export { getSIWBCanisterId };
