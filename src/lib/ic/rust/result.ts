import superjson from "superjson";
export type RustResult<T, E> =
	| { Ok: T; Err?: undefined }
	| { Ok?: undefined; Err: E };

export const parseRustResult = <Ok, Error_, T, E>(
	result: RustResult<Ok, Error_>,
	transformOk: (t: Ok) => T,
	transformError: (error: Error_) => E
): RustResult<T, E> => {
	if (result.Ok !== undefined) return { Ok: transformOk(result.Ok) };
	if (result.Err !== undefined) return { Err: transformError(result.Err) };
	throw new Error(`wrong rust result: ${superjson.stringify(result)}`);
};

export const unwrapRustResult = <T, E>(
	result: RustResult<T, E>,
	handleError: (error: E) => T
): T => {
	if (result.Ok !== undefined) return result.Ok;
	if (result.Err !== undefined) return handleError(result.Err);
	throw new Error(`wrong rust result: ${superjson.stringify(result)}`);
};

export const unwrapRustResultMap = <O, E, T>(
	result: RustResult<O, E>,
	transformOk: (o: O) => T,
	transformError: (error: E) => T
): T => {
	if (result.Ok !== undefined) return transformOk(result.Ok);
	if (result.Err !== undefined) return transformError(result.Err);
	throw new Error(`wrong rust result: ${superjson.stringify(result)}`);
};
