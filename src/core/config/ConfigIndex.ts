export interface VersionedConfig<T> {
	effectiveFrom: string;
	version: string;
	value: T;
}

export function configForDate<T>(versions: VersionedConfig<T>[], dataBase: string): VersionedConfig<T> | undefined {
	return versions
		.filter((version) => version.effectiveFrom <= dataBase)
		.sort((left, right) => right.effectiveFrom.localeCompare(left.effectiveFrom))[0];
}
