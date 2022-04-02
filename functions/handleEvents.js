const {Events} = require("../Validation/EventNames");
const Ascii = require("ascii-table");

module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        const Table = new Ascii("Events Loaded");
        for (const file of eventFiles) {
            const event = require(`${path}/${file}`);
            if (!Events.includes(event.name) || !event.name){
                // const L = file.split("/");
                await Table.addRow(`${event.name || "MISSING"}`, `⛔ Event name is either invalid or missing: ${file}`);
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(client,...args));
            } else {
                client.on(event.name, (...args) => event.execute(client,...args));
            }
            await Table.addRow(event.name,"✅ SUCCESSFUL");
        }
        console.log(Table.toString());
    };
}