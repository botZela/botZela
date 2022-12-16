export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			guildId: string;
			environment: 'dev' | 'prod' | 'debug';
			DatabaseUri: string;
			EmailUser: string;
			EmailPass: string;
			GOOGLE_CLIENT_EMAIL: string;
			GOOGLE_PRIVATE_KEY: string;
		}
	}
}
