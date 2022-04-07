const { dec2alpha, hexToRgb } = require("./cal.js");
const { google } = require("googleapis");

class GSpreadSheet {

    connect() { // Connect to sheet using authFile
        const auth = new google.auth.GoogleAuth({
            keyFile: this.authFile,
            scopes: ['https://www.googleapis.com/auth/spreadsheets', ],
        });
        this.sheets = google.sheets({
            version: 'v4',
            auth
        });
    }

    constructor(spId, authFile, worksheetIndex) { // Init of the Class
        this.authFile = authFile;
        this.spId = spId;
        this.worksheetIndex = worksheetIndex;
        this.connect();
    }

    static async createFromId(spId, authFile, worksheetIndex) { // Create the Class using the Id
        const out = new GSpreadSheet(spId, authFile, worksheetIndex);
        out.worksheetProp = await out.getWorksheetProp();
        out.worksheetName = out.worksheetProp.title;
        out.worksheetId = out.worksheetProp.sheetId;
        out.endCol = out.worksheetProp.gridProperties.columnCount;
        out.endRow = out.worksheetProp.gridProperties.rowCount;
        out.endColLetter = dec2alpha(out.endCol);
        return out;
    }

    static async createFromUrl(url, authFile, worksheetIndex) { // Create the Class using the sheet url 
        let spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(url)[1];
        return await GSpreadSheet.createFromId(spreadsheetId, authFile, worksheetIndex);
    }

    async getWorksheets() { // Get the worksheets of the given Spreadsheet 
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

    async getWorksheetProp() { // Get the properties of the sheets
        let worksheets = await this.getWorksheets();
        try {
            return worksheets[this.worksheetIndex].properties;
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async getRow(row) { // Get a specifique ROW from the Sheet returning a list of its values
        const request = {
            spreadsheetId: this.spId,
            range: `${this.worksheetName}!A${row}:${this.endColLetter}${row}`,
        };
        try {
            let res = (await this.sheets.spreadsheets.values.get(request)).data;
            let rows = res.values;
            if (rows.length) {
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

    async getCol(col) { // Get a specifique Column From the Sheet returning a list of its Values
        const request = {
            spreadsheetId: this.spId,
            range: `${this.worksheetName}!${col}:${col}`,
        };
        try {
            let res = (await this.sheets.spreadsheets.values.get(request)).data;
            let rows = res.values;
            if (rows.length) {
                let cols = [];
                rows.forEach(row => {
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

    async getCell(cell) { // Get the value of a Specifique CELL
        const request = {
            spreadsheetId: this.spId,
            range: `${this.worksheetName}!${cell}`,
        };
        try {
            let res = (await this.sheets.spreadsheets.values.get(request)).data;
            let rows = res.values;
            if (rows.length) {
                return rows[0][0];
            } else {
                // console.log("No data found.");
                return "";
            }
        } catch (err) {
            console.log(err);
            return "";
        }
    }
    async check() {
        let wantedTitles = ["Timestamp", "First Name", "Last Name", "Email", "Phone Number", "Discord Username", "ID Discord"];
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

    async updateCell(cell, value) { // Update "A1" cell with a value
        let values = [
            [
                value,
            ],
        ];
        const resource = {
            values,
        };
        let request = {
            spreadsheetId: this.spId,
            range: `${this.worksheetName}!${cell}`,
            valueInputOption: "RAW",
            resource,
        };
        try {
            let result = (await this.sheets.spreadsheets.values.update(request)).data;
            // console.log('%d cells updated.', result.updatedCells);
        } catch {
            console.log(err);
        }
    }

    async colorRow(row, color) { // Color a Row with a HEX Color
        let requests = [];
        let { r, g, b } = hexToRgb(color);
        requests.push({
            "repeatCell": {
                "range": {
                    "sheetId": this.worksheetId,
                    "startRowIndex": row - 1,
                    "endRowIndex": row
                },
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": {
                            "red": r,
                            "green": g,
                            "blue": b
                        },
                    }
                },
                "fields": "userEnteredFormat(backgroundColor)"
            }
        });
        const batchUpdateRequest = {
            requests
        };
        try {
            let response = (await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spId,
                resource: batchUpdateRequest,
            })).data;
        } catch (err) {
            console.error(err);
        }
    }

    async findCellCol(value, col) {
        let columns = await this.getCol(col);
        return columns.indexOf(value) + 1;
    }
}

module.exports = {
    GSpreadSheet,
}