import { cn } from "@/lib/utils";

export const EditIcon = ({
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
			<g clip-path="url(#clip0_411_9590)">
				<path
					d="M3.71931 2.66401C2.96996 2.66401 2.35724 3.27291 2.35724 4.02608V12.2343C2.35724 12.9837 2.96996 13.5925 3.71931 13.5925H11.9313C12.6807 13.5925 13.2896 12.9837 13.2896 12.2343V6.84015L14.6987 5.47808V12.7338C14.6987 13.9867 13.637 15.0015 12.3842 15.0015H3.21981C1.96695 15.0015 0.952114 13.9867 0.952114 12.7338V3.66702C0.952114 2.41418 1.96695 1.25888 3.21981 1.25888H10.4755L9.11728 2.66402H3.71931V2.66401ZM8.74258 9.33425L5.69829 10.1968L6.56866 7.17194L8.74258 9.33425ZM9.04714 9.0299L6.86919 6.87141L11.6543 2.11763L13.8322 4.27592L9.04714 9.0299ZM14.8158 3.30017L14.164 3.94813L11.9861 1.78582L12.6378 1.13784C12.8799 0.899811 13.2584 0.887995 13.4809 1.1106L14.843 2.46104C15.0656 2.68345 15.0538 3.06212 14.8158 3.30017Z"
					fill="currentColor"
					fillOpacity="0.4"
				/>
			</g>
			<defs>
				<clipPath id="clip0_411_9590">
					<rect fill="currentColor" height="16" width="16" />
				</clipPath>
			</defs>
		</svg>
	);
};
