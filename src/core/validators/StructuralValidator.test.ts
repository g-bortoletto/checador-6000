import { describe, expect, it } from "vitest";
import type { DloDocument } from "../DloTypes";
import { normalizeEncoding, validateDocumentStructure } from "./StructuralValidator";

function documentFor(dataBase: string): DloDocument {
	return {
		cnpj: "ABCD1234",
		dataBase,
		codigoDocumento: "2061",
		tipoEnvio: "I",
		codigoConglomerado: null,
		limits: [
			{ location: { xpath: "/documentoDLO/limitesInformados/limite[1]" }, codigoLimite: "03.00", enviado: "S" },
			{ location: { xpath: "/documentoDLO/limitesInformados/limite[2]" }, codigoLimite: "05.00", enviado: "S" },
		],
		parameters: [{ location: { xpath: "/documentoDLO/parametros/parametro" }, codigoParametro: "4", valorParametro: "2" }],
		accounts: [{ location: { xpath: "/documentoDLO/contas/conta" }, codigoConta: "100", valorConta: "0.00", valorCosif: "0.00", dloDetails: [], cosifDetails: [], participants: [], hasDloDetails: false, hasCosifDetails: false }],
		instruments: [], hasInstruments: false,
	};
}

describe("CNPJ header validity", () => {
	it("rejects an alphanumeric CNPJ through the 2026-06 layout", () => {
		expect(validateDocumentStructure(documentFor("2026-06")).some((issue) => issue.id === "PRE-XML-008")).toBe(true);
	});

	it("accepts an alphanumeric CNPJ from the 2026-07 layout", () => {
		expect(validateDocumentStructure(documentFor("2026-07")).some((issue) => issue.id === "PRE-XML-008")).toBe(false);
	});
});

describe("XML encoding declaration", () => {
	it("normalizes permitted encoding names without changing their meaning", () => {
		expect(normalizeEncoding("utf-8")).toBe("UTF-8");
		expect(normalizeEncoding("Iso-8859-1")).toBe("ISO-8859-1");
		expect(normalizeEncoding("ebcdic-cp-us")).toBe("EBCDIC-CP-US");
	});

	it("does not accept an encoding outside the DLO layout", () => {
		expect(normalizeEncoding("windows-1252")).toBeUndefined();
	});
});
