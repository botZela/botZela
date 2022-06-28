import { titleCase } from './stringFunc';
import gRoles from '../../Models/guildRoles';
import { Snowflake } from 'discord.js';
import { Guild } from 'discord.js';
import { GSpreadSheet } from '../GSpreadSheet';

export class Person {
	firstName: string;
	lastName: string;
	mail: string;
	phone: string;
	discordUsername: string;
	discordId: string;
	rolesNames: string[];
	rolesId: Snowflake[];

	constructor() {
		this.firstName = '';
		this.lastName = '';
		this.mail = '';
		this.phone = '';
		this.discordUsername = '';
		this.discordId = '';
		this.rolesNames = [];
		this.rolesId = [];
	}

	static async create(index: number, guild: Guild, activeSheet: GSpreadSheet) {
		let out = new Person();
		let user: string[] = await activeSheet.getRow(index);
		out.firstName = user[1];
		out.lastName = user[2];
		out.mail = user[3];
		out.phone = user[4];
		out.discordUsername = user[5];
		out.discordId = user[6];
		out.rolesNames = [];
		for (let i = 7; i < user.length; i++) {
			for (let role of user[i].split(',')) {
				if (role) {
					out.rolesNames.push(role.trim());
				}
			}
		}
		out.rolesId = await out.roles(guild.id);
		return out;
	}

	async roles(guildId: string) {
		const guildData = await gRoles.findOne({ guildId });
		if (!guildData) return [];
		const guildRoles = guildData.roles;
		let roleIds: string[] = [];
		if (guildData.defaultRole) {
			roleIds.push(guildData.defaultRole);
		}
		for (let role of this.rolesNames) {
			try {
				let roleId = guildRoles.get(role);
				if (roleId) {
					roleIds.push(roleId);
				} else {
					console.log(`[INFO] Role was not found ${role}`);
				}
			} catch (e) {
				console.log(`[INFO] Role was not found ${role} with Exception ${e}`);
			}
		}
		return roleIds;
	}

	get nickName() {
		let out = titleCase(this.firstName) + ' ' + this.lastName.toUpperCase();
		return out;
	}
}
