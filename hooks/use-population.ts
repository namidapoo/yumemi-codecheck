import { getPopulation } from "@/api/getPopulation";
import useSWR from "swr";

// getPopulation の返り値の型定義（各都道府県の人口データ）
export type PopulationData = Awaited<ReturnType<typeof getPopulation>>;

/**
 * SWR 用のフェッチャー関数
 * 渡されたキーはタプル [url, codes] となっており、codes（都道府県コードの配列）を用いて個別に getPopulation を呼び出します。
 *
 * @param key タプル形式のキー。1番目がURL（今回特に使用しない）、2番目が都道府県コードの配列。
 * @returns Promise 内に各都道府県の人口データの配列を返す
 */
const fetcher = async ([_, codes]: [string, number[]]): Promise<
	PopulationData[]
> => {
	try {
		return await Promise.all(
			codes.map(async (prefCode: number) => {
				return getPopulation(prefCode);
			}),
		);
	} catch (error) {
		console.error("Population data fetch error in usePopulation:", error);
		throw error;
	}
};

/**
 * 指定した都道府県コードに対する人口データを取得するためのカスタムフック
 *
 * @param selectedPrefCodes 選択された都道府県コードの配列
 * @returns SWR から得られる人口データ、エラー情報、ローディング状態を含むオブジェクト
 */
export const usePopulation = (selectedPrefCodes: number[]) => {
	const { data, error, isValidating } = useSWR<PopulationData[]>(
		["/api/population", selectedPrefCodes],
		fetcher,
		{
			keepPreviousData: true,
		},
	);

	return {
		population: data,
		error,
		isLoading: !data && !error,
		isValidating,
	};
};
