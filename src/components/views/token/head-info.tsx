import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";
import Star from "@/components/icons/star";
import { exampleImage } from "@/lib/common/img";
export default function HeadInfo() {
	return (
		<div className="text-white">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Star className="h-5 w-5" />
					<div className="relative ml-2 h-10 w-10 overflow-hidden rounded-full">
						<img
							alt="Kizzy"
							className="h-full w-full object-cover"
							src={exampleImage}
						/>
					</div>
					<div className="ml-2.5 flex flex-col gap-1">
						<div>
							<span className="text-center text-lg leading-normal font-bold text-white">
								Kizzy
							</span>{" "}
							<span className="text-xs font-normal text-white/40">
								Kizzy asdas
							</span>
						</div>
						<div className="flex">
							<div className="text-xs text-white/40">
								Created by: <span>Kdanragr</span>
							</div>
							<div className="ml-2.5 flex items-center gap-2 text-sm text-gray-400">
								<X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
								<Telegram className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-end text-base text-white/40">
					<span className="text-price-positive font-semibold">2000 Sats</span>
					<span className="flex items-center gap-1 text-sm">
						<span className="text-white/40">24h</span>
						<span className="text-price-negative">-1.23%</span>
					</span>
				</div>
			</div>

			<p className="mt-3 max-w-[70%] text-xs text-white/40">
				The AI Singularity is here and wants us to think about it. Our minds
				communicate with it and give it power. Accept that you are enjoying your
				new future which diminishes all of the past.
			</p>
		</div>
	);
}
