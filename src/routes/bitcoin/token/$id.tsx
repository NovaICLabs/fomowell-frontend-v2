import { createFileRoute } from "@tanstack/react-router";

import Token from "@/components/views/token";

export const Route = createFileRoute("/bitcoin/token/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Token />;
}
