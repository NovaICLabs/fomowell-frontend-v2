import { createFileRoute } from "@tanstack/react-router";

import AboutPage from "@/components/views/about";

export const Route = createFileRoute("/about/")({
	component: About,
});

export default function About() {
	return (
		<>
			<div className="relative m-auto mt-[15px] mb-[25px] flex w-full max-w-[780px] px-[10px] md:px-0">
				<AboutPage />
			</div>
		</>
	);
}
