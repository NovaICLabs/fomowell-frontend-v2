export const withPreventDefault = <
	T extends React.MouseEvent<unknown, MouseEvent>,
>(
	fn: (event?: T) => void
) => {
	return (event?: T) => {
		event?.preventDefault();
		fn(event);
	};
};

export const withStopPropagation = <
	T extends React.MouseEvent<unknown, MouseEvent>,
>(
	fn: (event?: T) => void
) => {
	return (event?: T) => {
		event?.stopPropagation();
		fn(event);
	};
};
