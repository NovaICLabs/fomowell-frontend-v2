import { useQuery } from "@tanstack/react-query";

import { getICPPrice } from "@/apis/coingecko";

export const useICPPrice = () => {
	return useQuery({
		queryKey: ["icp-price"],
		queryFn: getICPPrice,
		refetchInterval: 10000 * 60 * 5,
		staleTime: Infinity,
	});
};
