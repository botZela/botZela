# BotZela

A Discord BOT, Made Using Node.Js (Discord.Js, Google Spreadsheet api)

## ✨ Features

- Collect Data From Google Spreadsheet
- Adds Roles when a Member Joins The Server, and changes their nickname.
- Sends customised Schedule for first Year student.

## Install

### Install Node.JS

Check this website to download the LTS version or the Current Version of Node.JS for your system.
https://nodejs.org/en/download/

### Pull The Repo

```bash
git clone https://github.com/WHAT-S-N3XT/botZela.git
cd botZela
```

### Install Dependencies

```bash
npm i
# or
pnpm i
# or
yarn
```

## Usage

Copy the `.env.example` to `.env` and set the variables.

```
TOKEN=YOUR_DISCORD_BOT_TOKEN
DatabaseUri=YOUR_MONGODB_ATLAS_LINK
```

In `src/config.ts` change the `testGuilds` to the Servers where you want the commands to be loaded.

```ts
export const testGuilds = [
	{ name: 'SERVER_NAME_1', id: 'SERVER_ID_1' },
	{ name: 'SERVER_NAME_2', id: 'SERVER_ID_2' },
];
```

Run the bot

```bash
npm run start:dev
# or
pnpm run start:dev
# or
yarn start:dev
```
