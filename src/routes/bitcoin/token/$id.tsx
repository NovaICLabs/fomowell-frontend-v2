import { createFileRoute } from "@tanstack/react-router";

import Trending from "@/components/views/token/trending";

export const Route = createFileRoute("/bitcoin/token/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Trending />
		</div>
	);
}
