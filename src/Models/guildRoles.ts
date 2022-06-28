import { Schema as _Schema, model } from 'mongoose';

/**
 * Roles Structure
 * - roleName : roleId;
 */

const Schema = new _Schema({
	guildId: {
		type: String,
		required: true,
	},
	guildName: {
		type: String,
		required: true,
	},
	roles: {
		type: Map,
		of: String,
		required: true,
	},
	defaultRole: {
		type: String,
		required: false,
	},
});

export default model('guild-roles', Schema);
