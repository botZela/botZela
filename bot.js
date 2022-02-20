const {Client, Intents, Collection} = require("discord.js");
const {TOKEN} = require("./Credentials/config.json");
const fs = require("fs");

const myIntents = new Intents(32767);    
const client = new Client({ intents : myIntents});

client.commands = new Collection();

const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');

(async () => {
    for (file of functions) {
        require (`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles,"../events");
    client.handleCommands(commandFolders,"./commands");
    client.login(TOKEN);
})();