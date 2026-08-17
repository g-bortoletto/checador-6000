declare module "xmllint-wasm/index-browser.mjs" {
	export interface XMLValidationResult {
		readonly valid: boolean;
		readonly errors: ReadonlyArray<{
			readonly message: string;
			readonly loc: { readonly lineNumber: number } | null;
		}>;
	}

	export function validateXML(options: {
		xml: { readonly fileName: string; readonly contents: string };
		schema: string;
	}): Promise<XMLValidationResult>;
}
