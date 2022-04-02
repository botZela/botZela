const {Events} = require("../Validation/EventNames");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const Table = new Ascii("Events Loaded");

    let eventFiles = await PG(`${process.cwd()}/events/*/*.js`);
    for (const file of eventFiles) {
        const event = require(file);
        if (!Events.includes(event.name) || !event.name) {
            // const L = file.split("/");
            await Table.addRow(`${event.name || "MISSING"}`, `⛔ Event name is either invalid or missing: ${file.at(-2)}/${file.at(-1)}`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
        await Table.addRow(event.name, "✅ SUCCESSFUL ");
    }
    console.log(Table.toString());
}