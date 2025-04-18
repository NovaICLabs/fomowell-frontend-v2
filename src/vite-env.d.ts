/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SIWB_CANISTER_ID: string;
	readonly VITE_IC_HOST: string;
	readonly VITE_ICP_CANISTER_ID: string;
	readonly VITE_CHAIN_IC_CORE_CANISTER_ID: string;
	readonly VITE_TOAST_DURATION: string;
	readonly VITE_COINGECKO_API_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
