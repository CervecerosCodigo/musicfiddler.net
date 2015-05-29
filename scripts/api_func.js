/**
 * Fetches the JSON data from last.fm service based on specific request url string
 * @param request
 */
function fetchDataLastFM(request){
    var xmlhttp = new XMLHttpRequest();
    var url = request;
    var unparsedJSON = [];
    var parsedJSON = [];

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            unparsedJSON = xmlhttp.responseText;
            parsedJSON = JSON.parse(unparsedJSON);
            localStorage.setItem('JSONdata', JSON.stringify(parsedJSON));
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * An album object (container) for storing album data.
 * @param artist
 * @param title
 * @param tracks
 * @param label
 * @param year
 * @constructor
 */
function Album(artist, title, cover_m,tracks, label, year){
    this.artist = artist
    this.title = title
    this.tracks = tracks
    this.cover_m = cover_m
    this.label = label
    this.year = year

    //For debugging purposes, Prints contents into debugging console
    this.toConsole = function(){
        var output = "Artist : "+artist+"\nAlbum : "+title;
        console.log(output);
    }

    //For debugging purposes, Prints contents straight to document
    this.toDocument = function(){
        var output = "<br>Artist : "+artist+"\nAlbum : "+title;
        document.write(output);
    }
}

/**
 * Fetches top albums for an artists and returns an array with album objects.
 * @param artist
 * @returns {Array}
 */
function getTopAlbums(artist){
    request = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+artist+"&limit=10&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var topAlbums = [];

    fetchDataLastFM(request);
    //printAlbums(JSON.parse(localStorage.getItem('JSONdata'))); //for debugging
    var localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    albumcount = localJSON.topalbums.album.length;

    for (i = 0; i < albumcount; i++) {
        var current_album_cover = localJSON.topalbums.album[i].image[2]['#text'];
        var current_album = localJSON.topalbums.album[i].name;

        topAlbums.push(new Album(artist, current_album, current_album_cover, 0, 0, 0));
    }

    return topAlbums;
}

/**
 * For debugging
 */
function hei(){
    document.write("hei");
}

/**
 * For debugging
 * @param arr
 */
function printAlbums(arr) {

    if(arr.error > 1){
        document.write(arr.message);
    }else {
        //document.write(arr.length);

        albumcount = arr.topalbums.album.length;
        document.write("<br><u>printAlbums()</u><br><b>Total albums found: " + albumcount + "</b><br>");

        //Skriver rut listen over alle album
        for (i = 0; i < albumcount; i++) {
            current_album_cover = arr.topalbums.album[i].image[2]['#text'];
            current_album = arr.topalbums.album[i].name;

            document.write("<br><img src='" + current_album_cover + "' />");
            document.write(current_album);
        }
    }
}