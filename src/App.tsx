import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";

import DepositWithdrawDialog from "./components/layout/dialog/deposit-withdraw";
import SlippageDialog from "./components/layout/dialog/slippage";
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
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<WalletProvider>
					<RouterProvider router={router} />
					<TanStackRouterDevelopmentTools
						initialIsOpen={false}
						position="bottom-right"
						router={router}
					/>
					<ReactQueryDevtools initialIsOpen={false} />
					<Toaster
						expand
						duration={Number(import.meta.env.VITE_TOAST_DURATION)}
						position="bottom-right"
					/>
					<DepositWithdrawDialog />
					<SlippageDialog />
				</WalletProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
