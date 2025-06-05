// import { useEffect, useState } from "react";

// import copy from "copy-to-clipboard";
// import { Check } from "lucide-react";
// import QRCode from "qrcode.react";

// import { getBTCDepositAddress } from "@/canisters/ckbtc";
// import { CopyIcon } from "@/components/icons/common/copy";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { showToast } from "@/components/utils/toast";
// import { useIcIdentityStore } from "@/store/ic";

// export default function CkBTCDeposit() {
// 	const { principal } = useIcIdentityStore();
// 	const [btcAddress, setBtcAddress] = useState<string | null>(null);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [copied, setCopied] = useState(false);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		const fetchBtcAddress = async () => {
// 			if (!principal) return;

// 			try {
// 				setIsLoading(true);
// 				setError(null);

// 				// 获取BTC充值地址
// 				const address = await getBTCDepositAddress(principal);

// 				setBtcAddress(address);
// 			} catch (err) {
// 				console.error("Failed to get BTC deposit address:", err);
// 				setError(
// 					err instanceof Error
// 						? err.message
// 						: "Failed to get BTC deposit address"
// 				);
// 				showToast("error", "Failed to get BTC deposit address");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		void fetchBtcAddress();
// 	}, [principal]);

// 	const handleCopy = () => {
// 		if (!btcAddress) return;

// 		copy(btcAddress);
// 		setCopied(true);
// 		showToast("success", "Address copied to clipboard");

// 		setTimeout(() => {
// 			setCopied(false);
// 		}, 2000);
// 	};

// 	return (
// 		<div className="bg-gray-760 flex flex-col items-center rounded-2xl p-5">
// 			<h2 className="mb-4 text-xl font-semibold">Deposit BTC to ckBTC</h2>

// 			{isLoading ? (
// 				<div className="flex flex-col items-center gap-4">
// 					<Skeleton className="h-64 w-64" />
// 					<Skeleton className="h-10 w-full" />
// 				</div>
// 			) : error ? (
// 				<div className="p-4 text-center text-red-500">
// 					<p>{error}</p>
// 					<Button
// 						className="mt-4"
// 						onClick={() => {
// 							setError(null);
// 							void fetchBtcAddress();
// 						}}
// 					>
// 						Retry
// 					</Button>
// 				</div>
// 			) : btcAddress ? (
// 				<>
// 					<div className="mb-4 rounded-lg bg-white p-4">
// 						<QRCode value={btcAddress} size={256} />
// 					</div>

// 					<div className="bg-gray-710 flex w-full items-center justify-between rounded-lg p-3">
// 						<span className="mr-2 text-sm font-medium break-all text-white">
// 							{btcAddress}
// 						</span>
// 						<Button
// 							variant="ghost"
// 							size="icon"
// 							className="h-8 w-8"
// 							onClick={handleCopy}
// 						>
// 							{copied ? (
// 								<Check className="h-4 w-4 text-green-500" />
// 							) : (
// 								<CopyIcon className="h-4 w-4" />
// 							)}
// 						</Button>
// 					</div>

// 					<div className="mt-4 text-center text-sm text-white/60">
// 						<p>Send BTC to this address to receive ckBTC in your wallet.</p>
// 						<p className="mt-2">
// 							The conversion process may take a few minutes.
// 						</p>
// 					</div>
// 				</>
// 			) : (
// 				<div className="p-4 text-center">
// 					<p>No address available. Please connect your wallet first.</p>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
