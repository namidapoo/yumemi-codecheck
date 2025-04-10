"use client";

import type { getPopulation } from "@/api/getPopulation";
import type { getPrefectures } from "@/api/getPrefectures";
import HighchartsReact from "highcharts-react-official";
// v12は"highcharts"ではなく"highcharts/es-modules/**/*"からインポートする
// see: https://www.highcharts.com/docs/getting-started/version-12
import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import { useState } from "react";
import "highcharts/es-modules/masters/highcharts-more.src.js";
import "highcharts/es-modules/masters/modules/exporting.src.js";
import "highcharts/es-modules/masters/modules/accessibility.src.js";
import { cn } from "@/lib/utils";
import type { FC } from "react";
import { CategorySelector, type tabs } from "./category-selector";

type PopulationData = Awaited<ReturnType<typeof getPopulation>>;
type Prefecture = Awaited<ReturnType<typeof getPrefectures>>[number];

type Props = {
	population: PopulationData[];
	prefectures: Prefecture[];
	selectedPrefCodes: number[];
	isValidating?: boolean;
	isLoading?: boolean;
};

const baseOptions = {
	chart: {
		type: "line",
		height: 400,
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
			'<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 4px;">' +
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
	exporting: {
		enabled: false,
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

export const PopulationGraphPresentation: FC<Props> = ({
	population,
	prefectures,
	selectedPrefCodes,
	isValidating = false,
	isLoading = false,
}) => {
	const isEmpty = selectedPrefCodes.length === 0;
	const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("総人口");

	const series = population
		.map((popData, index) => {
			const prefCode = selectedPrefCodes[index];
			const pref = prefectures.find((p) => p.prefCode === prefCode);
			if (!pref) {
				return null;
			}
			const categoryData = popData.data.find(
				(dataItem) => dataItem.label === activeTab,
			);
			if (!categoryData) {
				return null;
			}
			const seriesData = categoryData.data.map((point) => ({
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
		yAxis: {
			...baseOptions.yAxis,
			title: {
				text: `${activeTab} (万人)`,
			},
		},
	};

	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
				<div className="mb-4 flex justify-end">
					<CategorySelector
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						disabled={isEmpty}
					/>
				</div>
				<div className="relative h-[400px] w-full">
					{isEmpty ? (
						<div className="flex h-full w-full flex-col items-center justify-center">
							<p className="text-center font-medium text-gray-600 text-sm">
								都道府県を選択してください。
							</p>
						</div>
					) : isLoading ? (
						<div className="flex h-full w-full flex-col items-center justify-center">
							<div className="relative">
								<div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
							</div>
						</div>
					) : (
						<div
							className={cn(isValidating ? "opacity-40" : "")}
							style={{ height: "100%" }}
						>
							<HighchartsReact
								highcharts={Highcharts}
								options={options}
								containerProps={{ style: { height: "100%" } }}
							/>
							{isValidating && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative">
										<div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
