const { titleCase } = require("./stringFunc.js");

class Person {
    static async create(index, client, guild, activeSheet) {
        let out = new Person();
        let user = await activeSheet.getRow(index);
        out.firstName = user[1];
        out.lastName = user[2];
        out.mail = user[3];
        out.phone = user[4];
        out.discordUsername = user[5];
        out.discordId = user[6];
        out.rolesNames = [];
        for (let i = 7; i < user.length; i++) {
            for (let role of user[i].split(", ")) {
                if (role) {
                    out.rolesNames.push(role.trim());
                }
            }
        }
        out.rolesId = out.roles(client,guild.id);
        return out;
    }

    roles(client,guildId) {
        const { ROLES } = client.data;
        let roleIds = [];
        for (let role of this.rolesNames) {
            try {
                let roleId = ROLES[`${guildId}`][role];
                if (roleId) {
                    roleIds.push(roleId);
                } else {
                    console.log(`[INFO] Role was not found ${role}`);
                };
            } catch (e) {
                console.log(`[INFO] Role was not found ${role} with Exception ${e}`);
            }
        }
        return roleIds;
    }

    get nickName() {
        let out = titleCase(this.firstName) + " " + this.lastName.toUpperCase();
        return out;
    }

}

module.exports = {
    Person,
}