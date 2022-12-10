import { Schema as _Schema, model } from 'mongoose';

interface IDriveFile {
	driveName: string;
	driveId: string;
	driveMimeType: string;
	driveResourceKey?: string;
}

export interface EnsiasDriveSchema {
	drivesArray: IDriveFile[];
	filiere: string;
	year: string;
}

const driveFile = new _Schema({
	driveName: {
		type: String,
		required: true,
	},
	driveId: {
		type: String,
		required: true,
	},
	driveMimeType: {
		type: String,
		required: true,
	},
	driveResourceKey: String,
});

const Schema = new _Schema({
	drivesArray: {
		type: Array,
		of: driveFile,
		required: true,
	},
	filiere: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
});

export default model<EnsiasDriveSchema>('ensias-drive', Schema);
