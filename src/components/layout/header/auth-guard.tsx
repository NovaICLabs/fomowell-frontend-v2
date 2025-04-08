import type React from "react";

import { useSiwbIdentity } from "ic-siwb-lasereyes-connector";

type AuthGuardProps = {
	children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
	const { isInitializing } = useSiwbIdentity();

	// If the user is not connected, clear the session.

	// If user switches to an unsupported network, clear the session.

	// If the user switches to a different address, clear the session.

	if (isInitializing) {
		return null;
	}

	return <>{children}</>;
}
