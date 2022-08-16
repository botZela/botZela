import { Schema as _Schema, model } from 'mongoose';

const Schema = new _Schema({
	guildId: {
		type: String,
		required: true,
	},
	guildName: String,
	channelId: {
		type: String,
		required: true,
	},
	messageId: {
		type: String,
		required: true,
	},
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

export default model('guild-drive', Schema);
