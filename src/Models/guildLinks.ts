import { Schema as _Schema, model } from 'mongoose';

const Schema = new _Schema({
	guildId: {
		type: String,
		required: true,
	},
	guildName: {
		type: String,
		required: false,
	},
	spreadsheet: String,
	form: String,
});

export default model('guild-links', Schema);
