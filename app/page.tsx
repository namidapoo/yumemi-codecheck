import { PrefectureSelector } from "@/components/prefecture-selector/container/prefecture-selector";
import type { FC } from "react";

const Page: FC = () => {
	return (
		<main className="mx-auto min-h-screen max-w-6xl p-4 md:px-6 lg:px-8">
			<h1 className="font-bold text-2xl">日本の都道府県別人口推移</h1>
			<PrefectureSelector />
		</main>
	);
};

export default Page;
