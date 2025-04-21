/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
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
	};

	private principal?: string;

	public type = "PLUG" as const;

	public getPrincipal = () => {
		return this.principal;
	};

	public constructor(config: WalletConnectorConfig) {
		this.config = {
			whitelist: config.whitelist,
			host: config.host,
			providerUrl: "",
			dev: false,
		};
	}

	public init = async () => {
		return true;
	};

	public createActor = async <Service>({
		canisterId,
		interfaceFactory,
	}: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> => {
		return await (window as any).ic.plug.createActor({
			canisterId,
			interfaceFactory,
		});
	};

	public isConnected = async () => {
		const isUnLocked = false; // Replace with proper implementation

		if (typeof isUnLocked === "boolean" && !isUnLocked) {
			return false;
		}

		if ((window as any).ic && (window as any).ic.plug) {
			return await (window as any).ic.plug.isConnected();
		}

		return false;
	};

	public connect = async () => {
		// Fix tracing message if plug is uninstalled but still connect to
		if (!(window as any).ic?.plug) {
			return false;
		}

		if (await this.isConnected()) {
			this.principal = (window as any).ic.plug.principalId;
		} else {
			console.debug(
				"🚀 ~ PlugConnector ~ connect= ~ this.isConnected():",
				this.isConnected()
			);
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
	};

	public disconnect = async () => {
		try {
			await (window as any).ic.plug.disconnect();
		} catch (error) {
			console.error(error);
		}
	};

	public expired = async () => {
		return false;
	};
}
