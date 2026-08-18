export type CsvRecord = Record<string, string>;

function fields(line: string): string[] {
	const result: string[] = [];
	let field = "";
	let quoted = false;
	for (let index = 0; index < line.length; index += 1) {
		const character = line[index];
		if (character === '"') {
			if (quoted && line[index + 1] === '"') {
				field += character;
				index += 1;
			} else quoted = !quoted;
		} else if (character === "," && !quoted) {
			result.push(field);
			field = "";
		} else field += character;
	}
	if (quoted) throw new Error("CSV possui aspas nao fechadas.");
	result.push(field);
	return result;
}

function rows(csv: string): string[] {
	const result: string[] = [];
	let row = "";
	let quoted = false;
	for (let index = 0; index < csv.length; index += 1) {
		const character = csv[index];
		if (character === '"') {
			if (quoted && csv[index + 1] === '"') {
				row += '""';
				index += 1;
			} else {
				quoted = !quoted;
				row += character;
			}
		} else if (character === "\n" && !quoted) {
			if (row.endsWith("\r")) row = row.slice(0, -1);
			if (row.length > 0) result.push(row);
			row = "";
		} else row += character;
	}
	if (quoted) throw new Error("CSV possui aspas nao fechadas.");
	if (row.length > 0) result.push(row);
	return result;
}

export function parseCsv(csv: string): CsvRecord[] {
	const records = rows(csv.replace(/^\uFEFF/, ""));
	if (records.length === 0) return [];
	const header = fields(records[0]);
	return records.slice(1).map((line, index) => {
		const values = fields(line);
		if (values.length !== header.length) throw new Error(`CSV possui ${values.length} colunas na linha ${index + 2}; esperadas ${header.length}.`);
		return Object.fromEntries(header.map((name, column) => [name, values[column]]));
	});
}
