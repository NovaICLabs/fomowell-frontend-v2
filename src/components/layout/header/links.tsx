import { Link, useLocation } from "@tanstack/react-router";

const links = [
	{
		label: "Tokens",
		to: "/",
	},
	{
		label: "How it works",
		to: "/how-it-works",
	},
];

export default function Links() {
	const location = useLocation();

	return (
		<div className="flex items-center gap-[30px]">
			{links.map((link) => {
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
