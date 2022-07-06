/* eslint-disable camelcase */
import { sheets as GoogleSheets, sheets_v4 } from '@googleapis/sheets';
import { GoogleAuth } from 'googleapis-common';
import { dec2alpha, hexToRgb } from './cal';

export class GSpreadSheet {
	public authFile: string | undefined;
	public sheets: sheets_v4.Sheets;
	public spId: string;
	public worksheetIndex: number;
	public worksheetProp: sheets_v4.Schema$SheetProperties | undefined;
	public worksheetName: string;
	public worksheetId: number;
	public endCol: number | null | undefined;
	public endRow: number | null | undefined;
	public endColLetter: string;

	public constructor(spId: string, authFile: string, worksheetIndex: number) {
		// Init of the Class
		this.worksheetId = 0;
		this.worksheetName = '';
		this.endColLetter = '';
		this.authFile = authFile;
		this.spId = spId;
		this.worksheetIndex = worksheetIndex;
		// Connect to sheet using authFile
		const auth = new GoogleAuth({
			keyFile: this.authFile,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
		this.sheets = GoogleSheets({
			version: 'v4',
			auth: auth,
		} as unknown as sheets_v4.Options);
	}

	public static async createFromId(spId: string, authFile: string, worksheetIndex: number): Promise<GSpreadSheet> {
		// Create the Class using the Id
		const out = new GSpreadSheet(spId, authFile, worksheetIndex);
		out.worksheetProp = await out.getWorksheetProp();
		out.worksheetName = out.worksheetProp?.title ?? '';
		out.worksheetId = out.worksheetProp?.sheetId ?? 0;
		out.endCol = out.worksheetProp?.gridProperties?.columnCount;
		out.endRow = out.worksheetProp?.gridProperties?.rowCount;
		out.endColLetter = out.endCol ? dec2alpha(out.endCol) : '';
		return out;
	}

	public static createFromUrl(url: string, authFile: string, worksheetIndex: number): Promise<GSpreadSheet> {
		// Create the Class using the sheet url
		const regExResults = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(url);
		if (regExResults === null) throw Error('RegEx Did not match with the link');
		const spreadsheetId = regExResults[1];
		return GSpreadSheet.createFromId(spreadsheetId, authFile, worksheetIndex);
	}

	public async getWorksheets(): Promise<sheets_v4.Schema$Sheet[] | undefined> {
		// Get the worksheets of the given Spreadsheet
		const request = {
			spreadsheetId: this.spId,
		};
		try {
			const res = (await this.sheets.spreadsheets.get(request)).data;
			return res.sheets;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	public async getWorksheetProp() {
		// Get the properties of the sheets
		const worksheets = await this.getWorksheets();
		if (!worksheets) {
			return undefined;
		}
		try {
			return worksheets[this.worksheetIndex].properties;
		} catch (err) {
			console.log(err);
			return undefined;
		}
	}

	public async getRow(row: number) {
		// Get a specifique ROW from the Sheet returning a list of its values
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!A${row}:${this.endColLetter}${row}`,
		};
		try {
			const res = (await this.sheets.spreadsheets.values.get(request)).data;
			const rows = res.values;
			if (rows?.length) {
				return rows[0] as unknown[];
			}
			// Console.log("No data found.");
			return [];
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	public async getCol(col: string) {
		// Get a specifique Column From the Sheet returning a list of its Values
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!${col}:${col}`,
		};
		try {
			const res = (await this.sheets.spreadsheets.values.get(request)).data;
			const rows = res.values;
			if (rows?.length) {
				const cols: unknown[] = [];
				rows.forEach((row: unknown[]) => {
					cols.push(row[0]);
				});
				return cols;
			}
			// Console.log("No Idata found.");
			return [];
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	public async getCell(cell: string) {
		// Get the value of a Specifique CELL
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!${cell}`,
		};
		try {
			const res = (await this.sheets.spreadsheets.values.get(request)).data;
			const rows = res.values;
			if (rows?.length) {
				return rows[0][0] as unknown;
			}
			// Console.log("No data found.");
			return '';
		} catch (err) {
			console.log(err);
			return '';
		}
	}

	public async check() {
		const wantedTitles = [
			'Timestamp',
			'First Name',
			'Last Name',
			'Email',
			'Phone Number',
			'Discord Username',
			'ID Discord',
		];
		let check = true;
		const n = wantedTitles.length;
		const firstRow = (await this.getRow(1)).slice(0, n);
		for (let i = 0; i < n; i++) {
			if (firstRow[i] !== wantedTitles[i]) {
				check = false;
				break;
			}
		}
		return check;
	}

	/**
	 * Update "A1" cell with a value
	 * @param {string} cell The cell "B12".
	 * @param {string} value The new Value.
	 */
	public async updateCell(cell: string, value: string): Promise<void> {
		const values = [[value]];
		const resource = {
			values,
		};
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!${cell}`,
			valueInputOption: 'RAW',
			resource,
		};
		try {
			await this.sheets.spreadsheets.values.update(request);
			// Const result = (await this.sheets.spreadsheets.values.update(request)).data;
			// Console.log('%d cells updated.', result.updatedCells);
		} catch (err) {
			console.log(err);
		}
	}

	public async colorRow(row: number, color: string) {
		// Color a Row with a HEX Color
		const requests: sheets_v4.Schema$Request[] = [];
		const { r, g, b } = hexToRgb(color);
		requests.push({
			repeatCell: {
				range: {
					sheetId: this.worksheetId,
					startRowIndex: row - 1,
					endRowIndex: row,
				},
				cell: {
					userEnteredFormat: {
						backgroundColor: {
							red: r,
							green: g,
							blue: b,
						},
					},
				},
				fields: 'userEnteredFormat(backgroundColor)',
			},
		});
		const batchUpdateRequest: sheets_v4.Schema$BatchUpdateSpreadsheetRequest = {
			requests,
		};
		try {
			await this.sheets.spreadsheets.batchUpdate({
				spreadsheetId: this.spId,
				resource: batchUpdateRequest,
			} as sheets_v4.Params$Resource$Spreadsheets$Batchupdate);
		} catch (err) {
			console.error(err);
		}
	}

	public async findCellCol(value: unknown, col: string) {
		const columns = await this.getCol(col);
		return columns.indexOf(value) + 1;
	}
}