import "server-only";

// APIレスポンスの型定義
export type ApiResponse<T> = {
	message: string | null;
	result: T;
};

const API_ENDPOINT = process.env.API_ENDPOINT;
const API_KEY = process.env.API_KEY;

/**
 * API通信の共通処理を行うユーティリティ関数
 *
 * {環境変数チェック,APIリクエスト送信,エラーハンドリング,レスポンスのパース} などの共通処理を集約したユーティリティ関数
 *
 * @template T - レスポンスの型パラメータ
 * @param path - APIエンドポイントへのパス（例: '/api/v1/prefectures'）
 * @returns パース済みAPIレスポンス
 * @example
 * // 都道府県一覧を取得する例
 * const prefectures = await fetchApi<ApiResponse<Prefecture[]>>('/api/v1/prefectures');
 */
export const requestApi = async <T>(path: string): Promise<T> => {
	if (!API_ENDPOINT) {
		throw new Error("API_ENDPOINTが設定されていません");
	}
	if (!API_KEY) {
		throw new Error("API_KEYが設定されていません");
	}

	const url = `${API_ENDPOINT}${path}`;

	try {
		const res = await fetch(url, {
			headers: {
				"X-API-KEY": API_KEY,
			},
			cache: "force-cache",
		});

		if (!res.ok) {
			throw new Error(`API エラー: ${res.status} ${res.statusText}`);
		}

		return res.json();
	} catch (err) {
		throw new Error(
			`API通信でエラーが発生しました (URL: ${url}): ${(err as Error).message}`,
		);
	}
};
