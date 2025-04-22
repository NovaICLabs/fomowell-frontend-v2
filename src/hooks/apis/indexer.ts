import { useQuery } from "@tanstack/react-query";

import { getTokenList } from "@/apis/indexer";

export const useTokenList = () => {
	return useQuery({
		queryKey: ["tokenList"],
		queryFn: getTokenList,
	});
};
