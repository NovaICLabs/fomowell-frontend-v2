import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/apis/indexer";

export const useUserInfo = (userid: string) => {
	return useQuery({
		queryKey: ["userInfo", userid],
		queryFn: () => getUserInfo(userid),
	});
};
