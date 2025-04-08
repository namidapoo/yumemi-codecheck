import type { getPopulation } from "@/api/getPopulation";
import type { FC } from "react";

type Props = {
	population: Awaited<ReturnType<typeof getPopulation>>[];
};

export const GraphViewPresentation: FC<Props> = ({ population }) => {
	return (
		<div>
			<h1>都道府県別のデータ</h1>
			<pre>{JSON.stringify(population, null, 2)}</pre>
		</div>
	);
};
