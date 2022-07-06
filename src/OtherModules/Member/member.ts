import { Guild, Snowflake } from 'discord.js';
import { titleCase } from './stringFunc';
import gRoles from '../../Models/guildRoles';
import { GSpreadSheet } from '../GSpreadSheet';

export class Person {
	private firstName: string;
	private lastName: string;
	private mail: string;
	private phone: string;
	private discordUsername: string;
	private discordId: string;
	public rolesNames: string[];
	public rolesId: Snowflake[];

	public constructor() {
		this.firstName = '';
		this.lastName = '';
		this.mail = '';
		this.phone = '';
		this.discordUsername = '';
		this.discordId = '';
		this.rolesNames = [];
		this.rolesId = [];
	}

	public static async create(index: number, guild: Guild, activeSheet: GSpreadSheet) {
		const out = new Person();
		const user = (await activeSheet.getRow(index)) as string[];
		out.firstName = user[1];
		out.lastName = user[2];
		out.mail = user[3];
		out.phone = user[4];
		out.discordUsername = user[5];
		out.discordId = user[6];
		out.rolesNames = [];
		for (let i = 7; i < user.length; i++) {
			for (const role of user[i].split(',')) {
				if (role) {
					out.rolesNames.push(role.trim());
				}
			}
		}
		out.rolesId = await out.roles(guild.id);
		return out;
	}

	private async roles(guildId: string) {
		const guildData = await gRoles.findOne({ guildId });
		if (!guildData) return [];
		const guildRoles = guildData.roles;
		const roleIds: string[] = [];
		if (guildData.defaultRole) {
			roleIds.push(guildData.defaultRole);
		}
		for (const role of this.rolesNames) {
			try {
				const roleId = guildRoles.get(role);
				if (roleId) {
					roleIds.push(roleId);
				} else {
					console.log(`[INFO] Role was not found ${role}`);
				}
			} catch (e) {
				console.log(`[INFO] Role was not found ${role} with Exception ${JSON.stringify(e)}`);
			}
		}
		return roleIds;
	}

	public get nickName() {
		const out = `${titleCase(this.firstName)} ${this.lastName.toUpperCase()}`;
		return out;
	}
}
