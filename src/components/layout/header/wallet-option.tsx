interface WalletOptionProps {
	name: string;
	onClick: () => void;
	recommended?: boolean;
	disabled?: boolean;
	icon?: React.ReactNode;
}

const WalletOption: React.FC<WalletOptionProps> = ({
	name,
	onClick,
	recommended,
	disabled,
	icon,
}) => {
	return (
		<button
			className="bg-gray-750 flex h-[43px] items-center justify-between rounded-full border border-white/10 p-4 px-4 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={disabled}
			type="button"
			onClick={onClick}
		>
			<span className="text-sm font-medium text-white">{name}</span>
			{recommended && (
				<span className="mt-1 rounded bg-blue-900 px-2 py-0.5 text-xs text-blue-200">
					Recommended
				</span>
			)}
			<div className="flex h-7 w-7 items-center justify-center rounded-full">
				{icon}
			</div>
		</button>
	);
};

export default WalletOption;
