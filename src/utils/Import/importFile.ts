export async function importFile(filePath: string) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
	return (await import(filePath))?.default;
}
