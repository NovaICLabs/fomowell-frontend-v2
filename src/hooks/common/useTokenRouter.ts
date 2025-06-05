import { useParams } from "@tanstack/react-router";

import { useChainStore } from "@/store/chain";

export const useCurrentChain = () => {
	const { chain } = useChainStore();

	const currentChain = chain === "base" || chain === "icp" ? "icp" : chain;

	return currentChain;
};

export const useTokenChainAndId = () => {
	const chain = useCurrentChain();

	const { id } = useParams({
		from: `/${chain}/token/$id`,
	});

	return {
		chain,
		id,
	};
};
