function dictToList(structure){
    let l=[];
    let name,temp,channels,subTypeElement,t,typeELement;
    for (let i of structure){
        typeELement = Object.keys(i)[0];
        if (typeELement.toLowerCase() === "category"){
                name = i[typeELement][0].split(',')[0];
                t = [name,typeELement];
            try{
                channels = i[typeELement][1];
                t = t.push(dictToList(Object.values(channels)[0]));
                l.push(t);
            } catch (e){
                null;
            }
        } else if (typeELement.toLowerCase() === "channel"){
            temp = i[typeELement].split(',').slice(0,2);
            name = temp[0];
            subTypeElement = temp.slice(1);
            t = [name,typeELement,subTypeElement];
            l.push(t);
        }
    }
    return l;
}

module.exports = {
    dictToList,
}