import { createRootRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
const RootLayout = () => (
	<div className="bg-background flex h-screen flex-col px-6">
		<Header />
		<div className="flex flex-1 flex-col overflow-hidden pb-10">
			<Outlet />
		</div>
		<Footer />
	</div>
);

export const Route = createRootRoute({
	component: RootLayout,
});
