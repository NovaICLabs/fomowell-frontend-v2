import { useMemo } from "react";

const NETWORK_FEE = 0.00002;
const FEE = 0.0000001;

// todo get btc deposit FEE and minter FEE
export type BtcFeeType = {
	row: bigint;
	formatted: number;
};
export const useBtcFees = () => {
	const fees: BtcFeeType = useMemo(() => {
		// todo get btc deposit FEE and minter FEE
		return {
			row: BigInt((NETWORK_FEE + FEE) * 1e8),
			formatted: NETWORK_FEE + FEE,
		};
	}, []);

	return fees;
};
