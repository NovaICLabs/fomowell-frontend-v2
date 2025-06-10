import { useQuery } from "@tanstack/react-query";

import { getBtcPrice, getCkBtcPrice, getICPPrice } from "@/apis/coingecko";

export const useICPPrice = () => {
	return useQuery({
		queryKey: ["icp-price"],
		queryFn: getICPPrice,
		refetchInterval: 10000 * 60 * 5,
		staleTime: Infinity,
	});
};

export const useCKBTCPrice = () => {
	return useQuery({
		queryKey: ["ckbtc-price"],
		queryFn: getCkBtcPrice,
		refetchInterval: 10000 * 60 * 5,
		staleTime: Infinity,
	});
};

export const useBTCPrice = () => {
	return useQuery({
		queryKey: ["btc-price"],
		queryFn: getBtcPrice,
		refetchInterval: 10000 * 60 * 5,
		staleTime: Infinity,
	});
};
