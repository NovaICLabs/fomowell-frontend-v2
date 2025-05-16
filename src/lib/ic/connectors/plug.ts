/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */

import { isMobile } from "react-device-detect";

import { showToast } from "@/components/utils/toast";

import type {
	ConnectorAbstract,
	CreateActorArgs,
	WalletConnectorConfig,
} from ".";
import type { ActorSubclass } from "@dfinity/agent";

const MAX_PLUG_WHITELIST_NUMBER = 200;

export class PlugConnector implements ConnectorAbstract {
	private readonly config: {
		whitelist: Array<string>;
		providerUrl: string;
		host: string;
		dev: boolean;
		onConnectionUpdate?: () => void;
	};

	private principal?: string;

	public type = "PLUG" as const;

	public getPrincipal() {
		return this.principal;
	}

	public constructor(
		config: WalletConnectorConfig,
		plugOnConnectionUpdate?: () => void
	) {
		this.config = {
			whitelist: config.whitelist,
			host: config.host,
			providerUrl: "",
			dev: false,
			onConnectionUpdate: plugOnConnectionUpdate,
		};
	}

	public async init() {
		return true;
	}

	public async createActor<Service>({
		canisterId,
		interfaceFactory,
	}: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> {
		return await (window as any).ic.plug.createActor({
			canisterId,
			interfaceFactory,
		});
	}

	public async isConnected() {
		// Mobile's always return false
		if (isMobile) {
			return false;
		}

		const plug = (window as any).ic.plug;
		const isUnLocked = plug.isWalletLocked; // Replace with proper implementation
		// Mobile's isUnlocked is incorrect
		if (typeof isUnLocked === "boolean" && plug.principalId && !isUnLocked) {
			this.principal = plug.principalId;
			return true;
		}
		if ((window as any).ic && (window as any).ic.plug) {
			let returned = false;
			const connected = await Promise.race<boolean>([
				(window as any).ic.plug.isConnected().then((connected: boolean) => {
					if (returned && connected) location.reload();
					return connected ? true : false;
				}),
				new Promise((resolve) => {
					setTimeout(() => {
						returned = true;
						resolve(false);
					}, 2000);
				}),
			]);
			if (connected) {
				this.principal = plug.principalId;
				return true;
			}
		}
		return false;
	}

	public async connect() {
		// Fix tracing message if plug is uninstalled but still connect to
		const plug = (window as any).ic?.plug;
		if (!plug) {
			console.error("Plug is not installed");
			showToast(
				"error",
				isMobile ? "Please open in Plug App" : "Please install Plug Wallet"
			);
			if (!isMobile) {
				window.open("https://www.plugwallet.ooo", "_blank");
			}
			return false;
		}
		plug.sessionManager.onConnectionUpdate = this.config.onConnectionUpdate;
		if (await this.isConnected()) {
			this.principal = (window as any).ic.plug.principalId;
		} else {
			await (window as any).ic.plug.requestConnect({
				whitelist:
					this.config.whitelist.length > MAX_PLUG_WHITELIST_NUMBER
						? this.config.whitelist.slice(0, MAX_PLUG_WHITELIST_NUMBER)
						: this.config.whitelist,
				host: this.config.host,
			});
			this.principal = (window as any).ic.plug.principalId;
		}

		return true;
	}

	public async disconnect() {
		try {
			await (window as any).ic.plug.disconnect();
		} catch (error) {
			console.error(error);
		}
	}

	public async expired() {
		return false;
	}
}
