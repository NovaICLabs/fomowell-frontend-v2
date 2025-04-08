/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SIWB_CANISTER_ID: string;
	readonly VITE_IC_HOST: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
