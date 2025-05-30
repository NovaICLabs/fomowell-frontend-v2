/* eslint-disable @typescript-eslint/await-thenable */
import {
	Actor,
	type ActorSubclass,
	HttpAgent,
	type Identity,
} from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

import type {
	ConnectorAbstract,
	CreateActorArgs,
	WalletConnectorConfig,
} from ".";

const iiExpireTime = 7 * 24 * 3600; // seconds

export class InternetIdentityConnector implements ConnectorAbstract {
	private readonly config: {
		whitelist: Array<string>;
		host: string;
		providerUrl: string;
		dev: boolean;
		verifyQuerySignatures: boolean;
		retryTimes: number;
		derivationOrigin?: string;
	};

	private identity?: Identity;

	private principal?: string;

	private client?: AuthClient;

	public type = "II" as const;

	public getPrincipal = () => {
		return this.principal;
	};

	public constructor(
		config: WalletConnectorConfig,
		derivationOrigin: string | undefined
	) {
		this.config = {
			whitelist: config.whitelist,
			host: config.host,
			derivationOrigin: derivationOrigin,
			providerUrl: "https://identity.ic0.app",
			dev: false,
			verifyQuerySignatures: false,
			retryTimes: 1,
		};
	}

	public init = async () => {
		// console.log("this.config", this.config);
		this.client = await AuthClient.create({
			idleOptions: {
				disableIdle: true,
				disableDefaultIdleCallback: true,
			},
		});

		const isConnected = await this.isConnected();

		if (isConnected) {
			this.identity = this.client.getIdentity();
			this.principal = this.identity?.getPrincipal().toString();
		}

		return true;
	};

	public isConnected = async (): Promise<boolean> => {
		return !!(await this.client?.isAuthenticated());
	};

	public createActor = async <Service>({
		canisterId,
		interfaceFactory,
	}: CreateActorArgs): Promise<ActorSubclass<Service> | undefined> => {
		if (!this.client?.getIdentity()) throw new Error("Identity not found");
		const agent = await HttpAgent.create({
			...this.config,
			identity: this.identity,
		});
		agent.replaceIdentity(this.client?.getIdentity());
		if (this.config.dev) {
			// Fetch root key for certificate validation during development
			agent.fetchRootKey().catch((error) => {
				console.warn(
					"Unable to fetch root key. Check to ensure that your local replica is running"
				);
				console.error(error);
			});
		}

		return Actor.createActor(interfaceFactory, {
			agent,
			canisterId,
		});
	};

	public connect = async () => {
		await new Promise((resolve, reject) => {
			void this.client?.login({
				identityProvider: this.config.providerUrl,
				derivationOrigin: this.config.derivationOrigin,
				onSuccess: () => {
					resolve(true);
				},
				onError: reject,
				maxTimeToLive: BigInt(iiExpireTime * 1000 * 1000 * 1000),
			});
		});
		window.localStorage.setItem(
			"ii-expire-time",
			(new Date().getTime() + iiExpireTime * 1000).toString()
		);
		const identity = this.client?.getIdentity();
		const principal = identity?.getPrincipal().toString();
		this.identity = identity;
		this.principal = principal;
		return true;
	};

	public disconnect = async () => {
		await this.client?.logout();
	};

	public expired = async () => {
		const iiExpireTime = await window.localStorage.getItem("ii-expire-time");
		if (!iiExpireTime) return true;
		return new Date().getTime() >= Number(iiExpireTime);
	};
}

export const InternetIdentity = {
	connector: InternetIdentityConnector,
	id: "ii",
	type: "II" as const,
};
