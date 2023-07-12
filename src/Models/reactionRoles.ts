import { Schema as _Schema, model } from 'mongoose';

export const RolesSchema = new _Schema({
	roleId: { type: String, required: true },
	roleDescription: String,
	roleEmoji: String,
});

export interface RolesType {
	roleDescription?: string;
	roleEmoji?: string;
	roleId: string;
}

/**
 * Roles Structure
 * - roleId: string;
 * - roleDescription: string;
 * - roleEmoji: string;
 */

const Schema = new _Schema({
	title: String,
	guildId: { type: String, required: true },
	guildName: String,
	messageId: String,
	roles: {
		type: [RolesSchema],
		required: true,
	},
});

export default model('reaction-roles', Schema);
