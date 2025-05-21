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

// 为缺少类型定义的库添加声明
declare module "bn.js";
declare module "chai";
declare module "chai-as-promised";
declare module "concat-stream";
declare module "deep-eql";
declare module "form-data";
declare module "glob";
declare module "lru-cache";
declare module "minimatch";
declare module "mocha";
declare module "pbkdf2";
declare module "qs";
declare module "secp256k1";
