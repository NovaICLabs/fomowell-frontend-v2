import { motion } from "framer-motion";
import { toast } from "sonner";
type ToastType = "success" | "error" | "warning" | "info";

export const showToast = (type: ToastType, message: string) => {
	console.debug("🚀 ~ showToast ~ type:", type);
	toast.custom(() => {
		const duration = Number(import.meta.env.VITE_TOAST_DURATION);
		return (
			<div className="bg-gray-710 relative flex h-[78px] w-[302px] flex-col items-center justify-center overflow-hidden rounded-2xl pt-[17px] pb-4.5 shadow-[0px_4px_18px_2px_rgba(0,0,0,0.25)]">
				<div className="relative flex h-full w-full items-start justify-start gap-3 px-4">
					<div className="flex items-center gap-2">
						<img alt="success" src="/svgs/toast/success.svg" />
						<p className="text-sm font-semibold text-white">{message}</p>
					</div>
					<motion.div
						animate={{ width: "0%" }}
						className="absolute bottom-0 left-0 h-[2px] bg-yellow-500"
						initial={{ width: "100%" }}
						transition={{
							duration: duration / 1000,
							ease: "linear",
						}}
					/>
				</div>
			</div>
		);
	});
};
