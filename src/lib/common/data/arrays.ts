import type { WithImplicitCoercion } from "node:buffer";

export const array2string = (
	buf: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
): string => {
	const decoder = new TextDecoder();
	return decoder.decode(Buffer.from(buf));
};

export const string2array = (text: string): Array<number> => {
	const encoder = new TextEncoder();
	return [...encoder.encode(text)];
};
