import { PopulationGraph } from "@/components/population-graph/container/population-graph";
import { PrefectureSelector } from "@/components/prefecture-selector/container/prefecture-selector";
import { searchParamsCache } from "@/lib/search-params";
import type { SearchParams } from "nuqs";
import type { FC } from "react";

type PageProps = {
	searchParams: Promise<SearchParams>;
};

const Page: FC<PageProps> = async ({ searchParams }) => {
	await searchParamsCache.parse(searchParams);

	return (
		<main className="mx-auto min-h-screen max-w-6xl space-y-4 p-4 md:px-6 lg:px-8">
			<h1 className="font-bold text-2xl">日本の都道府県別人口推移</h1>
			<div className="space-y-2">
				<PrefectureSelector />
				<PopulationGraph />
			</div>
		</main>
	);
};

export default Page;
