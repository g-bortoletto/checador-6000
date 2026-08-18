import type { DloDocument } from "../DloTypes";
import type { ValidationIssue } from "../ValidationResultTypes";

const allowedEncodings = new Map([
	["ISO-8859-1", "ISO-8859-1"],
	["EBCDIC-CP-US", "EBCDIC-CP-US"],
	["UTF-8", "UTF-8"],
	["UTF-16", "UTF-16"],
	["US-ASCII", "US-ASCII"],
]);
const moneyPattern = /^-?\d{1,14}(?:\.\d{1,2})?$/;

function rejected(id: string, message: string, xpath?: string, line?: number): ValidationIssue {
	return { id, stage: id === "PRE-XML-001" ? "pre-xml" : "structural", outcome: "rejected", severity: "error", message, xpath, line };
}

function duplicateIssues<T extends { location: { xpath: string; line?: number } }>(id: string, values: T[], value: (item: T) => string | null, label: string): ValidationIssue[] {
	const seen = new Set<string>();
	return values.flatMap((item) => {
		const code = value(item);
		if (!code || !seen.has(code)) {
			if (code) seen.add(code);
			return [];
		}
		return [rejected(id, `${label} duplicado: ${code}.`, item.location.xpath, item.location.line)];
	});
}

export interface DecodedXml {
	xml?: string;
	issues: ValidationIssue[];
}

export function normalizeEncoding(encoding: string): string | undefined {
	return allowedEncodings.get(encoding.toUpperCase());
}

function decode(bytes: ArrayBuffer): DecodedXml {
	const data = new Uint8Array(bytes);
	const utf16 = (data[0] === 0xff && data[1] === 0xfe) || (data[0] === 0xfe && data[1] === 0xff);
	const provisional = new TextDecoder(utf16 ? "utf-16" : "iso-8859-1").decode(data);
	const declaration = provisional.match(/^(?:\uFEFF)?<\?xml\s+version=["']([^"']+)["']\s+encoding=["']([^"']+)["']\s*\?>/);
	if (!declaration || !/^(?:\uFEFF)?<\?xml[^\r\n]*\?>\r?\n/.test(provisional)) {
		return { issues: [rejected("PRE-XML-001", "A declaracao XML deve estar completa na primeira linha.")] };
	}
	const declaredEncoding = declaration[2];
	const encoding = normalizeEncoding(declaredEncoding);
	if (!encoding) {
		return { issues: [rejected("PRE-XML-001", `Encoding nao permitido: ${declaredEncoding}.`)] };
	}
	if (encoding === "EBCDIC-CP-US") {
		return { issues: [{ id: "PRE-XML-001", stage: "pre-xml", outcome: "skipped", severity: "warning", message: "O encoding EBCDIC-CP-US e permitido, mas nao pode ser decodificado localmente pelo navegador.", missingDependencies: ["Decodificador EBCDIC-CP-US"] }] };
	}
	if (encoding === "US-ASCII" && data.some((byte) => byte > 0x7f)) {
		return { issues: [rejected("PRE-XML-001", "Os bytes do arquivo nao correspondem ao encoding US-ASCII declarado.")] };
	}
	if (utf16 !== (encoding === "UTF-16")) {
		return { issues: [rejected("PRE-XML-001", "O BOM do arquivo nao corresponde ao encoding declarado.")] };
	}
	try {
		const xml = new TextDecoder(encoding, { fatal: true }).decode(data);
		return { xml, issues: [] };
	} catch {
		return { issues: [rejected("PRE-XML-001", `Os bytes do arquivo nao podem ser decodificados como ${encoding}.`)] };
	}
}

export async function decodeAndValidateXml(file: File): Promise<DecodedXml> {
	return decode(await file.arrayBuffer());
}

export function validateDocumentStructure(document: DloDocument): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const rootPath = "/documentoDLO";
	for (const [name, value] of Object.entries({ cnpj: document.cnpj, dataBase: document.dataBase, codigoDocumento: document.codigoDocumento, tipoEnvio: document.tipoEnvio })) {
		if (!value) issues.push(rejected("PRE-XML-004", `Atributo obrigatorio ausente: ${name}.`, rootPath));
	}
	if (!document.dataBase || !/^\d{4}-(0[1-9]|1[0-2])$/.test(document.dataBase) || document.dataBase < "2008-07" || document.dataBase >= "2050-01") issues.push(rejected("PRE-XML-005", "dataBase deve estar entre 2008-07 e 2049-12 no formato AAAA-MM.", rootPath));
	if (document.codigoDocumento !== "2061") issues.push(rejected("PRE-XML-006", "codigoDocumento deve ser exatamente 2061.", rootPath));
	if (!document.tipoEnvio || !["I", "D", "E"].includes(document.tipoEnvio)) issues.push(rejected("PRE-XML-007", "tipoEnvio deve ser I, D ou E.", rootPath));
	const cnpjPattern = document.dataBase && document.dataBase >= "2026-07" ? /^[A-Za-z0-9]{8}$/ : /^\d{8}$/;
	if (!document.cnpj || !cnpjPattern.test(document.cnpj)) issues.push(rejected("PRE-XML-008", "cnpj deve ter oito caracteres e respeitar a regra vigente da data-base.", rootPath));
	if (document.codigoConglomerado && !/^C\d{7}$/.test(document.codigoConglomerado)) issues.push(rejected("PRE-XML-008", "codigoConglomerado deve ter o formato C seguido de sete digitos.", rootPath));
	if (document.limits.length < 2) issues.push(rejected("PRE-XML-009", "limitesInformados deve conter ao menos dois limites.", "/documentoDLO/limitesInformados"));
	if (document.parameters.length < 1) issues.push(rejected("PRE-XML-009", "parametros deve conter ao menos um parametro.", "/documentoDLO/parametros"));
	if (document.accounts.length < 1) issues.push(rejected("PRE-XML-009", "contas deve conter ao menos uma conta.", "/documentoDLO/contas"));
	if (document.hasInstruments && document.instruments.length === 0) issues.push(rejected("PRE-XML-009", "instrumentosCapital nao pode estar vazio.", "/documentoDLO/instrumentosCapital"));
	issues.push(...duplicateIssues("PRE-XML-010", document.limits, (item) => item.codigoLimite, "codigoLimite"));
	issues.push(...duplicateIssues("PRE-XML-010", document.parameters, (item) => item.codigoParametro, "codigoParametro"));
	issues.push(...duplicateIssues("PRE-XML-010", document.accounts, (item) => item.codigoConta, "codigoConta"));
	issues.push(...duplicateIssues("PRE-XML-010", document.instruments, (item) => item.idTitulo, "idTitulo"));
	for (const account of document.accounts) {
		if (account.hasDloDetails && account.dloDetails.length === 0) issues.push(rejected("PRE-XML-009", "detalhamentosDLO nao pode estar vazio.", account.location.xpath, account.location.line));
		if (account.hasCosifDetails && account.cosifDetails.length === 0) issues.push(rejected("PRE-XML-009", "detalhamentosCosif nao pode estar vazio.", account.location.xpath, account.location.line));
		issues.push(...duplicateIssues("PRE-XML-010", account.cosifDetails, (item) => item.codigoCosif, "codigoCosif"));
		issues.push(...duplicateIssues("PRE-XML-010", account.participants, (item) => item.identificacaoParticipante, "identificacaoParticipante"));
		for (const detail of account.dloDetails) issues.push(...duplicateIssues("PRE-XML-010", detail.details, (item) => item.codigoElemento, "codigoElemento"));
		for (const [name, value] of [["valorConta", account.valorConta], ["valorCosif", account.valorCosif], ...account.dloDetails.map((detail) => ["valorDetalhe", detail.valorDetalhe] as const), ...account.cosifDetails.map((detail) => ["saldoCosif", detail.saldoCosif] as const)]) {
			if (value !== null && !moneyPattern.test(value)) issues.push(rejected("PRE-XML-012", `${name} deve ter no maximo 14 digitos inteiros e duas casas decimais.`, account.location.xpath, account.location.line));
		}
	}
	return issues;
}
