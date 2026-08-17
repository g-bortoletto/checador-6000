export interface ValidationError {
	message: string;
	line?: number;
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}
