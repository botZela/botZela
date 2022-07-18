import { Schema as _Schema, model } from 'mongoose';

const Schema = new _Schema({
	guildId: { type: String, required: true },
	guildName: String,
	channelId: { type: String, required: true },
	reactions: { type: Array, of: String, required: true },
	random: { type: Boolean, required: true },
	numberOfReactions: { type: Number, required: true },
});

export default model('auto-react-channels', Schema);
