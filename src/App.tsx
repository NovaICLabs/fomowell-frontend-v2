import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";
import { Toaster } from "sonner";

import { useAppStore } from "@/store/app";

import HowItWorksDialog from "./components/layout/dialog/how-it-works";
import { ThemeProvider } from "./components/providers/theme-provider";
import { WalletProvider } from "./components/providers/wallet";
import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";
import { routeTree } from "./routeTree.gen";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
const queryClient = new QueryClient();
const router = createRouter({ routeTree });
const App = () => {
	const { setInvitationCode2ic, setInvitationCode2btc } = useAppStore();

	useEffect(() => {
		const searchParameters = new URLSearchParams(window.location.search);
		const refParameter = searchParameters.get("ref");
		const chainParameter = searchParameters.get("chain");

		if (chainParameter === "icp" && refParameter) {
			setInvitationCode2ic(refParameter);
		}
		if (chainParameter === "bitcoin" && refParameter) {
			setInvitationCode2btc(refParameter);
		}
	}, [setInvitationCode2ic, setInvitationCode2btc]);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<WalletProvider>
					<RouterProvider router={router} />
					{!isMobile && (
						<>
							<TanStackRouterDevelopmentTools
								initialIsOpen={false}
								position="bottom-right"
								router={router}
							/>
							<ReactQueryDevtools initialIsOpen={false} />
						</>
					)}
					<Toaster
						expand={!isMobile}
						position={isMobile ? "top-right" : "bottom-right"}
					/>
					<HowItWorksDialog />
				</WalletProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
