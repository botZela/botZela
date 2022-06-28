// Convert a number 0 ... 25 to alphabets A ... Z
function num2alpha(number: number): string {
	const code = 'A'.charCodeAt(0) + number;
	return String.fromCharCode(code);
}

function dec2alpha(number: number): string {
	number -= 1;
	let out: string[] = [];
	let base = 26;
	let r = number % base;
	out.push(num2alpha(r));
	while (Math.floor(number / base) > 0) {
		number = Math.floor((number - base) / base);
		let r = number % base;
		out.push(num2alpha(r));
	}
	return out.reverse().join('');
}

function hexToRgb(hex: string) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r: string, g: string, b: string) {
		return r + r + g + g + b + b;
	});
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16) / 255,
				g: parseInt(result[2], 16) / 255,
				b: parseInt(result[3], 16) / 255,
		  }
		: {
				r: 1,
				g: 1,
				b: 1,
		  };
}

export { dec2alpha, hexToRgb };
