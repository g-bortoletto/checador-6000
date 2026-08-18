import type {
	DloAccount,
	DloCosifDetail,
	DloDetail,
	DloDloDetail,
	DloDocument,
	DloInstrument,
	DloLimit,
	DloParameter,
	DloParticipant,
	DloLocation,
} from "./DloTypes";

export class DloXmlParseError extends Error {}

function xpathFor(element: Element): string {
	const parts: string[] = [];
	let current: Element | null = element;
	while (current) {
		let index = 1;
		let sibling = current.previousElementSibling;
		while (sibling) {
			if (sibling.tagName === current.tagName) index += 1;
			sibling = sibling.previousElementSibling;
		}
		parts.unshift(`${current.tagName}[${index}]`);
		current = current.parentElement;
	}
	return `/${parts.join("/").replace(/\[1\](?=\/|$)/g, "")}`;
}

function findLine(xml: string, element: Element): number | undefined {
	const sameName = Array.from(element.ownerDocument?.querySelectorAll(element.tagName) ?? []);
	const occurrence = sameName.indexOf(element);
	const expression = new RegExp(`<${element.tagName}(?:\\s|/|>)`, "g");
	let position = -1;
	for (let index = 0; index <= occurrence; index += 1) {
		const match = expression.exec(xml);
		if (!match) return undefined;
		position = match.index;
	}
	if (position < 0) return undefined;
	return xml.slice(0, position).split(/\r\n|\r|\n/).length;
}

function location(xml: string, element: Element): DloLocation {
	return { xpath: xpathFor(element), line: findLine(xml, element) };
}

function children(element: Element, name: string): Element[] {
	return Array.from(element.children).filter((child) => child.tagName === name);
}

function attribute(element: Element, name: string): string | null {
	return element.getAttribute(name);
}

export function parseDloXml(xml: string): DloDocument {
	const document = new DOMParser().parseFromString(xml, "application/xml");
	if (document.querySelector("parsererror")) throw new DloXmlParseError("O XML nao esta bem formado.");
	const root = document.documentElement;
	if (root.tagName !== "documentoDLO") throw new DloXmlParseError("O elemento raiz deve ser documentoDLO.");

	const limits = children(root.querySelector(":scope > limitesInformados") ?? root, "limite").map<DloLimit>((element) => ({
		location: location(xml, element), codigoLimite: attribute(element, "codigoLimite"), enviado: attribute(element, "enviado"),
	}));
	const parameters = children(root.querySelector(":scope > parametros") ?? root, "parametro").map<DloParameter>((element) => ({
		location: location(xml, element), codigoParametro: attribute(element, "codigoParametro"), valorParametro: attribute(element, "valorParametro"),
	}));
	const accounts = children(root.querySelector(":scope > contas") ?? root, "conta").map<DloAccount>((element) => {
		const hasDloDetails = element.querySelector(":scope > detalhamentosDLO") !== null;
		const hasCosifDetails = element.querySelector(":scope > detalhamentosCosif") !== null;
		const dloDetails = Array.from(element.querySelectorAll(":scope > detalhamentosDLO > detalhamentoDLO")).map<DloDloDetail>((detail) => ({
			location: location(xml, detail), valorDetalhe: attribute(detail, "valorDetalhe"),
			details: children(detail, "detalhe").map<DloDetail>((item) => ({ location: location(xml, item), codigoElemento: attribute(item, "codigoElemento"), valorElemento: attribute(item, "valorElemento") })),
		}));
		const cosifDetails = Array.from(element.querySelectorAll(":scope > detalhamentosCosif > detalhamentoCosif")).map<DloCosifDetail>((detail) => ({ location: location(xml, detail), codigoCosif: attribute(detail, "codigoCosif"), saldoCosif: attribute(detail, "saldoCosif") }));
		const participants = Array.from(element.querySelectorAll(":scope > cliente > detalhamentosCliente > detalhamentoCliente")).map<DloParticipant>((participant) => ({ location: location(xml, participant), identificacaoParticipante: attribute(participant, "identificacaoParticipante") }));
		return { location: location(xml, element), codigoConta: attribute(element, "codigoConta"), valorConta: attribute(element, "valorConta"), valorCosif: attribute(element, "valorCosif"), dloDetails, cosifDetails, participants, hasDloDetails, hasCosifDetails };
	});
	const instrumentSection = root.querySelector(":scope > instrumentosCapital");
	const instruments = children(instrumentSection ?? root, "instrumentoCapital").map<DloInstrument>((element) => ({ location: location(xml, element), idTitulo: attribute(element, "idTitulo") }));
	return {
		cnpj: attribute(root, "cnpj"), dataBase: attribute(root, "dataBase"), codigoDocumento: attribute(root, "codigoDocumento"), tipoEnvio: attribute(root, "tipoEnvio"), codigoConglomerado: attribute(root, "codigoConglomerado"),
		limits, parameters, accounts, instruments, hasInstruments: instrumentSection !== null,
	};
}
