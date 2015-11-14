/**
 * O function returns an object by its ID.
 * This function assumes that there is present an element id of function parameter obj.
 * If true, an object with equivalent id is returned. No need to type the getElementById.
 * @param obj
 * @returns {*}
 * @constructor
 */

function O(obj){
    if(typeof obj == 'object') return obj
    else return document.getElementById(obj)
}

/**
 * S function returns the style property of an object.
 * This is quick way to change the corespondent CSS property of an object.
 * Usage example: S('myobj').color = 'green'
 * @param obj
 * @returns {CSSStyleDeclaration}
 * @constructor
 */
function S(obj){
    return O(obj).style
}

/**
 * C function returns an array of all objects that access given class.
 * Example: myarray = C('myclass')
 *          S(myarray[i]).textDecoration = 'underline'
 * @param name
 * @returns {Array}
 * @constructor
 */
function C(name) {
    var elements = document.getElementsByTagName('*')
    var objects = []

    for (var i = 0; i < elements.length; ++i) {
        if (elements[i].className == name)
            objects.push(elements[i])

        return objects
    }
}



/**
 * Retrieves the mbid value from url parameter list.
 * @returns {string}
 */
function getmbidFromURL(){
    var x = 0;
    var param = location.search;
    return param.substring(6);

}



function addParagraphsToArtistBio(numPara){


    var artistExtended = O("artistExtended");

    var paragraphs = artistExtended.getElementsByClassName("paragraphHidden");
    for(var j = 0; j < numPara; j++){
        paragraphs[j].className = "";
    }

    if(!O("addParagraphs")) {

        var link = document.createElement("a");
        link.id = "addParagraphs";
        link.className = "btn artistReadMore";


        link.onclick = function(){
            addParagraphsToArtistBio(5);
        };
        link.title = "More";
        link.appendChild(document.createTextNode("More"));
        artistExtended.appendChild(link);
    }


}



/**
 * This function creates the extended version of an artists' biography.
 * It generates and returns a full HTML object to be inserted in the page
 * @param mbid
 * @param name
 * @returns {Element}
 */
function printArtistInfoExtended(mbid, name){
    var artistExtended = O("artistExtended");
    var imageArray;
    var heading = document.createElement("h3");
    heading.classList.add("underline");
    heading.appendChild(document.createTextNode("Extended biography"));
    var bioTemp;
    var bioExtendedArr;
    var paragraphs = O(artistExtended).getElementsByTagName("p");

    try {
        imageArray = getArtistImages(mbid, name);
    }catch(e){
        alert("Debug: No artist images was found");
    }


    try {
        bioTemp = getFullArtistBiography(mbid, name).biography;     //Get extended bio
        bioTemp = "<p>" + bioTemp + "</p>";                         //Reformat bio to fix paragraphs

        bioExtendedArr = bioTemp.split("</p>");                     //Create array with paragraphs
        artistExtended.appendChild(heading);
        for(var i = 0; i < bioExtendedArr.length; i++){             //Add all paragraphs to document
            artistExtended.innerHTML += bioExtendedArr[i];
        }

        for(var i = 0; i < paragraphs.length; i++){                 //Hide all paragraphs
            paragraphs[i].className = "paragraphHidden";
        }

    }catch(e){
        if(e.id == 1){
            artistExtended.innerHTML += "<p>" + artist.bio + "</p>";
            alert("Debug: Can't find extended artist info");
        }
    }

    addImagesToParagraphs(imageArray, name);                        //Add images to paragraphs
    addParagraphsToArtistBio(5);                                    //Show the first 5 paragraphs
}



function printArtistInfoSimple(bio){

    var link = document.createElement("a");
    link.className = "btn artistReadMore";

    var introText = O("introText");
    var paragraph = document.createElement("p");

    paragraph.innerHTML = bio;
    introText.appendChild(paragraph);

    introText.appendChild(link);

}


/**
 * This function is loaded by artist.html.
 * It uses other functions to generate HTML elements before inserting them into the page.
 * @param simple
 */
function printArtistInfo(simple){

    //Get artist and albums
    var mbid = getmbidFromURL();        //mbid is read from url parameter
    var artist = getArtistInfo(mbid);   //get the current artists' detailed information

    createArtistIntroImage(artist);


    //var simArtists = createSimArtists(artist.similar_artists);   //Generate list of similar artists


    if (simple) {
        var headline = O("headline");
        headline.appendChild(document.createTextNode(artist.name));
        printArtistInfoSimple(artist.bio);   //Generates the full artist Bio with images

        var topAlbums = createTopAlbumList(mbid, artist.name);
        topAlbums.className = "horizontalTileList";
        O("topAlbumsPreview").appendChild(topAlbums);

        createArtistNews(mbid, artist.name);

    } else {
        printArtistInfoExtended(mbid, artist.name);

        destroyBusyIndicator(O('blanket'), O('indicatorDiv'))
    }


}



/**
 * Function adds artist images to the array of paragraphs in artist.html
 * @param images
 * @param name
 */
function addImagesToParagraphs(images, name){
    var intervall;
    var imagesAdded = 0;
    var paragraphs = O("artistExtended").getElementsByTagName("p");

    paragraphs.length > 15 ? intervall = 3 : intervall = 2;

    for(var i = 3; i < paragraphs.length; i += intervall){

        if (imagesAdded < images.length) {
            var tempImg = document.createElement("img");
            tempImg.src = images[imagesAdded++].url;
            tempImg.alt = name + " image";
            if(imagesAdded % 2 == 0){
                tempImg.className = "imgFill imgFloatLeft";
            }else{
                tempImg.className = "imgFill imgFloatRight";
            }
            paragraphs[i].insertBefore(tempImg, paragraphs[i].firstChild);
        }
    }
}



function createSimArtists(similar_artists){

    var simArtists = createTileCollection(similar_artists);          //Generate
    simArtists.id = "simArtists";
    simArtists.className = "artistIntro";
    var simArtistsHeading = document.createElement("h3");
    simArtistsHeading.appendChild(document.createTextNode("Similar Artists"));
    simArtists.insertBefore(simArtistsHeading, simArtists.firstChild);

    return simArtists;
}


/**
 * Creates the TopAlbum list and returns a ready made HTML element
 * @param mbid
 * @param artistName
 * @returns {Element}
 */
function createTopAlbumList(mbid, artistName){

    var albums = getTopAlbums(mbid, artistName);     //Get the albums
    var albumList = createTileCollection(albums);

    //albumList.id = "topAlbumsPreview";
    //albumList.className = "artistIntro";
    var topAlbumsHeading = document.createElement("h3");
    topAlbumsHeading.appendChild(document.createTextNode("Top Albums"));
    albumList.insertBefore(topAlbumsHeading, albumList.firstChild);

    return albumList;

}





/**
 * Creates the HTML aside element and returns it.
 * @param artist
 * @returns {Element}
 */
function createArtistIntroImage(artist){

    var mainImage = O("mainImage");
    mainImage.src = artist.image_xl;
    mainImage.alt = artist.name + " - Main image";
    mainImage.id = "mainImage";

}


/**
 * This function creates the small tiles that represents artists or albums
 * @param title
 * @param index
 * @returns {Element}
 */
function createTileDiv(title, index){
    var tileDiv = document.createElement('div');

    if (title) {
        tileDiv.id = "albumTileID" + index;
    } else {
        tileDiv.id = "tileID" + index;
    }
    tileDiv.className = "tile";

    if (title) {       //It's an album tile
        tileDiv.onclick = function () {
            onAlbumTileclick(this.id);
        };
    } else {
        tileDiv.onclick = function () {
            onArtistTileClick(this.id);
        };
    }

    tileDiv.onmouseover = function(){
        tileOnMouseOver(this.id);
    };
    tileDiv.onmouseout = function(){
        tileOnMouseOut(this.id);
    }

    return tileDiv;
}




/**
 * Creates a Tile DOM element for different tile lists.
 * @param array
 * @returns {Element}
 */
function createTileCollection(array){

    var tileList = document.createElement("section");
    //tileList.id = "tileList";
    tileList.className ='tileList';

    for(var i = 0; i < array.length; i++) {


        var tileDiv = createTileDiv(array[i].title, i);


        //Div that contains artist name. Originally hidden.
        //It's the "hover over tile" text that pops up over tile.
        var textDiv = document.createElement("div");
        textDiv.className = "tileText tileTextHidden";


        var image = document.createElement("img");

        //The different tiles needs different variables...
        if(array[i].image_l) {              //artist array
            image.src = array[i].image_l;
            image.alt = array[i].name;
            textDiv.appendChild(document.createTextNode(array[i].name));
        }else if(array[i].image_m) {        //similar_artist array
            image.src = array[i].image_m;
            image.alt = array[i].name;
            textDiv.appendChild(document.createTextNode(array[i].name));
        }else if(array[i].cover_l){         //topAlbum array
            image.src = array[i].cover_l;
            image.alt = array[i].title;
            textDiv.appendChild(document.createTextNode(array[i].title));
        }

        var artString = "<input id='mbidID" + i + "' + type='hidden' value=" + array[i].mbid + ">";

        tileDiv.innerHTML = artString;
        tileDiv.appendChild(image);
        tileDiv.appendChild(textDiv);

        O(tileList).appendChild(tileDiv);
    }

    return tileList;
}



/**
 * This function pick up the top artists using the getTopArtists() function.
 * The tileList section is generated by createTileCollection function.
 */
function printTopArtists() {

    var artists = getTopArtists();
    var tileList = createTileCollection(artists);
    O("results").appendChild(tileList);

}


function tileOnMouseOver(parentDiv){
    var child = O(parentDiv).children[2];
    child.className = "tileText";
    O(parentDiv).classList.add("tileHovering");
}


function tileOnMouseOut(parentDiv){
    var child = O(parentDiv).children[2];
    child.className = "tileText tileTextHidden";
    O(parentDiv).classList.remove("tileHovering");

}



/**
 * This function is run when user clicks on a tile and it creates a popup-div
 * that presents the artist. A blanket is also "protecting" the user from clicking
 * anything else. When user clicks anywhere on the blanket, it disappears.
 * @param divID
 */
function onArtistTileClick(divID){

    var mbid = O(divID).firstChild;             //Get last.fm ID
    var artist = getArtistInfo(mbid.value);     //Get the artist
    var teaseDiv = document.createElement("div");   //Div for teaser information
    var teaseCloseBtn = document.createElement("div");
    var teaseContent = document.createElement("div");
    var link = document.createElement("a");
    var headline = document.createElement("H4");    //Artist name
    var para = document.createElement("p");         //Text to put in the teaser div


    //Setting memberships
    teaseDiv.id = "teaseDiv";
    teaseDiv.className = "teaserP teaserF";
    link.className = " btn-default moreInfo";
    teaseCloseBtn.id = "btn-closeTeaser"

    //Adding content
    headline.appendChild(document.createTextNode(artist.name));
    para.innerHTML = "<figure>";
    para.innerHTML += "<img src=" + artist.image_l + " alt='" + artist.name + "'/>";
    para.innerHTML += "</figure>";
    para.innerHTML += artist.bio;
    teaseCloseBtn.innerHTML = "<a href='javascript:void(0)' onclick='wrapperID.removeChild(teaseDiv);'>x</a>";

    link.onclick = function(){
      window.location.href = "artist.html?mbid="+mbid.value;
    };
    link.title = "More info";
    link.appendChild(document.createTextNode("More info"));


    //Adding to document
    teaseContent.appendChild(headline);
    teaseContent.appendChild(para);
    teaseContent.appendChild(link);
    teaseDiv.appendChild(teaseContent);
    teaseDiv.appendChild(teaseCloseBtn);
    O("wrapperID").appendChild(teaseDiv);

    O("blanket").className = O("blanket").className + " enableBlanket";

}

function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}

function removeParent(id) {
    return (elem=document.getElementById(id)).teaseDiv;
}

function onAlbumTileclick(divID){
    var mbid = O(divID).firstChild;
    
}

/**
 * This function resets the blanket and deletes the teaser-div from DOM
 */
function onBlanketClose(){
    O("blanket").className = "";
    var parent = O("wrapperID");
    var child = document.getElementById("teaseDiv");
    parent.removeChild(child);
}


function createArtistNews(mbid, name){

    var artistNewsArr = getArtistNews(mbid, name);
    var artistNewsSec = O("artistNewsSec");

    var newsMainHeading = document.createElement("h3");
    newsMainHeading.appendChild(document.createTextNode("Recent news"));
    newsMainHeading.className = "underline";
    artistNewsSec.appendChild(newsMainHeading);

    var artistNewsDiv;
    var newsHeading;
    var newsDate;
    var newsSummary;

    for(var i = 0; i < artistNewsArr.length; i++){
        artistNewsDiv = document.createElement("div");
        artistNewsDiv.className = "artistNewsDiv";
        newsHeading = document.createElement("h4");
        newsHeading.appendChild(document.createTextNode(artistNewsArr[i].topic));
        newsDate = document.createElement("span");
        newsDate.className = "dateSpan";
        newsDate.appendChild(document.createTextNode(artistNewsArr[i].date.substr(0, 10)));
        newsDate.innerHTML += " - ";
        newsSummary = document.createElement("p");
        newsSummary.innerHTML = artistNewsArr[i].summary;

        artistNewsDiv.appendChild(newsDate);
        artistNewsDiv.appendChild(newsHeading);

        artistNewsDiv.appendChild(newsSummary);

        artistNewsSec.appendChild(artistNewsDiv);
    }

    destroyBusyIndicator(O('blanket'), O('indicatorDiv'))

}


/**
 * Adding listeners for the search input field.
 */
function listenForSearchText() {
    var input = O("search");
    input.addEventListener("keydown", function () {
        search(input.value);
    });

}


var timeLastKeyPressed = [];


/**
 * Determines the time between two keys pressed so that we dont search while in contant typing.
 * @param text
 */
function search(text){

    var lastTimeStamp;
    var currentTimeStamp = Date.now();

    if(O("searchResult")){
        O("searchElement").removeChild(O("searchResult"));
    }



    if(text.length > 1){

        timeLastKeyPressed.push(currentTimeStamp);

        if(timeLastKeyPressed.length > 1){
            lastTimeStamp = timeLastKeyPressed[timeLastKeyPressed.length -2];
        }else{
            return;
        }

        if(currentTimeStamp - lastTimeStamp > 80){

            var resArr = getSearchResults(text);
            if(resArr){
                printSearchResults(resArr);
            }

        }
    }else{
        if(O("searchResult")){
            O("searchElement").removeChild(O("searchResult"));
        }
    }

}


/**
 * Prints out the div containing the search results. It uses a timeout function to give the
 * loop a little "life", and not pop up right away.
 * @param resArr
 */
function printSearchResults(resArr){

    var searchResult = document.createElement("div");
    searchResult.id = "searchResult";
    O("searchElement").appendChild(searchResult);               //Add searchResult to document


    function myLoop(i){

        setTimeout(function(){

            if(resArr[i].mbid) {


                var resultDiv = document.createElement("div");
                resultDiv.className = "resultClass";

                var imgContainer = document.createElement("div");
                imgContainer.className = "imgResContainer";
                var img = document.createElement("img");
                imgContainer.appendChild(img);
                img.src = resArr[i].image_m;

                var nameElem = document.createElement("span");
                nameElem.appendChild(document.createTextNode(resArr[i].name));
                resultDiv.appendChild(imgContainer);
                resultDiv.appendChild(nameElem);

                var mbidString = "<input id='searchMBID" + i + "' + type='hidden' value=" + resArr[i].mbid + ">";

                resultDiv.onclick = function () {
                    window.location.href = "artist.html?mbid="+resArr[i-1].mbid;
                };

                resultDiv.innerHTML += mbidString;

                searchResult.appendChild(resultDiv);                    //Add result to searchResult
                if (i < resArr.length - 1) {
                    i++;
                    myLoop(i);
                }
            }else{
                i++;
            }
        }, 10);

    }
    if(resArr.length > 0)
        myLoop(0);

}


function onExtendedBioClicked(){
    createBusyIndicator();
    O("topAlbumsPreview").classList.add("displayNone");
    O("artistNewsSec").classList.add("displayNone");
    O("artistExtended").classList.remove("displayNone");
    printArtistInfo(false);
}


function onNewsClicked(){
    createBusyIndicator();
    O("topAlbumsPreview").classList.add("displayNone");
    O("artistExtended").classList.add("displayNone");
    O("artistNewsSec").classList.remove("displayNone");
    destroyBusyIndicator(O('blanket'), O('indicatorDiv'))
}


function onLooseFocus(){
    if(O("searchResult")){
        O("search").value = "";

        function myLoop(){
            setTimeout(function(){
                O("searchElement").removeChild(O("searchResult"));
            }, 1000);

        }

        myLoop();


    }

}


function windowResized(){

    var wrapper = O("wrapperID");

    var wrapperWidth = wrapper.offsetWidth;
    var header = O("header");
    var paddingPrTile = 60;
    var imgWidth = 178;
    var desiredWidth = 0;

    //Lower limit before breaking
    if(wrapperWidth < 974 && wrapperWidth > 777) {   //5 tiles
        desiredWidth = ((imgWidth + paddingPrTile) * 3) +10;
    }else if(wrapperWidth <= 777 && wrapperWidth > 584) {  //4 tiles
        desiredWidth = ((imgWidth + paddingPrTile) * 2) + 60;
    }else if(wrapperWidth <= 584){   //3 tiles
        desiredWidth = ((imgWidth + paddingPrTile) * 1) - 30;
    }else{
        desiredWidth = ((imgWidth + paddingPrTile) * 4) - 30;
    }
    header.setAttribute("style", "width:"+desiredWidth+"px");
}

