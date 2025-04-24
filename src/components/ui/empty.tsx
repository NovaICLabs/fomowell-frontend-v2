import { cn } from "@/lib/utils";

export const Empty = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"flex h-50 flex-col items-center justify-center text-center text-sm text-white/40",
				className
			)}
		>
			<img alt={"noData"} className="opacity-40" src={"/svgs/noData.svg"} />
			<div>No Data</div>
		</div>
	);
};
