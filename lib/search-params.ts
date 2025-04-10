import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
	prefCodes: parseAsArrayOf(parseAsInteger).withDefault([]),
});
