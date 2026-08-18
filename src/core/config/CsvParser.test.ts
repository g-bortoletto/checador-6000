import { describe, expect, it } from "vitest";
import { parseCsv } from "./CsvParser";

describe("CSV parser", () => {
	it("parses quoted values, commas and escaped quotes", () => {
		expect(parseCsv('"codigo","mensagem"\n"ELIM0007","Valor, com ""aspas"""')).toEqual([
			{ codigo: "ELIM0007", mensagem: 'Valor, com "aspas"' },
		]);
	});

	it("rejects malformed column counts", () => {
		expect(() => parseCsv("codigo,valor\nELIM0007")).toThrow("linha 2");
	});
});
