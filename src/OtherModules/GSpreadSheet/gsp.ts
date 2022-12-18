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
	public endCol: number;
	public endRow: number;
	public endColLetter: string;
	public headerNames: string[];

	public constructor(spId: string, worksheetIndex: number) {
		// Init of the Class
		this.worksheetId = 0;
		this.worksheetName = '';
		this.endColLetter = '';
		this.spId = spId;
		this.endCol = 1;
		this.endRow = 1;
		this.worksheetIndex = worksheetIndex;
		this.headerNames = [];
		// Connect to sheet using authFile
		const auth = new GoogleAuth({
			credentials: {
				client_email: process.env.GOOGLE_CLIENT_EMAIL,
				private_key: process.env.GOOGLE_PRIVATE_KEY,
			},
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
		this.sheets = GoogleSheets({
			version: 'v4',
			auth: auth,
		} as unknown as sheets_v4.Options);
	}

	public static async createFromId(spId: string, worksheetIndex: number): Promise<GSpreadSheet> {
		// Create the Class using the Id
		const out = new GSpreadSheet(spId, worksheetIndex);
		out.worksheetProp = await out.getWorksheetProp();
		out.worksheetName = out.worksheetProp?.title ?? '';
		out.worksheetId = out.worksheetProp?.sheetId ?? 0;
		out.endCol = out.worksheetProp?.gridProperties?.columnCount ?? 1;
		out.endRow = out.worksheetProp?.gridProperties?.rowCount ?? 1;
		out.endColLetter = out.endCol ? dec2alpha(out.endCol) : '';
		out.headerNames = (await out.getRow(1)) as string[];
		return out;
	}

	public static createFromUrl(url: string, worksheetIndex: number): Promise<GSpreadSheet> {
		// Create the Class using the sheet url
		const regExResults = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(url);
		if (regExResults === null) throw Error('RegEx Did not match with the link');
		const spreadsheetId = regExResults[1];
		return GSpreadSheet.createFromId(spreadsheetId, worksheetIndex);
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

	public async getWorksheetMergedCells() {
		// Get the Merged Cells of the sheets
		const worksheets = await this.getWorksheets();
		if (!worksheets) {
			return undefined;
		}
		try {
			return worksheets[this.worksheetIndex].merges;
		} catch (err) {
			console.log(err);
			return undefined;
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

	public async getAll() {
		// Get a specifique ROW from the Sheet returning a list of its values
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!A1:${this.endColLetter}${this.endRow}`,
		};
		try {
			const res = (await this.sheets.spreadsheets.values.get(request)).data;
			const rows = res.values;
			if (rows?.length) {
				return rows as unknown[][];
			}
			// Console.log("No data found.");
			return [];
		} catch (err) {
			console.log(err);
			return [];
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

	public async batchGetCells(cells: string[]) {
		// Get the value of a Specifique CELL
		const request = {
			spreadsheetId: this.spId,
			ranges: cells.map((cell) => `${this.worksheetName}!${cell}`),
		};
		try {
			const res = (await this.sheets.spreadsheets.values.batchGet(request)).data;
			return res.valueRanges;
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

	public check() {
		const wantedTitles = [
			'Timestamp',
			'First Name',
			'Last Name',
			'Email',
			'Phone Number',
			'Discord Username',
			'ID Discord',
		];
		const n = wantedTitles.length;
		const firstRow = this.headerNames.slice(0, n);
		for (let i = 0; i < n; i++) {
			if (firstRow[i] !== wantedTitles[i]) {
				return false;
			}
		}
		return true;
	}

	public async batchUpdate(data: sheets_v4.Schema$ValueRange[]): Promise<void> {
		const request: sheets_v4.Schema$BatchUpdateValuesRequest = {
			valueInputOption: 'USER_ENTERED',
			data,
		};
		try {
			await this.sheets.spreadsheets.values.batchUpdate({ spreadsheetId: this.spId, requestBody: request });
			// Const result = (await this.sheets.spreadsheets.values.update(request)).data;
			// Console.log('%d cells updated.', result.updatedCells);
		} catch (err) {
			console.log(err);
		}
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

	public async unMerge(cells: sheets_v4.Schema$GridRange[]) {
		// Color a Row with a HEX Color
		// const requests: sheets_v4.Schema$Request[] = [];
		const requests: sheets_v4.Schema$Request[] = cells.map((cell) => ({
			unmergeCells: {
				range: cell,
			},
		}));
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

	public async getRowDict(row: number) {
		const data = await this.getRow(row);
		const output: Map<string, unknown> = new Map();

		for (let i = 0; i < this.endCol; i++) {
			output.set(this.headerNames[i], data[i] ?? '');
		}

		return output;
	}

	public async getAllDict() {
		const data = await this.getAll();

		const out = data.map((row, index) => {
			const map: Map<string, unknown> = new Map();
			map.set('index', index + 1);
			for (let i = 0; i < this.endCol; i++) {
				map.set(this.headerNames[i], row[i] ?? '');
			}
			return map;
		});

		return out;
	}

	public getCellRefFromIndex(row: number, col: number) {
		return `${dec2alpha(col)}${row}`;
	}

	public getColIndDict(col: string) {
		return this.headerNames.indexOf(col) + 1;
	}

	public async setCellDict(row: number, col: string, value: string) {
		const colIndex = this.getColIndDict(col);
		const cell = this.getCellRefFromIndex(row, colIndex);
		await this.updateCell(cell, value);
	}
}
