import { Guild, Snowflake } from 'discord.js';
import { Document } from 'mongoose';
import { titleCase } from './stringFunc';
import gRoles from '../../Models/guildRoles';
import { ADMINS, PRV_ROLES } from '../../config';
import { GSpreadSheet } from '../GSpreadSheet';

type GuildDataType =
	| (Document<
			unknown,
			any,
			{
				guildId: string;
				guildName: string;
				roles: Map<string, string>;
				defaultRole?: string | undefined;
			}
	  > & {
			guildId: string;
			guildName: string;
			roles: Map<string, string>;
			defaultRole?: string | undefined;
	  })
	| null;
export class Person {
	public static guildData: GuildDataType = null;

	private firstName: string;
	private lastName: string;
	private mail: string;
	private phone: string;
	private discordUsername: string;
	public discordId: string;
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

	public static async getAll(guild: Guild, activeSheet: GSpreadSheet) {
		const users = (await activeSheet.getAll()) as string[][];
		return Promise.all(users.map((user) => this.createFromArray(user, guild)));
	}

	public static async create(index: number, guild: Guild, activeSheet: GSpreadSheet) {
		const user = (await activeSheet.getRow(index)) as string[];
		return Person.createFromArray(user, guild);
	}

	public static async createFromArray(user: string[], guild: Guild) {
		const out = new Person();
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
		if (Person.guildData === null) Person.guildData = await gRoles.findOne({ guildId });
		else if (Person.guildData.guildId !== guildId) Person.guildData = await gRoles.findOne({ guildId });

		if (!Person.guildData) return [];
		const guildRoles = Person.guildData.roles;
		const roleIds: string[] = [];
		if (Person.guildData.defaultRole) {
			roleIds.push(Person.guildData.defaultRole);
		}
		for (const role of this.rolesNames) {
			const roleId = guildRoles.get(role);
			if (roleId) {
				roleIds.push(roleId);
			} else {
				console.log(`[INFO] Role was not found ${role}`);
			}
		}
		// Only ENSIAS SERVER
		if (guildId === '921408078983876678' && ADMINS.includes(this.discordId)) {
			roleIds.push(PRV_ROLES[`${guildId}`].Admin);
			this.rolesNames.push('Admin');
		}
		return roleIds;
	}

	public get nickName() {
		if (this.firstName === '' && this.lastName === '') return null;
		const out = `${titleCase(this.firstName)} ${this.lastName.toUpperCase()}`;
		return out;
	}

	public getDiscordUsername() {
		return this.discordUsername;
	}
}
