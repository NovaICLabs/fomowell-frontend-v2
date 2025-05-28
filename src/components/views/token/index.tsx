import { useState } from "react";

import { useCanGoBack, useParams, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { isMobile } from "react-device-detect";

import { getICPCanisterId } from "@/canisters/icrc3";
import { Star } from "@/components/icons/star";
import BitcoinWalletConnect from "@/components/layout/header/connect-button/bitcoin";
import IcpWalletConnect from "@/components/layout/header/connect-button/icp";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/utils/toast";
import Bottom from "@/components/views/token/bottom";
import HeadInfo from "@/components/views/token/head-info";
import Right from "@/components/views/token/right";
import TradingView from "@/components/views/token/tradingview";
import Trending from "@/components/views/token/trending";
import { useFavoriteToken, useSingleTokenInfo } from "@/hooks/apis/indexer";
import { useMemeTokenInfo } from "@/hooks/ic/core";
import { withStopPropagation } from "@/lib/common/react-event";
import { validatePrincipalText } from "@/lib/ic/principal";
import { getSwapUrlByCanisterId } from "@/lib/swap/icpex";
import { cn } from "@/lib/utils";
import { useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";
import { useIcIdentityStore } from "@/store/ic";
import { useMobileSheetStore } from "@/store/mobile/sheet";

import Comments from "./bottom/comments";
import Transactions from "./bottom/transactions";
import InfoSheet from "./mobile-sheet/info";
import TradeSheet from "./mobile-sheet/trade";
import Holders from "./right/holders";

import type { TradeTab } from "./right/trade";
const MobileTabsTop = ["Price", "Comments"];
const MobileTabsBottom = ["Transactions", "Holders"];

const MobileToken = () => {
	const { chain } = useChainStore();
	const { id } = useParams({ from: "/icp/token/$id" });
	const { data: tokenInfo } = useSingleTokenInfo({ id });
	const { mutateAsync: favoriteToken } = useFavoriteToken();
	const { data: memeTokenInfo } = useMemeTokenInfo(Number(id));
	const [activeTopTab, setActiveTopTab] = useState(MobileTabsTop[0]);
	const [activeBottomTab, setActiveBottomTab] = useState(MobileTabsBottom[0]);
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const { setInfoOpen, setTradeOpen } = useMobileSheetStore();
	const { connected } = useIcIdentityStore();
	const { setIcpConnectOpen } = useDialogStore();
	const [tradeType, setTradeType] = useState<TradeTab>("Buy");
	const isCompleted = memeTokenInfo?.completed;
	return (
		<div className="flex h-dvh flex-col gap-4 pt-2">
			<InfoSheet />
			<TradeSheet initialTab={tradeType} />
			<div className="flex h-11 items-center justify-between gap-2 px-2.5">
				<div className="flex items-center gap-0.5">
					{canGoBack ? (
						<ChevronLeft
							className="-ml-2"
							onClick={() => {
								router.history.back();
							}}
						/>
					) : null}

					<span className="text-xl font-semibold uppercase">
						{tokenInfo?.ticker}/ICP
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Star
						className="h-5 w-5"
						isActive={tokenInfo?.isFollow}
						onClick={withStopPropagation(() => {
							void favoriteToken({ tokenId: id });
						})}
					/>
					{chain === "bitcoin" && <BitcoinWalletConnect />}
					{chain === "icp" && <IcpWalletConnect />}
				</div>
			</div>
			<div className="flex-1 overflow-auto pb-3.5">
				<div className="relative mt-2 flex items-center gap-[30px] px-2.5">
					<div className="bg-gray-710 absolute -bottom-1 left-0 h-px w-full" />
					{MobileTabsTop.map((tab) => {
						const isActive = activeTopTab === tab;
						return (
							<div
								key={tab}
								className={`relative cursor-pointer text-sm font-semibold capitalize ${
									isActive ? "text-white" : "text-white/60 hover:text-white"
								}`}
								onClick={() => {
									setActiveTopTab(tab);
								}}
							>
								{tab}
								<div
									className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
										isActive ? "w-full opacity-100" : "w-0 opacity-0"
									}`}
									style={{
										background:
											"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
									}}
								/>
							</div>
						);
					})}
				</div>
				<div className="mt-3 flex flex-1 flex-col gap-4 overflow-auto">
					{activeTopTab === "Price" && (
						<>
							<div className="px-2.5">
								<HeadInfo />
							</div>
							<TradingView />
							<div className="sticky top-0 mt-2 flex w-full items-center gap-[30px] px-2.5">
								{MobileTabsBottom.map((tab) => {
									const isActive = activeBottomTab === tab;
									return (
										<div
											key={tab}
											className={`relative cursor-pointer text-sm font-semibold capitalize ${
												isActive
													? "text-white"
													: "text-white/60 hover:text-white"
											}`}
											onClick={() => {
												setActiveBottomTab(tab);
											}}
										>
											{tab}
											<div
												className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
													isActive ? "w-full opacity-100" : "w-0 opacity-0"
												}`}
												style={{
													background:
														"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
												}}
											/>
										</div>
									);
								})}
							</div>
							{activeBottomTab === "Transactions" && <Transactions />}
							{activeBottomTab === "Holders" && (
								<div className="px-2.5">
									<Holders />
								</div>
							)}
						</>
					)}
					{activeTopTab === "Comments" && <Comments />}
				</div>
			</div>

			<div className="fixed right-0 bottom-0 left-0 z-10 flex h-14 items-center justify-between gap-x-5 bg-gray-800 px-2.5 shadow">
				<div
					className="flex flex-col items-center"
					onClick={() => {
						setInfoOpen(true);
					}}
				>
					<img alt="info" className="h-6 w-6" src="/svgs/common/info.svg" />
					<span className="text-xs text-white/60">Info</span>
				</div>
				{isCompleted ? (
					<Button
						className="h-9.5 w-37 flex-1 rounded-[19px] px-2.5 py-1.5 text-sm font-semibold text-black"
						onClick={() => {
							const canister_id = memeTokenInfo.canister_id;
							if (!canister_id) {
								showToast("error", "Canister ID not found!");
								return;
							}
							const input = validatePrincipalText(canister_id.toText());
							window.open(
								`${getSwapUrlByCanisterId({
									input: input.toText(),
									output: getICPCanisterId().toText(),
								})}`,
								"_blank"
							);
						}}
					>
						Go to Dex
					</Button>
				) : (
					<>
						<Button
							key={"buy"}
							className={cn(
								"bg-price-positive hover:bg-price-positive/80 h-9.5 w-37 rounded-[19px] px-2.5 py-1.5 text-sm font-medium text-white"
							)}
							onClick={() => {
								if (!connected) {
									setIcpConnectOpen(true);
									return;
								}
								setTradeOpen(true);
								setTradeType("Buy");
							}}
						>
							Buy
						</Button>
						<Button
							key={"sell"}
							className={cn(
								"bg-price-negative hover:bg-price-negative/80 h-9.5 w-37 rounded-[19px] px-2.5 py-1.5 text-sm font-medium text-white"
							)}
							onClick={() => {
								if (!connected) {
									setIcpConnectOpen(true);
									return;
								}
								setTradeOpen(true);
								setTradeType("Sell");
							}}
						>
							Sell
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

const DesktopToken = () => {
	return (
		<div className="flex h-full flex-row gap-4 pt-7.5">
			<Trending />
			<div className="flex flex-1 flex-col gap-4 overflow-auto">
				<HeadInfo />
				<div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-auto">
					<TradingView />
					<Bottom />
				</div>
			</div>
			<Right />
		</div>
	);
};

export default function Token() {
	return isMobile ? <MobileToken /> : <DesktopToken />;
}
