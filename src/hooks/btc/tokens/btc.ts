import { useCallback, useMemo } from "react";

import { useLaserEyes } from "@omnisat/lasereyes";
import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";

import { getBtcBalanceByAddress } from "@/apis/coingecko";
import {
	getChainBTCCoreCanisterId,
	getUserCreatedMemeTokens,
	getUserTokens,
	withdrawBtc,
	type WithdrawBtcArgs,
} from "@/canisters/btc_core";
import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { useBtcIdentityStore } from "@/store/btc";

import {
	useBtcMultipleCurrentPrice,
	useBtcMultipleTokenHoldersCount,
} from "../core";

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
				const balance = await getBtcBalanceByAddress(btcAddress);
				// console.log("🚀 ~ queryFn: ~ result:", balanceInSatoshis);

				// Use LaserEyes to get the balance if it provides such functionality
				// const balanceInSatoshis = await laserEyes.getBalance();
				const balanceInBtc = BigNumber(balance)
					.dividedBy(10 ** getCkbtcCanisterToken().decimals)
					.toString();

				// console.debug("🚀 ~ queryFn: ~ balanceInBtc:", balanceInBtc);

				return {
					raw: balance,
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
		mutationKey: ["btc-core", "withdraw"],
		mutationFn: async (args: WithdrawBtcArgs) => {
			if (!identity) {
				return new Error("No identity found");
			}

			return withdrawBtc(
				identity as Identity,
				getChainBTCCoreCanisterId().toText(),
				args
			);
		},
	});
};

export const useBtcUserHoldingTokens = (id: string) => {
	return useQuery({
		queryKey: ["btc_holdings", id],
		queryFn: async () => {
			if (!id) throw new Error("Principal is not set");
			return getUserTokens(getChainBTCCoreCanisterId().toText(), {
				owner: id,
			});
		},
	});
};

export const useBtcUserCreatedTokens = (userid: string) => {
	return useQuery({
		queryKey: ["btc_created", userid],
		queryFn: async () => {
			if (!userid) throw new Error("Principal is not set");
			return getUserCreatedMemeTokens(getChainBTCCoreCanisterId().toText(), {
				owner: userid,
			});
		},
	});
};

export const useBtcUserTokenHoldersList = (id: string) => {
	const { data, isFetching, refetch } = useBtcUserHoldingTokens(id);
	const {
		data: allPrices,
		isFetching: isPriceFetching,
		refetch: priceRefetch,
	} = useBtcMultipleCurrentPrice({
		ids: data ? data?.map((row) => row.id) : [],
	});
	const {
		data: allHolders,
		isFetching: isHolderFetching,
		refetch: holderRefetch,
	} = useBtcMultipleTokenHoldersCount({
		ids: data ? data?.map((row) => row.id) : [],
	});

	const items = useMemo(() => {
		return (data ?? []).map((row) => {
			const price = allPrices?.find((p) => p.id === row.id);
			const holders = allHolders?.find((h) => h.id === row.id);
			return {
				...row,
				balance: BigNumber(row.balance)
					.dividedBy(BigNumber(10).pow(row.decimals))
					.toString(),
				price: price?.formattedPerPayToken,
				holders: holders?.total,
			};
		});
	}, [allHolders, allPrices, data]);

	const reload = useCallback(async () => {
		await Promise.all([refetch(), priceRefetch(), holderRefetch()]);
	}, [refetch, priceRefetch, holderRefetch]);

	const isLoading = useMemo(() => {
		return isFetching && isPriceFetching && isHolderFetching;
	}, [isFetching, isPriceFetching, isHolderFetching]);

	return {
		isFetching: isLoading,
		refetch: reload,
		data: items,
	};
};

export const useBtcUserCreatedTokenList = (userid: string) => {
	const { data, isFetching, refetch } = useBtcUserCreatedTokens(userid);
	const {
		data: allPrices,
		isFetching: isPriceFetching,
		refetch: priceRefetch,
	} = useBtcMultipleCurrentPrice({
		ids: data ? data?.map((row) => row.id) : [],
	});
	const {
		data: allHolders,
		isFetching: isHolderFetching,
		refetch: holderRefetch,
	} = useBtcMultipleTokenHoldersCount({
		ids: data ? data?.map((row) => row.id) : [],
	});

	const items = useMemo(() => {
		return (data ?? []).map((row) => {
			const price = allPrices?.find((p) => p.id === row.id);
			const holders = allHolders?.find((h) => h.id === row.id);
			return {
				...row,
				price: price?.formattedPerPayToken,
				holders: holders?.total,
			};
		});
	}, [allHolders, allPrices, data]);

	const reload = useCallback(async () => {
		await Promise.all([refetch(), priceRefetch(), holderRefetch()]);
	}, [refetch, priceRefetch, holderRefetch]);

	const isLoading = useMemo(() => {
		return isFetching && isPriceFetching && isHolderFetching;
	}, [isFetching, isPriceFetching, isHolderFetching]);

	return {
		isFetching: isLoading,
		refetch: reload,
		data: items,
	};
};
