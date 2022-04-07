
function flGrp(member){
    let filieresArray = ["_2IA_", "_2SCL_", "_BI&A_", "_GD_", "_GL_", "_IDF_", "_IDSIT_", "_SSE_", "_SSI_"];
    let groupesArray = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];
    let roles = member.roles.cache;
    let fl = roles.map((r) => r.name).filter((role) => filieresArray.includes(role)).at(0)?.slice(1,-1) || "";
    let grp = roles.map((r) => r.name).filter((role) => groupesArray.includes(role)).at(0) || "";
    return { filiere : fl, groupe : grp};
}

module.exports = {
    flGrp,
}