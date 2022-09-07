import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Guild, Snowflake } from 'discord.js';
import { Document } from 'mongoose';
import { titleCase } from './stringFunc';
import gRoles from '../../Models/guildRoles';
import { ADMINS, PRV_ROLES } from '../../config';
import { GSpreadSheet } from '../GSpreadSheet';

dayjs.extend(customParseFormat);

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
	public timestamp: Date;
	public discordId: string;
	public rolesNames: string[];
	public rolesId: Snowflake[];

	public constructor() {
		this.timestamp = new Date();
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

	public static async createFromMap(user: Map<string, string>, guild: Guild) {
		const out = new Person();
		// Handle the timestamp
		if (user.get('Timestamp')) {
			out.timestamp = dayjs(user.get('Timestamp'), 'DD-MM-YYYY HH:mm:ss').toDate();
		}
		out.firstName = user.get('First Name') ?? '';
		out.lastName = user.get('Last Name') ?? ' ';
		out.mail = user.get('Email') ?? '';
		out.phone = user.get('Phone Number') ?? '';
		out.discordUsername = user.get('Discord Username') ?? '';
		out.discordId = user.get('ID Discord') ?? '';
		out.rolesNames = [];
		const userArray = [...user.values()];
		for (let i = 7; i < userArray.length; i++) {
			for (const role of userArray[i].split(',')) {
				if (role) {
					out.rolesNames.push(role.trim());
				}
			}
		}
		// Only ENSIAS SERVER
		if (guild.id === '921408078983876678') {
			out.checkYear();
		}
		out.rolesId = await out.roles(guild.id);
		return out;
	}

	public static async createFromArray(user: string[], guild: Guild) {
		const out = new Person();
		out.timestamp = dayjs(user[0], 'DD-MM-YYYY HH:mm:ss').toDate();
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
		// Only ENSIAS SERVER
		if (guild.id === '921408078983876678') {
			out.checkYear();
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
		if (guildId === '921408078983876678') {
			if (ADMINS.includes(this.discordId)) {
				roleIds.push(PRV_ROLES[`${guildId}`].Admin);
				this.rolesNames.push('Admin');
			}
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

	// Only ENSIAS SERVER
	private checkYear() {
		const yearsArray = ['1A', '2A', '3A'];
		const filieresArray = ['_2IA_', '_2SCL_', '_BI&A_', '_GD_', '_GL_', '_IDF_', '_IDSIT_', '_SSE_', '_SSI_'];
		const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
		const today = new Date();
		const refDate = new Date(`${today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1}-09`);

		if (this.timestamp < refDate) {
			const diffDate = new Date(refDate.valueOf() - this.timestamp.valueOf());
			const yearsDiff = diffDate.getFullYear() - 1969;

			const newArray: string[] = [];

			if (this.rolesNames.includes('1A')) {
				groupesArray.forEach((groupe) => {
					const index = this.rolesNames.indexOf(groupe);
					if (index > -1) {
						this.rolesNames.splice(index, 1);
					}
				});
			}

			this.rolesNames.forEach((value) => {
				if (yearsArray.includes(value)) {
					const index = yearsArray.indexOf(value);
					let newYear = index + yearsDiff;
					if (newYear < 3) {
						newArray.push(yearsArray[newYear]);
					} else {
						newYear -= 3;
						filieresArray.forEach((filiere) => {
							const index = this.rolesNames.indexOf(filiere);
							if (index > -1) {
								newArray.push(`L_${filiere.slice(1, -1)}`);
								this.rolesNames.splice(index, 1);
							}
						});
						newArray.push(`Laureate`);
						newArray.push(`${refDate.getFullYear() - newYear}`);
					}
				} else {
					newArray.push(value);
				}
			});

			this.rolesNames = newArray;
		}
	}
}
