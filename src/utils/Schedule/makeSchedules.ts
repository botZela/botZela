import 'dotenv/config';
import { sheets_v4 } from '@googleapis/sheets';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { gridRangeDimensions, gridRangeToA1 } from '../../OtherModules/GSpreadSheet/cal';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'] as const;
const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'] as const;
const flGrpArray = [...filieresArray, ...groupesArray] as const;
const daysArray = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as const;

type DayType = typeof daysArray[number];
type FlGrpType = typeof flGrpArray[number];

type ScheduleDay = Map<DayType, Map<typeof flGrpArray[number], string[]>>;

export function extractSchedule(data: string[][]) {
	const out: ScheduleDay = new Map(
		daysArray.map((day) => [day, new Map<FlGrpType, string[]>(flGrpArray.map((flGrp) => [flGrp, Array(8).fill('')]))]),
	);

	for (const row of data) {
		const day = row[0]?.trim().toUpperCase() as DayType;
		const dayMap = out.get(day);
		if (dayMap === undefined) continue;
		for (let i = 0; i * 3 < row.length; i++) {
			const A1 = (row[i * 3 + 1]?.trim().split(/\s+/) as FlGrpType[] | undefined) ?? [];
			const A2 = (row[i * 3 + 2]?.trim() as string | undefined) ?? '';
			const A3 = (row[i * 3 + 3]?.trim() as string | undefined) ?? '';
			A1.forEach((flgrp, index) => {
				let flgrpArr = dayMap.get(flgrp);
				if (flgrpArr === undefined) {
					if (!['1', '2'].includes(flgrp.at(-1) ?? '')) return;
					flgrpArr = dayMap.get(flgrp.slice(0, -1) as FlGrpType);
					if (flgrpArr === undefined) return;
					const custom = `(${flgrp})`;
					flgrpArr[i * 2] += `${custom} ${A2}\n`;
					flgrpArr[i * 2 + 1] += `${custom} ${A3}\n`;
				} else if (['1', '2'].includes(A1[index + 1])) {
					const custom = `(${flgrp}${A1[index + 1]})`;
					flgrpArr[i * 2] += `${custom} ${A2}\n`;
					flgrpArr[i * 2 + 1] += `${custom} ${A3}\n`;
				} else {
					flgrpArr[i * 2] = `${A2}`;
					flgrpArr[i * 2 + 1] = `${A3}`;
				}
			});
		}
	}
	return out;
}

export async function unmergeFill(activesheet: GSpreadSheet, cells: sheets_v4.Schema$GridRange[]) {
	const cellValues = await activesheet.batchGetCells(cells.map(gridRangeToA1));

	const toUpdate: sheets_v4.Schema$ValueRange[] = cells.map((cell, index) => {
		const dim = gridRangeDimensions(cell);
		const value = (cellValues?.at(index)?.values?.at(0)?.at(0) as string | undefined) ?? '';
		const range = cellValues?.at(index)?.range ?? '';
		return {
			range,
			values: Array<string[]>(dim[0]).fill(Array<string>(dim[1]).fill(value)),
		};
	});
	await activesheet.unMerge(cells);
	await activesheet.batchUpdate(toUpdate);
}

async function makeSchedules() {
	const spId = '1DxMuX49oQqCL4Ln4DO3jCg7-Ffrm7A2We8SiMAVk_Iw';
	const activeSheet = await GSpreadSheet.createFromId(spId, 0);
	// const mergedCells = await activeSheet.getWorksheetMergedCells();
	// const toFetch = mergedCells?.map(gridRangeToA1);
	// if (toFetch) console.log(JSON.stringify(await activeSheet.batchGetCells(toFetch), null, 4));
	// console.log(JSON.stringify(mergedCells, null, 4 ));
	// if (mergedCells)
	// 	await unmergeFill(
	// 		activeSheet,
	// 		mergedCells.filter((cell) => cell.endRowIndex! > 1),
	// 	);
	const data = await activeSheet.getAll();
	// console.log(JSON.stringify(data, null, 4));
	extractSchedule(data as string[][]);
}

void makeSchedules();
