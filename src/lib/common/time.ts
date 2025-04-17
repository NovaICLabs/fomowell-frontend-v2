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
		m: "1min",
		mm: "%d mins",
		h: "1hr",
		hh: "%d hrs",
		d: "1d",
		dd: "%d days",
		w: "1w",
		ww: "%d weeks",
		M: "1mo",
		MM: "%dmon",
		y: "1y",
		yy: "%d years",
	},
});
export const fromNow = (timestampNanos: bigint) => {
	const milliseconds = timestampNanos / 1000000n;
	const date = dayjs(Number(milliseconds));
	return date.fromNow();
};
