import { isPrincipalText } from "@/lib/ic/principal";

const getSIWBCanisterId = () => {
	const value = import.meta.env["VITE_SIWB_CANISTER_ID"];
	if (!value || !isPrincipalText(value)) {
		throw new Error("SIWB_CANISTER_ID is not set or is not a principal");
	}
	return value;
};

export { getSIWBCanisterId };
