import { Schema as _Schema, model } from 'mongoose';

type RolesType = {
	roleId: string;
	roleDescription: string;
	roleEmoji: string;
}

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
	roles:{
		type: Array<RolesType>,
		required:true,
	} ,
});

export default model('reaction-roles', Schema);
