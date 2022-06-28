function titleCase(str: string): string {
	let str1 = str.toLowerCase();
	return str1[0].toUpperCase() + str1.slice(1);
}

export { titleCase };
