import { cn } from "@/lib/utils";

const Sorts = ({
	className,
	sort,
}: {
	className?: string;
	sort?: "desc" | "asc";
}) => {
	return (
		<div className={`flex flex-col items-center gap-[2px] ${className}`}>
			<div
				className={cn(
					"h-0 w-0 border-r-[3.5px] border-b-[4px] border-l-[3.5px] border-white/40 border-r-transparent border-b-current border-l-transparent",
					sort === "asc" && "border-white"
				)}
			/>

			<div
				className={cn(
					"h-0 w-0 border-t-[4px] border-r-[3.5px] border-l-[3.5px] border-white/40 border-t-current border-r-transparent border-l-transparent",
					sort === "desc" && "border-white"
				)}
			/>
		</div>
	);
};

export default Sorts;
