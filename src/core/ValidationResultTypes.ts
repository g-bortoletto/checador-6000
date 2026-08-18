export type ValidationStage = "pre-xml" | "xsd" | "header" | "structural";
export type ValidationOutcome = "rejected" | "passed" | "skipped";
export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
	id: string;
	stage: ValidationStage;
	outcome: ValidationOutcome;
	severity: ValidationSeverity;
	message: string;
	elim?: string;
	rgr?: string;
	line?: number;
	xpath?: string;
	missingDependencies?: string[];
}

export interface ValidationSummary {
	rejected: number;
	indications: number;
	skipped: number;
}

export interface ValidationResult {
	valid: boolean;
	issues: ValidationIssue[];
	summary: ValidationSummary;
}
