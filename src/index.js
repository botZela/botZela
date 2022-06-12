const { Client, Intents, Collection } = require("discord.js");
const { TOKEN } = require("../credentials/config.json");

const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const { AsciiTable3 } = require("ascii-table3");

const myIntents = new Intents(32767);
const client = new Client({ intents: myIntents });

client.commands = new Collection();
client.buttons = new Collection();
client.buttonsCooldown = new Collection();
client.selectMenu = new Collection();

// client.data = require("../data/data.json");

client.testGuilds = [
    { name: "🔺▬▬ • ENSIAS • ▬▬🔺", id: "921408078983876678" },
    { name: "Test_channel", id: "942172171285987370" },
    { name: "bot TEST WN", id: "933499256000643103" },
    { name: "GIVE'N'TAKE", id: "979396566018322482" },
    // { name: "IEEE", id: "981579286735634492" },
];

["Events", "Commands", "Buttons", "SelectMenu"].forEach((handler) => {
    require(`./Handlers/${handler}`)(client, PG, AsciiTable3);
});



client.login(TOKEN);

module.exports = {
    client,
}