import { getPopulation } from "@/api/getPopulation";
import { getPrefectures } from "@/api/getPrefectures";
import { searchParamsCache } from "@/lib/search-params";
import type { FC } from "react";
import { PopulationGraphPresentation } from "../presentation/population-graph-presentation";

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

	// 都道府県一覧と人口データを並行して取得
	const [prefectures, population] = await Promise.all([
		// `getPrefectures`は実際にはリクエストの重複排除でキャッシュを利用するだけ
		getPrefectures(),
		Promise.all(
			searchParams.prefCodes.map((prefCode) => getPopulation(prefCode)),
		),
	]);

	return (
		<PopulationGraphPresentation
			population={population}
			prefectures={prefectures}
			selectedPrefCodes={searchParams.prefCodes}
		/>
	);
};
