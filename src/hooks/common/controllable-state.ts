import * as React from "react";

import { useCallbackRef } from "@/hooks/common/callback-ref";

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/use-controllable-state/src/useControllableState.tsx
 */

type UseControllableStateParameters<T> = {
	prop?: T | undefined;
	defaultProp?: T | undefined;
	onChange?: (state: T) => void;
};

type SetStateFn<T> = (previousState?: T) => T;

function useControllableState<T>({
	prop,
	defaultProp,
	onChange = () => {},
}: UseControllableStateParameters<T>) {
	const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
		defaultProp,
		onChange,
	});
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledProp;
	const handleChange = useCallbackRef(onChange);

	const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
		React.useCallback(
			(nextValue) => {
				if (isControlled) {
					const setter = nextValue as SetStateFn<T>;
					const value =
						typeof nextValue === "function" ? setter(prop) : nextValue;
					if (value !== prop) handleChange(value as T);
				} else {
					setUncontrolledProp(nextValue);
				}
			},
			[isControlled, prop, setUncontrolledProp, handleChange]
		);

	return [value, setValue] as const;
}

function useUncontrolledState<T>({
	defaultProp,
	onChange,
}: Omit<UseControllableStateParameters<T>, "prop">) {
	const uncontrolledState = React.useState<T | undefined>(defaultProp);
	const [value] = uncontrolledState;
	const previousValueRef = React.useRef(value);
	const handleChange = useCallbackRef(onChange);

	React.useEffect(() => {
		if (previousValueRef.current !== value) {
			handleChange(value as T);
			previousValueRef.current = value;
		}
	}, [value, previousValueRef, handleChange]);

	return uncontrolledState;
}

export { useControllableState };
