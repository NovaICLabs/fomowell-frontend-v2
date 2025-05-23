import { memo } from "react";

import { cn } from "@/lib/utils";

export const Star = memo(
	({
		className,
		onClick,
		isActive,
	}: {
		className?: string;
		onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
		isActive?: boolean;
	}) => {
		return (
			<svg
				fill="currentColor"
				height="24"
				viewBox="0 0 24 24"
				width="24"
				xmlns="http://www.w3.org/2000/svg"
				className={cn(
					className,
					"cursor-pointer text-white/40 duration-300",
					isActive && "text-yellow-500"
				)}
				onClick={onClick}
			>
				<path
					d="M16.5878 20.5997C16.3379 20.5997 16.0536 20.5307 15.7951 20.3928L12.0552 18.5229L8.28956 20.3928C8.04829 20.5221 7.78115 20.591 7.49679 20.591C7.13487 20.591 6.78157 20.479 6.4972 20.2636C5.97156 19.8672 5.70443 19.1864 5.82507 18.5574L6.59199 14.5677L3.63632 11.8188C3.17962 11.3535 3.00727 10.69 3.17962 10.0609L3.18823 10.0437C3.40366 9.39741 3.93792 8.94932 4.58421 8.86315L8.68595 8.11346L10.5214 4.37364C10.8144 3.77906 11.4176 3.3999 12.0552 3.3999C12.7188 3.3999 13.3392 3.79629 13.5977 4.38225L15.4331 8.11346L19.5349 8.82868C20.1812 8.92347 20.7241 9.38879 20.905 10.0265C21.1118 10.6469 20.9395 11.3276 20.4742 11.793L20.4655 11.8016L17.5271 14.5763L18.2682 18.5746C18.3888 19.2123 18.1303 19.8586 17.6047 20.2636C17.3031 20.479 16.9498 20.5997 16.5878 20.5997Z"
					fill="currentColor"
					fillOpacity="1"
				/>
			</svg>
		);
	}
);
