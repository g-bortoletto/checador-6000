import { describe, expect, it } from "vitest";
import { lexFormula } from "./FormulaLexer";

describe("formula lexer", () => {
	it("accepts decimal commas and DLO formula separators", () => {
		expect(lexFormula("SE(SALDO(105)<=0,15;1;0)")).toEqual([
			{ type: "identifier", value: "SE" }, { type: "parenthesis", value: "(" },
			{ type: "identifier", value: "SALDO" }, { type: "parenthesis", value: "(" },
			{ type: "number", value: "105" }, { type: "parenthesis", value: ")" },
			{ type: "operator", value: "<=" }, { type: "number", value: "0,15" },
			{ type: "separator", value: ";" }, { type: "number", value: "1" },
			{ type: "separator", value: ";" }, { type: "number", value: "0" },
			{ type: "parenthesis", value: ")" },
		]);
	});
});
