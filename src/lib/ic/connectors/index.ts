export const connectors = ["PLUG", "II", "OISY"] as const;

export type Connector = (typeof connectors)[number];

export type CreateActorArgs = {
	canisterId: string;
	interfaceFactory: IDL.InterfaceFactory;
};

export interface WalletConnectorConfig {
	whitelist: Array<string>;
	host: string;
}

export type ConnectCallback = () => Promise<void>;

export type ActorCreator = <Service>({
	canisterId,
	interfaceFactory,
}: CreateActorArgs) => Promise<ActorSubclass<Service> | undefined>;

export type ConnectorAbstract = {
	init: () => Promise<boolean>;
	isConnected: () => Promise<boolean>;
	createActor: ActorCreator;
	connect: () => Promise<boolean>;
	disconnect: () => Promise<void>;
	getPrincipal: () => string | undefined;
	type: Connector;
	expired: () => Promise<boolean>;
};

import { InternetIdentityConnector } from "./ii";
import { OisyConnector } from "./oisy";
import { PlugConnector } from "./plug";

import type { ActorSubclass } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export class WalletConnector {
	public connector: ConnectorAbstract | null = null;

	public connectorType: Connector = "II";

	// initial connect instance
	public async init(connectorType: Connector) {
		if (!this.connector || this.connector.type !== connectorType) {
			const connector = WalletConnector.create(connectorType);
			this.connectorType = connectorType;
			await connector.init();
			this.connector = connector;
			window.icConnector = this.connector;
		}
	}

	public static create(connector: Connector) {
		const config = {
			host: import.meta.env.VITE_IC_HOST,
			whitelist: [],
		};

		switch (connector) {
			case "II":
				return new InternetIdentityConnector(config);
			case "PLUG":
				return new PlugConnector(config);
			case "OISY":
				return new OisyConnector(config);
			default:
				throw new Error(`Not support this connect for now`);
		}
	}

	public async connect(): Promise<{ connected: boolean; principal?: string }> {
		if (!this.connector) return { connected: false };

		const connected = await this.connector.connect();

		window.icConnector = this.connector;
		const principal = window.icConnector.getPrincipal();
		return { connected, principal };
	}

	public async isConnected() {
		const connected = await this.connector?.isConnected();
		const principal = this.connector?.getPrincipal();
		return { connected, principal };
	}

	public async createActor<Service>(
		canisterId: string,
		interfaceFactory: IDL.InterfaceFactory
	): Promise<ActorSubclass<Service> | undefined> {
		return this.connector?.createActor({ canisterId, interfaceFactory });
	}
}

export const connectManager = new WalletConnector();
