import { Schema as _Schema, model } from 'mongoose';

export interface ISeance {
	class: string;
	name: string;
	professor?: string;
	otherFilieres?: string[];
}

export interface ISchedule {
	year: string;
	filiere: string;
	week?: string;
	days: ISeance[][];
}

const seanceSchema = new _Schema({
	class: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	professor: String,
	otherFilieres: {
		type: [String],
		required: false,
	},
});

const Schema = new _Schema({
	year: {
		type: String,
		required: true,
	},
	filiere: {
		type: String,
		required: true,
	},
	week: {
		type: String,
		required: false,
	},
	days: {
		type: [[seanceSchema]],
		required: true,
	},
});

export default model<ISchedule>('ensias-schedule', Schema);