async function createChannel(guild,name,channel_type,overwrites = null,category = null,channelPosition = null){
    message = `[INFO] .${channel_type}_channel : .${name} in guild : .${guild.name}`
    try{
        out = await guild.channels.create(name,{
            type : channel_type,
        })
        out.setParent(category);
        console.log(message+" Was Created Succesfully.\n\`\`\`");
        return out;
    }catch(e){
        console.log(message+"Was not created\n");
        return null;
    }
}

module.exports = {
    createChannel,
}
