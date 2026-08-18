export interface DloLocation {
	line?: number;
	xpath: string;
}

export interface DloNode {
	location: DloLocation;
}

export interface DloLimit extends DloNode {
	codigoLimite: string | null;
	enviado: string | null;
}

export interface DloParameter extends DloNode {
	codigoParametro: string | null;
	valorParametro: string | null;
}

export interface DloDetail extends DloNode {
	codigoElemento: string | null;
	valorElemento: string | null;
}

export interface DloDloDetail extends DloNode {
	valorDetalhe: string | null;
	details: DloDetail[];
}

export interface DloCosifDetail extends DloNode {
	codigoCosif: string | null;
	saldoCosif: string | null;
}

export interface DloParticipant extends DloNode {
	identificacaoParticipante: string | null;
}

export interface DloAccount extends DloNode {
	codigoConta: string | null;
	valorConta: string | null;
	valorCosif: string | null;
	dloDetails: DloDloDetail[];
	cosifDetails: DloCosifDetail[];
	participants: DloParticipant[];
	hasDloDetails: boolean;
	hasCosifDetails: boolean;
}

export interface DloInstrument extends DloNode {
	idTitulo: string | null;
}

export interface DloDocument {
	cnpj: string | null;
	dataBase: string | null;
	codigoDocumento: string | null;
	tipoEnvio: string | null;
	codigoConglomerado: string | null;
	limits: DloLimit[];
	parameters: DloParameter[];
	accounts: DloAccount[];
	instruments: DloInstrument[];
	hasInstruments: boolean;
}
