import { cn } from "@/lib/utils";

export default function IcpLogo({ className }: { className?: string }) {
	return (
		<svg
			className={cn(className)}
			fill="none"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<mask
				height="24"
				id="mask0_120_16048"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<circle cx="12" cy="12" fill="#F1F1F1" r="12" />
			</mask>
			<g mask="url(#mask0_120_16048)">
				<path
					d="M17.0972 7.42871C16.0037 7.42871 14.8115 7.98911 13.5515 9.09293C12.9537 9.61597 12.4374 10.1764 12.0503 10.6247C12.0503 10.6247 12.0503 10.6247 12.0537 10.6281V10.6247C12.0537 10.6247 12.665 11.2904 13.3409 12.0036C13.7043 11.5723 14.2274 10.9847 14.8285 10.4549C15.9493 9.47333 16.6795 9.26615 17.0972 9.26615C18.6698 9.26615 19.9468 10.5126 19.9468 12.0444C19.9468 13.566 18.6664 14.8124 17.0972 14.8226C17.0259 14.8226 16.9342 14.8124 16.8187 14.7886C17.2773 14.9856 17.7698 15.1283 18.2385 15.1283C21.1185 15.1283 21.6824 13.2501 21.7197 13.1142C21.8046 12.7712 21.8488 12.4112 21.8488 12.041C21.8488 9.50049 19.7159 7.42871 17.0972 7.42871Z"
					fill="url(#paint0_linear_120_16048)"
				/>
				<path
					d="M7.03717 16.6664C8.1308 16.6664 9.32293 16.1059 10.583 15.0021C11.1808 14.4791 11.697 13.9187 12.0841 13.4704C12.0841 13.4704 12.0841 13.4704 12.0807 13.467V13.4704C12.0807 13.4704 11.4695 12.8047 10.7935 12.0914C10.4301 12.5228 9.9071 13.1103 9.30595 13.6402C8.18514 14.6217 7.45492 14.8289 7.03717 14.8289C5.46465 14.8255 4.18761 13.5791 4.18761 12.0473C4.18761 10.5257 5.46804 9.27925 7.03717 9.26906C7.10849 9.26906 7.20019 9.27925 7.31567 9.30302C6.85716 9.10603 6.36469 8.96338 5.89598 8.96338C3.01586 8.96338 2.45546 10.8416 2.41471 10.974C2.3298 11.3205 2.28564 11.6771 2.28564 12.0473C2.28564 14.5946 4.41856 16.6664 7.03717 16.6664Z"
					fill="url(#paint1_linear_120_16048)"
				/>
				<path
					d="M18.2314 15.0875C16.7573 15.0502 15.2255 13.8886 14.9131 13.5999C14.1048 12.8527 12.2401 10.8319 12.0941 10.6722C10.7287 9.14048 8.87772 7.42871 7.03689 7.42871H7.0335H7.0301C4.79528 7.4389 2.91709 8.95368 2.41443 10.9745C2.45179 10.8421 3.1888 8.92651 5.89231 8.99444C7.36634 9.0318 8.90489 10.2103 9.22076 10.499C10.0291 11.2462 11.8937 13.2671 12.0398 13.4267C13.4051 14.9551 15.2561 16.6669 17.0969 16.6669H17.1003H17.1037C19.3385 16.6567 21.2201 15.1419 21.7194 13.121C21.6786 13.2535 20.9382 15.1521 18.2314 15.0875Z"
					fill="#29ABE2"
				/>
			</g>
			<defs>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="paint0_linear_120_16048"
					x1="14.6238"
					x2="21.0841"
					y1="8.03784"
					y2="14.7276"
				>
					<stop offset="0.21" stopColor="#F15A24" />
					<stop offset="0.6841" stopColor="#FBB03B" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="paint1_linear_120_16048"
					x1="9.5106"
					x2="3.05034"
					y1="16.0572"
					y2="9.36744"
				>
					<stop offset="0.21" stopColor="#ED1E79" />
					<stop offset="0.8929" stopColor="#522785" />
				</linearGradient>
			</defs>
		</svg>
	);
}
