# BotZela

A Discord BOT, Made Using Node.Js (Discord.Js, Google Spreadsheet api)

## ✨ Features

- Collect Data From Google Spreadsheet
- Adds Roles when a Member Joins The Server, and changes their nickname.
- Sends customised Schedule for first Year student.

## Install

### Install Node.JS

Use the official website of Node.js to download and install the LTS version or the Current Version on your system:
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
TOKEN = YOUR_DISCORD_BOT_TOKEN
TEST_GUILDS =[{"name":"GUILD_NAME","id":"GUILD_ID"}]
ADMINS = "ADMIN_ID1 ADMIN_ID2"
PRV_ROLES={"GUILD_ID":{"ROLE_NAME":"ROLE_ID"}}

DatabaseUri = YOUR_MONGODB_ATLAS_LINK

EmailUser = EMAIL
EmailPass = Mailing_SERICE_Password

GOOGLE_CLIENT_EMAIL = "SERVICE_ACCOUNT_EMAIL"
GOOGLE_PRIVATE_KEY = "SERVICE_ACCOUNT_PRIVATE_KEY"
```

Run the bot

```bash
npm run start:dev
# or
pnpm run start:dev
# or
yarn start:dev
```
