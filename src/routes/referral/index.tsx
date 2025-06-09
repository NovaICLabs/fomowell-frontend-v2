import { createFileRoute } from "@tanstack/react-router";

import ReferralPage from "@/components/views/referral";

export const Route = createFileRoute("/referral/")({
	component: Referral,
});

export default function Referral() {
	return (
		<div className="m-auto mt-[15px] mb-[25px] flex w-full">
			<ReferralPage />
		</div>
	);
}
