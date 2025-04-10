import { createRootRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
const RootLayout = () => (
	<div className="bg-background flex-col px-6">
		<Header />
		<Outlet />
		<Footer />
	</div>
);

export const Route = createRootRoute({
	component: RootLayout,
});
