import { useRouter, useSearch } from "@tanstack/react-router";

import BaseLogo from "@/components/icons/logo/base";
import BitcoinLogo from "@/components/icons/logo/bitcoin";
import ICPLogo from "@/components/icons/logo/icp";
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
	logo: React.ComponentType<{ className?: string }>;
	name: string;
	value: ChainType;
}> = [
	{
		logo: BitcoinLogo,
		name: "Bitcoin",
		value: "bitcoin",
	},
	{
		logo: ICPLogo,
		name: "ICP",
		value: "icp",
	},
	{
		logo: BaseLogo,
		name: "Base",
		value: "base",
	},
];

export default function ChainSelector() {
	const { chain, setChain } = useChainStore();
	const router = useRouter();
	const { ...search } = useSearch({ from: "__root__" });
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
			<SelectContent className="bg-gray-750 rounded-2xl border-none px-1 py-[5px]">
				<SelectGroup className="bg-gray-750">
					{chains.map((chain) => (
						<SelectItem
							key={chain.value}
							className="flex h-[42px] cursor-pointer items-center gap-x-1.5 rounded-[14px] text-sm font-semibold hover:bg-gray-700 data-[state=checked]:bg-gray-700"
							value={chain.value}
						>
							<chain.logo />
							{chain.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
			<SelectTrigger className="dark:bg-gray-750 h-[38px] min-w-[126px] rounded-full border-none px-4 text-sm font-semibold focus-visible:ring-0">
				<SelectValue placeholder="" />
			</SelectTrigger>
		</Select>
	);
}
