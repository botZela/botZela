// Convert a number 0 ... 25 to alphabets A ... Z
function num2alpha(number: number): string {
	const code = 'A'.codePointAt(0)! + number;
	return String.fromCodePoint(code);
}

function dec2alpha(number_param: number): string {
	let number = number_param - 1;
	const out: string[] = [];
	const base = 26;
	let rest = number % base;
	out.push(num2alpha(rest));
	while (Math.floor(number / base) > 0) {
		number = Math.floor((number - base) / base);
		rest = number % base;
		out.push(num2alpha(rest));
	}

	return out.reverse().join('');
}

function hexToRgb(hex_param: string) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?(?<red>[\da-f])(?<green>[\da-f])(?<blue>[\da-f])$/i;
	const hex = hex_param.replace(shorthandRegex, (_, rr: string, gg: string, bb: string) => rr + rr + gg + gg + bb + bb);
	const result = /^#?(?<red>[\da-f]{2})(?<green>[\da-f]{2})(?<blue>[\da-f]{2})$/i.exec(hex) ?? ['1', '1', '1'];
	return {
		red: Number.parseInt(result[1], 16) / 255,
		green: Number.parseInt(result[2], 16) / 255,
		blue: Number.parseInt(result[3], 16) / 255,
	};
}

export { dec2alpha, hexToRgb };
