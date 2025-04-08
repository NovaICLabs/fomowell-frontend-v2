import { createFileRoute } from "@tanstack/react-router";

const Home = () => {
	return (
		<div className="h-screen w-screen flex-col items-center justify-center font-bold"></div>
	);
};

export const Route = createFileRoute("/")({
	component: Home,
});
