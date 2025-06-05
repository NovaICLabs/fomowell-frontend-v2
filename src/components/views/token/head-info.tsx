import { Link } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";

import Telegram from "@/components/icons/media/telegram";
import Website from "@/components/icons/media/website";
import X from "@/components/icons/media/x";
import { Star } from "@/components/icons/star";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavoriteToken, useSingleTokenInfo } from "@/hooks/apis/indexer";
import { useTokenChainAndId } from "@/hooks/common/useTokenRouter";
import { useCurrentPrice, useMemeTokenInfo } from "@/hooks/ic/core";
import { formatNumberSmart, isNullOrUndefined } from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";

export default function HeadInfo() {
	const { id } = useTokenChainAndId();
	const { data: memeToken, isLoading: isLoadingMemeToken } = useMemeTokenInfo(
		Number(id)
	);

	const { data: currentPrice, isLoading: isLoadingCurrentPrice } =
		useCurrentPrice({ id: Number(id) });
	const { data: tokenInfo } = useSingleTokenInfo({ id });

	const { mutateAsync: favoriteToken } = useFavoriteToken();
	return (
		<div className="text-white">
			<div className="flex items-center justify-between pr-4">
				<div className="flex items-center">
					{!isMobile && (
						<Star
							className="h-5 w-5"
							isActive={tokenInfo?.isFollow}
							onClick={withStopPropagation(() => {
								void favoriteToken({ tokenId: id });
							})}
						/>
					)}
					<div className="relative ml-2 h-10 w-10 overflow-hidden rounded-full">
						{isLoadingMemeToken ? (
							<Skeleton className="h-full w-full" />
						) : (
							<HoverCard>
								<HoverCardTrigger asChild>
									<img
										alt="logo"
										className="h-full w-full object-cover"
										src={memeToken?.logo}
									/>
								</HoverCardTrigger>
								<HoverCardContent className="mt-3 w-40 rounded-2xl p-0">
									<div className="flex w-full items-center justify-between overflow-hidden rounded-2xl">
										<img
											alt="logo"
											className="h-full w-full object-cover"
											src={memeToken?.logo}
										/>
									</div>
								</HoverCardContent>
							</HoverCard>
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
									<span className="text-center text-lg leading-normal font-bold text-white uppercase">
										{memeToken?.ticker}
									</span>{" "}
									<span className="text-xs font-normal text-white/40">
										{memeToken?.name}
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
									<Link target="_blank" to={memeToken?.twitter}>
										<X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
									</Link>
								)}
								{memeToken?.telegram && (
									<Link target="_blank" to={memeToken?.telegram}>
										<Telegram className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
									</Link>
								)}
								{memeToken?.website && (
									<Link target="_blank" to={memeToken?.website}>
										<Website className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
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
						<div className="text-price-positive flex items-center gap-1 font-semibold">
							{formatNumberSmart(currentPrice?.formattedPerPayToken ?? "0", {
								shortZero: true,
							})}
							<span>ICP</span>
						</div>
					)}
					<span className="flex items-center gap-1 text-sm">
						<span className="text-white/40">24h</span>
						<span
							className={cn(
								!isNullOrUndefined(tokenInfo?.priceChangeRate24H)
									? tokenInfo?.priceChangeRate24H >= 0
										? "text-price-positive"
										: "text-price-negative"
									: "text-price-negative"
							)}
						>
							{tokenInfo?.priceChangeRate24H ?? "--"}%
						</span>
					</span>
				</div>
			</div>

			<div className="mt-3 flex items-center justify-between">
				{isLoadingMemeToken ? (
					<div className="flex max-w-[70%] flex-col gap-2">
						<Skeleton className="h-4 w-1/3" />
					</div>
				) : (
					<p className="max-w-[70%] text-xs text-white/40">
						{memeToken?.description}
					</p>
				)}
				{isMobile && (
					<div className="flex flex-col items-end gap-1.5">
						<span className="text-xs text-yellow-500">
							({formatNumberSmart((memeToken?.progress ?? 0) * 100)}%)
						</span>
						<Progress
							className="w-22"
							value={(memeToken?.progress ?? 0) * 100}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
