function load_artist(){
    var xmlhttp = new XMLHttpRequest();
    var url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&artist=Cher&album=Believe&format=json";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            print_artist(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Fetches the JSON data from last.fm service based on specific request url string
 * @param request
 */
function fetchDataLastFM(request){
    var xmlhttp = new XMLHttpRequest();
    var url = request;
    var unparsedJSON = [];
    var parsedJSON = [];

    xmlhttp.onload = function(e) {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            unparsedJSON = xmlhttp.responseText;
            parsedJSON = JSON.parse(unparsedJSON);
            localStorage.setItem('JSONdata', JSON.stringify(parsedJSON));
        }else{
            throw xmlhttp.statusText;
        }
    }
    xmlhttp.open("GET", url, true);

    xmlhttp.onerror = function(e){
        throw "Connection error";
    }

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
function Album(artist, title, cover_l,tracks, label, year){
    this.artist = artist
    this.title = title
    this.tracks = tracks
    this.cover_l = cover_l
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
 * Artist object (container)
 * @param name
 * @param playcount
 * @param image_m
 * @constructor
 */
function Artist(name, playcount, image_l, image_xl, ontour, similar_artists, tags, bio){
    var mbid; //id for musicbrainz
    this.name = name
    this.playcount = playcount
    this.image_l = image_l

    //For debugging
    this.toConsole = function() {
        var output = "Artist: " + name;
        console.log(output);
    }

    //For debugging
    this.toDocument = function() {
        var output = "<br><img src="+image_l+" />" + name + "Playcount: "+playcount;
        document.write(output);
    }
}

/**
 * Fetches top albums for an artists and returns an array with album objects.
 * @param artist
 * @returns {Array}
 */
function getTopAlbums(artist){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+artist+"&limit=10&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var topAlbums = [];
    var localJSON, albumcount, current_album_cover, current_album;

    try {
        fetchDataLastFM(request);
    }catch (e){
        alert(e);
    }
    //printAlbums(JSON.parse(localStorage.getItem('JSONdata'))); //for debugging
    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    albumcount = localJSON.topalbums.album.length;

    for (var i = 0; i < albumcount; i++) {
        current_album_cover = localJSON.topalbums.album[i].image[2]['#text'];
        current_album = localJSON.topalbums.album[i].name;

        topAlbums.push(new Album(artist, current_album, current_album_cover, 0, 0, 0));
    }

    localStorage.removeItem('JSONdata');

    return topAlbums;
}

/**
 * Retrieves current top artists
 * @returns {Array}
 */
function getTopArtists(){
    var request = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var topArtists = [];
    var localJSON, albumcount, artist_name, artist_playcount, artist_img_l;

    try {
        fetchDataLastFM(request);
    }catch (e){
        alert(e);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));
    artistCount = localJSON.artists.artist.length;

    for(var i = 0; i<artistCount; i++){
        artist_name =  localJSON.artists.artist[i].name;
        artist_playcount = localJSON.artists.artist[i].playcount;
        artist_img_l = localJSON.artists.artist[i].image[2]['#text'];

        topArtists.push(new Artist(artist_name, artist_playcount, artist_img_l,0,0,0,0,0));
    }

    localStorage.removeItem('JSONdata');

    return topArtists;
}

function getArtistInfo(artist){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist+"&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";

}

//todo: Lage her ferdig
function getAlbumInfo(artist, album){
    var request = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&artist="+artist+"&album="+album+"&format=json";
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
