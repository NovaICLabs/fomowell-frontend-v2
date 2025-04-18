import { cn } from "@/lib/utils";

export default function Like({
	className,
	onClick,
	likes,
}: {
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	likes?: number;
}) {
	return (
		<div
			className="group flex cursor-pointer items-center gap-1"
			onClick={onClick}
		>
			<svg
				className={cn("text-gray-400 group-hover:text-white", className)}
				fill="none"
				height="14"
				viewBox="0 0 14 14"
				width="14"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_148_18658)">
					<path
						d="M11.375 4.9875H9.3625C9.3625 4.9875 9.625 4.1125 9.8 2.5375C9.8875 1.75 9.275 0.9625 8.4 0.875H8.225C7.525 0.875 7.0875 1.3125 6.825 1.925L6.3 3.2375C5.8625 4.1125 5.5125 4.6375 5.25 4.8125C4.9 4.9875 3.5875 4.9875 3.5 4.9875H1.75C1.225 4.9875 0.875 5.3375 0.875 5.775V12.3375C0.875 12.775 1.225 13.125 1.75 13.125H10.5875C11.9 13.125 12.25 12.25 12.425 11.025L13.125 6.825C13.2125 5.8625 13.0375 4.9875 11.375 4.9875ZM3.5 12.3375H1.75V5.775H3.5V12.3375ZM12.25 6.7375L11.55 10.9375C11.375 11.725 11.375 12.3375 10.5 12.3375H4.375V5.775C4.9875 5.775 5.3375 5.6875 5.6 5.5125C6.0375 5.3375 6.475 4.6375 7.0875 3.5C7.4375 2.625 7.6125 2.1875 7.7 2.1C7.7875 1.8375 7.9625 1.6625 8.3125 1.6625H8.4C8.8375 1.6625 9.0125 2.1 9.0125 2.3625C8.8375 3.7625 8.575 4.6375 8.575 4.6375L8.225 5.775H11.55C11.8125 5.775 11.9875 5.775 12.1625 5.95C12.3375 6.125 12.25 6.475 12.25 6.7375Z"
						fill="currentColor"
					/>
				</g>
				<defs>
					<clipPath id="clip0_148_18658">
						<rect fill="currentColor" height="14" width="14" />
					</clipPath>
				</defs>
			</svg>
			<span className="text-gray-280 text-xs">{likes}</span>
		</div>
	);
}
