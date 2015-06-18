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

/*
function printArtist(arr){

    info = "Album: " + arr.album.name
        + "<br>Release: " + arr.album.releasedate
        + "<br>Artist: " + arr.album.artist
        + "<br>ImageLink: " + arr.album.image[1]['#text'];

    img_url = arr.album.image[2]['#text'];
    info += "<br>img url: " + img_url;
    info += "<br><img src='" + img_url + "' />";

    tracklist = arr.album.tracks.track;
    trackcount = arr.album.tracks.track.length;
    info += "<br>Trackcount: " + trackcount;

    info += "<br>";
    for(i = 0; i < trackcount; i++) {
        info += i+1 + ". " + arr.album.tracks.track[i].name + "<br>";
    }

    O("results").innerHTML = info;

}*/


/**
 * Retrieves the mbid value from url parameter list.
 * @returns {string}
 */
function getmbidFromURL(){
    var x = 0;
    var param = location.search;
    return param.substring(6);

}


/**
 * Prints out all content to artist.html
 */
function printArtistInfo(){

    //Get artist and albums
    var mbid = getmbidFromURL();        //mbid is read from url parameter
    var artist = getArtistInfo(mbid);
    var topAlbums;

    //Create HTML elements
    var name = document.createTextNode(artist.name);
    var headline = document.createElement("h2");
    headline.appendChild(name);

    var bio = document.createElement("p");
    //bio.className = "group";
    var image = document.createElement("img");
    image.src = artist.image_xl;
    O(bio).appendChild(image);
    //bio.innerHTML += artist.bio;
    bio.innerHTML += getFullArtistBiography(mbid).biography;



    //Calling functions to get readymade DOM objects
    var aside = createArtistAside(artist.playcount, artist.year_formed, artist.ontour);
    var simArtists = createTileCollection(artist.similar_artists);
    topAlbums = createTopAlbumList(artist.mbid, artist.name);


    var tagList = createTagList(artist.tags);
    tagList.id = "tagList";
    var tagHeading = document.createElement("h3");
    tagHeading.appendChild(document.createTextNode("Tags"));
    tagList.insertBefore(tagHeading, tagList.firstChild);


    simArtists.id = "simArtists";
    var simArtistsHeading = document.createElement("h3");
    simArtistsHeading.appendChild(document.createTextNode("Similar Artists"));
    simArtists.insertBefore(simArtistsHeading, simArtists.firstChild);

    var topAlbumsHeading = document.createElement("h3");
    topAlbumsHeading.appendChild(document.createTextNode("Top Albums"));
    topAlbums.insertBefore(topAlbumsHeading, topAlbums.firstChild);
    topAlbums.className = "artistTopAlbums";

    //Append elements to DOM
    O("detailsCol1").appendChild(headline);
    O("detailsCol1").appendChild(bio);

    O("detailsCol2").appendChild(aside);

    O("detailsCol2").appendChild(simArtists);
    O("detailsCol1").appendChild(topAlbums);
    O("detailsCol1").appendChild(tagList);

}




/**
 *
 * @param mbid
 * @param artistName
 */
function createTopAlbumList(mbid, artistName){


    var albums = getTopAlbums(mbid, artistName);     //Get the albums
    var albumList = createTileCollection(albums);
    return albumList;

}



function createTagList(tags){

    var tagList = document.createElement("div");
    tagList.className = "tagList";

    for(var i = 0; i < tags.length; i++){
        var tag = document.createElement("div");
        tag.className = "genreTag";
        var name = document.createTextNode(tags[i]);
        tag.appendChild(name);
        tagList.appendChild(tag);
    }

    return tagList;
}


/**
 * Helping function that generates the aside element for artist.html
 * @param playcount
 * @param yearFormed
 * @param ontour
 * @returns {Element}
 */
function createArtistAside(playcount, yearFormed, ontour){

    var aside = document.createElement("aside");
    var table = "<table>";
        table += "<tr>";
            table += "<td class='asideCol1'>Play count";
            table += "</td>";
            table += "<td class='asideCol2'>" + playcount;
            table += "</td>";
        table += "</tr>";

        table += "<tr>";
            table += "<td class='asideCol1'>Year formed";
            table += "</td>";
            table += "<td class='asideCol2'>" + yearFormed;
            table += "</td>";
        table += "</tr>";

        table += "<tr>";
            table += "<td class='asideCol1'>On tour";
            table += "</td>";
            table += "<td class='asideCol2'>" + ontour;
            table += "</td>";
        table += "</tr>";

    table += "</table>";

    aside.innerHTML = table;
    return aside;
}




/**
 * Creates a Tile DOM element for different tile lists.
 * @param array
 * @returns {Element}
 */
function createTileCollection(array){

    var tileList = document.createElement("section");
    //tileList.id = "tileList";
    tileList.className ='tileList container';

    for(var i = 0; i < array.length; i++) {

        var tileDiv = document.createElement('div');

        if (array[i].title) {
            tileDiv.id = "albumTileID" + i;
        } else {
            tileDiv.id = "tileID" + i;
        }
        tileDiv.className = "tile";

        if (array[i].title) {       //It's an album tile
            tileDiv.onclick = function () {
                redirectToAlbum(this.id);
            };
        } else {
            tileDiv.onclick = function () {
                onTileClick(this.id);
            };
        }

        tileDiv.onmouseover = function(){
            tileOnMouseOver(this.id);
        };
        tileDiv.onmouseout = function(){
            tileOnMouseOut(this.id);
        }


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



function redirectToAlbum(divID){
    var mbid = O(divID).firstChild;
    window.location.href = "album.html?mbid="+mbid.value;
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




/*function printTopAlbums(){
    var albums = getTopAlbums("metallica");
    //document.getElementById("results").innerHTML = "Antall album: "+albums.length;
    string = "";
    for(var i = 0; i<albums.length;i++){
        //string += "<div class='albumtile'>";
        string += albums[i].artist;
        //string += "</div>";

    }
    O("results").innerHTML = string;

}*/


/**
 * This function is run when user clicks on a tile and it creates a popup-div
 * that presents the artist. A blanket is also "protecting" the user from clicking
 * anything else. When user clicks anywhere on the blanket, it disappears.
 * @param divID
 */
function onTileClick(divID){


    var mbid = O(divID).firstChild;             //Get last.fm ID
    var artist = getArtistInfo(mbid.value);     //Get the artist
    var teaseDiv = document.createElement("div");   //Div for teaser information
    var teaseContent = document.createElement("div");
    var link = document.createElement("a");
    var headline = document.createElement("H4");    //Artist name
    var para = document.createElement("p");         //Text to put in the teaser div


    //Setting memberships
    teaseDiv.id = "teaseDiv";
    teaseDiv.className = "teaserP teaserF";
    link.className = " btn-default moreInfo";

    //Adding content
    headline.appendChild(document.createTextNode(artist.name));
    para.innerHTML = "<figure>";
    para.innerHTML += "<img src=" + artist.image_l + " alt='" + artist.name + "'/>";
    para.innerHTML += "</figure>";
    para.innerHTML += artist.bio;

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
    O("wrapperID").appendChild(teaseDiv);

    O("blanket").className = O("blanket").className + " enableBlanket";

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


