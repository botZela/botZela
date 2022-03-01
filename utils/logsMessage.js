async function logsMessage(client,message,guild) {
    try{
        console.log(message);
        let channel = client.channels.cache.get(CHANNELS[`${guild.id}`]['LOGS']);
        await channel.send(message);
    }catch(e){
        console.log(`Logs channel not set in ${guild.name}`);
    }
}

module.exports = {
    logsMessage,
}
