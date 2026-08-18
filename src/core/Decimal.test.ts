import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

describe("regulatory decimal arithmetic", () => {
	it("retains decimal precision and uses explicit half-up rounding", () => {
		const value = new Decimal("0.10").plus("0.20");
		expect(value.equals("0.30")).toBe(true);
		expect(new Decimal("1.005").toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2)).toBe("1.01");
	});
});
