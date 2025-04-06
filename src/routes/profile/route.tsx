import { createFileRoute, Outlet } from "@tanstack/react-router";

function RouteComponent() {
	return (
		<div>
			Profile <Outlet />
		</div>
	);
}

export const Route = createFileRoute("/profile")({
	component: RouteComponent,
});
