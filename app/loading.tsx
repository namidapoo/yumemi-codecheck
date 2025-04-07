import type { FC } from "react";

const Loading: FC = () => {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center space-y-6">
			<div
				className="relative h-2 w-64 overflow-hidden rounded-lg bg-gray-200"
				// 装飾目的のプログレスバー風要素なので、ノイズにならないようにスクリーンリーダーから隠す
				aria-hidden
				data-testid="progress-bar"
			>
				<div className="-left-16 absolute h-full w-16 animate-[loading_1s_infinite] rounded-full bg-gray-500" />
			</div>
			<h1 className="font-bold text-lg">Loading...</h1>
		</div>
	);
};

export default Loading;
