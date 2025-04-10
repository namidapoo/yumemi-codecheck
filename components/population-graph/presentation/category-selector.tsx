import { cn } from "@/lib/utils";
import type { Dispatch, FC, SetStateAction } from "react";

export const tabs = ["総人口", "年少人口", "生産年齢人口", "老年人口"] as const;

type Props = {
	activeTab: (typeof tabs)[number];
	setActiveTab: Dispatch<SetStateAction<(typeof tabs)[number]>>;
	disabled: boolean;
};

export const CategorySelector: FC<Props> = ({
	activeTab,
	setActiveTab,
	disabled,
}) => {
	return (
		<div
			role="tablist"
			aria-label="人口カテゴリの選択"
			className={cn(
				"inline-flex rounded-lg bg-gray-200 px-2 py-1.5",
				disabled && "opacity-50",
			)}
		>
			{tabs.map((tab) => {
				const isSelected = activeTab === tab;
				return (
					<button
						type="button"
						role="tab"
						aria-selected={isSelected}
						tabIndex={isSelected ? 0 : -1}
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={cn(
							"cursor-pointer rounded-md px-2 py-1 font-medium text-xs transition-colors",
							isSelected
								? "bg-white text-indigo-700 shadow-sm"
								: "text-gray-600 hover:text-gray-800",
							disabled && "cursor-not-allowed",
						)}
						disabled={disabled}
					>
						{tab}
					</button>
				);
			})}
		</div>
	);
};
