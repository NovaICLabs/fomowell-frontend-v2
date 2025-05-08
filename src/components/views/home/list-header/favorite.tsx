import { useRouter, useSearch } from "@tanstack/react-router";

import { Star } from "@/components/icons/star";
import { cn } from "@/lib/utils";

export default function FavoriteTab() {
	const { tab } = useSearch({
		from: "/",
	});
	const router = useRouter();
	return (
		<div
			className={cn(
				"bg-gray-750 cursor-pointer rounded-full px-4 py-2 text-white/60",
				tab === "favorite" && "bg-white"
			)}
			onClick={() => {
				void router.navigate({
					to: "/",
					search: (previous) => ({
						...previous,
						sort: undefined,
						direction: undefined,
						tab: "favorite",
					}),
				});
			}}
		>
			<Star isActive={tab === "favorite"} />
		</div>
	);
}
