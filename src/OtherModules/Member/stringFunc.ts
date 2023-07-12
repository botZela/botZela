function titleCase(str: string): string {
	return str
		.split(/\s+/g)
		.map((vv) => vv[0].toUpperCase() + vv.slice(1).toLowerCase())
		.join(' ');
}

export { titleCase };
