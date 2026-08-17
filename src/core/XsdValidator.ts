import { validateXML } from "xmllint-wasm/index-browser.mjs";
import schema from "../../docs/dlo/validation-schema.xsd?raw";
import { ValidationResult } from "./ValidationResultTypes";

export async function validateDloXml(file: File): Promise<ValidationResult> {
	const result = await validateXML({
		xml: { fileName: file.name, contents: await file.text() },
		schema,
	});

	return {
		valid: result.valid,
		errors: result.errors.map((error) => ({
			message: error.message,
			line: error.loc?.lineNumber,
		})),
	};
}
