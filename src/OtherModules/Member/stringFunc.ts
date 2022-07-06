function titleCase(str: string): string {
	return str
		.split(/\s+/g)
		.map((v) => v[0].toUpperCase() + v.slice(1).toLowerCase())
		.join(' ');
}

export { titleCase };
