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

    document.getElementById("results").innerHTML = info;

}

/**
 * This function pick up the top artists using the getTopArtists() function.
 * The array is then printed out in HTML elements.
 */
function printTopArtists(){

    var artists = getTopArtists();
    string = "";

    string += "<section class='tileList container'>"
    string += "<h2>Top artists</h2>";
    for(var i = 0; i<artists.length;i++){
        idVar = "tileID" + i;
        string += "<div class='tile' id='" + idVar + "' onclick='onTileClick(this.id)'>";
            /* string += "<input type='hidden' id='tileID' value='" + artists[i].name +"'/>"; */
            string += "<figure>"
                string += "<img src=" + artists[i].image_m + " alt='" + artists[i].name + "'/>";
                string += "<figcaption> " + artists[i].name + " </figcaption>";
            string += "</figure>";
        string += "</div>";
    }
    string += "</section>";
    document.getElementById("results").innerHTML = string;
}


function printTopAlbums(){
    var albums = getTopAlbums("metallica");
    //document.getElementById("results").innerHTML = "Antall album: "+albums.length;
    string = "";
    for(var i = 0; i<albums.length;i++){
        //string += "<div class='albumtile'>";
        string += albums[i].artist;
        //string += "</div>";

    }
    document.getElementById("results").innerHTML = string;

}


function onTileClick(id){
    var div = O(id);
    //S(id).position = 'relative';
    string ="";
    string += "<div class='tileTeaser' >";
    string += "";
    string += "</div>";
    div.innerHTML = div.innerHTML + string;
}