import { cn } from "@/lib/utils";

const Sorts = ({
	className,
	direction,
	selected,
}: {
	className?: string;
	direction?: "desc" | "asc";
	selected?: boolean;
}) => {
	return (
		<div className={`flex flex-col items-center gap-[2px] ${className}`}>
			<div
				className={cn(
					"h-0 w-0 border-r-[3.5px] border-b-[4px] border-l-[3.5px] border-white/40 border-r-transparent border-b-current border-l-transparent",
					selected &&
						direction === "asc" &&
						"border-white border-r-transparent border-l-transparent"
				)}
			/>

			<div
				className={cn(
					"h-0 w-0 border-t-[4px] border-r-[3.5px] border-l-[3.5px] border-white/40 border-t-current border-r-transparent border-l-transparent",
					selected &&
						direction === "desc" &&
						"border-white border-t-white border-r-transparent border-l-transparent"
				)}
			/>
		</div>
	);
};

export default Sorts;
