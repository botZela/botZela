import { Schema as _Schema, model } from 'mongoose';

const Schema = new _Schema({
	driveName: {
		type: String,
		required: true,
	},
	driveId: {
		type: String,
		required: true,
	},
	driveResourceKey: String,
});

export default model('ensias-data', Schema);
