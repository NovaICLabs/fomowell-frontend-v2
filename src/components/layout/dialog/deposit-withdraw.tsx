import { useCallback, useEffect, useMemo, useState } from "react";

import BigNumber from "bignumber.js";
import { validate } from "bitcoin-address-validation";
import copy from "copy-to-clipboard";
import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";
import { Check, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { isMobile } from "react-device-detect";

// import { getCkBTCLedgerCanisterId } from "@/canisters/ckbtc_ledger";
// import { getBTCDepositAddress } from "@/canisters/ckbtc_minter";
import { getCkbtcCanisterId } from "@/canisters/btc_core";
import { getCkbtcCanisterToken } from "@/canisters/icrc3/specials";
import { getFastBtcAddress } from "@/canisters/rune";
import { CopyIcon } from "@/components/icons/common/copy";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/components/utils/toast";
import { useBtcCoreTokenBalance, useBtcFees } from "@/hooks/btc/core";
import {
	useBtcBalance,
	useBtcDeposit,
	useBtcWithdraw,
} from "@/hooks/btc/tokens/btc";
import { getAvatar } from "@/lib/common/avatar";
import {
	formatNumberSmart,
	formatUnits,
	parseUnits,
} from "@/lib/common/number";
import { withStopPropagation } from "@/lib/common/react-event";
import { validateInputNumber } from "@/lib/common/validate";
import { truncatePrincipal } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useBtcIdentityStore } from "@/store/btc";
// import { useDepositWithdrawStore } from "@/store/depositWithdraw";
import { useDialogStore } from "@/store/dialog";

import type { Identity } from "@dfinity/agent";

// import { useLaserEyes } from "@omnisat/lasereyes";

const tabs = ["deposit", "withdraw"] as const;
const innerTabs = ["Linked Wallet", "External Wallet"] as const;
type InnerTab = (typeof innerTabs)[number];
const tokens = ["BTC"] as const;
type Token = (typeof tokens)[number];

const Deposit = () => {
	const { identity } = useSiwbIdentity();
	// wallet btc balance
	const { data: balance, refetch: refetchBtcBalance } = useBtcBalance();
	// console.debug("🚀 ~ data:==========", balance);

	const [amount, setAmount] = useState<string>("");
	// console.debug("🚀 ~ Deposit ~ amount:", amount);
	const [btcAddress, setBtcAddress] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedType, setSelectedType] = useState<InnerTab>("Linked Wallet");

	const fees = useBtcFees();

	const maxAmount = useMemo(() => {
		return balance?.raw ? BigInt(balance.raw) - BigInt(fees.row) : 0n;
	}, [balance, fees]);

	const { principal } = useBtcIdentityStore();

	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: {
				ICRCToken: getCkbtcCanisterId(),
			},
		});

	const isEnough = useMemo(() => {
		if (amount === "") return false;

		return (
			balance &&
			BigInt(balance.raw) - BigInt(fees.row) >= BigInt(parseUnits(amount))
		);
	}, [balance, fees, amount]);

	const { mutateAsync: btcDeposit, isPending } = useBtcDeposit();

	const buttonDisabled = useMemo(() => {
		return !isEnough || !amount || amount === "0" || amount === "" || isPending;
	}, [isEnough, amount, isPending]);

	useEffect(() => {
		const fetchBtcAddress = async () => {
			if (!principal) return;

			setLoading(true);
			try {
				// get fast btc address
				const address = await getFastBtcAddress(identity as Identity);
				console.debug("🚀 ~ fetchBtcAddress ~ address:", address);

				setBtcAddress(address);
			} catch (error) {
				console.error("Failed to get BTC deposit address:", error);
				showToast("error", "Failed to get BTC deposit address");
			} finally {
				setLoading(false);
			}
		};

		void fetchBtcAddress();
	}, [identity, principal]);

	const refetch = useCallback(() => {
		void refetchBtcBalance();
		void refetchCoreTokenBalance();
	}, [refetchBtcBalance, refetchCoreTokenBalance]);

	// const { addPaddingList, setHasPadding } = useDepositWithdrawStore();

	const handleDeposit = useCallback(async () => {
		// deposit
		if (!btcAddress) return;

		const parameters = {
			btcAddress,
			amount: BigNumber(Number(amount) * 1e8)
				.toNumber()
				.toFixed(0),
		};
		console.debug("🚀 ~ handleDeposit ~ parameters:", parameters);

		const result = await btcDeposit(parameters);

		// todo
		// if (result) {
		// 	setHasPadding(true);
		// 	addPaddingList({
		// 		...parameters,
		// 		txid: result,
		// 		status: "pending",
		// 		type: "deposit",
		// 	});
		// }

		console.debug("🚀 ~ handleDeposit ~ result:", result);
		refetch();
		showToast(
			"success",
			`${formatNumberSmart(amount)} BTC deposited, please wait!`
		);

		// , setHasPadding, addPaddingList
	}, [btcAddress, amount, btcDeposit, refetch]);

	const [copied, setCopied] = useState(false);

	return (
		<div className="flex w-full flex-1 flex-col">
			<Tabs
				className="mx-auto"
				defaultValue="Linked Wallet"
				value={selectedType}
				onValueChange={(value: string) => {
					setSelectedType(value as InnerTab);
				}}
			>
				<TabsList className="border-gray-650 h-[38px] rounded-full border bg-transparent">
					{innerTabs.map((tabName) => (
						<TabsTrigger
							key={tabName}
							// disabled={tabName === "External Wallet"}
							value={tabName}
							className={cn(
								"rounded-full px-4 py-2 text-white/60 capitalize dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
							)}
						>
							{tabName}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			{selectedType === "Linked Wallet" && (
				<div className="mt-5 flex w-full flex-1 flex-col items-start justify-between">
					<span className="text-md font-medium text-white">
						From linked wallet
					</span>
					<span className="mt-4 mb-2 pl-1.5 text-sm text-white/60">Token</span>
					<Select
						value={"BTC"}
						onValueChange={(value: Token) => {
							console.log(value);
						}}
					>
						<SelectContent className="rounded-xl border-none bg-gray-800 px-[2px] py-[2px]">
							<SelectGroup className="bg-gray-800">
								{tokens.map((token) => (
									<SelectItem
										key={token}
										className="hover:bg-gray-750 data-[state=checked]:bg-gray-750 flex h-10.5 cursor-pointer items-center gap-x-1.5 rounded-xl text-sm font-semibold"
										value={token}
									>
										<div className="flex items-center gap-x-1.5">
											<img alt={"btc-logo"} src={`/svgs/chains/bitcoin.svg`} />
											{token}
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
						<SelectTrigger className="!h-10.5 w-full rounded-xl border border-white/10 px-4 text-sm font-semibold focus-visible:ring-0 dark:bg-gray-800 dark:hover:bg-gray-800/80">
							<div className="flex items-center gap-x-1.5">
								<SelectValue className="text-white/60" placeholder="" />
							</div>
						</SelectTrigger>
					</Select>

					<div className="mt-6.25 flex w-full flex-col items-start justify-between">
						<div className="flex w-full justify-between px-1.5">
							<span className="text-sm text-white/60">Amount</span>
							<div className="flex items-center gap-x-1">
								<span className="text-sm text-white/60">Balance: </span>
								<span className="text-sm font-medium text-white">
									{balance?.formatted} BTC
								</span>
							</div>
						</div>
						<div className="relative mt-2 flex h-10.5 w-full items-center justify-center">
							<Input
								className="dark:bg-background h-full rounded-[10px] border-white/10 text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:ring-0"
								placeholder="0.00"
								value={amount}
								onBlur={() => {
									setAmount(
										amount.endsWith(".") ? amount.slice(0, -1) : amount
									);
								}}
								onChange={(event) => {
									const value = event.target.value.trim();
									validateInputNumber({
										value,
										callback: setAmount,
									});
								}}
							/>
							<div
								className="absolute top-1/2 right-0 flex h-full -translate-y-1/2 cursor-pointer items-center gap-x-2 pr-4"
								onClick={() => {
									setAmount(formatUnits(maxAmount));
								}}
							>
								<span className="text-base font-medium text-yellow-500">
									(Max)
								</span>
								<span className="text-sm font-medium text-white">BTC</span>
							</div>
						</div>
						<div className="mt-2 flex w-full items-center justify-between px-1.5">
							<span className="text-sm text-white/60">Network fee</span>
							<span className="text-sm font-medium text-white">
								{fees.formatted} BTC
							</span>
						</div>
					</div>
					<img alt="to" className="mx-auto mt-7.5" src="/svgs/common/to.svg" />
					<div className="mt-auto flex w-full flex-col items-start justify-between">
						<div className="bg-gray-710 mt-2 flex h-[38px] w-full items-center justify-start rounded-[12px] px-4">
							<img
								alt=""
								className="h-6 w-6 rounded-full"
								src={getAvatar(principal ?? "")}
							/>
							<span className="ml-1.5 text-sm font-medium text-white">
								{truncatePrincipal(principal ?? "")}
							</span>
							<div className="ml-auto flex h-full items-center gap-x-1">
								<img alt={"btc-logo"} src={`/svgs/chains/bitcoin.svg`} />
								{coreTokenBalance?.formatted}
								{/* <span className="text-sm font-medium text-white">BTC</span> */}
							</div>
						</div>
						<Button
							className="mt-10 h-[42px] w-full rounded-full text-base font-bold text-black"
							disabled={buttonDisabled}
							onClick={handleDeposit}
						>
							Confirm{" "}
							{isPending && (
								<img
									alt=""
									className="h-4 w-4 animate-spin"
									src="/svgs/loading.svg"
								/>
							)}
						</Button>
					</div>
				</div>
			)}

			{selectedType === "External Wallet" && (
				<div className="mt-5 flex w-full flex-1 flex-col items-start justify-between">
					<div className="mb-4 flex w-full flex-1 flex-col items-center justify-center">
						<div className="flex h-46 w-46 items-center justify-center rounded-2xl bg-white p-4">
							{loading && (
								<img
									alt=""
									className="h-12 w-12 animate-spin"
									src="/svgs/loading.svg"
								/>
							)}
							{btcAddress && !loading && (
								<QRCodeSVG size={184} value={btcAddress} />
							)}
						</div>
						<div className="mt-4 flex w-full items-center justify-center text-center text-sm text-[#DBB75B]">
							<Info className="mr-2 text-[#DBB75B]" size={20} />
							Only supports receiving Bitcoin assets.
						</div>
					</div>
					<div className="w-full pb-2">
						<div className="mb-2 text-sm font-medium text-white/60">
							Your address
						</div>
						<div className="flex w-full items-center justify-between">
							<div className="flex-1 text-sm font-medium text-white">
								{btcAddress}
							</div>
							<div>
								{copied ? (
									<Check className="opacity-40" size={16} strokeWidth={4} />
								) : (
									<CopyIcon
										className="ml-1"
										size={16}
										onClick={withStopPropagation(() => {
											setCopied(true);
											copy(btcAddress ?? "");
											setTimeout(() => {
												setCopied(false);
											}, 2000);
										})}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
const Withdraw = () => {
	// const { identity } = useSiwbIdentity();

	const [amount, setAmount] = useState<string>("");

	const { principal, btcAddress: storeBtcAddress } = useBtcIdentityStore();

	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useBtcCoreTokenBalance({
			owner: principal,
			token: {
				ICRCToken: getCkbtcCanisterId(),
			},
		});

	const fees = useBtcFees();

	const maxAmount = useMemo(() => {
		return coreTokenBalance?.raw ? coreTokenBalance.raw - fees.row : 0n;
	}, [coreTokenBalance, fees]);

	const isEnough = useMemo(() => {
		if (amount === "") return false;
		return (
			coreTokenBalance &&
			coreTokenBalance.raw - fees.row >= BigInt(parseUnits(amount))
		);
	}, [amount, coreTokenBalance, fees]);

	// const [btcAddress, setBtcAddress] = useState<string | null>(null);
	const [loading] = useState<boolean>(false);
	// useEffect(() => {
	// 	const fetchBtcAddress = async () => {
	// 		if (!principal) return;

	// 		setLoading(true);
	// 		try {
	// 			// get fast btc address
	// 			const address = await getFastBtcAddress(identity as Identity);
	// 			console.debug("🚀 ~ fetchBtcAddress ~ address:", address);

	// 			setBtcAddress(address);
	// 		} catch (error) {
	// 			console.error("Failed to get BTC Withdraw address:", error);
	// 			showToast("error", "Failed to get BTC Withdraw address");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	void fetchBtcAddress();
	// }, [identity, principal]);

	const { mutateAsync: withdraw, isPending: isWithdrawing } = useBtcWithdraw();

	const refetch = useCallback(() => {
		void refetchCoreTokenBalance();
	}, [refetchCoreTokenBalance]);

	const [selectedToType, setSelectedToType] =
		useState<InnerTab>("Linked Wallet");
	const [inputAddress, setInputAddress] = useState<string>("");
	const [isInputAddressValid, setIsInputAddressValid] =
		useState<boolean>(false);

	const selectedToAddress = useMemo(() => {
		if (selectedToType === "Linked Wallet") return storeBtcAddress;
		return inputAddress;
	}, [selectedToType, storeBtcAddress, inputAddress]);

	const buttonDisabled = useMemo(() => {
		return (
			!isEnough ||
			!amount ||
			amount === "0" ||
			amount === "" ||
			isWithdrawing ||
			(selectedToType === "External Wallet" && !isInputAddressValid)
		);
	}, [isEnough, amount, isWithdrawing, isInputAddressValid, selectedToType]);

	const handleWithdraw = useCallback(async () => {
		try {
			if (!principal) {
				throw new Error("Principal is not valid");
			}
			if (!selectedToAddress) {
				throw new Error("Address is not valid");
			}

			if (loading) {
				return;
			}

			const parameters = {
				amount: BigInt(parseUnits(amount)),
				to: selectedToAddress,
				from: principal,
				token: getCkbtcCanisterToken(),
			};
			console.debug("🚀 ~ handleWithdraw ~ params:", parameters);

			// todo withdraw
			const result = await withdraw(parameters);

			console.debug("🚀 ~ handleWithdraw ~ result:", result);
			refetch();
			showToast("success", `${formatNumberSmart(amount)} BTC withdrawn!`);
		} catch (error) {
			console.debug("🚀 ~ handleWithdraw ~ error:", error);
		}
	}, [principal, selectedToAddress, loading, amount, withdraw, refetch]);

	return (
		<div className="flex w-full flex-1 flex-col">
			<Tabs
				className="mx-auto"
				defaultValue="Linked Wallet"
				value={selectedToType}
				onValueChange={(value: string) => {
					setSelectedToType(value as InnerTab);
				}}
			>
				<TabsList className="border-gray-650 h-[38px] rounded-full border bg-transparent">
					{innerTabs.map((tabName) => (
						<TabsTrigger
							key={tabName}
							value={tabName}
							className={cn(
								"rounded-full px-4 py-2 text-white/60 capitalize dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
							)}
						>
							{tabName}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			<div className="mt-4 flex w-full flex-1 flex-col items-start justify-between gap-0">
				<span className="text-md font-medium text-white">From</span>
				<div className="bg-gray-710 mt-2 flex h-[38px] w-full items-center justify-start rounded-[12px] px-4">
					<img
						alt=""
						className="h-6 w-6 rounded-full"
						src={getAvatar(principal ?? "")}
					/>
					<span className="ml-1.5 text-sm font-medium text-white">
						{truncatePrincipal(principal ?? "")}
					</span>
					<div className="ml-auto flex h-full items-center gap-x-1">
						<img alt={"btc-logo"} src={`/svgs/chains/bitcoin.svg`} />
						{coreTokenBalance?.formatted}
						{/* <span className="text-sm font-medium text-white">BTC</span> */}
					</div>
				</div>
				<span className="mt-4 mb-2 pl-1.5 text-sm text-white/60">Token</span>
				<Select
					value={"BTC"}
					onValueChange={(value: Token) => {
						console.log(value);
					}}
				>
					<SelectContent className="rounded-xl border-none bg-gray-800 px-[2px] py-[2px]">
						<SelectGroup className="bg-gray-800">
							{tokens.map((token) => (
								<SelectItem
									key={token}
									className="hover:bg-gray-750 data-[state=checked]:bg-gray-750 flex h-10.5 cursor-pointer items-center gap-x-1.5 rounded-xl text-sm font-semibold"
									value={token}
								>
									<div className="flex items-center gap-x-1.5">
										<img alt={"btc-logo"} src={`/svgs/chains/bitcoin.svg`} />
										{token}
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
					<SelectTrigger className="!h-10.5 w-full rounded-xl border border-white/10 px-4 text-sm font-semibold focus-visible:ring-0 dark:bg-gray-800 dark:hover:bg-gray-800/80">
						<div className="flex items-center gap-x-1.5">
							<SelectValue className="text-white/60" placeholder="" />
						</div>
					</SelectTrigger>
				</Select>

				<div className="mt-6.25 flex w-full flex-col items-start justify-between">
					<div className="flex w-full justify-between px-1.5">
						<span className="text-sm text-white/60">Amount</span>
						<span className="text-sm font-medium text-white">
							Balance: {coreTokenBalance?.formatted} BTC
						</span>
					</div>
					<div className="relative mt-2 flex h-10.5 w-full items-center justify-center">
						<Input
							className="dark:bg-background h-full rounded-[10px] border-white/10 text-lg font-semibold placeholder:text-lg placeholder:leading-[14px] placeholder:font-bold placeholder:text-white/40 focus-visible:ring-0"
							placeholder="0.00"
							value={amount}
							onBlur={() => {
								setAmount(amount.endsWith(".") ? amount.slice(0, -1) : amount);
							}}
							onChange={(event) => {
								const value = event.target.value.trim();
								validateInputNumber({
									value,
									callback: setAmount,
								});
							}}
						/>
						<div
							className="absolute top-1/2 right-0 flex h-full -translate-y-1/2 cursor-pointer items-center gap-x-2 pr-4"
							onClick={() => {
								setAmount(formatUnits(maxAmount));
							}}
						>
							<span className="text-base font-medium text-yellow-500">
								(Max)
							</span>
							<span className="text-sm font-medium text-white">BTC</span>
						</div>
					</div>
					<div className="mt-2 flex w-full items-center justify-between px-1.5">
						<span className="text-sm text-white/60">Network fee</span>
						<span className="text-sm font-medium text-white">
							{fees.formatted} BTC
						</span>
					</div>
				</div>

				<div className="flex w-full flex-1 flex-col items-start justify-between">
					{selectedToType === "Linked Wallet" ? (
						<>
							<img
								alt="to"
								className="mx-auto mt-5"
								src="/svgs/common/to.svg"
							/>
							<span className="mx-auto mt-5 text-sm text-white/40">
								Linked Wallet
							</span>
						</>
					) : (
						<div className="mt-6 flex w-full flex-col items-start justify-between">
							<span className="pl-1.5 text-sm text-white/40">Address</span>
							<Input
								placeholder="Enter your BTC address"
								value={inputAddress}
								className={cn(
									"dark:bg-background mt-2 h-10.5 rounded-[10px] border-white/10 text-lg font-semibold placeholder:text-sm placeholder:leading-[14px] placeholder:font-normal placeholder:text-white/20 focus-visible:ring-0"
								)}
								onChange={(event) => {
									setInputAddress(event.target.value);
									setIsInputAddressValid(validate(event.target.value));
								}}
							/>
							{!isInputAddressValid && inputAddress !== "" && (
								<span className={cn("text-price-negative text-sm")}>
									Invalid Address
								</span>
							)}
						</div>
					)}

					<Button
						className="mt-10 h-[42px] w-full rounded-full text-base font-bold text-black"
						disabled={buttonDisabled}
						onClick={handleWithdraw}
					>
						Confirm{" "}
						{isWithdrawing && (
							<img
								alt=""
								className="h-4 w-4 animate-spin"
								src="/svgs/loading.svg"
							/>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export const DepositWithdrawHeader = () => {
	const { btcDepositWithdrawOpen, setBtcDepositWithdrawOpen } =
		useDialogStore();
	return (
		<>
			{tabs.map((tab) => {
				const isActive = btcDepositWithdrawOpen.type === tab;
				return (
					<div
						key={tab}
						className={`relative cursor-pointer text-base font-semibold capitalize ${
							isActive ? "text-white" : "text-white/60 hover:text-white"
						}`}
						onClick={() => {
							setBtcDepositWithdrawOpen({
								open: true,
								type: tab,
							});
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
		</>
	);
};
export const DepositWithdrawContent = () => {
	const { btcDepositWithdrawOpen } = useDialogStore();
	return (
		<div
			className={cn(
				"bg-gray-740 mt-5 flex flex-1 flex-col rounded-2xl p-5",
				isMobile && "h-[561] flex-0"
			)}
		>
			{btcDepositWithdrawOpen.type === "deposit" && <Deposit />}
			{btcDepositWithdrawOpen.type === "withdraw" && <Withdraw />}
		</div>
	);
};
export default function BtcDepositWithdrawDialog() {
	const { btcDepositWithdrawOpen, setBtcDepositWithdrawOpen } =
		useDialogStore();
	return (
		<Dialog
			open={btcDepositWithdrawOpen.open}
			onOpenChange={(open) => {
				setBtcDepositWithdrawOpen({
					open,
					type: btcDepositWithdrawOpen.type,
				});
			}}
		>
			<DialogContent className="bg-gray-760 h-[667px] w-[500px] rounded-3xl">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-[30px]">
							<DepositWithdrawHeader />
						</div>
					</DialogTitle>
					<DepositWithdrawContent />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
