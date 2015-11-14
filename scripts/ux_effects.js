/**
 * Create a spinning circle busy indicator.
 */
function createBusyIndicator(){
    var indicatorDiv = document.createElement("div");
    indicatorDiv.className = "loading bar";
    indicatorDiv.id = 'indicatorDiv';

    indicatorDiv.innerHTML +=
        "<div></div>" +
        "<div></div>" +
        "<div></div>" +
        "<div></div>" +
        "<div></div>" +
        "<div></div>" +
        "<div></div>" +
        "<div></div>";


    if(!O("blanket")){
        var blanket = document.createElement("div");
        blanket.id = "blanket";
        document.body.insertBefore(blanket, document.body.firstChild);
    }
    O("blanket").appendChild(indicatorDiv);
}



/**
 * Deletes previously created div.
 * @param parent
 * @param div
 */
function destroyBusyIndicator(parent,div){

    if(O("indicatorDiv"))
        O("blanket").remove("indicatorDiv");
}