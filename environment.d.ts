export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ADMINS: string;
			DatabaseUri: string;
			EmailPass: string;
			EmailUser: string;
			GOOGLE_CLIENT_EMAIL: string;
			GOOGLE_PRIVATE_KEY: string;
			PRV_ROLES: string;
			TEST_GUILDS: string;
			TOKEN: string;
			environment: 'debug' | 'dev' | 'prod';
			guildId: string;
		}
	}
}
