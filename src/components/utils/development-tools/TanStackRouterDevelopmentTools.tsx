import React from "react";

import { isProduction } from "../../../common/env";

export const TanStackRouterDevelopmentTools = isProduction
	? (): null => null
	: React.lazy(() =>
			import("@tanstack/router-devtools").then((result) => ({
				default: result.TanStackRouterDevtools,
			}))
		);
