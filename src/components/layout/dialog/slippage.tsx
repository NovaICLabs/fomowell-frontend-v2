import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { slippageRange, validateInputNumber } from "@/lib/common/validate";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/dialog";
import { useQuickBuyStore } from "@/store/quick-buy"; // Assuming you store slippage here

export default function SlippageDialog() {
	const { slippageOpen, setSlippageOpen } = useDialogStore();
	// Use quickBuyStore or pass props to manage slippage state
	const { slippage, setSlippage, autoSlippage, setAutoSlippage } =
		useQuickBuyStore();

	// Initialize state, will be correctly set by useEffect when dialog opens
	const [selectedOption, setSelectedOption] = useState<"auto" | "custom">(
		"auto"
	);
	const [customValue, setCustomValue] = useState<string>("");

	// Effect to set initial state when dialog opens or type changes
	useEffect(() => {
		if (slippageOpen.open) {
			let initialSelectedOption: "auto" | "custom" = "auto"; // Default to auto
			let initialCustomSlippage = "";

			switch (slippageOpen.type) {
				case "global":
					// Global mode: Reflect the Zustand store state accurately
					initialSelectedOption = autoSlippage ? "auto" : "custom";
					if (!autoSlippage) {
						initialCustomSlippage = slippage;
					}
					break; // Exit switch after handling global case

				case "single":
					initialSelectedOption = slippageOpen.autoSlippage ? "auto" : "custom";
					if (!slippageOpen.autoSlippage) {
						initialCustomSlippage = slippageOpen.customSlippage;
					}
					break; // Exit switch after handling single case

				default:
					break;
			}

			setSelectedOption(initialSelectedOption);
			setCustomValue(initialCustomSlippage);
		}
	}, [
		slippageOpen.open,
		slippageOpen.type,
		autoSlippage,
		slippage,
		slippageOpen,
	]);

	const handleConfirm = () => {
		const finalSlippage = selectedOption === "auto" ? "10" : customValue || "0"; // Default custom to 0.5 if empty
		setSlippage(finalSlippage);
		// Only update global autoSlippage state if the dialog type is global
		switch (slippageOpen.type) {
			case "global":
				setAutoSlippage(selectedOption === "auto");
				setSlippageOpen({ open: false, type: slippageOpen.type });
				break;
			case "single":
				slippageOpen.callback?.({
					slippage: finalSlippage,
					autoSlippage: selectedOption === "auto",
				});
				setSlippageOpen({
					open: false,
					type: slippageOpen.type,
					autoSlippage: selectedOption === "auto",
					callback: slippageOpen.callback,
					customSlippage: slippageOpen.customSlippage,
				});
				break;
		}
	};
	const isConfirmDisabled =
		selectedOption === "custom" &&
		(!customValue ||
			parseFloat(customValue) > slippageRange[1] ||
			parseFloat(customValue) < slippageRange[0]);

	return (
		<Dialog
			open={slippageOpen.open}
			onOpenChange={(open) => {
				if (slippageOpen.type === "single") {
					setSlippageOpen({
						open,
						type: slippageOpen.type,
						autoSlippage: autoSlippage,
						callback: slippageOpen.callback,
						customSlippage: slippageOpen.customSlippage,
					});
				} else {
					setSlippageOpen({
						open,
						type: slippageOpen.type,
					});
				}
			}}
		>
			<DialogContent className="bg-gray-760 flex h-auto max-h-[90vh] w-[500px] flex-col rounded-3xl p-6">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center justify-between text-base font-semibold text-white">
							Slippage limit
						</div>
					</DialogTitle>
				</DialogHeader>
				<div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto">
					{/* Auto Section */}
					<div
						className={cn(
							"bg-gray-740 flex cursor-pointer flex-col gap-2 rounded-2xl border p-5 transition-colors",
							selectedOption === "auto" // Use selectedOption directly
								? "border-yellow-500"
								: "border-gray-740 hover:border-white/30"
						)}
						onClick={() => {
							setSelectedOption("auto");
						}}
					>
						<span className="text-md font-semibold text-white">Auto (10%)</span>
						<span className="text-sm text-white/60">
							Based on the current trading currency, we recommend an appropriate
							slippage value to help you achieve trading success.
						</span>
					</div>

					{/* Customization Section */}
					<div
						className={cn(
							"bg-gray-740 flex cursor-pointer flex-col gap-2 rounded-2xl border p-5 transition-colors",
							selectedOption === "custom" // Use selectedOption directly
								? "border-yellow-500"
								: "border-gray-740 hover:border-white/30"
						)}
						onClick={() => {
							setSelectedOption("custom");
						}}
					>
						<span className="text-md font-semibold text-white">
							Customization
						</span>
						<span className="text-sm text-white/60">
							Execute the transaction in accordance with the slippage you have
							set.
						</span>
						<div className="relative mt-3 flex h-10.5 w-full items-center justify-center">
							<Input
								className="dark:bg-background h-full rounded-[10px] border-white/10 pr-8 text-base font-semibold placeholder:text-base placeholder:font-medium placeholder:text-white/40 focus-visible:ring-0"
								placeholder={`${slippageRange[0]}-${slippageRange[1]}`} // Placeholder indicating range
								value={customValue}
								onBlur={() => {
									// Ensure customValue doesn't end with a decimal point on blur
									const parsedValue = parseFloat(customValue);
									if (!isNaN(parsedValue)) {
										// Optional: Format to 2 decimal places or handle trailing zeros if needed
										// setCustomValue(parsedValue.toFixed(2)); // Example formatting
									} else if (customValue.endsWith(".")) {
										setCustomValue(customValue.slice(0, -1));
									}
									// Keep existing logic if needed, e.g. checking for '.'
									if (customValue.endsWith(".")) {
										setCustomValue(customValue.slice(0, -1));
									}
								}}
								onChange={(event) => {
									const value = event.target.value.trim();
									validateInputNumber({
										value,
										callback: setCustomValue,
										decimals: 2,
									});
								}}
							/>
							<span className="absolute right-4 text-base font-medium text-white/60">
								%
							</span>
						</div>
						{selectedOption === "custom" &&
							(!customValue ||
								parseFloat(customValue) > slippageRange[1] ||
								parseFloat(customValue) < slippageRange[0]) &&
							customValue !== "" && (
								<span className="text-price-negative mt-1 text-sm">
									Please enter a value between {slippageRange[0]} and{" "}
									{slippageRange[1]}.
								</span>
							)}
					</div>
				</div>
				<div className="mt-6 flex w-full justify-end">
					<Button
						className="h-[42px] w-full rounded-full text-base font-bold" // Assuming default primary style is yellow
						disabled={isConfirmDisabled}
						onClick={handleConfirm}
					>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
