import type { getPrefectures } from "@/api/getPrefectures";
import { describe, expect, it } from "vitest";
import { groupPrefecturesByRegion } from "./group-prefectures-by-region";

type Prefecture = Awaited<ReturnType<typeof getPrefectures>>[number];

const prefectures = [
	{ prefCode: 1, prefName: "北海道" },
	{ prefCode: 2, prefName: "青森" },
	{ prefCode: 8, prefName: "茨城" },
	{ prefCode: 9, prefName: "栃木" },
	{ prefCode: 15, prefName: "新潟" },
	{ prefCode: 24, prefName: "大阪" },
	{ prefCode: 40, prefName: "福岡" },
	// マッピングに該当しない都道府県
	{ prefCode: 99, prefName: "unknown" },
] as const satisfies Prefecture[];

describe("groupPrefecturesByRegion", () => {
	it("`北海道・東北`グループに正しい都道府県が含まれること", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const hokkaidoTohoku = groups.find(
			(group) => group.region === "北海道・東北",
		);
		// Assert
		expect(hokkaidoTohoku).toBeDefined();
		expect(hokkaidoTohoku?.prefectures).toHaveLength(2);
		expect(hokkaidoTohoku?.prefectures.map((p) => p.prefName)).toEqual([
			"北海道",
			"青森",
		]);
	});

	it("`関東`グループに正しい都道府県が含まれること", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const kanto = groups.find((group) => group.region === "関東");
		// Assert
		expect(kanto).toBeDefined();
		expect(kanto?.prefectures).toHaveLength(2);
		expect(kanto?.prefectures.map((p) => p.prefName)).toEqual(["茨城", "栃木"]);
	});

	it("`中部`グループに正しい都道府県が含まれること", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const chubu = groups.find((group) => group.region === "中部");
		// Assert
		expect(chubu).toBeDefined();
		expect(chubu?.prefectures).toHaveLength(1);
		expect(chubu?.prefectures.map((p) => p.prefName)).toEqual(["新潟"]);
	});

	it("`近畿`グループに正しい都道府県が含まれること", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const kinki = groups.find((group) => group.region === "近畿");
		// Assert
		expect(kinki).toBeDefined();
		expect(kinki?.prefectures).toHaveLength(1);
		expect(kinki?.prefectures.map((p) => p.prefName)).toEqual(["大阪"]);
	});

	it("`中国・四国`グループは空であること", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const chugokuShikoku = groups.find(
			(group) => group.region === "中国・四国",
		);
		// Assert
		expect(chugokuShikoku).toBeDefined();
		expect(chugokuShikoku?.prefectures).toHaveLength(0);
	});

	it("`九州・沖縄`グループに正しい都道府県が含まれること", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const kyushuOkinawa = groups.find((group) => group.region === "九州・沖縄");
		// Assert
		expect(kyushuOkinawa).toBeDefined();
		expect(kyushuOkinawa?.prefectures).toHaveLength(1);
		expect(kyushuOkinawa?.prefectures.map((p) => p.prefName)).toEqual(["福岡"]);
	});

	it("マッピングに該当しない都道府県はグループに含まれていないこと", () => {
		// Arrange
		const groups = groupPrefecturesByRegion(prefectures);
		// Act
		const allGroupedPrefCodes = groups.flatMap((group) =>
			group.prefectures.map((p) => p.prefCode),
		);
		// Assert
		expect(allGroupedPrefCodes).not.toContain(99);
	});
});
