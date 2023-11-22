import 'dotenv/config';
import type { sheets_v4 } from '@googleapis/sheets';
import type { ISchedule, ISeance } from '../../Models/ensiasSchedules';
import ensiasSchedules from '../../Models/ensiasSchedules';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { gridRangeDimensions, gridRangeToA1 } from '../../OtherModules/GSpreadSheet/cal';
import type { YearNameType } from '../../Typings/Ensias';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'] as const;
const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'] as const;
const flGrpArray = [...filieresArray, ...groupesArray] as const;
const daysArray = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as const;

type DayType = (typeof daysArray)[number];
type FlGrpType = (typeof flGrpArray)[number];

type ScheduleDay = Map<DayType, Map<(typeof flGrpArray)[number], string[]>>;
// const spId = '1DxMuX49oQqCL4Ln4DO3jCg7-Ffrm7A2We8SiMAVk_Iw';

async function saveSchedule(data: ScheduleDay, year: YearNameType & string, week: string) {
	const output: ISchedule[] = [];

	for (const fl of flGrpArray) {
		const to_add: ISchedule = {
			week,
			year,
			filiere: fl,
			days: [],
		};

		for (const dayName of daysArray) {
			const dayArray = data.get(dayName)?.get(fl);
			if (dayArray === undefined) continue;

			const day: ISeance[] = [];
			for (let ii = 0; 2 * ii < dayArray.length; ii++) {
				const seance: ISeance = {
					class: dayArray[2 * ii],
					name: dayArray[2 * ii + 1],
				};
				day.push(seance);
			}

			to_add.days.push(day);
		}

		output.push(to_add);
	}

	await Promise.all(
		output.map((sched) =>
			ensiasSchedules.updateOne(
				{ year: sched.year, filiere: sched.filiere, week: sched.week },
				{ days: sched.days },
				{ upsert: true },
			),
		),
	);
}

function extractSchedule(data: string[][]) {
	const out: ScheduleDay = new Map(
		daysArray.map((day) => [
			day,
			new Map<FlGrpType, string[]>(flGrpArray.map((flGrp) => [flGrp, Array.from<string>({ length: 8 }).fill('')])),
		]),
	);

	for (const row of data) {
		const day = row[0]?.trim().toUpperCase() as DayType;
		const dayMap = out.get(day);
		if (dayMap === undefined) continue;
		for (let ii = 0; ii * 3 < row.length; ii++) {
			const A1 = (row[ii * 3 + 1]?.trim().split(/\s+|\s*\+\s*/) as FlGrpType[] | undefined) ?? [];
			const A2 = (row[ii * 3 + 2]?.trim() as string | undefined) ?? '';
			const A3 = (row[ii * 3 + 3]?.trim() as string | undefined) ?? '';
			for (const [index, flgrp] of A1.entries()) {
				let flgrpArr = dayMap.get(flgrp);
				if (flgrpArr === undefined) {
					if (A3 === '') continue;
					if (!['1', '2'].includes(flgrp.at(-1) ?? '')) continue;
					flgrpArr = dayMap.get(flgrp.slice(0, -1) as FlGrpType);
					if (flgrpArr === undefined) continue;
					const custom = `(${flgrp})`;
					flgrpArr[ii * 2] += `${custom} ${A2}\n`;
					flgrpArr[ii * 2 + 1] += `${custom} ${A3}\n`;
				} else if (['1', '2'].includes(A1[index + 1])) {
					if (A3 === '') continue;
					const custom = `(${flgrp}${A1[index + 1]})`;
					flgrpArr[ii * 2] += `${custom} ${A2}\n`;
					flgrpArr[ii * 2 + 1] += `${custom} ${A3}\n`;
				} else {
					flgrpArr[ii * 2] = `${A2}`;
					flgrpArr[ii * 2 + 1] = `${A3}`;
				}
			}
		}
	}

	return out;
}

async function unmergeFill(activesheet: GSpreadSheet, cells: sheets_v4.Schema$GridRange[]) {
	const cellValues = await activesheet.batchGetCells(cells.map(gridRangeToA1));

	const toUpdate: sheets_v4.Schema$ValueRange[] = cells.map((cell, index) => {
		const dim = gridRangeDimensions(cell);
		const value = (cellValues?.at(index)?.values?.at(0)?.at(0) as string | undefined) ?? '';
		const range = cellValues?.at(index)?.range ?? '';
		return {
			range,
			values: Array.from<string[]>({ length: dim[0] }).fill(Array.from<string>({ length: dim[1] }).fill(value)),
		};
	});
	await activesheet.unMerge(cells);
	await activesheet.batchUpdate(toUpdate);
}

export async function makeSchedules(spId: string, year: YearNameType & string, week: string) {
	const activeSheet = await GSpreadSheet.createFromId(spId, 0);
	const mergedCells = await activeSheet.getWorksheetMergedCells();
	if (mergedCells && mergedCells.length > 1)
		await unmergeFill(
			activeSheet,
			mergedCells.filter((cell) => cell.endRowIndex! > 1),
		);
	const data = await activeSheet.getAll();
	const output = extractSchedule(data as string[][]);
	await saveSchedule(output, year, week);
}
