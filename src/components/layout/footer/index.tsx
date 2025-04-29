import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";

export default function Footer() {
	return (
		<div className="bg-gray-710 fixed right-0 bottom-0 left-0 flex h-[38px] items-center justify-between px-4">
			<span className="text-xs leading-4 font-light text-white/60">
				© 2025 Fomowell
			</span>
			<div className="flex items-center gap-x-8">
				<a href="https://x.com/fomowellcom" target="_blank">
					<X className="h-4 w-4 cursor-pointer" />
				</a>
				<a href="https://t.me/fomowell" target="_blank">
					<Telegram className="h-4 w-4 cursor-pointer" />
				</a>
			</div>
		</div>
	);
}
