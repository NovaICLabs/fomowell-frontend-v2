import { useLaserEyes } from "@omnisat/lasereyes";
import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";

// import { btcWithdraw, type WithdrawArgs } from "@/canisters/rune";
import {
	getChainICCoreCanisterId,
	withdrawBtc,
	type WithdrawBtcArgs,
} from "@/canisters/core";
import { useBtcIdentityStore } from "@/store/btc";

import type { Identity } from "@dfinity/agent";

export const useBtcBalance = () => {
	const laserEyes = useLaserEyes();
	// const { getAddress } = useSiwbIdentity();
	const { principal } = useBtcIdentityStore();
	const btcAddress = laserEyes.address;

	return useQuery({
		queryKey: ["btc-balance", btcAddress, principal],
		queryFn: async () => {
			if (!btcAddress || !laserEyes)
				throw new Error("No BTC address connected");

			try {
				// Use LaserEyes to get the balance if it provides such functionality
				const balanceInSatoshis = await laserEyes.getBalance();
				const balanceInBtc = BigNumber(balanceInSatoshis)
					.dividedBy(100000000)
					.toString();

				console.debug("🚀 ~ queryFn: ~ balanceInBtc:", balanceInBtc);

				return {
					raw: balanceInSatoshis,
					formatted: balanceInBtc,
					decimals: 8,
				};
			} catch (error) {
				console.error("Failed to fetch BTC balance:", error);
				throw error;
			}
		},
		enabled: !!laserEyes,
		refetchInterval: 3 * 1000,
	});
};

export type DepositArgs = {
	btcAddress: string;
	amount: number | string;
};

export const useBtcDeposit = () => {
	const { sendBTC } = useLaserEyes();

	return useMutation({
		mutationKey: ["btc-core", "deposit"],
		mutationFn: async (args: DepositArgs) => {
			if (!args.amount) {
				throw new Error("No deposit amount found");
			}
			return sendBTC(args.btcAddress, Number(args.amount));
		},
	});
};

export const useBtcWithdraw = () => {
	const { identity } = useSiwbIdentity();

	return useMutation({
		mutationKey: ["ic-core", "withdraw"],
		mutationFn: async (args: WithdrawBtcArgs) => {
			if (!identity) {
				return new Error("No identity found");
			}

			return withdrawBtc(
				identity as Identity,
				getChainICCoreCanisterId().toText(),
				args
			);
		},
	});
};
