const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

const { logsMessage } = require(`../../utils/logsMessage`);

module.exports = {
    name: 'guildUpdate',
    async execute(client, oldGuild, newGuild) {
        if (oldGuild.name === newGuild.name) return;

        const modelsFolder = await PG(`${__dirname}/../../Models/*.js`);
        if (!modelsFolder.length) return;

        for (let file of modelsFolder) {
            const Model = require(file);
            const ModelData = await Model.findOne({guildId: newGuild.id});
            if (ModelData?.guildName){
                ModelData.guildName = newGuild.name;
                await ModelData.save();
            }
        }
        
        let log = `[INFO] Guild Name Changed from "${oldGuild.name}" to "${newGuild.name}".`;
        await logsMessage(client, log, newGuild);

    },
}