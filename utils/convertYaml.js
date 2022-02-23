const yaml = require('js-yaml');

function convertYaml(message){
    out = yaml.load(message);
    return out;
}

module.exports = {
    convertYaml,
}