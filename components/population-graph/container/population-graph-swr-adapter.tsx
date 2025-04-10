"use client";
import type { getPrefectures } from "@/api/getPrefectures";
import { usePopulation } from "@/hooks/use-population";
import type { FC } from "react";
import { PopulationGraphPresentation } from "../presentation/population-graph-presentation";

type Prefecture = Awaited<ReturnType<typeof getPrefectures>>[number];
type Props = {
	prefectures: Prefecture[];
	selectedPrefCodes: number[];
};

export const PopulationGraphSWRAdapter: FC<Props> = ({
	prefectures,
	selectedPrefCodes,
}) => {
	const { population, isLoading, isValidating, error } =
		usePopulation(selectedPrefCodes);

	if (isLoading) {
		return (
			<PopulationGraphPresentation
				population={[]}
				prefectures={prefectures}
				selectedPrefCodes={selectedPrefCodes}
				isValidating={true}
				isLoading={true}
			/>
		);
	}

	if (error) {
		console.error("SWR Error:", error);
		return <div>人口データの取得中にエラーが発生しました。</div>;
	}

	return (
		<PopulationGraphPresentation
			population={population ?? []}
			prefectures={prefectures}
			selectedPrefCodes={selectedPrefCodes}
			isValidating={isValidating}
			isLoading={false}
		/>
	);
};
