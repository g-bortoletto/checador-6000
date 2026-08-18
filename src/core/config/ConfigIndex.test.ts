import { describe, expect, it } from "vitest";
import { configForDate } from "./ConfigIndex";

describe("configuration effective dates", () => {
	it("uses the latest version effective on the document base date", () => {
		const versions = [
			{ effectiveFrom: "2024-12", version: "2024.12", value: "legacy" },
			{ effectiveFrom: "2026-07", version: "2026.07", value: "current" },
		];
		expect(configForDate(versions, "2026-06")?.value).toBe("legacy");
		expect(configForDate(versions, "2026-07")?.value).toBe("current");
		expect(configForDate(versions, "2024-11")).toBeUndefined();
	});
});
