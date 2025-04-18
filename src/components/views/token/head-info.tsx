import { useParams } from "@tanstack/react-router";
import { Link } from "lucide-react";

import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";
import Star from "@/components/icons/star";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentPrice, useMemeTokenInfo } from "@/hooks/ic/core";
import { truncatePrincipal } from "@/lib/ic/principal";

export default function HeadInfo() {
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data: memeToken, isLoading: isLoadingMemeToken } = useMemeTokenInfo(
		Number(id)
	);
	const { data: currentPrice, isLoading: isLoadingCurrentPrice } =
		useCurrentPrice({ id: Number(id) });
	return (
		<div className="text-white">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Star className="h-5 w-5" />
					<div className="relative ml-2 h-10 w-10 overflow-hidden rounded-full">
						{isLoadingMemeToken ? (
							<Skeleton className="h-full w-full" />
						) : (
							<img
								alt="logo"
								className="h-full w-full object-cover"
								src={memeToken?.logo}
							/>
						)}
					</div>
					<div className="ml-2.5 flex flex-col gap-1">
						<div>
							{isLoadingMemeToken ? (
								<div className="flex h-[27px] items-center gap-2">
									<Skeleton className="h-[21.5px] w-24" />
								</div>
							) : (
								<>
									<span className="text-center text-lg leading-normal font-bold text-white">
										{memeToken?.ticker}
									</span>{" "}
									<span className="text-xs font-normal text-white/40">
										{memeToken?.description}
									</span>
								</>
							)}
						</div>
						<div className="flex">
							<div className="flex items-center text-xs whitespace-break-spaces text-white/40">
								<span>Created by: </span>
								{isLoadingMemeToken ? (
									<Skeleton className="inline h-4 w-24" />
								) : (
									<span>{truncatePrincipal(memeToken?.creator ?? "")}</span>
								)}
							</div>
							<div className="ml-2.5 flex items-center gap-2 text-sm text-gray-400">
								{memeToken?.twitter && (
									<Link href={memeToken?.twitter} target="_blank">
										<X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
									</Link>
								)}
								{memeToken?.telegram && (
									<Link href={memeToken?.telegram} target="_blank">
										<Telegram className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-end text-base text-white/40">
					{isLoadingCurrentPrice ? (
						<Skeleton className="h-6 w-16" />
					) : (
						<span className="text-price-positive font-semibold">
							{currentPrice?.formattedPerPayToken} ICP
						</span>
					)}
					<span className="flex items-center gap-1 text-sm">
						<span className="text-white/40">24h</span>
						<span className="text-price-negative">-1.23%</span>
					</span>
				</div>
			</div>

			{isLoadingMemeToken ? (
				<div className="mt-3 flex max-w-[70%] flex-col gap-2">
					<Skeleton className="h-4 w-1/3" />
				</div>
			) : (
				<p className="mt-3 max-w-[70%] text-xs text-white/40">
					{memeToken?.description}
				</p>
			)}
		</div>
	);
}
