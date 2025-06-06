/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SIWB_CANISTER_ID: string;
	readonly VITE_IC_HOST: string;
	readonly VITE_ICP_CANISTER_ID: string;
	readonly VITE_CHAIN_IC_CORE_CANISTER_ID: string;
	readonly VITE_TOAST_DURATION: string;
	readonly VITE_COINGECKO_API_BASE_URL: string;
	readonly VITE_IMG_UPLOADER_URL: string;
	readonly VITE_INDEXER_BASE_URL: string;
	readonly VITE_ICPEX_SWAP: string;
	readonly VITE_CKBTC_MINTER_CANISTER_ID: string;
	readonly VITE_CKBTC_LEDGER_CANISTER_ID: string;
	readonly VITE_RUNE_WALLET_CANISTER_ID: string;
	readonly VITE_CKBTC_RUN_WALLET_CANISTER_ID: string;
	readonly VITE_INDEXER_BTC_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
