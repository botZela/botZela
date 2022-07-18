export function choice<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}

export function shuffle<T>(list: T[], size?: number): T[] {
	const array = [...list];
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return size ? array.slice(0, size) : array;
}
