import { cn } from "@/lib/utils";

export const SubmitIcon = ({
	className,
	onClick,
	size = 12,
}: {
	className?: string;
	onClick?: () => void;
	size?: number;
}) => {
	return (
		<svg
			className={cn(className, "cursor-pointer")}
			fill="none"
			height={size}
			viewBox="0 0 16 16"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
		>
			<path
				d="M14.4 5.125V7.925C14.4 9.1 13.45 10.05 12.275 10.05H3.875L6.125 12.3C6.375 12.55 6.375 12.95 6.125 13.175C6 13.3 5.85 13.35 5.675 13.35C5.5 13.35 5.35 13.3 5.225 13.175L2.375 10.325C1.875 9.825 1.875 9.025 2.375 8.525L5.2 5.675C5.45 5.425 5.85 5.425 6.075 5.675C6.325 5.925 6.325 6.325 6.075 6.55L3.85 8.775H12.25C12.725 8.775 13.125 8.375 13.125 7.9V5.125C13.125 4.65 12.725 4.25 12.25 4.25H9.375C9.025 4.25 8.75 3.975 8.75 3.625C8.75 3.275 9.025 3 9.375 3H12.275C13.425 3 14.4 3.95 14.4 5.125Z"
				fill="white"
				fill-opacity="0.4"
			/>
		</svg>
	);
};
