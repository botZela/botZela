const {Client, Intents, Collection} = require("discord.js");
const {TOKEN} = require("./credentials/config.json");
const fs = require("fs");
const { loadData } = require("./utils/loadData");

const myIntents = new Intents(32767);    
const client = new Client({ intents : myIntents});

client.commands = new Collection();
client.testGuilds = ["942172171285987370","933499256000643103"];

require("./Handlers/Commands")(client);
require("./Handlers/Events")(client);

client.login(TOKEN);

// const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
// const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
// const commandFolders = fs.readdirSync('./commands');
// loadData();
// (async () => {
//     for (file of functions) {
//         require (`./functions/${file}`)(client);
//     }
//     client.handleEvents(eventFiles,"../events");
//     client.handleCommands(commandFolders,"./commands");
//     client.login(TOKEN);
// })();