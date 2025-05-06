import { useCallback, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

import {
	getChainICCoreCanisterId,
	getUserCreatedMemeTokens,
	getUserTokens,
} from "@/canisters/core";
import { getICPCanisterId } from "@/canisters/icrc3";
import { getICPBalance } from "@/canisters/tokens/icp";
import { useIcIdentityStore } from "@/store/ic";

import { useMultipleCurrentPrice, useMultipleTokenHoldersCount } from "../core";

export const useICPBalance = (principal?: string) => {
	const { principal: self } = useIcIdentityStore();
	const p = principal ?? self;
	return useQuery({
		queryKey: ["balance", getICPCanisterId().toText(), p],
		queryFn: async () => {
			if (!p) throw new Error("Principal is not set");
			return getICPBalance(p);
		},
		enabled: !!p,
		refetchInterval: 15_000,
	});
};

export const useUserHoldingTokens = (id: string) => {
	return useQuery({
		queryKey: ["holdings", id],
		queryFn: async () => {
			if (!id) throw new Error("Principal is not set");
			return getUserTokens(getChainICCoreCanisterId().toText(), {
				owner: id,
			});
		},
	});
};

export const useUserCreatedTokens = () => {
	const { principal: self } = useIcIdentityStore();
	return useQuery({
		queryKey: ["created", self],
		queryFn: async () => {
			if (!self) throw new Error("Principal is not set");
			return getUserCreatedMemeTokens(getChainICCoreCanisterId().toText(), {
				owner: self,
			});
		},
	});
};

export const useUserTokenHoldersList = (id: string) => {
	const { data, isFetching, refetch } = useUserHoldingTokens(id);
	const {
		data: allPrices,
		isFetching: isPriceFetching,
		refetch: priceRefetch,
	} = useMultipleCurrentPrice({ ids: data ? data?.map((row) => row.id) : [] });
	const {
		data: allHolders,
		isFetching: isHolderFetching,
		refetch: holderRefetch,
	} = useMultipleTokenHoldersCount({
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

export const useUserCreatedTokenList = () => {
	const { data, isFetching, refetch } = useUserCreatedTokens();
	const {
		data: allPrices,
		isFetching: isPriceFetching,
		refetch: priceRefetch,
	} = useMultipleCurrentPrice({ ids: data ? data?.map((row) => row.id) : [] });
	const {
		data: allHolders,
		isFetching: isHolderFetching,
		refetch: holderRefetch,
	} = useMultipleTokenHoldersCount({
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
