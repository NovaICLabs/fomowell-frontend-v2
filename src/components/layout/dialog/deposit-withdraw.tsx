import { useCallback, useMemo, useState } from "react";

import { getICPCanisterId } from "@/canisters/icrc3";
import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import IcpLogo from "@/components/icons/logo/icp";
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
import { useCoreTokenBalance, useDeposit, useWithdraw } from "@/hooks/ic/core";
import { useICPBalance } from "@/hooks/ic/tokens/icp";
import { useConnectedIdentity } from "@/hooks/providers/wallet/ic";
import { getAvatar } from "@/lib/common/avatar";
import {
	formatNumberSmart,
	formatUnits,
	parseUnits,
} from "@/lib/common/number";
import { validateInputNumber } from "@/lib/common/validate";
import { truncatePrincipal, validatePrincipalText } from "@/lib/ic/principal";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
const tabs = ["deposit", "withdraw"] as const;
const innerTabs = ["Linked Wallet", "External Wallet"] as const;
type InnerTab = (typeof innerTabs)[number];
const tokens = ["ICP"] as const;
type Token = (typeof tokens)[number];
const Deposit = () => {
	const { data: icpBalance, refetch: refetchICPBalance } = useICPBalance();
	const [amount, setAmount] = useState<string>("");
	console.debug("🚀 ~ Deposit ~ amount:", amount);

	const fees = useMemo(() => {
		return 2n * getICPCanisterToken().fee;
	}, []);

	const maxAmount = useMemo(() => {
		return icpBalance?.raw ? icpBalance.raw - fees : 0n;
	}, [icpBalance, fees]);
	const { principal } = useConnectedIdentity();
	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useCoreTokenBalance({
			owner: principal,
			token: { ICRCToken: getICPCanisterId() },
		});
	const isEnough = useMemo(() => {
		if (amount === "") return false;

		return icpBalance && icpBalance.raw - fees >= BigInt(parseUnits(amount));
	}, [icpBalance, fees, amount]);

	const { mutateAsync: deposit, isPending } = useDeposit();

	const buttonDisabled = useMemo(() => {
		return !isEnough || !amount || amount === "0" || amount === "" || isPending;
	}, [isEnough, amount, isPending]);

	const refetch = useCallback(() => {
		void refetchICPBalance();
		void refetchCoreTokenBalance();
	}, [refetchICPBalance, refetchCoreTokenBalance]);

	const handleDeposit = useCallback(async () => {
		await deposit({
			amount: BigInt(parseUnits(amount)),
			token: getICPCanisterToken(),
		});
		refetch();
		showToast("success", `${formatNumberSmart(amount)} ICP deposited!`);
	}, [deposit, amount, refetch]);
	return (
		<div className="flex w-full flex-1 flex-col">
			<Tabs className="mx-auto" defaultValue="Linked Wallet">
				<TabsList className="border-gray-650 h-[38px] rounded-full border bg-transparent">
					{innerTabs.map((tabName) => (
						<TabsTrigger
							key={tabName}
							disabled={tabName === "External Wallet"}
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
			<div className="mt-5 flex w-full flex-1 flex-col items-start justify-between">
				<span className="text-md font-medium text-white">
					From linked wallet
				</span>
				<span className="mt-4 mb-2 text-sm text-white/60">Token</span>
				<Select
					value={"ICP"}
					onValueChange={(value: Token) => {
						console.log(value);
					}}
				>
					<SelectContent className="rounded-xl border-none bg-gray-800 px-[2px] py-[2px]">
						<SelectGroup className="bg-gray-800">
							{tokens.map((token) => (
								<SelectItem
									key={token}
									className="hover:bg-gray-750 data-[state=checked]:bg-gray-750 flex h-[38px] cursor-pointer items-center gap-x-1.5 rounded-xl text-sm font-semibold"
									value={token}
								>
									<div className="flex items-center gap-x-1.5">
										<IcpLogo />
										{token}
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
					<SelectTrigger className="h-[38px] w-full rounded-xl border border-white/10 px-4 text-sm font-semibold focus-visible:ring-0 dark:bg-gray-800 dark:hover:bg-gray-800/80">
						<div className="flex items-center gap-x-1.5">
							<SelectValue className="text-white/60" placeholder="" />
						</div>
					</SelectTrigger>
				</Select>

				<div className="mt-6.25 flex w-full flex-col items-start justify-between">
					<div className="flex w-full justify-between">
						<span className="text-sm text-white/60">Balance</span>
						<span className="text-sm font-medium text-white">
							{icpBalance?.formatted} ICP
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
							<span className="text-sm font-medium text-white">ICP</span>
						</div>
					</div>
					<span className="mt-2 ml-auto text-sm text-white/40">
						Network fee: 0.0002 ICP
					</span>
				</div>

				<div className="mt-auto flex w-full flex-col items-start justify-between">
					<span className="text-md font-medium text-white">To:</span>
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
							<IcpLogo className="h-4 w-4" />
							{coreTokenBalance?.formatted}
							{/* <span className="text-sm font-medium text-white">ICP</span> */}
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
		</div>
	);
};
const Withdraw = () => {
	const { refetch: refetchICPBalance } = useICPBalance();
	const [amount, setAmount] = useState<string>("");

	const { principal } = useConnectedIdentity();
	const { data: coreTokenBalance, refetch: refetchCoreTokenBalance } =
		useCoreTokenBalance({
			owner: principal,
			token: { ICRCToken: getICPCanisterId() },
		});
	const maxAmount = useMemo(() => {
		return coreTokenBalance?.raw ? coreTokenBalance.raw : 0n;
	}, [coreTokenBalance]);
	const isEnough = useMemo(() => {
		if (amount === "") return false;
		return (
			coreTokenBalance && coreTokenBalance.raw >= BigInt(parseUnits(amount))
		);
	}, [coreTokenBalance, amount]);

	const { mutateAsync: withdraw, isPending: isWithdrawing } = useWithdraw();

	const refetch = useCallback(() => {
		void refetchICPBalance();
		void refetchCoreTokenBalance();
	}, [refetchICPBalance, refetchCoreTokenBalance]);

	const [selectedToType, setSelectedToType] =
		useState<InnerTab>("Linked Wallet");
	const [inputPrincipal, setInputPrincipal] = useState<string>("");
	const [isInputPrincipalValid, setIsInputPrincipalValid] =
		useState<boolean>(false);
	const selectedToPrincipal = useMemo(() => {
		if (selectedToType === "Linked Wallet") return principal;
		return inputPrincipal;
	}, [selectedToType, principal, inputPrincipal]);

	const buttonDisabled = useMemo(() => {
		return (
			!isEnough ||
			!amount ||
			amount === "0" ||
			amount === "" ||
			isWithdrawing ||
			(selectedToType === "External Wallet" && !isInputPrincipalValid)
		);
	}, [isEnough, amount, isWithdrawing, isInputPrincipalValid, selectedToType]);

	const handleWithdraw = useCallback(async () => {
		try {
			if (!selectedToPrincipal) {
				throw new Error("Principal is not valid");
			}
			await withdraw({
				amount: BigInt(parseUnits(amount)),
				to: selectedToPrincipal,
				token: getICPCanisterToken(),
			});
			refetch();
			showToast("success", `${formatNumberSmart(amount)} ICP withdrawn!`);
		} catch (error) {
			console.debug("🚀 ~ handleWithdraw ~ error:", error);
		}
	}, [withdraw, amount, selectedToPrincipal, refetch]);
	return (
		<div className="flex w-full flex-1 flex-col">
			<div className="mt-4 flex w-full flex-1 flex-col items-start justify-between">
				<span className="text-md font-medium text-white">From:</span>
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
						<IcpLogo className="h-4 w-4" />
						{coreTokenBalance?.formatted}
						{/* <span className="text-sm font-medium text-white">ICP</span> */}
					</div>
				</div>
				<span className="mt-4 mb-2 text-sm text-white/60">Token</span>
				<Select
					value={"ICP"}
					onValueChange={(value: Token) => {
						console.log(value);
					}}
				>
					<SelectContent className="rounded-xl border-none bg-gray-800 px-[2px] py-[2px]">
						<SelectGroup className="bg-gray-800">
							{tokens.map((token) => (
								<SelectItem
									key={token}
									className="hover:bg-gray-750 data-[state=checked]:bg-gray-750 flex h-[38px] cursor-pointer items-center gap-x-1.5 rounded-xl text-sm font-semibold"
									value={token}
								>
									<div className="flex items-center gap-x-1.5">
										<IcpLogo />
										{token}
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
					<SelectTrigger className="h-[38px] w-full rounded-xl border border-white/10 px-4 text-sm font-semibold focus-visible:ring-0 dark:bg-gray-800 dark:hover:bg-gray-800/80">
						<div className="flex items-center gap-x-1.5">
							<SelectValue className="text-white/60" placeholder="" />
						</div>
					</SelectTrigger>
				</Select>

				<div className="mt-6.25 flex w-full flex-col items-start justify-between">
					<div className="flex w-full justify-between">
						<span className="text-sm text-white/60">Amount</span>
						<span className="text-sm font-medium text-white">
							Balance: {coreTokenBalance?.formatted} ICP
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
							<span className="text-sm font-medium text-white">ICP</span>
						</div>
					</div>
					<span className="mt-2 ml-auto text-sm text-white/40">
						Network fee: 0.0001 ICP
					</span>
				</div>

				<div className="mt-auto flex w-full flex-col items-start justify-between">
					<span className="text-md mb-2 font-medium text-white">To:</span>
					<div className="mb-2 flex w-full flex-col items-start justify-between">
						<Select
							value={selectedToType}
							onValueChange={(value: InnerTab) => {
								setSelectedToType(value);
							}}
						>
							<SelectContent className="rounded-xl border-none bg-gray-800 px-[2px] py-[2px]">
								<SelectGroup className="bg-gray-800">
									{innerTabs.map((tab) => (
										<SelectItem
											key={tab}
											className="hover:bg-gray-750 data-[state=checked]:bg-gray-750 flex h-[38px] cursor-pointer items-center gap-x-1.5 rounded-xl text-sm font-semibold"
											value={tab}
										>
											{tab}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
							<SelectTrigger className="h-[38px] w-full rounded-xl border border-white/10 px-4 text-sm font-semibold focus-visible:ring-0 dark:bg-gray-800 dark:hover:bg-gray-800/80">
								<div className="flex items-center gap-x-1.5">
									<SelectValue className="text-white/60" placeholder="" />
								</div>
							</SelectTrigger>
						</Select>
						<Input
							placeholder="Enter your principal id"
							value={inputPrincipal}
							className={cn(
								"dark:bg-background mt-2 flex w-full flex-col items-start justify-between rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold focus-visible:ring-0 dark:hover:bg-gray-800/80",
								selectedToType === "Linked Wallet" && "invisible"
							)}
							onChange={(event) => {
								setInputPrincipal(event.target.value);
								try {
									validatePrincipalText(event.target.value);
									setIsInputPrincipalValid(true);
								} catch (error) {
									console.debug("🚀 ~ Withdraw ~ error:", error);
									setIsInputPrincipalValid(false);
								}
							}}
						/>
						{!isInputPrincipalValid && inputPrincipal !== "" && (
							<span
								className={cn(
									"text-price-negative mt-2 ml-auto text-sm",
									selectedToType === "Linked Wallet" && "invisible"
								)}
							>
								Invalid principal id
							</span>
						)}
					</div>
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
export default function DepositWithdrawDialog() {
	const { depositWithdrawOpen, setDepositWithdrawOpen } = useDialogStore();
	return (
		<Dialog
			open={depositWithdrawOpen.open}
			onOpenChange={(open) => {
				setDepositWithdrawOpen({
					open,
					type: depositWithdrawOpen.type,
				});
			}}
		>
			<DialogContent className="bg-gray-760 h-[667px] w-[500px] rounded-3xl">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-[30px]">
							{tabs.map((tab) => {
								const isActive = depositWithdrawOpen.type === tab;
								return (
									<div
										key={tab}
										className={`relative cursor-pointer text-base font-semibold capitalize ${
											isActive ? "text-white" : "text-white/60 hover:text-white"
										}`}
										onClick={() => {
											setDepositWithdrawOpen({
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
						</div>
					</DialogTitle>
					<div className="bg-gray-740 mt-5 flex flex-1 flex-col rounded-2xl p-5">
						{depositWithdrawOpen.type === "deposit" && <Deposit />}
						{depositWithdrawOpen.type === "withdraw" && <Withdraw />}
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
