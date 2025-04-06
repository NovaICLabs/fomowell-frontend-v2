import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";

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
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<TanStackRouterDevelopmentTools
				initialIsOpen={false}
				position="bottom-right"
				router={router}
			/>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
