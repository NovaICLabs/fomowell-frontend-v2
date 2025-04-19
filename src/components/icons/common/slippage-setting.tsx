import { cn } from "@/lib/utils";

export default function SlippageSetting({
	className,
	onClick,
}: {
	className?: string;
	onClick?: () => void;
}) {
	return (
		<svg
			className={cn(className, "cursor-pointer opacity-40 hover:opacity-100")}
			fill="none"
			height="18"
			viewBox="0 0 18 18"
			width="18"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
		>
			<path
				d="M15.435 8.208L13.1607 3.7593C13.0149 3.47419 12.7932 3.2349 12.5201 3.06782C12.2469 2.90075 11.9329 2.81239 11.6127 2.8125H6.43497C5.78697 2.8125 5.19297 3.1725 4.89417 3.7467L2.57217 8.1954C2.44244 8.44376 2.37469 8.7198 2.37469 9C2.37469 9.2802 2.44244 9.55624 2.57217 9.8046L4.89417 14.2533C5.04108 14.535 5.26239 14.771 5.53404 14.9357C5.80569 15.1004 6.11729 15.1875 6.43497 15.1875H11.6127C12.2661 15.1875 12.8637 14.8221 13.1607 14.2407L15.435 9.7911C15.5602 9.54619 15.6255 9.27506 15.6255 9C15.6255 8.72494 15.5602 8.45381 15.435 8.2089V8.208ZM14.1624 14.7528C13.9223 15.2224 13.5571 15.6166 13.1072 15.8918C12.6573 16.167 12.1401 16.3126 11.6127 16.3125H6.43497C5.91167 16.3124 5.39841 16.1689 4.95095 15.8976C4.50349 15.6263 4.13896 15.2375 3.89697 14.7735L1.57497 10.3248C1.36149 9.91583 1.25 9.46133 1.25 9C1.25 8.53867 1.36149 8.08417 1.57497 7.6752L3.89697 3.2256C4.13908 2.76179 4.50366 2.37319 4.95111 2.10202C5.39856 1.83085 5.91176 1.68749 6.43497 1.6875H11.6127C12.6882 1.6875 13.6728 2.2905 14.1624 3.2472L16.4367 7.6968C16.8552 8.5158 16.8552 9.4851 16.4367 10.3032L14.1624 14.7528Z"
				fill="white"
				fillOpacity={0.6}
			/>
			<path
				d="M9.00005 12.2623C8.57161 12.2623 8.14737 12.1779 7.75154 12.014C7.35572 11.85 6.99606 11.6097 6.69311 11.3067C6.39016 11.0038 6.14985 10.6441 5.98589 10.2483C5.82194 9.85249 5.73755 9.42824 5.73755 8.9998C5.73755 8.57137 5.82194 8.14713 5.98589 7.7513C6.14985 7.35548 6.39016 6.99582 6.69311 6.69287C6.99606 6.38992 7.35572 6.1496 7.75154 5.98565C8.14737 5.82169 8.57161 5.7373 9.00005 5.7373C9.86532 5.7373 10.6951 6.08103 11.307 6.69287C11.9188 7.30471 12.2625 8.13454 12.2625 8.9998C12.2625 9.86507 11.9188 10.6949 11.307 11.3067C10.6951 11.9186 9.86532 12.2623 9.00005 12.2623ZM9.00005 11.1373C9.28075 11.1373 9.5587 11.082 9.81803 10.9746C10.0774 10.8672 10.313 10.7097 10.5115 10.5112C10.71 10.3128 10.8674 10.0771 10.9748 9.81779C11.0823 9.55846 11.1375 9.28051 11.1375 8.9998C11.1375 8.7191 11.0823 8.44115 10.9748 8.18182C10.8674 7.92249 10.71 7.68685 10.5115 7.48836C10.313 7.28988 10.0774 7.13243 9.81803 7.02501C9.5587 6.91759 9.28075 6.8623 9.00005 6.8623C8.43315 6.8623 7.88947 7.0875 7.48861 7.48836C7.08775 7.88922 6.86255 8.4329 6.86255 8.9998C6.86255 9.5667 7.08775 10.1104 7.48861 10.5112C7.88947 10.9121 8.43315 11.1373 9.00005 11.1373Z"
				fill="white"
				fillOpacity={0.6}
			/>
		</svg>
	);
}
