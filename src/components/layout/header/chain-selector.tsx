import { useRouter, useSearch } from "@tanstack/react-router";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type ChainType, useChainStore } from "@/store/chain";
const chains: Array<{
	logo: React.ReactNode;
	name: string;
	value: ChainType;
}> = [
	{
		logo: (
			<div className="flex h-6 w-6 items-center justify-center">
				<img alt={"bitcoin-logo"} src={`/svgs/chains/bitcoin.svg`} />
			</div>
		),
		name: "Bitcoin",
		value: "bitcoin",
	},
	{
		logo: (
			<div className="flex h-6 w-6 items-center justify-center">
				<img alt={"icp-logo"} src={`/svgs/chains/icp.svg`} />
			</div>
		),
		name: "ICP",
		value: "icp",
	},
	// {
	// 	logo: (
	// 		<div className="flex h-6 w-6 items-center justify-center">
	// 			<img alt={"base-logo"} src={`/svgs/chains/base.svg`} />
	// 		</div>
	// 	),
	// 	name: "Base",
	// 	value: "base",
	// },
];

export default function ChainSelector() {
	const { chain, setChain } = useChainStore();
	const router = useRouter();
	const search = useSearch({ from: "__root__" });
	return (
		<Select
			value={chain}
			onValueChange={(value: ChainType) => {
				void router.navigate({
					to: "/",
					search: { ...search, chain: value },
				});
				setChain(value);
			}}
		>
			<SelectContent className="bg-gray-750 rounded-2xl border-none px-0.5 py-[3px] sm:px-1 sm:py-[5px]">
				<SelectGroup className="bg-gray-750">
					{chains.map((chain) => (
						<SelectItem
							key={chain.value}
							className="flex h-7 cursor-pointer items-center gap-x-1.5 rounded-[14px] text-sm font-semibold hover:bg-gray-700 data-[state=checked]:bg-gray-700 sm:h-[42px]"
							value={chain.value}
						>
							{chain.logo}
							{chain.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
			<SelectTrigger className="dark:bg-gray-750 !h-7 min-w-22.5 rounded-full border-none px-4 text-sm font-semibold focus-visible:ring-0 sm:!h-[38px] sm:min-w-[126px]">
				<SelectValue placeholder="" />
			</SelectTrigger>
		</Select>
	);
}
