import { Button } from "@/components/ui/button";

export default function CreateToken() {
	return (
		<div className="relative inline-block">
			<div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500"></div>

			<Button className="bg-gray-850 relative m-[1px] h-8 w-[95px] rounded-full text-xs font-semibold text-white hover:bg-gray-700">
				Create Token
			</Button>
		</div>
	);
}
