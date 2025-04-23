import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s",
		s: "%ds",
		m: "1 min",
		mm: "%d mins",
		h: "1 hr",
		hh: "%d hrs",
		d: "1 day",
		dd: "%d days",
		w: "1 week",
		ww: "%d weeks",
		M: "1 month",
		MM: "%d months",
		y: "1 year",
		yy: "%d years",
	},
});
export const fromNow = (timestampNanos: bigint) => {
	const milliseconds = timestampNanos / 1000000n;
	const date = dayjs(Number(milliseconds));
	return date.fromNow();
};

export const formatDate = (
	timestampNanos: bigint,
	formatString = "YYYY-MM-DD HH:mm:ss"
) => {
	const milliseconds = timestampNanos / 1000000n;
	const date = dayjs(Number(milliseconds));
	return date.format(formatString);
};
