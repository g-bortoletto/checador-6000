export type FormulaToken =
	| { type: "identifier"; value: string }
	| { type: "number"; value: string }
	| { type: "operator"; value: string }
	| { type: "separator" | "parenthesis"; value: string };

export function lexFormula(formula: string): FormulaToken[] {
	const tokens: FormulaToken[] = [];
	const pattern = /\s+|\d+(?:,\d+)?|[A-Z_][A-Z0-9_]*|==|<=|>=|[-+*/<>]|[();]/gy;
	let index = 0;
	while (index < formula.length) {
		pattern.lastIndex = index;
		const match = pattern.exec(formula);
		if (!match) throw new Error(`Token invalido na posicao ${index + 1}.`);
		index = pattern.lastIndex;
		const value = match[0];
		if (/^\s+$/.test(value)) continue;
		if (/^\d/.test(value)) tokens.push({ type: "number", value });
		else if (/^[A-Z_]/.test(value)) tokens.push({ type: "identifier", value });
		else if (value === ";") tokens.push({ type: "separator", value });
		else if (value === "(" || value === ")") tokens.push({ type: "parenthesis", value });
		else tokens.push({ type: "operator", value });
	}
	return tokens;
}
