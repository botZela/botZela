export function choice<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}

export function shuffle<T>(list: T[], size?: number): T[] {
	const array = [...list];
	for (let ii = array.length - 1; ii > 0; ii--) {
		const jj = Math.floor(Math.random() * (ii + 1));
		[array[ii], array[jj]] = [array[jj], array[ii]];
	}

	return size ? array.slice(0, size) : array;
}
