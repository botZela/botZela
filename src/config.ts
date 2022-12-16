import 'dotenv/config';
interface ITestGuild {
	name: string;
	id: string;
}

interface IPrv_Roles {
	[key: string]: {
		[key2: string]: string;
	};
}

export const testGuilds = JSON.parse(process.env.TEST_GUILDS) as ITestGuild[];

export const PRV_ROLES = JSON.parse(process.env.PRV_ROLES) as IPrv_Roles;

export const ADMINS = process.env.ADMINS.split(' ');
