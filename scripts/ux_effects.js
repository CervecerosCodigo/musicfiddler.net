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

/**
 * Just for testing right now
 * @param time
 */
function createSoftBusyIndicator(time){
    setTimeout(function(){
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

        //document.body.appendChild(indicatorDiv);
        O("blanket").appendChild(indicatorDiv);
    }, time);

    body.removeChild("")
}