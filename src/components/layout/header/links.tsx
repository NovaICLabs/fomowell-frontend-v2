import { useMemo } from "react";

import { Link, useLocation } from "@tanstack/react-router";

import { useChainStore } from "@/store/chain";
import { useDialogStore } from "@/store/dialog";

export const menuLinks = [
	{
		label: "Tokens",
		to: "/",
	},
	// {
	// 	label: "Liquidity",
	// 	to: "/liquidity",
	// },
	// {
	// 	label: "Referral",
	// 	to: "/referral",
	// },
];

export default function Links() {
	const location = useLocation();
	const { setHowItWorksOpen } = useDialogStore();

	const { chain } = useChainStore();

	const menus = useMemo(() => {
		if (chain === "bitcoin") {
			const newMenus = [
				...menuLinks,
				{
					label: "Liquidity",
					to: "/bitcoin/liquidity",
				},
				{
					label: "Referral",
					to: "/referral",
				},
			];
			return newMenus;
		}

		const newMenus = [
			...menuLinks,
			{
				label: "Referral",
				to: "/referral",
			},
		];

		return newMenus;
	}, [chain]);

	const menuLeftCount = useMemo(() => {
		return chain === "bitcoin" ? 1 : 0;
	}, [chain]);

	return (
		<div className="flex items-center gap-[20px]">
			{menus.map((link, index) => {
				if (index > menuLeftCount) return;
				const isActive = location.pathname === link.to;
				return (
					<Link
						key={link.to}
						to={link.to}
						className={`relative text-sm font-medium ${
							isActive ? "text-white" : "text-white/60 hover:text-white"
						}`}
					>
						{link.label}
						<div
							className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
								isActive ? "w-full opacity-100" : "w-0 opacity-0"
							}`}
							style={{
								background:
									"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
							}}
						/>
					</Link>
				);
			})}
			<div
				className={`relative cursor-pointer text-sm font-medium text-white/60 hover:text-white`}
				onClick={() => {
					setHowItWorksOpen(true);
				}}
			>
				How it works
			</div>
			{menus.map((link, index) => {
				if (index <= menuLeftCount) return;

				const isActive = location.pathname === link.to;
				return (
					<Link
						key={link.to}
						to={link.to}
						className={`relative text-sm font-medium ${
							isActive ? "text-white" : "text-white/60 hover:text-white"
						}`}
					>
						{link.label}
						<div
							className={`absolute -bottom-1 left-0 h-[1px] rounded-[1px] transition-all duration-300 ease-in-out ${
								isActive ? "w-full opacity-100" : "w-0 opacity-0"
							}`}
							style={{
								background:
									"linear-gradient(90deg, #F7B406 0%, rgba(247, 180, 6, 0.00) 100%)",
							}}
						/>
					</Link>
				);
			})}
		</div>
	);
}
