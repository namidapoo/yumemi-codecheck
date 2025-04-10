// ref: https://github.com/Quramy/server-components-with-container-presentation/blob/main/src/lib/testing/getProps.ts
import type {
	ComponentProps,
	JSX,
	JSXElementConstructor,
	ReactElement,
} from "react";

/**
 * 渡された値が ReactElement かどうかを判定する
 */
const isElement = (prop: unknown): prop is ReactElement => {
	// オブジェクトでなく、または null の場合は ReactElement ではない
	if (
		typeof prop !== "object" ||
		prop === null ||
		!Object.hasOwn(prop, "$$typeof")
	) {
		return false;
	}
	// "type" プロパティが存在し、関数/文字列/シンボルなら ReactElement とみなす
	if (
		"type" in prop &&
		Object.hasOwn(prop, "type") &&
		(typeof prop.type === "function" ||
			typeof prop.type === "string" ||
			typeof prop.type === "symbol")
	) {
		return true;
	}
	return false;
};

/**
 * 再帰的にコンポーネントツリー内から指定した componentType の props を取得する関数
 *
 * @example
 * ```tsx
 * function Fuga() {
 *   return (
 *     <div id="hoge">
 *       <Hoge className="fuga-hoge" />
 *     </div>
 *   );
 * }
 *
 * const el = Fuga();
 * // div の props を取得
 * assert(getProps(el, "div")!.id === "hoge");
 * // Hoge コンポーネントの props を取得
 * assert(getProps(el, Hoge)!.className === "fuga-hoge");
 * ```
 */
export const getProps = <
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	T extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
>(
	element: ReactElement,
	componentType: T,
): ComponentProps<T> | undefined => {
	// 自身の type が指定された型と一致していれば、props を返す（適切にキャスト）
	if (element.type === componentType) {
		return element.props as ComponentProps<T>;
	}
	// 子要素（propsの値）をオブジェクトとして探索
	for (const prop of Object.values(element.props as Record<string, unknown>)) {
		if (isElement(prop)) {
			const hit = getProps(prop, componentType);
			if (hit !== undefined) {
				return hit;
			}
		}
	}
	return undefined;
};
