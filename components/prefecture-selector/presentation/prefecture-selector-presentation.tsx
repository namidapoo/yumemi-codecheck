import type { getPrefectures } from "@/api/getPrefectures";
import { groupPrefecturesByRegion } from "@/components/prefecture-selector/lib/group-prefectures-by-region";
import type { FC } from "react";

type Props = {
	prefectures: Awaited<ReturnType<typeof getPrefectures>>;
};

export const PrefectureSelectorPresentation: FC<Props> = ({ prefectures }) => {
	const regionGroups = groupPrefecturesByRegion(prefectures);

	return (
		<div>
			<div className="mb-3 flex items-center justify-between">
				<p className="text-gray-600 text-sm" aria-live="polite">
					選択済み: <span className="font-medium">0</span> / 47
				</p>
				<div className="flex gap-2">
					<button
						type="button"
						className="rounded-md bg-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-200"
					>
						すべて選択
					</button>
					<button
						type="button"
						className="rounded-md bg-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-200"
					>
						選択をクリア
					</button>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{regionGroups.map((group) => (
					<div key={group.region} className="rounded-lg border p-3">
						<div className="mb-2 flex items-center justify-between">
							<h3 className="font-medium text-gray-700 text-sm">
								{group.region}
							</h3>
							<button
								type="button"
								className="text-gray-500 text-xs hover:text-gray-700"
							>
								すべて選択
							</button>
						</div>
						<div className="flex flex-wrap gap-1">
							{group.prefectures.map((pref) => {
								return (
									<button
										type="button"
										key={pref.prefCode}
										className="rounded-full border px-2 py-1 text-xs transition-colors"
									>
										{pref.prefName}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
