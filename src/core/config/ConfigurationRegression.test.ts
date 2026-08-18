import { describe, expect, it } from "vitest";
import elims from "../../../docs/dlo/configuracao-dlo-2061/elims.csv?raw";
import rules from "../../../docs/dlo/configuracao-dlo-2061/regras.csv?raw";
import { parseCsv } from "./CsvParser";

describe("DLO configuration regression", () => {
	it("keeps the ELIM and RGR association for detail balance validation", () => {
		const parsedRules = parseCsv(rules);
		const parsedElims = parseCsv(elims);
		expect(parsedRules).toContainEqual(expect.objectContaining({ codigo: "RGR03438", elim: "ELIM0956" }));
		expect(parsedElims).toContainEqual(expect.objectContaining({ codigo: "ELIM0956" }));
	});
});
