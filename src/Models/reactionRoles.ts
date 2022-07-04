import { Schema as _Schema, model } from 'mongoose';

export const RolesSchema = new _Schema({
	roleId: String,
	roleDescription: String,
	roleEmoji: String,
});

export type RolesType = {
	roleId: string;
	roleDescription?: string;
	roleEmoji?: string;
};

/**
 * Roles Structure
 * - roleId: string;
 * - roleDescription: string;
 * - roleEmoji: string;
 */

const Schema = new _Schema({
	title: String,
	guildId: String,
	guildName: String,
	messageId: String,
	roles: {
		type: [RolesSchema],
		required: true,
	},
});

export default model('reaction-roles', Schema);
