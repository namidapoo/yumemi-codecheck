import type { getPopulation } from "@/api/getPopulation";
import { type ApiResponse, requestApi } from "@/api/utils";
import { type NextRequest, NextResponse } from "next/server";

type PopulationData = Awaited<ReturnType<typeof getPopulation>>;

export const dynamic = "force-dynamic";

// APIキーをクライアントに晒さないためのラッパーとしてこのRoute Handlersを使用
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const prefCode = searchParams.get("prefCode");
	if (!prefCode) {
		return NextResponse.json(
			{ error: "prefCode is required" },
			{ status: 400 },
		);
	}
	try {
		const data = await requestApi<ApiResponse<PopulationData>>(
			`/api/v1/population/composition/perYear?prefCode=${prefCode}`,
		);
		return NextResponse.json(data.result);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch population data" },
			{ status: 500 },
		);
	}
}
