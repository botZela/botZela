import { dec2alpha, hexToRgb } from './cal';
import { GoogleAuth } from 'googleapis-common';
import { sheets as GoogleSheets } from '@googleapis/sheets';
import { sheets_v4 } from '@googleapis/sheets';
import { FSWatcher, PathLike } from 'fs';

export class GSpreadSheet {
	authFile: string | undefined;
	sheets: sheets_v4.Sheets;
	spId: string;
	worksheetIndex: number;
	worksheetProp: sheets_v4.Schema$SheetProperties | undefined;
	worksheetName: string | null | undefined;
	worksheetId: number | null | undefined;
	endCol: number | null | undefined;
	endRow: number | null | undefined;
	endColLetter: string | undefined;

	constructor(spId: string, authFile: string, worksheetIndex: number) {
		// Init of the Class
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

	static async createFromId(spId: string, authFile: string, worksheetIndex: number) {
		// Create the Class using the Id
		const out = new GSpreadSheet(spId, authFile, worksheetIndex);
		out.worksheetProp = await out.getWorksheetProp();
		out.worksheetName = out.worksheetProp?.title;
		out.worksheetId = out.worksheetProp?.sheetId;
		out.endCol = out.worksheetProp?.gridProperties?.columnCount;
		out.endRow = out.worksheetProp?.gridProperties?.rowCount;
		out.endColLetter = out.endCol ? dec2alpha(out.endCol) : '';
		return out;
	}

	static async createFromUrl(url: string, authFile: string, worksheetIndex: number): Promise<GSpreadSheet> {
		// Create the Class using the sheet url
		const regExResults = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(url);
		if (regExResults === null) throw 'RegEx Did not match with the link';
		let spreadsheetId = regExResults[1];
		return await GSpreadSheet.createFromId(spreadsheetId, authFile, worksheetIndex);
	}

	async getWorksheets(): Promise<sheets_v4.Schema$Sheet[] | undefined> {
		// Get the worksheets of the given Spreadsheet
		const request = {
			spreadsheetId: this.spId,
		};
		try {
			let res = (await this.sheets.spreadsheets.get(request)).data;
			return res.sheets;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async getWorksheetProp() {
		// Get the properties of the sheets
		let worksheets = await this.getWorksheets();
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

	async getRow(row: number) {
		// Get a specifique ROW from the Sheet returning a list of its values
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!A${row}:${this.endColLetter}${row}`,
		};
		try {
			let res = (await this.sheets.spreadsheets.values.get(request)).data;
			let rows = res.values;
			if (rows?.length) {
				return rows[0];
			} else {
				// console.log("No data found.");
				return [];
			}
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async getCol(col: number) {
		// Get a specifique Column From the Sheet returning a list of its Values
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!${col}:${col}`,
		};
		try {
			let res = (await this.sheets.spreadsheets.values.get(request)).data;
			let rows = res.values;
			if (rows?.length) {
				let cols: any[] = [];
				rows.forEach((row: any[]) => {
					cols.push(row[0]);
				});
				return cols;
			} else {
				// console.log("No Idata found.");
				return [];
			}
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async getCell(cell: string) {
		// Get the value of a Specifique CELL
		const request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!${cell}`,
		};
		try {
			let res = (await this.sheets.spreadsheets.values.get(request)).data;
			let rows = res.values;
			if (rows?.length) {
				return rows[0][0];
			} else {
				// console.log("No data found.");
				return '';
			}
		} catch (err) {
			console.log(err);
			return '';
		}
	}
	async check() {
		let wantedTitles = [
			'Timestamp',
			'First Name',
			'Last Name',
			'Email',
			'Phone Number',
			'Discord Username',
			'ID Discord',
		];
		let check = true;
		let n = wantedTitles.length;
		let firstRow = (await this.getRow(1)).slice(0, n);
		for (let i = 0; i < n; i++) {
			if (firstRow[i] != wantedTitles[i]) {
				check = false;
				break;
			}
		}
		return check;
	}

	/**
	 * Update "A1" cell with a value
	 * @param cell
	 * @param value
	 */
	async updateCell(cell: string, value: string) {
		let values = [[value]];
		const resource = {
			values,
		};
		let request = {
			spreadsheetId: this.spId,
			range: `${this.worksheetName}!${cell}`,
			valueInputOption: 'RAW',
			resource,
		};
		try {
			let result = (await this.sheets.spreadsheets.values.update(request)).data;
			// console.log('%d cells updated.', result.updatedCells);
		} catch (err) {
			console.log(err);
		}
	}

	async colorRow(row: number, color: string) {
		// Color a Row with a HEX Color
		let requests: sheets_v4.Schema$Request[] = [];
		let { r, g, b } = hexToRgb(color);
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

	async findCellCol(value: any, col: any) {
		let columns = await this.getCol(col);
		return columns.indexOf(value) + 1;
	}
}
