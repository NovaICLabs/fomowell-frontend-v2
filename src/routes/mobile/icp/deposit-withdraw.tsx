import { createFileRoute, notFound } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";

import {
	DepositWithdrawContent,
	DepositWithdrawHeader,
} from "@/components/layout/dialog/deposit-withdraw";
export const Route = createFileRoute("/mobile/icp/deposit-withdraw")({
	component: RouteComponent,
	loader: () => {
		if (!isMobile) {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw notFound();
		}
	},
});

function RouteComponent() {
	return (
		<div className="bg-gray-760 container m-auto flex h-full flex-col justify-start gap-5 overflow-auto px-2.5 pt-4 pb-10">
			<div className="flex gap-6">
				<DepositWithdrawHeader />
			</div>
			<DepositWithdrawContent />
		</div>
	);
}
