const {loadData} = require("./done/loadData.js");
loadData();

function logsMessage(client,message,guild) {
    try{
        let channel = client.channels.cache.get(CHANNELS[`${guild.id}`]);
        await channel.send(message);
    }catch(e){
        console.log(`Logs channel not set in ${guild.name}`);
    }
}

module.exports = {
    logsMessage,
}