import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";

export default function Footer() {
	return (
		<div className="bg-gray-710 fixed right-0 bottom-0 left-0 flex h-[38px] items-center justify-between px-4">
			<span className="text-xs leading-4 font-light text-white/60">
				© 2024 Fomowell
			</span>
			<div className="flex items-center gap-x-8">
				<X className="h-4 w-4 cursor-pointer" />
				<Telegram className="h-4 w-4 cursor-pointer" />
			</div>
		</div>
	);
}
