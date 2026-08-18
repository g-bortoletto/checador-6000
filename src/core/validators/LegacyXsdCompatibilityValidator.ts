export function allowsAlphanumericCnpj(dataBase: string | null): boolean {
	return dataBase !== null && dataBase >= "2026-07";
}
