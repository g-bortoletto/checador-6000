import { validateXML } from "xmllint-wasm/index-browser.mjs";
import schema from "../../docs/dlo/validation-schema.xsd?raw";
import type { ValidationIssue } from "./ValidationResultTypes";

export async function validateXsd(xml: string, allowAlphanumericCnpj: boolean): Promise<ValidationIssue[]> {
	const result = await validateXML({ xml: { fileName: "documento-dlo.xml", contents: xml }, schema });
	return result.errors
		.filter((error) => !(allowAlphanumericCnpj && /cnpj/i.test(error.message)))
		.map((error) => ({
			id: "PRE-XML-002", stage: "xsd", outcome: "rejected", severity: "error",
			message: error.message, line: error.loc?.lineNumber,
		}));
}
