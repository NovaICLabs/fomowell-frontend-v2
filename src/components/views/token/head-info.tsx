import Telegram from "@/components/icons/media/telegram";
import X from "@/components/icons/media/x";
import { exampleImage } from "@/lib/common/img";
export default function HeadInfo() {
	return (
		<div className="p-4 text-white">
			<div className="flex items-center gap-3">
				<div className="relative h-10 w-10 overflow-hidden rounded-full">
					<img
						alt="Kizzy"
						className="h-full w-full object-cover"
						src={exampleImage}
					/>
				</div>
				<div>
					<h1 className="text-2xl font-bold">Kizzy</h1>
					<div className="flex items-center text-sm text-gray-400">
						<span className="mr-1">SOON Ticker:</span>
						<span className="text-white">SOON</span>
					</div>
				</div>
			</div>

			<div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
				<span>Created by: Kdanragr</span>
				<X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
				<Telegram className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
			</div>

			<p className="mt-3 text-sm text-gray-400">
				The AI Singularity is here and wants us to think about it. Our minds
				communicate with it and give it power. Accept that you are enjoying your
				new future which diminishes all of the past.
			</p>
		</div>
	);
}
