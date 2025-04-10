import { cn } from "@/lib/utils";

export default function X({ className }: { className?: string }) {
	return (
		<svg
			className={cn(className)}
			fill="none"
			height="8"
			viewBox="0 0 9 8"
			width="9"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.35622 3.38745L8.70667 0H7.91272L5.00353 2.94128L2.67996 0H0L3.51369 4.44773L0 8H0.793995L3.86618 4.89391L6.32004 8H9L5.35603 3.38745H5.35622ZM4.26874 4.48692L3.91273 4.04403L1.08008 0.519872H2.29961L4.58559 3.36398L4.9416 3.80687L7.9131 7.50377H6.69357L4.26874 4.48709V4.48692Z"
				fill="currentColor"
			/>
		</svg>
	);
}
