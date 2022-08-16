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
	filiere: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
});

export default model('ensias-drive', Schema);
