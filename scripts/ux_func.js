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

}

/*
 * Retrieves the mbid value from url parameter list.
 */
function getmbidFromURL(){
    var x = 0;
    var param = location.search;
    return param.substring(6);

}

function printArtistInfo(){

    //Get artist
    var mbid = getmbidFromURL();
    var id = document.createTextNode(mbid);
    var artist = getArtistInfo(mbid);

    //Declare artist variables
    var name = document.createTextNode(artist.name);
    var imgXL = document.createTextNode(artist.image_xl);
    var bio = document.createTextNode(artist.bio);

    //Declare HTML elements
    var headline = document.createElement("h2");


    //Add content to HTML elements
    headline.appendChild(name);





    O("results").appendChild(headline);
}



/**
 * This function pick up the top artists using the getTopArtists() function.
 * The array is then printed out in HTML elements.
 */
function printTopArtists() {

    var artists = getTopArtists();

    var resSection = document.createElement("section");
    resSection.id = "tileList";
    resSection.className ='tileList container';
    O("results").appendChild(resSection);


    for(var i = 0; i < artists.length; i++){

        var tileDiv = document.createElement('div');
        tileDiv.id = "tileID" + i;
        tileDiv.className = "tile";
        tileDiv.onclick = function(){
            onTileClick(this.id);
        };
        tileDiv.data = artists[i].name;
        tileDiv.style.backgroundImage = "url(" + artists[i].image_l + ")";

        var artString = "<input id='mbidID" + i + "' + type='hidden' value=" + artists[i].mbid + ">";

        tileDiv.innerHTML = artString;

        O("tileList").appendChild(tileDiv);
    }

}

/*
function printTopArtists() {

    var artists = getTopArtists();

    var resSection = document.createElement("section");
    resSection.id = "tileList";
    resSection.className ='tileList container';
    O("results").appendChild(resSection);


    for(var i = 0; i < artists.length; i++){

        var tileDiv = document.createElement('div');
        tileDiv.id = "tileID" + i;
        tileDiv.className = "tile";
        tileDiv.onclick = function(){
            onTileClick(this.id);
        };


        var artString = "<input id='mbidID" + i + "' + type='hidden' value=" + artists[i].mbid + ">";
        artString += "<figure>";
        artString += "<img src=" + artists[i].image_l + " alt='" + artists[i].name + "'/>";
        artString += "<figcaption> " + artists[i].name + " </figcaption>";
        artString += "</figure>";
        tileDiv.innerHTML = artString;

        O("tileList").appendChild(tileDiv);
    }

}*/



function printTopAlbums(){
    var albums = getTopAlbums("metallica");
    //document.getElementById("results").innerHTML = "Antall album: "+albums.length;
    string = "";
    for(var i = 0; i<albums.length;i++){
        //string += "<div class='albumtile'>";
        string += albums[i].artist;
        //string += "</div>";

    }
    O("results").innerHTML = string;

}


/*
    This function is run when user clicks on a tile and it creates a popup-div
    that presents the artist. A blanket is also "protecting" the user from clicking
    anything else. When user clicks anywhere on the blanket, it disappears.
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


/*
    This function resets the blanket and deletes the teaser-div from DOM
 */
function onBlanketClose(){
    O("blanket").className = "";
    var parent = O("wrapperID");
    var child = document.getElementById("teaseDiv");
    parent.removeChild(child);

}

