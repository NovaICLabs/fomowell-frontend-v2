import { createFileRoute } from "@tanstack/react-router";

import ReferralPage from "@/components/views/referral";

export const Route = createFileRoute("/referral/")({
	component: Referral,
});

export default function Referral() {
	return (
		<>
			<div
				className="fixed top-0 left-0 z-[0] h-full w-full"
				style={{
					background: "linear-gradient(123deg, #3D2E05 5.41%, #111 29.13%)",
				}}
			></div>
			<div className="relative m-auto mt-[15px] mb-[25px] flex w-full px-[10px] md:px-0">
				<ReferralPage />
			</div>
		</>
	);
}
