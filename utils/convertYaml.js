const yaml = require('js-yaml');

function convertYaml(message) {
    try {
        out = yaml.load(message);
        if (Array.isArray(out))
            return out;
        return 0;
    } catch (e) {
        return 0;
    }
}

module.exports = {
    convertYaml,
}