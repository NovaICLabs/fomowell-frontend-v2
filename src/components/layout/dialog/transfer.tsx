import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getICPCanisterToken } from "@/canisters/icrc3/specials";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/utils/toast";
import { useIcrcTransfer } from "@/hooks/ic/tokens";
import { useICPBalance } from "@/hooks/ic/tokens/icp";
import { formatUnits, parseUnits } from "@/lib/common/number";
import { validateInputNumber } from "@/lib/common/validate";
import { isPrincipalText, truncatePrincipal } from "@/lib/ic/principal";

const transferSchema = z.object({
	address: z
		.string()
		.refine(
			(value) => isPrincipalText(value),
			"Address must be a valid Principal ID"
		),
});

type TransferForm = z.infer<typeof transferSchema>;

export default function TransferDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [amount, setAmount] = useState<string>("");
	const form = useForm<TransferForm>({
		resolver: zodResolver(transferSchema),
		defaultValues: {
			address: "",
		},
	});

	const { mutateAsync: transferToken, isPending: isTransferring } =
		useIcrcTransfer();
	const { data: balance, refetch: refetchBalance } = useICPBalance();

	const { fee, decimals, canister_id } = getICPCanisterToken();

	const maxAmount = balance?.raw ? balance.raw - fee : 0n;

	const isEnough =
		balance && amount !== ""
			? balance.raw - fee >= BigInt(parseUnits(amount, decimals))
			: false;

	const buttonDisabled =
		!isEnough || !amount || amount === "" || isTransferring;

	const onSubmit = async (data: TransferForm) => {
		try {
			const amountParsed = parseFloat(amount);
			if (isNaN(amountParsed) || amountParsed <= 0) {
				showToast("error", "Invalid amount");
				return;
			}
			if (
				!balance ||
				balance.raw < BigInt(parseUnits(amount, decimals)) + fee
			) {
				showToast("error", "Insufficient balance");
				return;
			}

			await transferToken({
				canisterId: canister_id.toText(),
				to: data.address,
				amount: BigInt(parseUnits(amount, decimals)),
				fee,
			});
			setOpen(false);
			form.reset();
			setAmount("");
			showToast(
				"success",
				`Transferred ${amount} tokens to ${truncatePrincipal(data.address)}`
			);
			void refetchBalance();
		} catch (error) {
			console.error("Transfer failed:", error);
			showToast("error", "Transfer failed. Please try again.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="bg-gray-760 w-[500px] rounded-3xl p-0">
				<DialogHeader className="p-5 pb-0">
					<DialogTitle>Transfer</DialogTitle>
				</DialogHeader>
				<div className="bg-gray-740 m-5 mt-5 flex flex-1 flex-col rounded-2xl p-5">
					<Form {...form}>
						<form
							className="flex h-full flex-col justify-between"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<div>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm text-white/60">
												Recipient Principal ID
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													className="dark:bg-background mt-2 flex h-[38px] w-full flex-col items-start justify-between rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold placeholder:text-white/60 focus-visible:ring-0 dark:hover:bg-gray-800/80"
													placeholder="Enter recipient Principal ID"
												/>
											</FormControl>
											<FormMessage className="text-price-negative mt-1 text-xs" />
										</FormItem>
									)}
								/>

								<div className="mt-6.25 flex w-full flex-col items-start justify-between">
									<div className="flex w-full justify-between">
										<span className="text-sm text-white/60">Amount</span>
										<span className="text-sm font-medium text-white">
											Balance: {balance ? balance.formatted : "--"} ICP
										</span>
									</div>
									<div className="relative mt-2 flex h-10.5 w-full items-center justify-center">
										<Input
											className="dark:bg-background h-full rounded-[10px] border-white/10 text-lg font-semibold placeholder:text-lg placeholder:font-semibold placeholder:text-white/40 focus-visible:ring-0"
											inputMode="decimal"
											placeholder="0.00"
											type="text"
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
													decimals,
													callback: setAmount,
												});
											}}
										/>
										<div
											className="absolute top-1/2 right-0 flex h-full -translate-y-1/2 cursor-pointer items-center gap-x-2 pr-4"
											onClick={() => {
												if (maxAmount > 0n) {
													setAmount(formatUnits(maxAmount, decimals));
												} else {
													setAmount("0");
												}
											}}
										>
											<span className="text-base font-medium text-yellow-500">
												(Max)
											</span>
											<span className="text-sm font-medium text-white">
												ICP
											</span>
										</div>
									</div>
									<span className="mt-2 ml-auto text-sm text-white/40">
										Network fee: {formatUnits(fee, decimals)} ICP
									</span>
									{amount !== "" && !isEnough && !isTransferring && balance && (
										<span className="text-price-negative mt-1 ml-auto text-xs">
											Insufficient balance for transfer + fee
										</span>
									)}
								</div>
							</div>

							<Button
								className="mt-10 h-[42px] w-full rounded-full text-base font-bold text-black"
								disabled={buttonDisabled}
								type="submit"
							>
								Confirm
								{isTransferring && (
									<img
										alt="loader"
										className="ml-2 h-4 w-4 animate-spin"
										src="/svgs/loading.svg"
									/>
								)}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
