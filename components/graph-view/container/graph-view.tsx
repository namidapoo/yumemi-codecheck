import { getPopulation } from "@/api/getPopulation";
import { searchParamsCache } from "@/lib/search-params";
import type { FC } from "react";
import { GraphViewPresentation } from "../presentation/graph-view-presentation";

export const GraphView: FC = async () => {
	const searchParams = searchParamsCache.all();
	if (searchParams.prefCodes.length === 0) {
		return null;
	}
	const population = await Promise.all(
		searchParams.prefCodes.map((prefCode) => getPopulation(prefCode)),
	);

	return <GraphViewPresentation population={population} />;
};
