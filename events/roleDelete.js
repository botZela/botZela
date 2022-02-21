module.exports = {
	name: 'roleDelete',
	async execute(client,role) {
		console.log(`${role.name} has been deleted.`);
    },  
}