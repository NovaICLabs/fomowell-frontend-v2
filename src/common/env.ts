export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

const isBuildMode = (value: unknown): value is "production" | "development" => {
	return value === "production" || value === "development";
};

export const getBuildMode = (): string => {
	const mode = import.meta.env.MODE;
	return isBuildMode(mode) ? mode : "production";
};

export const getConnectDerivationOrigin = (): string | undefined => {
	console.log("import.meta.env.mode", getBuildMode());

	switch (getBuildMode()) {
		case "production":
			return "https://f77dm-vaaaa-aaaah-arekq-cai.icp0.io";
		case "development":
			return undefined;
		default:
			return undefined;
	}
};
