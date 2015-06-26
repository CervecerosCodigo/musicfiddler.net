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

    //document.body.appendChild(indicatorDiv);
    O("blanket").appendChild(indicatorDiv);
}

/**
 * Deletes previously created div.
 * @param parent
 * @param div
 */
function destroyBusyIndicator(parent,div){
    O(parent).removeChild(div);
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