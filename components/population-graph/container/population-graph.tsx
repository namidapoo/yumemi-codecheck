import { getPrefectures } from "@/api/getPrefectures";
import { searchParamsCache } from "@/lib/search-params";
import type { FC } from "react";
import { PopulationGraphPresentation } from "../presentation/population-graph-presentation";
import { PopulationGraphSWRAdapter } from "./population-graph-swr-adapter";

export const PopulationGraph: FC = async () => {
	const searchParams = searchParamsCache.all();
	if (searchParams.prefCodes.length === 0) {
		return (
			<PopulationGraphPresentation
				population={[]}
				prefectures={[]}
				selectedPrefCodes={[]}
			/>
		);
	}

	// `getPrefectures`は実際にはリクエストの重複排除でキャッシュを利用するだけ
	const prefectures = await getPrefectures();

	return (
		<PopulationGraphSWRAdapter
			prefectures={prefectures}
			selectedPrefCodes={searchParams.prefCodes}
		/>
	);
};
