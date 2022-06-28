export async function importFile(filePath: string) {
	return (await import(filePath))?.default;
}
