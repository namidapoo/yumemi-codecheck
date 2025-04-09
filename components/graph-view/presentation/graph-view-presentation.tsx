"use client";

import type { getPopulation } from "@/api/getPopulation";
import type { getPrefectures } from "@/api/getPrefectures";
import HighchartsReact from "highcharts-react-official";
// v12は"highcharts"ではなく"highcharts/es-modules/**/*"からインポートする
// see: https://www.highcharts.com/docs/getting-started/version-12
import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import "highcharts/es-modules/masters/highcharts-more.src.js";
import "highcharts/es-modules/masters/modules/exporting.src.js";
import "highcharts/es-modules/masters/modules/accessibility.src.js";
import type { FC } from "react";

type PopulationData = Awaited<ReturnType<typeof getPopulation>>;
type Prefecture = Awaited<ReturnType<typeof getPrefectures>>[number];

type Props = {
	population: PopulationData[];
	prefectures: Prefecture[];
	selectedPrefCodes: number[];
};

const baseOptions = {
	chart: {
		type: "line",
		spacingTop: 20,
		spacingBottom: 0,
		spacingLeft: 10,
		spacingRight: 20,
	},
	title: {
		text: "",
	},
	xAxis: {
		title: { text: "年度", margin: 15 },
		type: "linear",
		tickInterval: 5,
		labels: {
			style: {
				fontSize: "12px",
			},
		},
	},
	yAxis: {
		title: {
			text: "人口 (万人)",
			margin: 8,
		},
		labels: {
			formatter: function () {
				return `${Highcharts.numberFormat((this.value as number) / 10000, 0, ".", ",")}`;
			},
			style: {
				fontSize: "10px",
			},
		},
	},
	tooltip: {
		headerFormat:
			'<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 12px;">' +
			'<span style="font-size: 13px; font-weight: bold; color: {point.color}; max-width: 70%;">{series.name}</span>' +
			'<span style="font-size: 12px; color: #666; min-width: 50px; text-align: right;">{point.x}年</span>' +
			"</div>",
		pointFormat:
			'<div style="font-size: 12px; font-weight: bold;">{point.y:,.0f}人</div>',
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		shadow: true,
		useHTML: true,
	},
	credits: {
		enabled: false,
	},
	responsive: {
		rules: [
			{
				condition: {
					maxWidth: 600,
				},
				chartOptions: {
					chart: {
						spacingLeft: 0,
						spacingRight: 5,
					},
					xAxis: {
						labels: {
							style: {
								fontSize: "10px",
							},
						},
					},
					yAxis: {
						title: {
							margin: 5,
						},
						labels: {
							style: {
								fontSize: "9px",
							},
						},
					},
				},
			},
		],
	},
} satisfies Highcharts.Options;

export const GraphViewPresentation: FC<Props> = ({
	population,
	prefectures,
	selectedPrefCodes,
}) => {
	const isEmpty = selectedPrefCodes.length === 0;
	const series = population
		.map((popData, index) => {
			const prefCode = selectedPrefCodes[index];
			const pref = prefectures.find((p) => p.prefCode === prefCode);
			if (!pref) {
				return null;
			}
			const totalPopulationData = popData.data.find(
				(dataItem) => dataItem.label === "総人口",
			);
			if (!totalPopulationData) {
				return null;
			}
			const seriesData = totalPopulationData.data.map((point) => ({
				x: point.year,
				y: point.value,
			}));
			return {
				name: pref.prefName,
				data: seriesData,
				type: "line",
			} as Highcharts.SeriesOptionsType;
		})
		.filter(
			(seriesItem): seriesItem is Highcharts.SeriesOptionsType =>
				seriesItem !== null,
		);

	const options = {
		...baseOptions,
		series,
		exporting: {
			enabled: !isEmpty,
		},
	};

	return (
		<div className="relative min-h-[400px] rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
			<HighchartsReact highcharts={Highcharts} options={options} />
			{isEmpty && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
					<p className="text-center font-medium text-gray-600 text-sm">
						都道府県を選択してください。
					</p>
				</div>
			)}
		</div>
	);
};
