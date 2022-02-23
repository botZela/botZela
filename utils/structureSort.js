function structureSort(tab){
    let n,temp;
    n = tab.lenght();
    for (let i = 0; i<n; i++){
        if (tab[i][1].toLowerCase() === "category"){
            try{
                structureSort(tab[i][2]);
            } catch (e){
                null;
            }
        }
        for(let i = 0; i<n; i++){
            for (let j =0 ; j<n-i-1; j++){
                if(tab[j][1].toLowerCase() === "category" && tab[j+1][1].toLowerCase() === "channel"){
                    tab[j] = temp;
                    tab[j] = tab[j+1];
                    tab[j+1] = temp; 
                }else if (tab[j][1].toLowerCase() === "channel" && tab[j+1][1].toLowerCase() === "channel"){
                    if(tab[j][2].toLowerCase() == "voice" && tab[j+1][2].toLowerCase() === "text"){
                        tab[j] = temp;
                        tab[j] = tab[j+1];
                        tab[j+1] = temp; 
                    }
                }
            }
        }
    }
}

module.exports = {
    structureSort,
}