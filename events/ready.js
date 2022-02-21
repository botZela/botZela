module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		client.user.setPresence({
			activities: [{
				name: "with WHAT'S N3XT team",
				type: "WATCHING"
			}],
			status: "online"
		});
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log('------');
	},  
}