import { Schema as _Schema, model } from 'mongoose';

/**
 * Channels Structure
 * - channelName : channelId;
 */

const Schema = new _Schema({
	guildId: {
		type: String,
		required: true,
	},
	guildName: String,
	channels: {
		type: Map,
		of: String,
		required: true,
	},
});

export default model('guild-channels', Schema);
