import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/linked-wallet")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/linked-wallet"!</div>;
}
