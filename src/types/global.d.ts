/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
	ic: {
		plug: {
			createAgent: ({
				whitelist,
				host,
			}: {
				whitelist: Array<string>;
				host: string;
			}) => Promise<boolean>;
			agent: HttpAgent;
			requestConnect: ({
				whitelist,
			}: {
				whitelist?: Array<string>;
			}) => Promise<any>;
			fetchRootKey: () => Promise<void>;
			createActor: <T>({
				canisterId,
				interfaceFactory,
			}: CreateActorArgs) => Promise<ActorSubclass<T>>;
			isConnected: () => Promise<boolean>;
			disconnect: () => Promise<void>;
			principalId: string;
			getPrincipal: () => Promise<Principal>;
			onExternalDisconnect: (callback: () => void) => void;
			onLockStateChange: (callback: (isLocked: boolean) => void) => void;
		};
	};
	icConnector: {
		init: () => Promise<boolean>;
		isConnected: () => Promise<boolean>;
		createActor: <Service>({
			canisterId,
			interfaceFactory,
		}: CreateActorArgs) => Promise<ActorSubclass<Service> | undefined>;
		connect: () => Promise<boolean>;
		disconnect: () => Promise<void>;
		getPrincipal: () => string | undefined;
		type: Connector;
		expired: () => Promise<boolean>;
	};
}
