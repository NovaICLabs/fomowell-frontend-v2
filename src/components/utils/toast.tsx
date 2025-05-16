import { motion } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
type ToastType = "success" | "error" | "warning" | "info" | "loading";

export const showToast = (
	type: ToastType,
	message: string,
	options?: {
		duration?: number;
	}
) => {
	const animationDuration = Number(import.meta.env.VITE_TOAST_DURATION) / 1000;
	const toastDuration =
		options?.duration ?? Number(import.meta.env.VITE_TOAST_DURATION);
	return toast.custom(
		() => {
			return (
				<div className="flex h-full w-full items-center justify-end">
					<div className="bg-gray-710 relative flex h-[78px] w-[302px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl pt-[17px] pb-4.5 shadow-[0px_4px_18px_2px_rgba(0,0,0,0.25)]">
						<div className="relative flex h-full w-full items-start justify-start gap-3 px-4">
							<div className="flex items-center gap-2">
								{type === "loading" ? (
									<img
										alt="loading"
										className="h-6 w-6 animate-spin"
										src="/svgs/loading.svg"
									/>
								) : (
									<img alt="success" src={`/svgs/toast/${type}.svg`} />
								)}
								<p className="text-sm font-semibold text-white">{message}</p>
							</div>
							<div
								className={
									"bg-gray-650 absolute right-0 bottom-0 left-0 h-[2px]"
								}
							></div>
							{type !== "loading" && (
								<motion.div
									animate={{ width: "0%" }}
									initial={{ width: "100%" }}
									className={cn(
										"absolute bottom-0 left-0 h-[2px] bg-yellow-500",
										type === "error" && "bg-price-negative"
									)}
									transition={{
										duration: animationDuration,
										ease: "linear",
									}}
								/>
							)}
						</div>
					</div>
				</div>
			);
		},
		{
			duration: toastDuration,
		}
	);
};
