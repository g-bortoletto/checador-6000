import { describe, expect, it } from "vitest";
import catalog from "../../docs/dlo/catalogo-validacoes-pre-pos-processamento.md?raw";
import manifest from "../../docs/dlo/manifesto-cobertura.md?raw";
const states = new Set(["implemented", "partial", "conditional", "blocked"]);
const identifier = /(?:PRE-(?:XML|REF|EST|VAL)-\d{3}|ELIM\d{4}|DLO\d{5}|LIM\d{5})/g;

function identifiers(text: string): Set<string> {
	return new Set(text.match(identifier) ?? []);
}

function coveredIdentifiers(text: string): Set<string> {
	const covered = identifiers(text);
	const ranges = /((?:PRE-(?:XML|REF|EST|VAL)-\d{3}|ELIM\d{4}|DLO\d{5}|LIM\d{5}))\s+(?:a|-)\s+((?:PRE-(?:XML|REF|EST|VAL)-\d{3}|ELIM\d{4}|DLO\d{5}|LIM\d{5}))/g;
	for (const match of text.matchAll(ranges)) {
		const [start, end] = [match[1], match[2]];
		const prefix = start.replace(/\d+$/, "");
		if (!end.startsWith(prefix)) continue;
		for (let value = Number(start.slice(prefix.length)); value <= Number(end.slice(prefix.length)); value += 1) {
			covered.add(`${prefix}${value.toString().padStart(start.length - prefix.length, "0")}`);
		}
	}
	return covered;
}

describe("coverage manifest", () => {
	it("declares an auditable state and justification for every catalog family", () => {
		const rows = manifest.split("\n").filter((line) => line.startsWith("| ") && !line.startsWith("| ---") && !line.startsWith("| Catalogo"));
		for (const row of rows) {
			const columns = row.split("|").map((column) => column.trim());
			expect(states.has(columns[2])).toBe(true);
			expect(columns[4]?.length).toBeGreaterThan(0);
		}
		for (const family of ["PRE-XML", "PRE-REF", "PRE-EST", "PRE-VAL", "ELIM", "RGR", "DLO", "LIM"]) {
			expect(catalog).toContain(family);
			expect(manifest).toContain(family);
		}
		const covered = coveredIdentifiers(manifest);
		for (const id of identifiers(catalog)) expect(covered).toContain(id);
	});
});
