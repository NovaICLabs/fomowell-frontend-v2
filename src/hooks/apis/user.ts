import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/apis/indexer";
import { getBtcUserInfo } from "@/apis/indexer_btc";

export const useUserInfo = (userid: string) => {
	return useQuery({
		queryKey: ["icp", "userInfo", userid],
		queryFn: () => getUserInfo(userid),
	});
};

export const useBtcUserInfo = (userid: string) => {
	return useQuery({
		queryKey: ["bitcoin", "userInfo", userid],
		queryFn: () => getBtcUserInfo(userid),
	});
};
