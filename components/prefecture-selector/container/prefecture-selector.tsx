import { getPrefectures } from "@/api/getPrefectures";
import type { FC } from "react";
import { PrefectureSelectorPresentation } from "../presentation/prefecture-selector-presentation";

export const PrefectureSelector: FC = async () => {
	const prefectures = await getPrefectures();

	return <PrefectureSelectorPresentation prefectures={prefectures} />;
};
