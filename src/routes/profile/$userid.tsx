import { createFileRoute } from "@tanstack/react-router";

const UserId = () => {
	const { userid } = Route.useParams();
	return <div>UserId {userid}</div>;
};

export const Route = createFileRoute("/profile/$userid")({
	component: UserId,
});
