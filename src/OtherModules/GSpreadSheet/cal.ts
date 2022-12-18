import { sheets_v4 } from '@googleapis/sheets';

// Convert a number 0 ... 25 to alphabets A ... Z
function num2alpha(number: number): string {
	const code = 'A'.codePointAt(0)! + number;
	return String.fromCodePoint(code);
}

export function dec2alpha(number: number): string {
	number--;
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

export function hexToRgb(hex: string) {
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

export function gridRangeDimensions(cell: sheets_v4.Schema$GridRange): [number, number] {
	// TODO: handle the undefined and null cases
	const rows = cell.endRowIndex! - cell.startRowIndex!;
	const cols = cell.endColumnIndex! - cell.startColumnIndex!;
	return [rows, cols];
}

export function gridRangeToA1(cell: sheets_v4.Schema$GridRange) {
	// TODO: handle the undefined and null cases

	const startColumn = dec2alpha(cell.startColumnIndex! + 1);
	const endColumn = dec2alpha(cell.endColumnIndex!);
	const startRow = cell.startRowIndex! + 1;
	const endRow = cell.endRowIndex!;

	const isCell = startRow === endRow && startColumn === endColumn;
	if (isCell) return `${startRow}${startColumn}`;
	return `${startColumn}${startRow}:${endColumn}${endRow}`;
}
