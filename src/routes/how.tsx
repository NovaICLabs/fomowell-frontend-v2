import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/how")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/how"!</div>;
}
