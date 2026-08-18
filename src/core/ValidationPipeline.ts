import { DloXmlParseError, parseDloXml } from "./DloXmlParser";
import type { ValidationIssue, ValidationResult } from "./ValidationResultTypes";
import { validateXsd } from "./XsdValidator";
import { allowsAlphanumericCnpj } from "./validators/LegacyXsdCompatibilityValidator";
import { decodeAndValidateXml, validateDocumentStructure } from "./validators/StructuralValidator";

function result(issues: ValidationIssue[]): ValidationResult {
	const rejected = issues.filter((issue) => issue.outcome === "rejected").length;
	return { valid: rejected === 0, issues, summary: { rejected, indications: 0, skipped: issues.filter((issue) => issue.outcome === "skipped").length } };
}

export async function validateDloXml(file: File): Promise<ValidationResult> {
	const decoded = await decodeAndValidateXml(file);
	if (!decoded.xml) return result(decoded.issues);
	try {
		const document = parseDloXml(decoded.xml);
		const issues = [
			...decoded.issues,
			...await validateXsd(decoded.xml, allowsAlphanumericCnpj(document.dataBase)),
			...validateDocumentStructure(document),
		];
		return result(issues);
	} catch (error) {
		if (error instanceof DloXmlParseError) return result([...decoded.issues, { id: "PRE-XML-002", stage: "structural", outcome: "rejected", severity: "error", message: error.message }]);
		throw error;
	}
}
