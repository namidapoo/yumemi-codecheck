import type { getPopulation } from "@/api/getPopulation";
import { faker } from "@faker-js/faker/locale/ja";
import { Factory } from "fishery";

type PopulationData = Awaited<ReturnType<typeof getPopulation>>;

const years = Array.from({ length: 18 }, (_, i) => 1960 + i * 5);

const baseDataPoint = (year: number) => ({
	year,
	value: faker.number.int({ min: 100000, max: 1000000 }),
});

// 総人口用：rate を含まないデータポイントファクトリ
const dataPointWithoutRateFactory = Factory.define<
	PopulationData["data"][number]["data"][number]
>(({ transientParams }) => ({
	...baseDataPoint(transientParams.year),
}));

// その他のカテゴリ用：rate を含むデータポイントファクトリ
const dataPointWithRateFactory = Factory.define<
	PopulationData["data"][number]["data"][number]
>(({ transientParams }) => ({
	...baseDataPoint(transientParams.year),
	rate: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
}));

export const populationDataFactory = Factory.define<PopulationData>(() => {
	return {
		boundaryYear: 2020,
		data: [
			{
				label: "総人口",
				data: years.map((year) =>
					dataPointWithoutRateFactory.build({}, { transient: { year } }),
				),
			},
			{
				label: "年少人口",
				data: years.map((year) =>
					dataPointWithRateFactory.build({}, { transient: { year } }),
				),
			},
			{
				label: "生産年齢人口",
				data: years.map((year) =>
					dataPointWithRateFactory.build({}, { transient: { year } }),
				),
			},
			{
				label: "老年人口",
				data: years.map((year) =>
					dataPointWithRateFactory.build({}, { transient: { year } }),
				),
			},
		],
	};
});
