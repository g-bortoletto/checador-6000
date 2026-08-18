// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import invalidDuplicateLimit from "./fixtures/invalid-duplicate-limit.xml?raw";
import validMinimal from "./fixtures/valid-minimal.xml?raw";
import { parseDloXml } from "./DloXmlParser";
import { validateDocumentStructure } from "./validators/StructuralValidator";

describe("curated DLO XML fixtures", () => {
	it("parses a minimal valid document without structural rejections", () => {
		const document = parseDloXml(validMinimal);
		expect(document.accounts).toHaveLength(1);
		expect(validateDocumentStructure(document)).toEqual([]);
	});

	it("rejects a duplicate limit with its catalog identifier and location", () => {
		const issues = validateDocumentStructure(parseDloXml(invalidDuplicateLimit));
		expect(issues).toContainEqual(expect.objectContaining({
			id: "PRE-XML-010",
			outcome: "rejected",
			xpath: "/documentoDLO/limitesInformados/limite[2]",
		}));
	});
});
